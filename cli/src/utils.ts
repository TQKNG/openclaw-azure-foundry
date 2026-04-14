import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

export function expandTilde(inputPath: string): string {
  if (inputPath === "~") {
    return os.homedir();
  }
  if (inputPath.startsWith("~/")) {
    return path.join(os.homedir(), inputPath.slice(2));
  }
  return inputPath;
}

export async function findProjectRoot(startDir: string): Promise<string> {
  let current = path.resolve(startDir);
  while (true) {
    const candidate = path.join(current, "infrastructure", "main.bicep");
    try {
      await fs.access(candidate);
      return current;
    } catch {
      const parent = path.dirname(current);
      if (parent === current) {
        throw new Error("Could not find project root containing infrastructure/main.bicep.");
      }
      current = parent;
    }
  }
}

export function runCommand(command: string, args: string[]): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit" });
    child.on("error", reject);
    child.on("close", (code) => resolve(code ?? 1));
  });
}

export async function runOrThrow(command: string, args: string[], message: string): Promise<void> {
  const code = await runCommand(command, args);
  if (code !== 0) {
    throw new Error(message);
  }
}
