pipeline {
  agent any

  tools { nodejs 'NodeJS' }

  environment {
    CONFIG_FILE = "${env.WORKSPACE}/jenkins/common-ct.properties"
    // Chemin du binaire LambdaTest Tunnel sur l'agent Windows
    LT_TUNNEL_BIN = "C:\\projects\\Cegid-Playwright_Demo\\LT.exe"

    // ✅ Mets ici TON vrai credentialsId (un seul endroit à changer)
    LT_CREDENTIALS_ID = "2b25b97c-094f-4504-885b-54741ff68f4e"
  }

  parameters {
    choice(
      name: 'CUCUMBER_TAGS',
      choices: ['@smoke', '@regression', '@all'],
      description: 'Select the tags to run'
    )
    choice(
      name: 'APPLICATION_ENV',
      choices: ['dev', 'preprod', 'prod'],
      description: 'Select the application environment'
    )
    choice(
      name: 'BROWSER_SELECTION',
      // ✅ valeurs compatibles avec ton code hooks.js (system_installed_browser_list + native_browser_list)
      choices: ['chromium', 'firefox', 'webkit', 'chrome', 'msedge'],
      description: 'Choose your browser'
    )
    booleanParam(
      name: 'LT_TUNNEL',
      defaultValue: false,
      description: 'Enable LambdaTest Tunnel (needed for internal/VPN websites)'
    )
  }

  stages {

    stage('Check LambdaTest Tunnel Binary') {
      when { expression { return params.LT_TUNNEL } }
      steps {
        bat """
          if exist "${env.LT_TUNNEL_BIN}" (
            echo LT.exe found at ${env.LT_TUNNEL_BIN}
          ) else (
            echo ERROR: LT.exe NOT FOUND at ${env.LT_TUNNEL_BIN}
            exit /b 1
          )
        """
      }
    }

    stage('Start LambdaTest Tunnel') {
      when { expression { return params.LT_TUNNEL } }
      steps {
        script {
          withCredentials([usernamePassword(
            credentialsId: env.LT_CREDENTIALS_ID,
            usernameVariable: 'LT_USERNAME',
            passwordVariable: 'LT_ACCESS_KEY'
          )]) {
            bat """
              echo Starting LambdaTest Tunnel...
              set LT_TUNNEL_NAME=cegid-%BRANCH_NAME%

              REM Start tunnel in background
              start "LT-Tunnel" /B "${env.LT_TUNNEL_BIN}" --user %LT_USERNAME% --key %LT_ACCESS_KEY% --tunnelName %LT_TUNNEL_NAME%
            """
          }
        }
      }
    }

    stage('Run Test') {
      steps {
        script {
          def choosenTag = params.CUCUMBER_TAGS
          def choosenEnv = params.APPLICATION_ENV
          def choosenBrowser = params.BROWSER_SELECTION
          def useTunnel = params.LT_TUNNEL.toString().toBoolean()

          withCredentials([usernamePassword(
            credentialsId: env.LT_CREDENTIALS_ID,
            usernameVariable: 'LT_USERNAME',
            passwordVariable: 'LT_ACCESS_KEY'
          )]) {
            bat """
              node -v
              npm -v

              set CUCUMBER_FILTER_TAGS=${choosenTag}
              set TEST_ENVIRONMENT=${choosenEnv}
              set PLAYWRIGHT_BROWSER=${choosenBrowser}

              REM Enable LambdaTest mode (hooks.js uses this to connect via wsEndpoint)
              set LT_RUN=true
              set LT_USERNAME=%LT_USERNAME%
              set LT_ACCESS_KEY=%LT_ACCESS_KEY%

              REM Tunnel info (hooks.js should use these in capabilities)
              set LT_TUNNEL=${useTunnel}
              set LT_TUNNEL_NAME=cegid-%BRANCH_NAME%

              npm ci
              npx playwright install
              npm run cucumberTest
            """
          }
        }
      }
    }
  }

  post {
    always {
      script {
        // Stop tunnel if it was started
        if (params.LT_TUNNEL) {
          bat """
            echo Stopping LambdaTest Tunnel...
            taskkill /F /IM LT.exe 2>NUL
            taskkill /F /IM LTClient.exe 2>NUL
          """
        }

        // Reports & artifacts
        bat 'npm run cucumberReport'

        archiveArtifacts artifacts: 'reports/cucumberReports/*.html', fingerprint: true
        archiveArtifacts artifacts: 'reports/cucumberScreenshots/*.png', fingerprint: true
        archiveArtifacts artifacts: 'reports/cucumber/*.json', fingerprint: true
      }
    }
  }
}