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
              set NODE_ENV=
              set npm_config_production=false
              npm ci --include=dev
              set LT_RUN=true
              set LT_USERNAME=%LT_USERNAME%
              set LT_ACCESS_KEY=%LT_ACCESS_KEY%
              node -e "const { chromium } = require('playwright'); (async()=>{ const caps={browserName:'Chrome',browserVersion:'latest','LT:Options':{platform:'Windows 10',build:'Jenkins Smoke',name:'LT connect smoke',user:process.env.LT_USERNAME,accessKey:process.env.LT_ACCESS_KEY,network:true,video:true,console:true}}; const ws='wss://cdp.lambdatest.com/playwright?capabilities='+encodeURIComponent(JSON.stringify(caps)); const b=await chromium.connect(ws); const p=await (await b.newContext()).newPage(); await p.goto('https://example.com'); await p.waitForTimeout(3000); await b.close(); console.log('LT smoke done'); })().catch(e=>{ console.error(e); process.exit(1); });"
              set LT_TUNNEL=${params.LT_TUNNEL}
              set LT_TUNNEL_NAME=cegid-%BRANCH_NAME%

              npx playwright install


              echo === DEBUG ===
echo LT_RUN=%LT_RUN%
echo LT_USERNAME_SET=%LT_USERNAME:~0,2%**
echo LT_ACCESS_KEY_SET=****
echo CUCUMBER_FILTER_TAGS=%CUCUMBER_FILTER_TAGS%
echo TEST_ENVIRONMENT=%TEST_ENVIRONMENT%
echo PLAYWRIGHT_BROWSER=%PLAYWRIGHT_BROWSER%
echo =============



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
                taskkill /F /IM LT.exe 2>NUL || exit /b 0
                taskkill /F /IM LTClient.exe 2>NUL || exit /b 0
                """
            }

            // (optionnel) archive ce que tu veux, sans faire échouer si vide
            archiveArtifacts artifacts: 'reports/cucumberScreenshots/*.png', fingerprint: true, allowEmptyArchive: true
            archiveArtifacts artifacts: 'cucumber/*.json', fingerprint: true, allowEmptyArchive: true
            }
        }
    }
}