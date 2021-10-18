pipeline {
  agent any
  tools {
    nodejs "node16"
  }
  options { skipDefaultCheckout() }
  environment {
    GH_TOKEN = credentials("gh-pat")
    ENVIRONMENT = "${env.BRANCH_NAME == "master" ? "production" : "staging"}"
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
            sh "rm -rf a"
            sh "git clone https://github.com/feuerdev/node-ts-boilerplate.git a"
            sh 'cd a; npm ci; echo hello > a.txt; git config --global user.name "jannik"; git config --global user.email "jannik@feuer.dev"; git add .; git commit -am "BREAKING CHANGE: version"; npx semantic-release'
            sh "npm ci"
          }
        }
        stage("Checking") {
          parallel {
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
          }
        }
        stage("Versioning") {
          when { branch 'master' }
          steps {
            sh "git fetch --tags"
            sh "git pull --tags"
            sh "npx semantic-release"
            script {
              COMPUTED_VERSION = sh (script: "git describe --tags", returnStdout: true).trim()
            }
          }
        }
        stage("Prepare Deployment") {
          parallel {
            stage("Production") {
              when { branch 'master' }
              steps {
                withCredentials([file(credentialsId: 'env-production-node-ts-boilerplate', variable: 'ENV_FILE')]) {
                  writeFile file: '.env', text: readFile(ENV_FILE)
                }
              }
            }
            stage("Staging") {
              when { not { branch 'master' } }
              steps {
                withCredentials([file(credentialsId: 'env-staging-node-ts-boilerplate', variable: 'ENV_FILE')]) {
                  writeFile file: '.env', text: readFile(ENV_FILE)
                }
              }
            }
          }
        }
        stage("Deploy") {
          when { expression { env.CHANGE_ID == null } } //Don't deploy a "PR"-Branch
          steps {
            sh "(echo; echo ENVIRONMENT=${env.ENVIRONMENT}) >> .env"
            script {
              withCredentials([usernamePassword(credentialsId: 'jenkinsUser', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                def remote = [:]
                remote.name = "vserver"
                remote.user = "$USERNAME"
                remote.host = "feuer.dev"
                remote.password = "$PASSWORD"
                remote.allowAnyHosts = true
                sshCommand remote: remote, command: "cd ${env.ENVIRONMENT}; sudo docker-compose down || true"
                sshRemove remote: remote, path: "${env.ENVIRONMENT}" //Defensive cleaning of the workspace
                sshCommand remote: remote, command: "git clone -b ${env.BRANCH_NAME} --single-branch ${GIT_URL} ${env.ENVIRONMENT}"
                sshPut remote: remote, from: ".env", into: "${env.ENVIRONMENT}"
                sshCommand remote: remote, command: "cd ${env.ENVIRONMENT}; sudo docker-compose down; sudo docker-compose up -d --build"
                sshRemove remote: remote, path: "${env.ENVIRONMENT}"
              }
            }
          }
        }
      }
    }
  }
}