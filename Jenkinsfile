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
                script {
                    docker.build("${IMAGE_NAME}:${BUILD_NUMBER}") // Zbudowanie obrazu Dockerowego
                    
                }
            }
        }
		stage('Push Dockers image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS) {
                        docker.image("${IMAGE_NAME}:${BUILD_NUMBER}").push() // Wysłanie obrazu na DockerHuba
                    }
                }
            }
		}
		stage('Delete docker image') {
            steps {
                script {
                    docker.rmi("${IMAGE_NAME}:${BUILD_NUMBER}")
                }
            }
		}
    }
}
