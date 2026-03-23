pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        timestamps()
        timeout(time: 20, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10', artifactNumToKeepStr: '5'))
    }

    triggers { githubPush() }

    environment {
        SERVICE_NAME              = "paywont-info"
        APP_PORT                  = "80"

        DOCKER_HUB_ID             = "kimeren0521"
        DOCKER_IMAGE              = "${DOCKER_HUB_ID}/paywont-info"
        DOCKER_CREDENTIALS_ID     = "dockerhub-credentials"

        DEPLOY_SSH_CREDENTIALS_ID = "ssh-credentials"
        DEPLOY_HOST               = "app@172.17.1.10"
        DEPLOY_PORT               = "35655"
        DEPLOY_DIR                = "/data/apps"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.IMAGE_TAG   = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    env.BRANCH_NAME = sh(script: "git rev-parse --abbrev-ref HEAD", returnStdout: true).trim()
                }
                echo "🚀 ${SERVICE_NAME} Build - Branch: ${BRANCH_NAME}, Commit: ${IMAGE_TAG}"
            }
        }

        stage('Docker Build & Push') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "${DOCKER_CREDENTIALS_ID}",
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                        export DOCKER_CONFIG=\$(mktemp -d)
                        mkdir -p \$DOCKER_CONFIG/cli-plugins
                        cp /var/jenkins_home/.docker/cli-plugins/docker-buildx \$DOCKER_CONFIG/cli-plugins/
                        echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin
                        DOCKER_BUILDKIT=1 docker build \\
                            --provenance=false \\
                            --memory=1.5g \\
                            --build-arg NODE_ENV=production \\
                            --build-arg HTTP_PROXY=http://172.16.2.10:3128 \\
                            --build-arg HTTPS_PROXY=http://172.16.2.10:3128 \\
                            --build-arg NO_PROXY=localhost,127.0.0.1,172.16.0.0/12 \\
                            --no-cache \\
                            -t ${DOCKER_IMAGE}:${IMAGE_TAG} \\
                            -t ${DOCKER_IMAGE}:latest \\
                            .
                        docker push ${DOCKER_IMAGE}:${IMAGE_TAG}
                        docker push ${DOCKER_IMAGE}:latest
                        docker logout
                        rm -rf \$DOCKER_CONFIG
                    """
                }
            }
        }

        stage('Deploy') {
            steps {
                lock('deploy-web-svr1') {
                    sshagent(credentials: [DEPLOY_SSH_CREDENTIALS_ID]) {
                        sh """
                            ssh -p ${DEPLOY_PORT} -o StrictHostKeyChecking=no ${DEPLOY_HOST} '
                                cd ${DEPLOY_DIR} &&
                                docker image rm ${DOCKER_IMAGE}:latest 2>/dev/null || true &&
                                docker pull ${DOCKER_IMAGE}:latest &&
                                docker compose up -d ${SERVICE_NAME} &&
                                docker image prune -f
                            '
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
            sh 'docker image prune -f 2>/dev/null || true'
        }
        success { echo "✅ ${SERVICE_NAME} 배포 완료 (${IMAGE_TAG})" }
        failure { echo "❌ ${SERVICE_NAME} 배포 실패" }
    }
}