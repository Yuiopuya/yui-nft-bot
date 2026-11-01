import { fetchOpenSeaDrops } from "./opensea";
import { NETWORKS } from "../chains-registry";

export interface NFTDrop {
  name: string;
  chain: keyof typeof NETWORKS;
  contractAddress?: string;
  mintPrice: string;
  mintDate?: string;
  mintUrl?: string;
  source: string;
  verified: boolean;
}

export function isFreeMint(drop: NFTDrop): boolean {
  return drop.mintPrice === "0";
}


export async function discoverFreeMints(
  chain?: keyof typeof NETWORKS
): Promise<NFTDrop[]> {
  const drops = await fetchOpenSeaDrops();

  return drops.filter(
    drop =>
      isFreeMint(drop) &&
      (!chain || drop.chain === chain)
  );
}
