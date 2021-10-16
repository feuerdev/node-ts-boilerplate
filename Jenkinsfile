pipeline {
  agent any
  tools {
    nodejs "node16"
  }
  environment {
    GH_TOKEN = credentials("gh-pat")
  }
  stages {
    stage("Parent") {
      when {
        not {
          changelog '.*^\\[skip ci\\] .+$'
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
              withCredentials([usernamePassword(credentialsId: 'jenkinsUser', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                def remote = [:]
                remote.name = "vserver"
                remote.user = "$USERNAME"
                remote.host = "feuer.dev"
                remote.password = "$PASSWORD"
                remote.allowAnyHosts = true
                sshPut remote: remote, from: '.', into: '.'
                // sshCommand remote: remote, command: "git clone -b ${env.BRANCH_NAME} --single-branch ${GIT_URL} temp"
                // sshRemove remote: remote, path: "temp"
              }
            }
          }
        }
      }
    }
  }
}