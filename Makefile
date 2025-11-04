.PHONY: help setup install-deps compile deploy-local update-contracts check-anvil setup-wallet

help:
	@echo "Usage: make <target>"
	@echo "Targets:"
	@echo "  setup            Complete setup: install deps, compile, deploy, and configure"
	@echo "  install-deps     Install all dependencies"
	@echo "  compile          Compile smart contracts"
	@echo "  deploy-local     Deploy contract to local Anvil network"
	@echo "  update-contracts Update contracts.ts with ABI and address"
	@echo "  setup-wallet     Interactive wallet setup (fund your address)"

setup: check-anvil install-deps compile setup-wallet deploy-local update-contracts
	@echo ""
	@echo "✅ Setup complete! You can now run 'bun run dev' to start the development server."

setup-wallet:
	@echo "💼 Wallet Setup"
	@echo ""
	@read -p "Do you want to use your own wallet address? [y/N]: " -n 1 -r USE_OWN; \
	echo; \
	if [[ $$USE_OWN =~ ^[Yy]$$ ]]; then \
		echo ""; \
		read -p "Enter your wallet address (0x...): " -r USER_ADDRESS; \
		echo ""; \
		if [ -z "$$USER_ADDRESS" ]; then \
			echo "❌ No address provided. Using default Anvil account."; \
		else \
			echo "💰 Funding your wallet..."; \
			cd packages/smart-contract && $(MAKE) fund-wallet-address ADDRESS=$$USER_ADDRESS || exit 1; \
			echo ""; \
			echo "⚠️  IMPORTANT: To use your wallet for deployment, add this to packages/smart-contract/.env:"; \
			echo "   ANVIL_PRIVATE_KEY=your_private_key_here"; \
			echo ""; \
			read -p "Press Enter to continue..."; \
		fi; \
	else \
		echo "Using default Anvil account for deployment."; \
	fi

install-deps:
	@echo "📦 Installing dependencies..."
	@bun install
	@echo "✅ Dependencies installed"

compile:
	@echo "🔨 Compiling smart contracts..."
	@cd packages/smart-contract && forge build
	@echo "✅ Smart contracts compiled"

deploy-local:
	@echo "🚀 Deploying contract to Anvil..."
	@cd packages/smart-contract && $(MAKE) deploy-anvil
	@echo "✅ Contract deployed"

update-contracts:
	@echo "📝 Updating contracts.ts..."
	@cd packages/smart-contract && $(MAKE) update-web-contracts
	@echo "✅ contracts.ts updated"

check-anvil:
	@echo "🔍 Checking if Anvil is running..."
	@if ! cast rpc eth_blockNumber --rpc-url http://127.0.0.1:8545 > /dev/null 2>&1; then \
		echo "⚠️  Anvil is not running. Please start it in another terminal:"; \
		echo "   anvil"; \
		echo ""; \
		echo "Then run 'make setup' again."; \
		exit 1; \
	fi
	@echo "✅ Anvil is running"

