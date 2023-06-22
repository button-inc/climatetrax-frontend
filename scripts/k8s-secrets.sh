# cd scripts
# bash k8s-secrets.sh

# Set the GCP project ID
PROJECT_ID="emissions-elt-demo"

# Set the Kubernetes namespace
NAMESPACE="default"

# Set the secret names
SECRET_NAMES=("eed_nextauth_google_client_id" "eed_nextauth_google_client_secret" "eed_nextauth_secret" "eed_nextauth_url" "eed_api_host" "eed_database" "eed_database_host" "eed_database_port" "eed_database_protocol" "eed_database_schema_admin" "eed_database_schema_clean" "eed_database_schema_workspace" "eed_database_user_admin" "eed_database_user_analyst" "eed_database_user_pw_admin" "eed_database_user_pw_analyst" "eed_db_host" "eed_db_pass" "eed_db_user")


# Authenticate to GCP using application-default credentials
authenticate() {
  gcloud auth application-default login
}

# Start the Kubernetes cluster using Cloud Code
#kubectl apply -f kubernetes/ || handle_error "Failed to start Kubernetes cluster"

# Function to handle errors and exit the script
handle_error() {
  echo "Error: $1" >&2
  exit 1
}

# Function to display success message
display_success() {
  echo "Secret $1 created/updated successfully"
}

# Function to display secret value
display_secret_value() {
  echo "Secret: $1, Value: $2"
}

# Set the GCP project
gcloud config set project "$PROJECT_ID" || handle_error "Failed to set project $PROJECT_ID"

# Authenticate to GCP
authenticate || handle_error "Failed to authenticate to GCP"

# Loop through the secret names and create/update the Kubernetes secrets
for secret_name in "${SECRET_NAMES[@]}"; do
  # Convert secret name to lowercase and replace underscores with hyphens
  secret_name_lower=$(echo "$secret_name" | tr '[:upper:]' '[:lower:]' | tr '_' '-')

  # If the secret name is "eed-nextauth-url", set it to "http://localhost:4503"
  if [[ "$secret_name" == "eed_nextauth_url" ]]; then
    secret_value="http://localhost:4503"
  elif [[ "$secret_name" == "eed_api_host" ]]; then
    secret_value="http://localhost:3000/"
  else
    # Get the secret value from GCP Secret Manager
    secret_value=$(gcloud secrets versions access latest --secret="$secret_name" 2>/dev/null || handle_error "Failed to retrieve secret $secret_name")
  fi

  # Create or update the Kubernetes secret
  if kubectl create secret generic "$secret_name_lower" --namespace="$NAMESPACE" --from-literal="$secret_name_lower"="$secret_value" --dry-run=client -o yaml | kubectl apply -f -; then
    display_success "$secret_name_lower"
    display_secret_value "$secret_name_lower" "$secret_value"
  else
    handle_error "Failed to create/update secret $secret_name_lower"
  fi
done

# Display overall success message
echo "All secrets created/updated successfully"
