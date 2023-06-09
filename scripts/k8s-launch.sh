#!/bin/bash

# Start Minikube
minikube start

# Set the Docker environment to Minikube's Docker daemon
eval $(minikube docker-env)

# Deploy the application using Skaffold
skaffold dev -f skaffold.yaml
