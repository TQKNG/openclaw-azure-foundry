import fs from "node:fs/promises";
import path from "node:path";
import { runCommand, runOrThrow } from "./utils.js";

export async function preflightChecks(): Promise<void> {
  await runOrThrow("az", ["--version"], "Azure CLI is not installed or not in PATH.");
  await runOrThrow("az", ["account", "show", "-o", "none"], "No active Azure login. Run `az login`.");
  await runOrThrow("az", ["bicep", "version"], "Bicep support is not available. Run `az bicep install`.");
}

export async function runDeployment(
  projectRoot: string,
  location: string,
  paramsPath: string,
  sshPublicKeyPath: string,
  telegramToken: string,
): Promise<void> {
  const sshKey = (await fs.readFile(path.resolve(sshPublicKeyPath), "utf8")).trim();
  if (!sshKey) {
    throw new Error("SSH public key file is empty.");
  }

  const args = [
    "deployment",
    "sub",
    "create",
    "--location",
    location,
    "--template-file",
    path.join(projectRoot, "infrastructure", "main.bicep"),
    "--parameters",
    paramsPath,
    "--parameters",
    `sshPublicKey=${sshKey}`,
    "--parameters",
    `telegramBotToken=${telegramToken}`,
  ];

  const code = await runCommand("az", args);
  if (code !== 0) {
    throw new Error("Azure deployment failed.");
  }
}
