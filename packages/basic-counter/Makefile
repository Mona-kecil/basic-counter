.PHONY: help test deploy deploy-anvil deploy-sepolia deploy-mainnet update-web-contracts get-abi

BASE_RPC_URL="https://mainnet.base.org"
BASE_SEPOLIA_RPC_URL="https://sepolia.base.org"
ANVIL_DEVNET_RPC_URL="http://127.0.0.1:8545"

# Default Anvil private key (first account from anvil)
ANVIL_PRIVATE_KEY=$(shell if [ -f .env ] && grep -q ANVIL_PRIVATE_KEY .env; then cat .env | grep ANVIL_PRIVATE_KEY | cut -d '=' -f2; else echo "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; fi)
TESTNET_PRIVATE_KEY=$(shell if [ -f .env ] && grep -q TESTNET_PRIVATE_KEY .env; then cat .env | grep TESTNET_PRIVATE_KEY | cut -d '=' -f2; else echo ""; fi)
MAINNET_PRIVATE_KEY=$(shell if [ -f .env ] && grep -q MAINNET_PRIVATE_KEY .env; then cat .env | grep MAINNET_PRIVATE_KEY | cut -d '=' -f2; else echo ""; fi)

help:
	@echo "Usage: make <target>"
	@echo "Targets:"
	@echo "  setup                Setup the smart contract"
	@echo "  test                 Test the smart contract"
	@echo "  deploy               Deploy (interactive)"
	@echo "  deploy-anvil         Deploy to Anvil"
	@echo "  deploy-sepolia       Deploy to Base Sepolia"
	@echo "  deploy-mainnet       Deploy to Base Mainnet"
	@echo "  update-web-contracts Update contracts.ts and .env with ABI and address"
	@echo "  get-abi              [DEPRECATED] Use update-web-contracts instead"

test:
	forge test

deploy:
	@echo "Deploying to: Base Network"
	@read -p "Deploy to: [1] Anvil [2] Sepolia [3] Mainnet: " -n 1 -r CHOICE; \
	echo; \
	case $$CHOICE in \
		1) $(MAKE) deploy-anvil ;; \
		2) $(MAKE) deploy-sepolia ;; \
		3) $(MAKE) deploy-mainnet ;; \
		*) echo "Invalid choice"; exit 1 ;; \
	esac

# Anvil's default account private key (used for funding)
ANVIL_DEFAULT_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

fund-wallet-address:
	@if [ -z "$(ADDRESS)" ]; then \
		echo "❌ Error: ADDRESS is required. Usage: make fund-wallet-address ADDRESS=0x..."; \
		exit 1; \
	fi; \
	echo "💰 Funding address $(ADDRESS) with 99999 ETH..."; \
	if cast send $(ADDRESS) --value 5000ether --rpc-url $(ANVIL_DEVNET_RPC_URL) --private-key $(ANVIL_DEFAULT_KEY); then \
		echo "✅ Wallet funded successfully!"; \
	else \
		echo "❌ Failed to fund wallet"; \
		exit 1; \
	fi

get-abi:
	@echo "⚠️  This command is deprecated. Use 'update-web-contracts' instead."
	@$(MAKE) update-web-contracts

update-web-contracts:
	@echo "Updating contracts.ts and .env with ABI and contract address..."
	@node scripts/update-contracts.js

deploy-anvil:
	@echo "Deploying to: Anvil Devnet"
	forge script script/Counter.s.sol:CounterScript \
		--private-key $(ANVIL_PRIVATE_KEY) \
		--rpc-url $(ANVIL_DEVNET_RPC_URL) \
		--broadcast

deploy-sepolia:
	@echo "Deploying to: Base Sepolia"
	forge script script/Counter.s.sol:CounterScript \
		--broadcast \
		--rpc-url $(BASE_SEPOLIA_RPC_URL) \
		--private-key $(TESTNET_PRIVATE_KEY)

deploy-mainnet:
	@echo "Deploying to: Base Mainnet"
	@read -p "WARNING: Mainnet deploy. Continue? [y/N]: " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		forge script script/Counter.s.sol:CounterScript \
			--broadcast \
			--rpc-url $(BASE_RPC_URL) \
			--private-key $(MAINNET_PRIVATE_KEY);
	fi \

setup:
	@echo "⚠️  This Makefile's setup is deprecated."
	@echo "   Use 'make setup' from the root directory instead."