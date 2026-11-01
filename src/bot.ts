
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

bot.command("discover", (ctx) =>
  ctx.reply("🔎 Discovery module coming in Phase 2.")
);

bot.command("wallets", (ctx) =>
  ctx.reply("🔒 No wallet signer configured.")
);

bot.command("budget", (ctx) =>
  ctx.reply("💰 Spending is disabled until budget controls are installed.")
);

bot.launch()
  .then(() => console.log("NFT Scout Agent running"))
  .catch(console.error);

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
