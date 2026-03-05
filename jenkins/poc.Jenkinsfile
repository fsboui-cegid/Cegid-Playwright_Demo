pipeline {
  agent any
  tools { nodejs 'NodeJS' }

  environment {
    LT_TUNNEL_BIN = "C:\\projects\\Cegid-Playwright_Demo\\LT.exe"
    LT_CREDENTIALS_ID = "0b5241c2-00eb-473d-b07c-a5aa89e89f0b"
  }

  parameters {
    choice(name: 'CUCUMBER_TAGS', choices: ['@smoke','@regression','@all'], description: 'Select tags')
    choice(name: 'APPLICATION_ENV', choices: ['dev','preprod','prod'], description: 'Select env')
    choice(name: 'BROWSER_SELECTION', choices: ['chromium','firefox','webkit','chrome','msedge'], description: 'Browser')
    booleanParam(name: 'LT_TUNNEL', defaultValue: false, description: 'Enable LambdaTest Tunnel')
  }

  stages {

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
              if not exist "${env.LT_TUNNEL_BIN}" (
                echo ERROR: LT.exe NOT FOUND at ${env.LT_TUNNEL_BIN}
                exit /b 1
              )

              echo Starting LambdaTest Tunnel...
              set LT_TUNNEL_NAME=cegid-%BRANCH_NAME%
              start "LT-Tunnel" /B "${env.LT_TUNNEL_BIN}" --user %LT_USERNAME% --key %LT_ACCESS_KEY% --tunnelName %LT_TUNNEL_NAME%
            """
          }
        }
      }
    }

    stage('Run Test') {
      steps {
        script {
          withCredentials([usernamePassword(
            credentialsId: env.LT_CREDENTIALS_ID,
            usernameVariable: 'LT_USERNAME',
            passwordVariable: 'LT_ACCESS_KEY'
          )]) {
            bat """
              node -v
              npm -v

              set CUCUMBER_FILTER_TAGS=${params.CUCUMBER_TAGS}
              set TEST_ENVIRONMENT=${params.APPLICATION_ENV}
              set PLAYWRIGHT_BROWSER=${params.BROWSER_SELECTION}

              set LT_RUN=true
              set LT_USERNAME=%LT_USERNAME%
              set LT_ACCESS_KEY=%LT_ACCESS_KEY%
              set LT_TUNNEL=${params.LT_TUNNEL}
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
        if (params.LT_TUNNEL) {
          bat """
            echo Stopping LambdaTest Tunnel...
            taskkill /F /IM LT.exe 2>NUL
            taskkill /F /IM LTClient.exe 2>NUL
          """
        }

        // Si tu n’as pas encore installé cucumber-html-reporter, commente temporairement :
        // bat 'npm run cucumberReport'
        bat 'npm run cucumberReport'

        archiveArtifacts artifacts: 'reports/cucumberReports/*.html', fingerprint: true
        archiveArtifacts artifacts: 'reports/cucumberScreenshots/*.png', fingerprint: true
        archiveArtifacts artifacts: 'reports/cucumber/*.json', fingerprint: true
      }
    }
  }
}