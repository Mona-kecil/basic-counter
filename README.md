# basic-counter

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines Next.js, Self, and more.

# How to setup

## Quick Setup (Automated)

1. Start Anvil in a separate terminal:

   ```bash
   anvil
   ```

2. Run the automated setup from the root directory:

   ```bash
   make setup
   ```

   This will:

   - Install all dependencies
   - Compile the smart contract
   - **Prompt you to use your own wallet** (optional - funds your address from Anvil's default account)
   - Deploy the contract to Anvil
   - Extract the contract address and ABI
   - Update `apps/web/.env` with the contract address
   - Update `apps/web/src/lib/contracts.ts` with the ABI

   **Using Your Own Wallet:**

   - When prompted, choose `y` to use your own wallet
   - Enter your wallet address (0x...)
   - Your wallet will be automatically funded with 99999 ETH from Anvil's default account
   - To deploy with your wallet, add your private key to `packages/basic-counter/.env`:
     ```
     ANVIL_PRIVATE_KEY=your_private_key_here
     ```
   - If you don't specify a wallet, the default Anvil account will be used

3. Configure your wallet to connect to Anvil:

   **MetaMask Setup:**

   - Open MetaMask and click the network dropdown (usually shows "Ethereum Mainnet")
   - Click "Add a network manually" or go to Settings → Networks → Add custom network
   - Enter the following details:
     - **Network Name**: `Anvil Local`
     - **RPC URL**: `http://127.0.0.1:8545`
     - **Chain ID**: `31337`
     - **Currency Symbol**: `ETH`
     - **Block Explorer URL**: (leave empty)
   - Click "Save"

   **Connect Your Wallet:**

   - If you used your own wallet address during setup, make sure that wallet is imported/connected in MetaMask
   - If you used the default Anvil account, you can import it:
     - In MetaMask, click the account icon → "Import Account"
     - Select "Private Key" and paste: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
     - This is the default Anvil account that was used for deployment
   - Switch to the "Anvil Local" network in MetaMask

4. Run the development server:
   ```bash
   bun run dev
   ```

## Manual Setup (Alternative)

If you prefer to set up manually:

1. `anvil`
2. transfer funds to the address you want to be the owner of the contract
3. `cd packages/basic-counter && make deploy-anvil`
4. Get contract address from stdout
5. Get abi from `packages/basic-counter/out/Counter.sol/Counter.json`
6. Set the contract address in `apps/web/.env`
7. Set the abi in `apps/web/src/lib/contracts.ts`
8. Run the development server from root directory: `bun run dev`

## Features

- **TypeScript** - For type safety and improved developer experience
- **Next.js** - Full-stack React framework
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **Biome** - Linting and formatting
- **Turborepo** - Optimized monorepo build system

## Getting Started

First, install the dependencies:

```bash
bun install
```

Then, run the development server:

```bash
bun run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see your fullstack application.

## Project Structure

```
basic-counter/
├── apps/
│   └── web/         # Fullstack application (Next.js)
├── packages/
│   ├── api/         # API layer / business logic
```

## Available Scripts

- `bun run dev`: Start all applications in development mode
- `bun run build`: Build all applications
- `bun run check-types`: Check TypeScript types across all apps
- `bun run check`: Run Biome formatting and linting
