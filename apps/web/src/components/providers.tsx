"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, http, WagmiProvider } from "wagmi";
import { anvil } from "wagmi/chains";
import { baseAccount, injected, metaMask, safe } from "wagmi/connectors";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
      <Toaster position="top-center" richColors />
    </ThemeProvider>
  );
}

const config = createConfig({
  chains: [anvil],
  connectors: [
    injected(),
    metaMask(),
    baseAccount({
      appName: "Basic Counter",
      appLogoUrl: "https://picsum.photos/150/150",
    }),
    safe(),
  ],
  transports: {
    [anvil.id]: http("http://127.0.0.1:8545"),
  },
});

const queryClient = new QueryClient();
queryClient.clear();
