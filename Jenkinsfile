pipeline {
  agent any
  tools {
    nodejs "node16"
  }
  environment {
    GH_TOKEN = credentials("gh-pat")
  }
  stages {
    stage("Skip Gate") {
      when {
        not {
          //Skip pipeline if last commit was generated by CI already.
          changelog '.*\\[skip ci\\].*' 
        }
      }
      stages {
        stage("Install") {
          steps {
            sh "npm ci"
          }
        }
        stage("Lint") {
          steps {
            sh "npm run lint"
          }
        }
        stage("Build") {
          steps {
            sh "npm run build"
          }
        }
        stage("Release") {
          when { branch 'master' }
          steps {
            sh "npx semantic-release"
          }
        }
        stage("Deploy") {
          when { branch 'master' }
          steps {
            script {
              withCredentials([file(credentialsId: 'env-node-ts-boilerplate', variable: 'ENV_FILE')]) {
                sh 'echo $ENV_FILE > .env'
              
                withCredentials([usernamePassword(credentialsId: 'jenkinsUser', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                  def remote = [:]
                  remote.name = "vserver"
                  remote.user = "$USERNAME"
                  remote.host = "feuer.dev"
                  remote.password = "$PASSWORD"
                  remote.allowAnyHosts = true
                  sshCommand remote: remote, command: "git clone -b ${env.BRANCH_NAME} --single-branch ${GIT_URL} ${env.BRANCH_NAME}; cd ${env.BRANCH_NAME}; sudo docker-compose down; sudo docker-compose up -d --build"
                  sshPut remote: remote, from: ".env", into: "${env.BRANCH_NAME}"
                  sshRemove remote: remote, path: "${env.BRANCH_NAME}"
                }
              }
            }
          }
        }
      }
    }
  }
}