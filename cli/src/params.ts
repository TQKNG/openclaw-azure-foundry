import fs from "node:fs/promises";
import path from "node:path";
import type { CliConfig } from "./types.js";
import { stateDir } from "./config.js";

export function generatedParamsPath(projectRoot: string): string {
  return path.join(stateDir(projectRoot), "generated.bicepparam");
}

export function renderBicepParams(config: CliConfig): string {
  return `using '../infrastructure/main.bicep'

param location = '${config.location}'
param resourceGroupName = '${config.resourceGroupName}'
param vnetName = '${config.vnetName}'
param vmName = '${config.vmName}'
param vmSize = '${config.vmSize}'
param osDiskSizeGb = ${config.osDiskSizeGb}
param adminUsername = '${config.adminUsername}'
param aiServicesName = '${config.aiServicesName}'
param hubName = '${config.hubName}'
param projectName = '${config.projectName}'
param storageAccountName = '${config.storageAccountName}'
param modelName = '${config.modelName}'
param modelVersion = '${config.modelVersion}'
param modelCapacity = ${config.modelCapacity}
param keyVaultName = '${config.keyVaultName}'
param sshPublicKey = 'ssh-rsa PLACEHOLDER'
param telegramBotToken = 'PLACEHOLDER'
`;
}

export async function writeGeneratedParams(projectRoot: string, config: CliConfig): Promise<string> {
  const outputPath = generatedParamsPath(projectRoot);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, renderBicepParams(config), "utf8");
  return outputPath;
}
