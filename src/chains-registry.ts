
export const NETWORKS = {
  ethereum: {
    name: "Ethereum",
    family: "evm",
    chainId: 1,
    currency: "ETH",
    mintSupport: "seadrop"
  },
  base: {
    name: "Base",
    family: "evm",
    chainId: 8453,
    currency: "ETH",
    mintSupport: "seadrop"
  },
  robinhood: {
    name: "Robinhood Chain",
    family: "evm",
    chainId: 4663,
    currency: "ETH",
    mintSupport: "seadrop"
  },
  bnb: {
    name: "BNB Chain",
    family: "evm",
    chainId: 56,
    currency: "BNB",
    mintSupport: "planned"
  },
  solana: {
    name: "Solana",
    family: "solana",
    chainId: null,
    currency: "SOL",
    mintSupport: "planned"
  },
  bitcoin: {
    name: "Bitcoin",
    family: "bitcoin",
    chainId: null,
    currency: "BTC",
    mintSupport: "planned"
  }
} as const;

export type NetworkId = keyof typeof NETWORKS;

export function listNetworks(): string {
  return Object.entries(NETWORKS)
    .map(([id, network]) =>
      `${network.name} (${id})\n` +
      `Currency: ${network.currency}\n` +
      `Mint adapter: ${network.mintSupport}`
    )
    .join("\n\n");
}
