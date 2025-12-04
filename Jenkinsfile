pipeline {
  agent any
  options {
    disableConcurrentBuilds()
    timestamps()
  }
  environment {
    DOCKER_HUB_ID              = "kimeren0521"
    DOCKER_CREDENTIALS_ID      = "dockerhub_credentials"
    DEPLOY_SSH_CREDENTIALS_ID  = "deploy_ssh"
    DEPLOY_HOST                = "app@192.168.1.11"
    DEPLOY_DIR                 = "/data/docker/paywont-info"
    SERVICE_NAME               = "paywont-info"
  }
  stages {
    stage('Checkout') {
      steps {
        checkout scm
        sh 'git rev-parse --short HEAD || true'
      }
    }
    stage('NPM Build') {
      steps {
        sh """
          set -e
          npm ci
          npm run build
        """
      }
    }
    stage('Build Docker Image') {
      steps {
        script {
          env.IMAGE_TAG    = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
          env.IMAGE_NAME   = "${env.DOCKER_HUB_ID}/${env.SERVICE_NAME}"
          echo "IMAGE_NAME=${env.IMAGE_NAME}, IMAGE_TAG=${env.IMAGE_TAG}"
        }
        sh '''\
          docker rmi -f ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest || true
          docker build \
            -t ${IMAGE_NAME}:${IMAGE_TAG} \
            -t ${IMAGE_NAME}:latest \
            .
        '''
      }
    }
    stage('Push Docker Image') {
      steps {
        withCredentials([
          usernamePassword(
            credentialsId: "${DOCKER_CREDENTIALS_ID}",
            usernameVariable: 'DOCKERHUB_USERNAME',
            passwordVariable: 'DOCKERHUB_PASSWORD'
          )
        ]) {
          sh '''\
            echo "$DOCKERHUB_PASSWORD" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin
            docker push ${IMAGE_NAME}:${IMAGE_TAG}
            docker push ${IMAGE_NAME}:latest
            docker logout || true
          '''
        }
      }
    }
    stage('Deploy to Remote') {
      steps {
        sshagent (credentials: [DEPLOY_SSH_CREDENTIALS_ID]) {
          sh '''\
            ssh -p 9722 -o StrictHostKeyChecking=no ${DEPLOY_HOST} "mkdir -p ${DEPLOY_DIR}"
            ssh -p 9722 -o StrictHostKeyChecking=no ${DEPLOY_HOST} "\
              cd ${DEPLOY_DIR} && \
              docker compose pull ${SERVICE_NAME} && \
              docker compose up -d ${SERVICE_NAME} && \
              docker system prune -f \
            "
          '''
        }
      }
    }
  }
  post {
    always {
      sh 'docker image prune -f || true'
    }
    success {
      echo "✅ ${SERVICE_NAME} CI/CD 파이프라인 성공"
    }
    failure {
      echo "❌ ${SERVICE_NAME} CI/CD 파이프라인 실패 - Jenkins 로그를 확인하세요."
    }
  }
}
