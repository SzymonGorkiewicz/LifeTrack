pipeline {
    agent any
    environment {
        DOCKER_CREDENTIALS = 'dockerhub_cred'
        IMAGE_NAME = 'simoon02/backend_app'
    }
    stages {
        stage('Clone repository') {
            steps {
                git branch: 'backend', url: 'https://github.com/SzymonGorkiewicz/LifeTrack.git' 
            }
        }
        stage('Build Docker image') {
            steps {
				sh 'docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} .'
                
            }
        }
		stage('Push Docker image') {
            steps {
					withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
						sh '''
							echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
							docker push ${IMAGE_NAME}:${BUILD_NUMBER}
							docker logout
						'''
					}
                }
            }
		}
		stage('Delete docker image') {
            steps {
				sh 'docker image rm ${IMAGE_NAME}:${BUILD_NUMBER}'
               
            }
		}
    }
}
