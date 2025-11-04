.PHONY: help test deploy deploy-anvil deploy-sepolia deploy-mainnet

BASE_RPC_URL="https://mainnet.base.org"
BASE_SEPOLIA_RPC_URL="https://sepolia.base.org"
ANVIL_DEVNET_RPC_URL="http://127.0.0.1:8545"

ANVIL_PRIVATE_KEY=$(shell cat .env | grep ANVIL_PRIVATE_KEY | cut -d '=' -f2)
TESTNET_PRIVATE_KEY=$(shell cat .env | grep TESTNET_PRIVATE_KEY | cut -d '=' -f2)
MAINNET_PRIVATE_KEY=$(shell cat .env | grep MAINNET_PRIVATE_KEY | cut -d '=' -f2)

help:
	@echo "Usage: make <target>"
	@echo "Targets:"
	@echo "  test             Test the smart contract"
	@echo "  deploy           Deploy (interactive)"
	@echo "  deploy-anvil     Deploy to Anvil"
	@echo "  deploy-sepolia   Deploy to Base Sepolia"
	@echo "  deploy-mainnet   Deploy to Base Mainnet"

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