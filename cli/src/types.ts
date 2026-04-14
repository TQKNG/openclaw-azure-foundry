export type CliConfig = {
  location: string;
  resourceGroupName: string;
  vnetName: string;
  vmName: string;
  vmSize: string;
  osDiskSizeGb: number;
  adminUsername: string;
  sshPublicKeyPath: string;
  aiServicesName: string;
  hubName: string;
  projectName: string;
  storageAccountName: string;
  modelName: string;
  modelVersion: string;
  modelCapacity: number;
  keyVaultName: string;
};
