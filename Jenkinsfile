pipeline {
    agent any
    
    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
        SSH_KEY = credentials('ec2_ssh')
        DOCKER_BUILDKIT = '1'
        DOCKER_HOST = 'unix:///var/run/docker.sock'
        CLIENT_DOCKER_IMAGE = 'i12a306/client:latest'
        SERVER_DOCKER_IMAGE = 'i12a306/server:latest'
        HOME = '/root'
      	EC2_HOST = 'i12a306.p.ssafy.io'
        EC2_USER = 'ubuntu'
        DEPLOY_PATH = '/home/ubuntu/S12P11A306'
    }
    
    options {
        timeout(time: 1, unit: 'HOURS')
        skipDefaultCheckout(false)
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup & Build') {
            agent {
                docker {
                    image 'docker:24.0-dind'
                    args '--privileged -v /var/run/docker.sock:/var/run/docker.sock'
                    reuseNode true
                }
            }
            steps {
                script {
                    def branch = env.BRANCH_NAME
                    
                    sh '''
                        docker login -u $DOCKER_HUB_CREDENTIALS_USR -p $DOCKER_HUB_CREDENTIALS_PSW
                        docker buildx rm builder || true
                        docker buildx create --name builder --driver docker-container --use
                        docker buildx inspect builder --bootstrap
                    '''
                    
                    if (env.CHANGE_ID == null) {
                        if (branch == 'master') {
                            sh """
                                docker buildx build --builder builder \
                                    --platform linux/amd64 \
                                    -t $CLIENT_DOCKER_IMAGE \
                                    ./damul-client \
                                    --push
                                docker buildx build --builder builder \
                                    --platform linux/amd64 \
                                    -t $SERVER_DOCKER_IMAGE \
                                    ./damul-server \
                                    --push
                            """
                        } else if (branch == 'Client' || branch == 'client-develop') {
                            sh """
                                docker buildx build --builder builder \
                                    --platform linux/amd64 \
                                    -t $CLIENT_DOCKER_IMAGE \
                                    ./damul-client \
                                    --push
                            """
                        } else if (branch == 'Server' || branch == 'server-develop') {
                            sh """
                                docker buildx build --builder builder \
                                    --platform linux/amd64 \
                                    -t $SERVER_DOCKER_IMAGE \
                                    ./damul-server \
                                    --push
                            """
                        }
                    }
                }
            }
        }
        
        stage('Client Test') {
            when {
                allOf {
                    expression { env.CHANGE_TARGET =~ /(Client|client-develop|master)/ }
                    expression { env.CHANGE_ID != null }
                }
            }
            agent {
                docker {
                    image 'node:latest'
                    reuseNode true
                }
            }
            steps {
                dir('damul-client') {
                    sh '''
                        npm ci
                        npm run test
                    '''
                }
            }
        }
        
        stage('Server Test') {
            when {
                allOf {
                    expression { env.CHANGE_TARGET =~ /(Server|server-develop|master)/ }
                    expression { env.CHANGE_ID != null }
                }
            }
            agent {
                docker {
                    image 'gradle:8.12-jdk17'
                    reuseNode true
                }
            }
            steps {
                dir('damul-server') {
                    sh 'gradle clean test'
                }
            }
        }
        
        stage('Deploy') {
            when {
                allOf {
                    branch pattern: '^(Client|Server|master)$', comparator: "REGEXP"
                    not { expression { env.CHANGE_ID != null } }
                }
            }
            agent {
                docker {
                    image 'debian:stable-slim'
                    args '--privileged'
                    reuseNode true
                }
            }
            steps {
                sh """
                    apt-get update && apt-get install -y openssh-client
                    mkdir -p /root/.ssh
                    chmod 700 /root/.ssh             # 추가
                    ssh-keyscan ${EC2_HOST} >> /root/.ssh/known_hosts
                    chmod 600 /root/.ssh/known_hosts # 추가
                """
                
                script {
                    def branch = env.BRANCH_NAME
                    def deployCmd = "cd $DEPLOY_PATH && docker compose -f docker-compose.prod.yml pull server && docker compose -f docker-compose.prod.yml up -d server && docker image prune -f"
                    
                    switch(branch) {
                        case 'Client':
                            deployCmd = "cd $DEPLOY_PATH && docker compose -f docker-compose.prod.yml pull client && docker compose -f docker-compose.prod.yml up -d client && docker image prune -f"
                            break
                        case 'Server':
                            deployCmd = "cd $DEPLOY_PATH && docker compose -f docker-compose.prod.yml pull server && docker compose -f docker-compose.prod.yml up -d server && docker image prune -f"
                            break
                        case 'master':
                            deployCmd = "cd $DEPLOY_PATH && docker compose -f docker-compose.prod.yml pull && docker compose -f docker-compose.prod.yml up -d && docker image prune -f"
                            break
                    }
                    
                    sshagent(credentials: ['ec2_ssh']) {
                        sh """
                            ssh $EC2_USER@\$EC2_HOST '
                                docker login -u '$DOCKER_HUB_CREDENTIALS_USR' -p '$DOCKER_HUB_CREDENTIALS_PSW' &&
                                ${deployCmd}
                            '
                        """
                    }
                }
            }
        }
    }
    
    post {
        always {
            script {
                docker.image('docker:24.0-dind').inside('--privileged -v /var/run/docker.sock:/var/run/docker.sock') {
                    sh '''
                        docker buildx rm builder || true
                        docker container prune -f --filter "label=com.docker.buildx.builder=builder"
                        docker builder prune -f
                        docker system prune -f
                    '''
                }
            }
            cleanWs()
        }
    }
}
