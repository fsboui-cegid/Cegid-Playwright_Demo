pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        CONFIG_FILE = "${env.WORKSPACE}/jenkins/common-ct.properties"
    }

    stages {

        stage('Read properties file') {
            steps {
                script {
                    def props = readProperties file: env.CONFIG_FILE
                    env.SERVER_INSTANCE = props['SERVER_INSTANCE']
                    env.PROJECT_KEY = props['PROJECT_KEY']
                    env.TEST_PLAN_KEY = props['TEST_PLAN_KEY']
                    env.EMAIL_JENKINS_NOTIFICATION = props['EMAIL_JENKINS_NOTIFICATION']
                }
            }
        }

        stage('Run Test') {
            steps {
                script {
                    def choosenTag = params.CUCUMBER_TAGS
                    def choosenEnv = params.APPLICATION_ENV
                    def choosenBrowser = params.BROWSER_SELECTION

                    bat """
                        node -v
                        npm -v

                        set CUCUMBER_FILTER_TAGS=${choosenTag}
                        set TEST_ENVIRONMENT=${choosenEnv}
                        set PLAYWRIGHT_BROWSER=${choosenBrowser}

                        npm ci
                        npx playwright install
                        npm run cucumberTest
                    """
                }
            }
        }
    }

    post {
        always {
            script {
                bat 'npm run cucumberReport'

                def reportFilePath = bat(
                    script: 'for /r cucumber %i in (*.json) do echo %i',
                    returnStdout: true
                ).trim()

                env.REPORT_FILE_PATH = reportFilePath

                archiveArtifacts artifacts: 'reports/cucumberReports/*.html', fingerprint: true

                step([$class: 'XrayImportBuilder',
                    endPointName: '/cucumber',
                    importFilePath: env.REPORT_FILE_PATH,
                    projectKey: env.PROJECT_KEY,
                    serverInstance: env.SERVER_INSTANCE,
                    testExecKey: env.TEST_PLAN_KEY
                ])
            }
        }
    }
}
