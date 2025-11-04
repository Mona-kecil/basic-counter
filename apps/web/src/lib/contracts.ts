const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS?.slice(2);

if (typeof CONTRACT_ADDRESS === "undefined") {
  throw new Error("CONTRACT_ADDRESS is not set");
}

if (CONTRACT_ADDRESS.startsWith("0x")) {
  throw new Error("CONTRACT_ADDRESS must not start with 0x");
}

export const wagmiContractConfig = {
  address: `0x${CONTRACT_ADDRESS}`,
  abi: [
    {
      type: "function",
      name: "decrement",
      inputs: [],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "increment",
      inputs: [],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "number",
      inputs: [],
      outputs: [{ name: "number", type: "uint256", internalType: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "setNumber",
      inputs: [{ name: "newNumber", type: "uint256", internalType: "uint256" }],
      outputs: [],
      stateMutability: "nonpayable",
    },
  ],
} as const;
