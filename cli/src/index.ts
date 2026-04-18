#!/usr/bin/env node

import { collectConfig, configPath, loadConfig, saveConfig } from "./config.js";
import { ask } from "./prompt.js";
import { writeGeneratedParams } from "./params.js";
import { findProjectRoot } from "./utils.js";
import { preflightChecks, runDeployment } from "./azure.js";

function helpText(): string {
  return `openclaw-azure-cli

Usage:
  openclaw-azure init
  openclaw-azure deploy
  openclaw-azure help

Commands:
  init    Prompt for infrastructure values and save local config.
  deploy  Run Azure preflight checks and deploy infrastructure.
`;
}

async function handleInit(projectRoot: string): Promise<void> {
  const config = await collectConfig(projectRoot);
  await saveConfig(projectRoot, config);
  const paramsPath = await writeGeneratedParams(projectRoot, config);
  console.log(`Saved config: ${configPath(projectRoot)}`);
  console.log(`Generated params: ${paramsPath}`);
}

async function handleDeploy(projectRoot: string): Promise<void> {
  const config = await loadConfig(projectRoot);
  if (!config) {
    throw new Error("No valid config found. Run `openclaw-azure init` first.");
  }

  const token = await ask("Telegram bot token (input visible)");
  if (!token) {
    throw new Error("Telegram bot token is required.");
  }

  const paramsPath = await writeGeneratedParams(projectRoot, config);

  console.log("Running preflight checks...");
  await preflightChecks();

  console.log("Deploying infrastructure...");
  await runDeployment(
    projectRoot,
    config.location,
    paramsPath,
    config.sshPublicKeyPath,
    token,
  );

  console.log("Deployment completed.");
  console.log("Next steps:");
  console.log("1. Run scripts/validate-deployment.sh");
  console.log("2. Test your Telegram bot");
}

async function main(): Promise<void> {
  const command = process.argv[2] ?? "help";
  const projectRoot = await findProjectRoot(process.cwd());

  if (command === "help" || command === "--help" || command === "-h") {
    console.log(helpText());
    return;
  }

  if (command === "init") {
    await handleInit(projectRoot);
    return;
  }

  if (command === "deploy") {
    await handleDeploy(projectRoot);
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

main().catch((err) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`Error: ${message}`);
  process.exit(1);
});
