pipeline {
  agent any
  environment {
    GH_TOKEN = credentials("gh-pat")
  }
  stages {
    stage("Semantic Release") {
      tools {
        nodejs "node16"
      }
      steps {
        sh "npx semantic-release"
        script {
          COMPUTED_VERSION = sh (script: "git describe --tags | cut -c2-", returnStdout: true).trim()
          echo "Computed version: ${COMPUTED_VERSION}"
          // COMPUTED_VERSION="${COMPUTED_VERSION:1}"
        }
        sh "npm version ${COMPUTED_VERSION} --no-git-tag-version"
        sh "git commit -am 'Jenkins updated version to ${COMPUTED_VERSION}'"
        sh "git push"
      }
    }
  }
}