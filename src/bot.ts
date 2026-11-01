import { discoverFreeMints } from "./discovery";
import { NETWORKS, listNetworks } from "./chains-registry";
import "dotenv/config";
import { Telegraf } from "telegraf";

const token = process.env.TELEGRAM_BOT_TOKEN;
const adminId = process.env.TELEGRAM_ADMIN_ID;

if (!token || !adminId) {
  throw new Error("Missing Telegram configuration");
}

const bot = new Telegraf(token);

bot.use(async (ctx, next) => {
  if (String(ctx.from?.id) !== adminId) {
    return;
  }
  await next();
});

bot.start((ctx) => {
  return ctx.reply(
    "🤖 NFT Scout Agent is online!\n\n" +
    "Use /help to see available commands."
  );
});

bot.command("help", (ctx) => {
  return ctx.reply(
    "Available commands:\n\n" +
    "/status - Check bot status\n" +
    "/discover - Check discovery module\n" +
    "/wallets - Check wallet integration\n" +
    "/budget - Check spending controls\n" +
    "/help - Show commands"
  );
});

bot.command("status", (ctx) => {
  return ctx.reply(
    "🟢 Bot online\n" +
    "Minting: DISABLED\n" +
    "Discovery: NOT CONFIGURED\n" +
    "Network: Base (planned)"
  );
});

bot.command("wallets", (ctx) =>
  ctx.reply("🔒 No wallet signer configured.")
);

bot.command("budget", (ctx) =>
  ctx.reply("💰 Spending is disabled until budget controls are installed.")
);
bot.command("chains", (ctx) => {
  return ctx.reply(
    "🌐 Supported network registry:\n\n" +
    listNetworks() +
    "\n\n⚠️ Live minting is not enabled."
  );
});

bot.command("discover", async (ctx) => {
  const args = ctx.message.text.split(" ");
  const chain = args[1]?.toLowerCase();

  if (chain && !(chain in NETWORKS)) {
    return ctx.reply(
      "Unknown network. Use /chains to see available networks."
    );
  }

  let drops;

try {
  drops = await discoverFreeMints(
    chain as keyof typeof NETWORKS | undefined
  );
} catch (error) {
  console.error("Discovery failed:", error);
  return ctx.reply(
    "⚠️ Discovery is temporarily unavailable. Try again later."
  );
}

  if (drops.length === 0) {
    return ctx.reply(
      "🔎 No free mints found in the current discovery data.\n" +
      "Live discovery sources are not connected yet."
    );
  }

 
return ctx.reply(
  drops.map(drop =>
    `🎨 ${drop.name}\n` +
    `Chain: ${drop.chain}\n` +
    `Reported price: 0 (eligibility unverified)\n` +
    `Contract: ${drop.contractAddress ?? "Unknown"}\n` +
    `Mint date: ${drop.mintDate ?? "Unknown"}\n` +
    `Mint link: ${drop.mintUrl ?? "Unavailable"}\n` +
    `Source: ${drop.source}`
  ).join("\n\n")
);
});

bot.launch()
  .then(() => console.log("NFT Scout Agent running"))
  .catch(console.error);

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
