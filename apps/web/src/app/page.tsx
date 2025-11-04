"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
} from "wagmi";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { wagmiContractConfig } from "@/lib/contracts";

const TITLE_TEXT = `
 ██████╗ ███████╗████████╗████████╗███████╗██████╗
 ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
 ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
 ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
 ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
 ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝

 ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗
 ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
    ██║       ███████╗   ██║   ███████║██║     █████╔╝
    ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
    ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
 `;

const MASKED_ADDRESS_LENGTH = 4;

export default function Home() {
  const queryClient = useQueryClient();
  const { address, status } = useAccount();
  const { disconnect } = useDisconnect();

  const maskedAddress = address
    ? `${address.slice(0, MASKED_ADDRESS_LENGTH)}...${address.slice(-MASKED_ADDRESS_LENGTH)}`
    : null;

  const {
    data: number,
    isLoading,
    error,
  } = useReadContract({
    ...wagmiContractConfig,
    functionName: "number",
    blockTag: "latest",
    query: {
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: true,
    },
  });

  console.log(`Number Data: ${number}`);
  console.log(`Number Loading: ${isLoading}`);
  console.log(`Number Error: ${error}`);

  const { writeContract } = useWriteContract({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries();
      },
    },
  });

  const increment = () => {
    if (!address) {
      return;
    }

    writeContract(
      {
        ...wagmiContractConfig,
        functionName: "increment",
      },
      {
        onSuccess: () => {
          toast.success("Transaction submitted successfully");
          queryClient.invalidateQueries();
        },
        onError: () => {
          toast.error("Transaction failed");
        },
      }
    );
  };

  const decrement = () => {
    if (!address) {
      return;
    }

    writeContract(
      {
        ...wagmiContractConfig,
        functionName: "decrement",
      },
      {
        onSuccess: () => {
          toast.success("Transaction submitted successfully");
          queryClient.invalidateQueries();
        },
        onError: () => {
          toast.error("Transaction failed");
        },
      }
    );
  };

  const setNumberTo100 = () => {
    if (!address) {
      return;
    }

    writeContract(
      {
        ...wagmiContractConfig,
        functionName: "setNumber",
        // biome-ignore lint/style/noMagicNumbers: <shut up>
        args: [BigInt(100)],
      },
      {
        onSuccess: () => {
          toast.success("Transaction submitted successfully");
          queryClient.invalidateQueries();
        },
        onError: () => {
          toast.error("Transaction failed");
        },
      }
    );
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      <pre className="overflow-x-auto font-mono text-sm">{TITLE_TEXT}</pre>
      <div className="grid gap-6">
        {status === "disconnected" && <WalletOptions />}
        {(status === "connecting" || status === "reconnecting") && <Loader />}

        {status === "connected" && (
          <section className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <h2 className="mb-2 font-bold text-3xl">Counter</h2>
              <div className="flex flex-col items-end justify-center">
                <p className="mb-2 text-muted-foreground text-sm">
                  Connected as: {maskedAddress}
                </p>
                <Button onClick={() => disconnect()}>Disconnect</Button>
              </div>
            </div>

            <div>
              {typeof number !== "undefined" ? (
                <p>Number: {number.toString()}</p>
              ) : (
                <p>Loading...</p>
              )}
              {typeof error !== "undefined" && <p>Error: {error?.message}</p>}
              <Button onClick={() => increment()}>Increment</Button>
              <Button onClick={() => decrement()}>Decrement</Button>
              <Button onClick={() => setNumberTo100()}>
                Set Number to 100
              </Button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function WalletOptions() {
  const { connect, connectors } = useConnect();
  return connectors.map((connector) => (
    <Button key={connector.id} onClick={() => connect({ connector })}>
      {connector.name}
    </Button>
  ));
}
