import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env from project root (not from cwd)
dotenv.config({ path: path.resolve(import.meta.dirname ?? '.', '../../.env') });

// ─── Configuration ──────────────────────────────────────────
// Inline the package ID so we don't depend on Vite/TS path resolution
const CUSTOM_MARKET_PACKAGE = '0xf8f92b0e934ac04faef02f273463638188767871068521979700e694d85761a8';

const SUI_PRIVATE_KEY = process.env.SUI_PRIVATE_KEY;
const MARKET_ID = process.env.MARKET_ID;
const ADMIN_CAP_ID = process.env.ADMIN_CAP_ID;
const TARGET_PRICE = Number(process.env.TARGET_PRICE) || 100000;
const POLL_INTERVAL_MS = Number(process.env.POLL_INTERVAL_MS) || 30000;

// ─── Validation ─────────────────────────────────────────────
const DEMO_MODE = !SUI_PRIVATE_KEY || !MARKET_ID || !ADMIN_CAP_ID;

if (DEMO_MODE) {
  console.warn("\n⚠  Running in DEMO MODE — no .env credentials found.");
  console.warn("   The bot will fetch prices but will NOT submit transactions.");
  console.warn("   To enable live resolution, create a .env file (see .env.example)\n");
}

// ─── Sui Client ─────────────────────────────────────────────
const client = new SuiClient({ url: getFullnodeUrl('testnet') });

// ─── Keypair Setup (only if credentials exist) ──────────────
let keypair: Ed25519Keypair | null = null;
if (!DEMO_MODE) {
  try {
    if (SUI_PRIVATE_KEY!.startsWith('suiprivkey')) {
      keypair = Ed25519Keypair.fromSecretKey(SUI_PRIVATE_KEY!);
    } else {
      const secret = Buffer.from(SUI_PRIVATE_KEY!, 'base64');
      const secretKeyOnly = secret.length === 64 ? secret.slice(0, 32) : secret;
      keypair = Ed25519Keypair.fromSecretKey(secretKeyOnly);
    }
    console.log(`[+] Bot Wallet Address: ${keypair.getPublicKey().toSuiAddress()}`);
  } catch (e) {
    console.error("[ERROR] Failed to parse SUI_PRIVATE_KEY:", e);
    process.exit(1);
  }
}

// ─── Price Fetchers ─────────────────────────────────────────

/** Fetch BTC price from CoinGecko (Primary) */
async function fetchCoinGeckoPrice(): Promise<number> {
  const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CoinGecko HTTP ${res.status}`);
  const data = await res.json();
  if (data.bitcoin && typeof data.bitcoin.usd === 'number') {
    return data.bitcoin.usd;
  }
  throw new Error("Invalid CoinGecko response format");
}

/** Fetch BTC price from Binance (Fallback) */
async function fetchBinancePrice(): Promise<number> {
  const url = 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT';
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Binance HTTP ${res.status}`);
  const data = await res.json();
  if (data.price) return parseFloat(data.price);
  throw new Error("Invalid Binance response format");
}

// ─── On-Chain Resolution ────────────────────────────────────

async function resolveMarketOnChain(winner: 1 | 2) {
  if (DEMO_MODE || !keypair) {
    console.log(`[DEMO] Would resolve market to ${winner === 1 ? 'YES' : 'NO'}, but no credentials.`);
    return;
  }

  console.log(`\n[+] Building resolve tx... (Winner = ${winner === 1 ? 'YES' : 'NO'})`);
  try {
    const txb = new TransactionBlock();
    txb.moveCall({
      target: `${CUSTOM_MARKET_PACKAGE}::market::resolve`,
      arguments: [
        txb.object(MARKET_ID!),
        txb.object(ADMIN_CAP_ID!),
        txb.pure(winner),
      ],
    });

    console.log(`[+] Signing and executing transaction...`);
    const result = await client.signAndExecuteTransactionBlock({
      signer: keypair,
      transactionBlock: txb,
      options: { showEffects: true },
    });

    if (result.effects?.status.status === 'success') {
      console.log(`\n[SUCCESS] ✅ Market resolved!`);
      console.log(`[+] Digest: ${result.digest}`);
      console.log(`[+] Explorer: https://suiscan.xyz/testnet/tx/${result.digest}`);
      console.log("\n[!] Bot's job is done. Exiting...");
      process.exit(0);
    } else {
      console.error(`[ERROR] Tx failed:`, result.effects?.status.error);
    }
  } catch (error) {
    console.error(`[ERROR] Failed to resolve:`, error);
  }
}

// ─── Main Loop ──────────────────────────────────────────────

let loopInterval: ReturnType<typeof setInterval>;

async function runBotLoop() {
  const ts = new Date().toLocaleTimeString();
  console.log(`\n[${ts}] Checking: Will BTC hit $${TARGET_PRICE.toLocaleString()}?`);

  let currentPrice = 0;
  let source = '';

  // Primary: CoinGecko
  try {
    currentPrice = await fetchCoinGeckoPrice();
    source = 'CoinGecko';
  } catch (err: any) {
    console.warn(`[WARN] CoinGecko failed (${err.message}). Trying Binance...`);
    // Fallback: Binance
    try {
      currentPrice = await fetchBinancePrice();
      source = 'Binance';
    } catch (fallbackErr: any) {
      console.error(`[ERROR] Both APIs failed. Skipping this tick.`);
      return;
    }
  }

  console.log(`[+] BTC Price (${source}): $${currentPrice.toLocaleString()}`);

  if (currentPrice >= TARGET_PRICE) {
    console.log(`[!!!] 🎯 TARGET REACHED! BTC >= $${TARGET_PRICE.toLocaleString()}`);
    clearInterval(loopInterval);
    await resolveMarketOnChain(1);
  } else {
    const diff = TARGET_PRICE - currentPrice;
    console.log(`[-] $${diff.toLocaleString()} away. Next check in ${POLL_INTERVAL_MS / 1000}s...`);
  }
}

// ─── Boot ───────────────────────────────────────────────────
console.log("══════════════════════════════════════════");
console.log("   Insuight Automated Oracle Bot v1.0     ");
console.log("══════════════════════════════════════════");
console.log(`   Mode:     ${DEMO_MODE ? '🔶 DEMO (read-only)' : '🟢 LIVE'}`);
console.log(`   Target:   BTC >= $${TARGET_PRICE.toLocaleString()}`);
console.log(`   Interval: ${POLL_INTERVAL_MS / 1000}s`);
console.log(`   Market:   ${MARKET_ID ?? '(none)'}`);
console.log("══════════════════════════════════════════\n");

runBotLoop();
loopInterval = setInterval(runBotLoop, POLL_INTERVAL_MS);
