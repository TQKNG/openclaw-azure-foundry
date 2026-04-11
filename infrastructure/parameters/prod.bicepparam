using '../main.bicep'

param location = 'eastus2'
param resourceGroupName = 'rg-openclaw'
param vnetName = 'vnet-openclaw'
param vmName = 'vm-openclaw'
param vmSize = 'Standard_D2s_v3'
param osDiskSizeGb = 64
param adminUsername = 'openclaw'
param aiServicesName = 'oc-ai-services-demo'
param hubName = 'oc-foundry-hub-demo'
param projectName = 'oc-foundry-proj-demo'
param storageAccountName = 'stocfoundrydemo01'
param modelName = 'gpt-4o'
param modelVersion = '2024-11-20'
param modelCapacity = 20
param keyVaultName = 'kv-oc-demo-01'
// sshPublicKey and telegramBotToken passed at deploy time
param sshPublicKey = 'ssh-rsa PLACEHOLDER'
param telegramBotToken = 'PLACEHOLDER'
