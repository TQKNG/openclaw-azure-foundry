#!/bin/bash
# OIDC setup commands for hkaanturgut/openclaw-azure-foundry
# Run as a user with permissions to create App Registrations and assign roles

set -euo pipefail
OWNER="hkaanturgut"
REPO="openclaw-azure-foundry"
APP_NAME="openclaw-github-actions"

# 1) Create the App Registration
appId=$(az ad app create --display-name "$APP_NAME" --query appId -o tsv)
echo "Created appId: $appId"

# 2) Create Service Principal
az ad sp create --id "$appId"
spObjectId=$(az ad sp show --id "$appId" --query objectId -o tsv)

# 3) Add federated credential for main branch
az ad app federated-credential create --id "$appId" --parameters '{
  "name":"github-actions-main",
  "issuer":"https://token.actions.githubusercontent.com",
  "subject":"repo:'$OWNER'/'$REPO':ref:refs/heads/main",
  "audiences":["api://AzureADTokenExchange"]
}'

# 4) Add federated credential for workflow_dispatch (workflow runs)
az ad app federated-credential create --id "$appId" --parameters '{
  "name":"github-actions-dispatch",
  "issuer":"https://token.actions.githubusercontent.com",
  "subject":"repo:'$OWNER'/'$REPO':ref:refs/heads/*",
  "audiences":["api://AzureADTokenExchange"]
}'

# 5) Assign roles at subscription scope
subId=$(az account show --query id -o tsv)
tenantId=$(az account show --query tenantId -o tsv)

# Contributor role
az role assignment create --assignee-object-id "$spObjectId" --assignee-principal-type ServicePrincipal --role "Contributor" --scope "/subscriptions/$subId"

# User Access Administrator role
az role assignment create --assignee-object-id "$spObjectId" --assignee-principal-type ServicePrincipal --role "User Access Administrator" --scope "/subscriptions/$subId"

# 6) Print variables to set in GitHub
cat <<EOT
Set these values in GitHub repository Variables (not secrets):
AZURE_CLIENT_ID=$appId
AZURE_TENANT_ID=$tenantId
AZURE_SUBSCRIPTION_ID=$subId
EOT

echo "OIDC setup complete"
