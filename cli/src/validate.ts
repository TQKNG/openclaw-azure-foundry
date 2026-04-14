import type { CliConfig } from "./types.js";

function ensureRegex(value: string, regex: RegExp, message: string): void {
  if (!regex.test(value)) {
    throw new Error(message);
  }
}

function ensureLength(value: string, min: number, max: number, field: string): void {
  if (value.length < min || value.length > max) {
    throw new Error(`${field} must be between ${min} and ${max} characters.`);
  }
}

export function validateConfig(config: CliConfig): void {
  ensureRegex(config.resourceGroupName, /^[a-zA-Z0-9._()\-]{1,90}$/, "resourceGroupName has invalid characters.");
  ensureRegex(config.vnetName, /^[a-zA-Z0-9._\-]{2,64}$/, "vnetName has invalid format.");
  ensureRegex(config.vmName, /^[a-zA-Z0-9\-]{1,64}$/, "vmName has invalid format.");
  ensureRegex(config.adminUsername, /^[a-z_][a-z0-9_-]{0,31}$/, "adminUsername has invalid format.");
  ensureRegex(config.aiServicesName, /^[a-z0-9\-]{2,64}$/, "aiServicesName must be lowercase letters, numbers, and dashes.");
  ensureRegex(config.hubName, /^[a-zA-Z0-9\-]{2,64}$/, "hubName has invalid format.");
  ensureRegex(config.projectName, /^[a-zA-Z0-9\-]{2,64}$/, "projectName has invalid format.");

  ensureLength(config.storageAccountName, 3, 24, "storageAccountName");
  ensureRegex(config.storageAccountName, /^[a-z0-9]+$/, "storageAccountName must be lowercase letters and numbers only.");

  ensureRegex(config.keyVaultName, /^[a-z0-9\-]{3,24}$/, "keyVaultName must be lowercase letters, numbers, and dashes (3-24 chars).");

  if (config.osDiskSizeGb < 30 || config.osDiskSizeGb > 4095) {
    throw new Error("osDiskSizeGb must be between 30 and 4095.");
  }
  if (config.modelCapacity < 1 || config.modelCapacity > 1000) {
    throw new Error("modelCapacity must be between 1 and 1000.");
  }
}
