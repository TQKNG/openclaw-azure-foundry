using '../main.bicep'

param location = 'eastus2'
param resourceGroupName = 'rg-openclaw-01'
param vnetName = 'vnet-openclaw-01'
param vmName = 'vm-openclaw-01'
param vmSize = 'Standard_D2s_v3'
param osDiskSizeGb = 64
param adminUsername = 'openclaw'
param aiServicesName = 'oc-ai-services-demo01'
param hubName = 'oc-foundry-hub-demo01'
param projectName = 'oc-foundry-proj-demo01'
param storageAccountName = 'stocfoundrydemo0101'
param modelName = 'gpt-4o'
param modelVersion = '2024-11-20'
param modelCapacity = 20
param keyVaultName = 'kv-oc-demo-0101'
// sshPublicKey and telegramBotToken passed at deploy time
param sshPublicKey = 'ssh-rsa PLACEHOLDER'
param telegramBotToken = 'PLACEHOLDER'
