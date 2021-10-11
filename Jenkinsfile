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
  }
}