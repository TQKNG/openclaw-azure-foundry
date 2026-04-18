import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import type { CliConfig } from "./types.js";
import { ask, askNumber, askYesNo } from "./prompt.js";
import { expandTilde, generateSshKeypair } from "./utils.js";
import { validateConfig } from "./validate.js";

export function stateDir(projectRoot: string): string {
  return path.join(projectRoot, ".openclaw-azure");
}

export function configPath(projectRoot: string): string {
  return path.join(stateDir(projectRoot), "config.json");
}

export async function saveConfig(projectRoot: string, config: CliConfig): Promise<void> {
  await fs.mkdir(stateDir(projectRoot), { recursive: true });
  await fs.writeFile(configPath(projectRoot), JSON.stringify(config, null, 2), "utf8");
}

export async function loadConfig(projectRoot: string): Promise<CliConfig | null> {
  try {
    const raw = await fs.readFile(configPath(projectRoot), "utf8");
    const config = JSON.parse(raw) as CliConfig;
    validateConfig(config);
    return config;
  } catch {
    return null;
  }
}

export async function collectConfig(projectRoot: string): Promise<CliConfig> {
  const defaultSshKey = path.join(os.homedir(), ".ssh", "id_ed25519.pub");

  const generateSsh = await askYesNo("Generate a new SSH keypair for this deployment?", true);
  let sshPublicKeyPath: string;
  if (generateSsh) {
    sshPublicKeyPath = await generateSshKeypair(projectRoot);
  } else {
    sshPublicKeyPath = expandTilde(await ask("SSH public key path", defaultSshKey));
  }

  const config: CliConfig = {
    location: await ask("Azure location", "eastus2"),
    resourceGroupName: await ask("Resource group name", "rg-openclaw"),
    vnetName: await ask("Virtual network name", "vnet-openclaw"),
    vmName: await ask("VM name", "vm-openclaw"),
    vmSize: await ask("VM size", "Standard_D2s_v3"),
    osDiskSizeGb: await askNumber("OS disk size GB", 64),
    adminUsername: await ask("VM admin username", "openclaw"),
    sshPublicKeyPath,
    aiServicesName: await ask("AI Services account name", "oc-ai-services-demo"),
    hubName: await ask("Foundry Hub name", "oc-foundry-hub-demo"),
    projectName: await ask("Foundry Project name", "oc-foundry-project-demo"),
    storageAccountName: await ask("Storage account name", "stocfoundrydemo01"),
    modelName: await ask("Model name", "gpt-4o"),
    modelVersion: await ask("Model version", "2024-11-20"),
    modelCapacity: await askNumber("Model capacity", 30),
    keyVaultName: await ask("Key Vault name", "kv-oc-demo-01"),
  };

  validateConfig(config);
  return config;
}
