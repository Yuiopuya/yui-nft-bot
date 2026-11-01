
import type { NFTDrop } from "./index";

type MintStage = {
  price?: string;
  stage_type?: string;
  label?: string;
  start_time?: string;
  end_time?: string;
  max_per_wallet?: string;
  price_currency_address?: string;
};

type OpenSeaDrop = {
  collection_name?: string;
  collection_slug?: string;
  chain?: string;
  contract_address?: string;
  opensea_url?: string;
  is_minting?: boolean;
  active_stage?: MintStage | null;
  next_stage?: MintStage | null;
};

export async function fetchOpenSeaDrops(): Promise<NFTDrop[]> {
  const key = process.env.OPENSEA_API_KEY;
  if (!key) throw new Error("Missing OpenSea API key");

  const response = await fetch(
    "https://api.opensea.io/api/v2/drops?type=upcoming&limit=100",
    {
      headers: { "X-API-KEY": key },
      signal: AbortSignal.timeout(15000)
    }
  );

  if (!response.ok) {
    throw new Error(`OpenSea API error: ${response.status}`);
  }

  const data = await response.json() as {
    drops?: OpenSeaDrop[];
  };

  const allowedChains = new Set([
    "ethereum",
    "base",
    "robinhood",
    "bnb"
  ]);

  return (data.drops ?? []).flatMap(drop => {
    if (!drop.chain || !allowedChains.has(drop.chain)) {
      return [];
    }

    const stage = drop.active_stage ?? drop.next_stage;

    if (!stage || stage.price !== "0") {
      return [];
    }

    return [{
      name: drop.collection_name ?? "Unknown collection",
      chain: drop.chain as NFTDrop["chain"],
      contractAddress: drop.contract_address,
      mintPrice: "0",
      mintDate: stage.start_time,
      mintUrl: drop.opensea_url,
      source: "OpenSea",
      verified: false
    }];
  });
}
