# Multi-Port Node.js Application

## Overview

This is a multi-port Node.js application designed to demonstrate a microservice-like architecture running on Kubernetes, with support for local development and deployment.

## Pre-requisites

- Node.js (v18.x or later)
- npm (v9.x or later)
- Docker
- Kubernetes CLI (kubectl)
- Minikube (for local development, optional)
- Google Cloud SDK (for GKE deployment, optional)

## Local Development Setup

**1. Clone the Repository**

```bash
git clone https://github.com/paulopatto/multiport-nodejs-app.git
cd multiport-nodejs-app
```

**2. Install Dependencies**

```bash
# Install project dependencies
npm install
```

**3. Run Locally**

```bash
# Run the application
node app.js # or via nodemon

# Application will be available on ports:
# - 8080 (Main service)
# - 8000 (Metrics service)
# - 9000 (Admin service)
```

## Docker Build

```bash
# Build Docker image
docker build -t multiport-nodejs:v1.0.0 .

# Run Docker container
docker run -p 8080:8080 -p 8000:8000 -p 9000:9000 multiport-nodejs:v1.0.0
```

## Kubernetes Deployment

### Local Minikube Deployment

**1. Start Minikube**

```bash
minikube start
```

**2. Build and Load Docker Image**

```bash
# Build image
docker build -t multiport-nodejs:v1.0.0 .

# Load image to Minikube
minikube image load multiport-nodejs:v1.0.0
```

**3. Deploy to Kubernetes**

```bash
# Apply Kubernetes manifests
kubectl apply -f k8s-deployment.yaml
kubectl apply -f k8s-ingress.yaml
```

### Using Ingress NGINX Controller

Given our architecture's need to manage multiple services independently, a [reverse proxy](https://www.cloudflare.com/learning/cdn/glossary/reverse-proxy/) is an ideal choice. Essentially, a reverse proxy acts as a routing server.
NGINX is a widely used tool for this purpose. To streamline our setup, we'll utilize a pre-built service called nginx-ingress-controller (found at https://github.com/kubernetes/ingress-nginx/). For detailed installation steps, refer to https://kubernetes.github.io/ingress-nginx/deploy/#quick-start.

#### Enable ingress nginx controller via minikube addon

```bash
minikube addons enable ingress
```

or via manifest

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.0-beta.0/deploy/static/provider/cloud/deploy.yaml
```

#### Local testing (with nginx ingress controller)

Create an ingress resource. The following example uses a host that maps to `localhost`. Apply `nginx-ingress.yaml` with:

```bash
kubectl apply -f nginx-ingress.yaml
```

Also config forward a local port to the ingress controller:

```bash
# Port-forward for port 8080
kubectl port-forward -n multiport service/multiport-nodejs-service 8080:8080 &

# Port-forward for port 8000
kubectl port-forward -n multiport service/multiport-nodejs-service 8000:8000 &

# Port-forward for port 9000
kubectl port-forward -n multiport service/multiport-nodejs-service 9000:9000 &
```

At this point, you can access your deployment using

**curl**

```bash
curl --resolve multiport.local.dev:8080:127.0.0.1 http://multiport.local.dev:8080
curl --resolve multiport.local.dev:8000:127.0.0.1 http://multiport.local.dev:8000
curl --resolve multiport.local.dev:9000:127.0.0.1 http://multiport.local.dev:9000
```

**browser**

- http://localhost:8080/
- http://localhost:8000/
- http://localhost:9000/

> **Additional Step(optional)**: Update the `/etc/hosts` file to resolve the local domain:
>
> `127.0.0.1 multiport.local.dev`

or if the hosts configured the service can be accessed in:

- http://multiport.local.dev/ (port 8080)
- http://multiport.local.dev/metrics (port 8000)
- http://multiport.local.dev/admin (port 9000)

To stop the port-forward processes, you can use:

```bash
# List background jobs
jobs

# List jobs filterde by port-forward
ps aux | grep port-forward


# Kill specific job by job number
kill %1
kill %2
kill %3
```

## GKE Deployment

1. Authenticate and Set Project

```bash
# Login to GCP
gcloud auth login

# Set your project
gcloud config set project $PROJECT_ID

# (Optional)
gcloud containers clusters create multiport-cluster
```

2. Build and push docker image to registry

```bash
docker build -t paulopatto/multiport-nodejs:$VERSION .
docker push paulopatto/multiport-nodejs:$VERSION
```

4. Deploy to GKE

```bash
kubectl apply -f manifest.k8s.yaml
```

Can check resources with:

```bash
kubectl get -n multiport deployments
kubectl get -n multiport services
kubectl get -n multiport pods

# OR just

kubectls get all -n multiport
```

The LoadBalancer service will provide external IP addresses use `kubectl get services` to find the external IPs

## Contributing

1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Make your changes
4. Commit your changes (git commit -m 'Add some AmazingFeature')
5. Push to the branch (git push origin feature/AmazingFeature)
6. Open a Pull Request
