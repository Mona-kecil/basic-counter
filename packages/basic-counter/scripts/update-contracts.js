#!/usr/bin/env node

/**
 * Script to update contracts.ts with ABI and .env with contract address
 */

import { access, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SCRIPT_DIR = __dirname;
const CONTRACT_DIR = dirname(SCRIPT_DIR);
const ROOT_DIR = join(CONTRACT_DIR, "../..");
const WEB_DIR = join(ROOT_DIR, "apps/web");
const CONTRACTS_TS = join(WEB_DIR, "src/lib/contracts.ts");
const ENV_FILE = join(WEB_DIR, ".env");

// Paths (relative to packages/basic-counter directory)
const ABI_SOURCE = join(CONTRACT_DIR, "out/Counter.sol/Counter.json");
const BROADCAST_FILE = join(
  CONTRACT_DIR,
  "broadcast/Counter.s.sol/31337/run-latest.json"
);

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function readJsonFile(path) {
  const content = await readFile(path, "utf-8");
  return JSON.parse(content);
}

async function updateEnvFile(contractAddress) {
  let envContent = "";

  // Read existing .env file if it exists
  if (await fileExists(ENV_FILE)) {
    envContent = await readFile(ENV_FILE, "utf-8");
  }

  // Update or add NEXT_PUBLIC_CONTRACT_ADDRESS
  const envLines = envContent.split("\n");
  let found = false;
  const updatedLines = envLines.map((line) => {
    if (line.startsWith("NEXT_PUBLIC_CONTRACT_ADDRESS=")) {
      found = true;
      return `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`;
    }
    return line;
  });

  if (!found) {
    updatedLines.push(`NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`);
  }

  await writeFile(ENV_FILE, `${updatedLines.join("\n")}\n`, "utf-8");
}

function formatAbi(abi) {
  // Format ABI with proper indentation (2 spaces, then add 2 more for array items)
  const formatted = JSON.stringify(abi, null, 2);
  // Add 4 spaces indentation to each line (for the abi property)
  return formatted
    .split("\n")
    .map((line) => `    ${line}`)
    .join("\n");
}

async function updateContractsTs(abi) {
  const abiFormatted = formatAbi(abi);

  const content = `const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS?.slice(2);

if (typeof CONTRACT_ADDRESS === "undefined") {
  throw new Error("CONTRACT_ADDRESS is not set");
}

if (CONTRACT_ADDRESS.startsWith("0x")) {
  throw new Error("CONTRACT_ADDRESS must not start with 0x");
}

export const wagmiContractConfig = {
  address: \`0x\${CONTRACT_ADDRESS}\`,
  abi: ${abiFormatted},
} as const;
`;

  await writeFile(CONTRACTS_TS, content, "utf-8");
}

async function main() {
  try {
    // Check if files exist
    if (!(await fileExists(ABI_SOURCE))) {
      console.error("❌ Error: ABI file not found at", ABI_SOURCE);
      console.error("   Please compile the contract first: forge build");
      process.exit(1);
    }

    if (!(await fileExists(BROADCAST_FILE))) {
      console.error("❌ Error: Broadcast file not found at", BROADCAST_FILE);
      console.error("   Please deploy the contract first");
      process.exit(1);
    }

    // Read and parse JSON files
    const abiData = await readJsonFile(ABI_SOURCE);
    const broadcastData = await readJsonFile(BROADCAST_FILE);

    // Extract ABI
    const abi = abiData.abi;
    if (!(abi && Array.isArray(abi))) {
      console.error("❌ Error: Invalid ABI format");
      process.exit(1);
    }

    // Extract contract address (from the CREATE transaction)
    const createTransaction = broadcastData.transactions?.find(
      (tx) => tx.transactionType === "CREATE"
    );

    if (!createTransaction?.contractAddress) {
      console.error(
        "❌ Error: Could not extract contract address from broadcast file"
      );
      process.exit(1);
    }

    const contractAddress = createTransaction.contractAddress;

    console.log("📝 Found contract address:", contractAddress);
    console.log("📝 Updating files...");

    // Update .env file
    if (!(await fileExists(ENV_FILE))) {
      console.log("⚠️  .env file not found, creating it...");
    }

    await updateEnvFile(contractAddress);
    await updateContractsTs(abi);

    console.log("✅ Updated", CONTRACTS_TS);
    console.log("✅ Updated", ENV_FILE);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

main();
