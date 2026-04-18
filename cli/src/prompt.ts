import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

export async function ask(question: string, defaultValue?: string): Promise<string> {
  const rl = readline.createInterface({ input, output });
  const suffix = defaultValue ? ` (${defaultValue})` : "";
  const answer = (await rl.question(`${question}${suffix}: `)).trim();
  rl.close();
  if (!answer && defaultValue !== undefined) {
    return defaultValue;
  }
  return answer;
}

export async function askYesNo(question: string, defaultValue: boolean = true): Promise<boolean> {
  const hint = defaultValue ? "Y/n" : "y/N";
  const answer = await ask(`${question} (${hint})`, undefined);
  if (!answer) return defaultValue;
  return answer.toLowerCase().startsWith("y");
}

export async function askNumber(question: string, defaultValue: number): Promise<number> {
  while (true) {
    const value = await ask(question, String(defaultValue));
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
    console.log("Please enter a valid number.");
  }
}
