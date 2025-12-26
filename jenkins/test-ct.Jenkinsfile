@NonCPS
def readPropertiesFromFile(String filePath){
    def props = readProperties file: filePath
    return props
}

pipeline{
        /* As I have used a remote system which is a MAC system so all the commands are with "sh" 
        if you want to run it on a differnt system please change the "label" value*/
    agent{ label 'iMac' }
    environment{
        /* Some remote system may have multiple nodejs version installed so while running the job it might take
        a lower version of nodejs, which is not compaitible whth playwright/cucumber, so current playwright/cucumber is 
        compatible with the node18 version */
        NODE_HOME= tool name: 'node18'
        CONFIG_FILE= "${env.WORKSPACE}/jenkins/common-ct.properties"
    }
    /* There paramters will be mentioned in Jenkins */
    parameters{
        choice(
            name: 'CUCUMBER_TAGS'
            choices: ['@Regression','@Smoke','@Functional']
            description: 'Select the cucumber tag'
        )
        choice(
            name: 'APPLICATION_ENV'
            choices: ['dev','qa','uat']
            description: 'Select the application environment'
        )
         choice(
            name: 'BROWSER_SELECTION'
            choices: ['Chrome','msedge','chromium','firefox','webkit']
            description: 'Choose your browser'
        )
    }
    stages {
        stage('Detect OS') {
            steps {
                script {
                    if (isUnix()) {
                        def isMac = sh(script: 'uname', returnStdout: true).trim() == 'Darwin'
                        if (isMac) {
                            env.OS = 'MAC'
                            echo "Running on MacOS"
                        } else {
                            env.OS = 'UNIX'
                            echo "Running on UNIX"
                        }
                    } else {
                        env.OS = 'WINDOWS'
                        echo "Running on Windows"
                    }
                }
            }
        }

        stage('Node setup') {
            steps {
                script {
                    env.PATH = "${env.NODE_HOME}/bin:${env.PATH}"
                    if (env.OS == 'MAC' || env.OS == 'UNIX') {
                        sh 'node -v'
                        sh 'echo $NODE_HOME'
                    } else if (env.OS == 'WINDOWS') {
                        bat 'node -v'
                        bat 'echo %NODE_HOME%'
                    }
                }
            }
        }

        stage('Read properties file'){
            steps{
                script{
                    def props= readPropertiesFromFile(env.CONFIG_FILE)
                    echo "Properties are: ${props}"
                    env.SERVER_INSTANCE= props['SERVER_INSTANCE']
                    env.PROJECT_KEY= props['PROJECT_KEY']
                    env.TEST_PLAN_KEY= props['TEST_PLAN_KEY']
                    env.EMAIL_JENKINS_NOTIFICATION= props['EMAIL_JENKINS_NOTIFICATION']
                    echo "Server instance: ${env.SERVER_INSTANCE}"
                }
            }
        }
        stage('Run Test') {
            steps {
                script {
                    def choosenTag = params.CUCUMBER_TAGS
                    def choosenEnv = params.APPLICATION_ENV
                    def choosenBrowser = params.BROWSER_SELECTION
                    if (env.OS == 'MAC' || env.OS == 'UNIX') {
                        sh 'npm install && npx playwright install'
                        sh "export CUCUMBER_FILTER_TAGS=${choosenTag} && export TEST_ENVIRONMENT=${choosenEnv} && export PLAYWRIGHT_BROWSER=${choosenBrowser} && npm run cucumberTest"
                    } else if (env.OS == 'WINDOWS') {
                        bat 'npm install && npx playwright install'
                        bat "set CUCUMBER_FILTER_TAGS=${choosenTag} && set TEST_ENVIRONMENT=${choosenEnv} && set PLAYWRIGHT_BROWSER=${choosenBrowser} && npm run cucumberTest"
                    }
                }
            }
        }
    }
    post{
        always{
            script{
               if (env.OS == 'MAC' || env.OS == 'UNIX') {
                    sh 'npm run cucumberReport'
                    def reportFilePath = sh(script: "find ${env.WORKSPACE}/cucumber -name '*.json' -print -quit", returnStdout: true).trim()
                } else if (env.OS == 'WINDOWS') {
                    bat 'npm run cucumberReport'
                    def reportFilePath = bat(script: "for /r %i in (*.json) do echo %i", returnStdout: true).trim()
                }
                echo "Full path of the report: ${reportFilePath}"
                env.REPORT_FILE_PATH=reportFilePath
                echo "USing report file path is: ${env.REPORT_FILE_PATH}"
                archiveArtifacts artifacts: 'reports/cucumberReports/*.html', fingerprint: true

                step([$class: 'XrayImportBuilder',
                endPointName: '/cucumber',
                importFilePath: env.REPORT_FILE_PATH,
                importToSameExecution: 'true',
                projectKey: env.PROJECT_KEY,
                serverInstance: env.SERVER_INSTANCE,
                testExecKey: env.TEST_PLAN_KEY
                ])
               //Notify via email
               if(env.EMAIL_JENKINS_NOTIFICATION?.trim()){
                emailext(
                    subject: "Job '${env.JOB_NAME}' (${env.BUILD_NUMBER}) Status",
                        body: """
                        Hi Team
                        Job '${env.JOB_NAME}' (${env.BUILD_NUMBER})' has completed
                        Please check the jenkins console output at ${env.BUILD_URL} to view the result
                        """,
                        to: env.EMAIL_JENKINS_NOTIFICATION,
                        recipientProviders: [[$class: 'DevelopersRecipientProvider']]
                )
               }
            cleanWS()
            }
            echo "Post actions completed!"
        }
    }

}