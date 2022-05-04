pipeline {

  agent none

  stages {
    stage('Test') {
     agent { node { label 'master' } }
      steps {
        echo 'run test step...'
      }
    }
    stage('Build') {
      agent { node { label 'master' } }
      environment {
        DOCKER_TAG="${GIT_BRANCH == 'origin/development' ? 'dev' : 'latest'}"
      }
      steps {
        script {
          if(GIT_BRANCH == "origin/development" || GIT_BRANCH == "origin/master") {
            sh "docker build -t caots99/nestjs-base:${DOCKER_TAG} ."
            withDockerRegistry(credentialsId: 'docker-hub', url: 'https://index.docker.io/v1/') {
              sh "docker push caots99/nestjs-base:${DOCKER_TAG}"
            }
            sh "docker image rm caots99/nestjs-base:${DOCKER_TAG}"
          }
        }
        echo 'Pulling brach...' + GIT_BRANCH
        echo 'Docker tag...' + DOCKER_TAG
      }
    }
    stage('Run') {
      agent { node { label 'master' } }
      steps {
        sshagent(['ssh-remote']) {
          // some block
          script {
            if(GIT_BRANCH == "origin/development" || GIT_BRANCH == "origin/master") {
              if(GIT_BRANCH == "origin/development") {
                sh 'docker ps -aq --filter="name=nestjs-base-dev" | grep -q . && docker stop nestjs-base-dev && docker rm nestjs-base-dev || echo "not exist container nestjs-base-dev"'
                sh 'docker run -d --name "nestjs-base-dev" -p 5000:5000 caots99/nestjs-base:dev'
              } else {
                sh 'docker ps -aq --filter="name=nestjs-base-prod" | grep -q . && docker stop nestjs-base-prod && docker rm nestjs-base-prod || echo "not exist container nestjs-base-prod"'
                sh 'docker run -d --name "nestjs-base-prod" -p 5001:5000 caots99/nestjs-base:latest'
              }
            }
          }
        }
      }
    }
  }
}