pipeline {
  agent any
  tools {
    nodejs "node16"
  }
  environment {
    GH_TOKEN = credentials("gh-pat")
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
      steps {
        sh "npx semantic-release"
      }
    }
    stage("Deploy") {
      steps {
        script {
          withCredentials([usernamePassword(credentialsId: 'jenkinsUser', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
            def remote = [:]
            remote.name = "vserver"
            remote.user = $USERNAME
            remote.host = "feuer.dev"
            remote.password = $PASSWORD
            remote.allowAnyHosts = true
            sshScript remote: remote, script: "deploy.sh"
          }
        }
      }
    }
  }
}