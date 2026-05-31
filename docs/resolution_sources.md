# Prediction Market Resolution Sources

> How each market category gets its outcome data — from real-world event → on-chain `resolve()`

---

## Overview — Resolution Pipeline

```
Real-World Event Occurs
        │
        ▼
Authoritative Data Source (API / feed)
        │
        ▼
Resolution Bot / Admin reads result
        │
        ▼
market::resolve(market, admin_cap, winner=1|2)
        │
        ▼
Winners call claim_yes() / claim_no()
```

Every market must specify its **resolution source** and **resolution criteria** at creation time so users know exactly what outcome they are betting on.

---

## Category Data Sources

### 🟣 Crypto

| Data Point | Primary Source | API | Fallback |
|------------|---------------|-----|---------|
| BTC / ETH / SUI price | **Pyth Network** (on-chain) | `https://hermes.pyth.network/v2/updates/price/latest?ids[]=0xe62df6...` | CoinGecko |
| BTC price | **CoinGecko** | `GET https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd` | CoinMarketCap |
| DEX volume | **DeFiLlama** | `GET https://api.llama.fi/overview/dexs?chain=sui` | Birdeye |
| TVL (DeFi protocols) | **DeFiLlama** | `GET https://api.llama.fi/protocol/{protocol}` | DeepBook Predict Server |
| SUI on-chain data | **Sui RPC** | `https://fullnode.testnet.sui.io:443` — `suix_getLatestSuiSystemState` | MystenLabs Explorer |
| DeepBook Predict oracle | **Predict Server** | `GET /oracles/:oracle_id/state` → `settlement_price` field | On-chain `OracleSettled` event |

**Resolution rule example:**
```
Market: "Will BTC exceed $70,000 by July 1, 2026?"
Source: Pyth Network BTC/USD feed
Timestamp: 2026-07-01T00:00:00Z (UTC)
Resolve YES (1): settlement_price > 70000
Resolve NO  (2): settlement_price ≤ 70000
```

**Pyth Price Feed IDs:**
| Asset | Feed ID |
|-------|---------|
| BTC/USD | `0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43` |
| ETH/USD | `0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace` |
| SUI/USD | `0x23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65744` |
| SOL/USD | `0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d` |

---

### 🌤 Weather

| Data Point | Primary Source | API | Fallback |
|------------|---------------|-----|---------|
| Temperature / Conditions | **Weather Underground (Wunderground)** | `GET https://api.weather.com/v2/pws/observations/current?stationId={ID}&format=json&units=m&apiKey={KEY}` | OpenWeatherMap |
| Hurricane / Storm category | **NOAA National Hurricane Center** | `https://www.nhc.noaa.gov/data/` — RSS/JSON feeds | Weather Underground |
| Rainfall / Snowfall | **NOAA Climate Data Online** | `https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND` | OpenMeteo |
| Forecast-based | **Open-Meteo** (free, no key) | `GET https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&daily=precipitation_sum` | Meteomatics |
| Global historical weather | **Meteostat** | `GET https://meteostat.p.rapidapi.com/stations/daily?station={id}&start={date}&end={date}` | NOAA |

**Resolution rule example:**
```
Market: "Will a Category 5 hurricane make US landfall in 2026?"
Source: NOAA National Hurricane Center — Atlantic/Pacific Basin Reports
Resolve YES (1): NHC reports any Category 5 (≥157 mph) landfall in US territory before 2026-12-31
Resolve NO  (2): No Category 5 US landfall by 2026-12-31 23:59:59 UTC
```

**Key Wunderground endpoints:**
```bash
# Personal weather station current conditions
GET https://api.weather.com/v2/pws/observations/current
  ?stationId=KCASANFR1
  &format=json
  &units=m
  &apiKey={WU_API_KEY}

# Historical daily summaries
GET https://api.weather.com/v2/pws/history/daily
  ?stationId=KCASANFR1
  &format=json
  &units=m
  &date=20260701
  &apiKey={WU_API_KEY}
```

---

### 🏛 Politics

| Data Point | Primary Source | API / URL | Fallback |
|------------|---------------|-----------|---------|
| Election results | **Associated Press Elections API** | `https://api.ap.org/v2/elections/{date}?apikey={KEY}` | Reuters |
| Federal Reserve decisions | **Federal Reserve** | `https://www.federalreserve.gov/feeds/press_all.xml` (RSS) | Bloomberg Terminal |
| Interest rates | **FRED (St. Louis Fed)** | `GET https://api.stlouisfed.org/fred/series/observations?series_id=FEDFUNDS&api_key={KEY}&file_type=json` | Federal Reserve website |
| Congressional votes | **ProPublica Congress API** | `GET https://api.propublica.org/congress/v1/{congress}/{chamber}/votes/{type}/{year}/{month}.json` | GovTrack |
| Policy announcements | **Reuters / AP News** | RSS: `https://feeds.reuters.com/Reuters/worldNews` | BBC News |
| Prediction market consensus | **Polymarket** | `GET https://clob.polymarket.com/markets` | Metaculus |

**Resolution rule example:**
```
Market: "Will the Fed cut rates before July 2026?"
Source: FRED series FEDFUNDS + Federal Reserve FOMC statement
Resolve YES (1): FEDFUNDS rate decreases from current level in any FOMC meeting before 2026-07-01
Resolve NO  (2): Rate stays flat or increases through 2026-06-30
```

---

### 🔬 Science & Technology

| Data Point | Primary Source | API / URL | Fallback |
|------------|---------------|-----------|---------|
| AI model releases | **OpenAI / Anthropic / Google** | Official announcement pages (scrape / RSS) | HuggingFace model hub |
| HuggingFace models | **HuggingFace API** | `GET https://huggingface.co/api/models?author=openai&sort=created` | Papers With Code |
| Research papers | **arXiv** | `GET http://export.arxiv.org/api/query?search_query=ti:{term}&sortBy=submittedDate` | Semantic Scholar |
| FDA approvals | **FDA API** | `GET https://api.fda.gov/drug/event.json?search=receivedate:[{start}+TO+{end}]` | FDA website |
| NASA / Space missions | **NASA Open APIs** | `GET https://api.nasa.gov/planetary/apod?api_key={KEY}` | NASA JPL |
| GitHub releases | **GitHub API** | `GET https://api.github.com/repos/{owner}/{repo}/releases/latest` | Product Hunt |

**Resolution rule example:**
```
Market: "Will GPT-5.6 be released by June 8, 2026?"
Source: OpenAI official blog (openai.com/blog) + HuggingFace model hub
Resolve YES (1): Model named "GPT-5.6" or "GPT 5.6" publicly announced/accessible before 2026-06-08 23:59:59 UTC
Resolve NO  (2): No such release by deadline
Dispute path: Community vote via Kleros / UMA Optimistic Oracle
```

---

### ⚽ Sports

| Data Point | Primary Source | API | Fallback |
|------------|---------------|-----|---------|
| Match results | **API-Football** | `GET https://v3.football.api-sports.io/fixtures?date={date}&league={id}` | ESPN |
| NBA / NFL / MLB scores | **SportRadar** | `GET https://api.sportradar.us/nba/trial/v8/en/games/{date}/schedule.json?api_key={KEY}` | The Sports DB |
| Live scores | **TheSportsDB** (free tier) | `GET https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d={date}&s=Soccer` | Sofascore |
| Esports results | **PandaScore** | `GET https://api.pandascore.co/matches?filter[status]=finished&token={KEY}` | Liquipedia |
| Player stats | **NBA Stats API** | `GET https://stats.nba.com/stats/playergamelog?PlayerID={id}&Season=2025-26` | Basketball Reference |

**Resolution rule example:**
```
Market: "Will Team X win the 2026 World Cup?"
Source: FIFA official results (fifa.com) + API-Football
Resolve YES (1): Confirmed winner matches "Team X" in FIFA official records
Resolve NO  (2): Any other team wins
```

---

### 📚 Education

| Data Point | Primary Source | API / URL | Fallback |
|------------|---------------|-----------|---------|
| University rankings | **QS World Rankings** | Manual scrape: `topuniversities.com` | Times Higher Education |
| Standardized test stats | **College Board (SAT)** | Annual PDF reports | ACT.org |
| Research output | **Scopus / Web of Science** | `GET https://api.elsevier.com/content/search/scopus?query={q}&apiKey={KEY}` | Google Scholar |
| EdTech adoption | **Crunchbase** | `GET https://api.crunchbase.com/api/v4/entities/organizations/{permalink}?card_ids=funding_rounds` | Pitchbook |
| Global literacy/enrollment | **World Bank Open Data** | `GET https://api.worldbank.org/v2/country/{country}/indicator/SE.PRM.ENRR?format=json` | UNESCO |

---

## Resolution Authority Model

### Tier 1 — Fully Automated (Trustless)
> On-chain oracle reads the result automatically. Admin just confirms.

```
Crypto prices → Pyth Network (already on Sui testnet)
  Admin reads: oracle.settlement_price from DeepBook Predict
  No human judgment needed
```

### Tier 2 — Bot-Assisted (Semi-Automated)
> Backend bot polls the API, writes result to a verification log, admin executes the transaction.

```
Weather → NOAA / Wunderground API
Sports → SportRadar API
Politics → FRED / AP Elections API

Resolution bot flow:
  1. Poll API at market end date/time
  2. Write result + source URL to a signed log (for dispute evidence)
  3. Call market::resolve(market, admin_cap, winner)
```

### Tier 3 — Manual + Community Dispute
> Human-readable sources (AI releases, political events). Disputed resolutions go to community vote.

```
Science/Tech → Blog posts, GitHub releases, arXiv
Politics → Government announcements
Education → Official reports

Dispute window: 48 hours after resolution
Dispute mechanism: Kleros Court / UMA Optimistic Oracle (future)
```

---

## Resolution Bot Architecture (Planned)

```typescript
// src/services/resolutionBot.ts

interface ResolutionSource {
  marketId: string;
  category: Category;
  question: string;
  endDate: Date;
  resolutionCriteria: string;
  source: {
    type: 'api' | 'feed' | 'manual';
    url: string;
    field: string;         // JSON path to the result value
    compareOp: '>' | '<' | '==' | 'contains';
    compareValue: unknown;
  };
}

async function resolveMarket(source: ResolutionSource): Promise<1 | 2> {
  const data = await fetch(source.source.url).then(r => r.json());
  const value = getNestedField(data, source.source.field);
  const isYes = evaluate(value, source.source.compareOp, source.source.compareValue);
  return isYes ? 1 : 2;
}
```

---

## API Key Registry

| Service | Purpose | Key Required | Free Tier |
|---------|---------|-------------|-----------|
| **Pyth Network** | Crypto prices | ❌ No key | ✅ Free |
| **Open-Meteo** | Weather | ❌ No key | ✅ Free |
| **NOAA CDO** | Historical weather | ✅ Register at `ncdc.noaa.gov` | ✅ Free |
| **Weather Underground** | Weather stations | ✅ `api.weather.com` | ⚠️ Paid |
| **CoinGecko** | Crypto prices | ✅ Optional (Demo key) | ✅ Free (rate limited) |
| **DeFiLlama** | TVL / DEX volume | ❌ No key | ✅ Free |
| **FRED (St. Louis Fed)** | Macro economics | ✅ `fred.stlouisfed.org/docs/api` | ✅ Free |
| **AP Elections** | Election results | ✅ Enterprise license | ❌ No free tier |
| **ProPublica Congress** | US legislative data | ✅ Register at `propublica.org/datastore` | ✅ Free |
| **API-Football** | Sports scores | ✅ `api-sports.io` | ✅ 100 req/day |
| **TheSportsDB** | Sports results | ✅ Optional | ✅ Free |
| **arXiv** | Research papers | ❌ No key | ✅ Free |
| **HuggingFace** | AI model releases | ✅ Optional | ✅ Free |
| **GitHub** | Software releases | ✅ Optional (higher rate limit) | ✅ Free |
| **NASA Open APIs** | Space / Science | ✅ `api.nasa.gov` | ✅ Free |
| **World Bank** | Education / Macro | ❌ No key | ✅ Free |

---

## Market Creation Standard

When creating a new prediction market, always specify:

```json
{
  "question": "Will Bitcoin exceed $70,000 by July 1, 2026?",
  "category": "crypto",
  "endDate": "2026-07-01T00:00:00Z",
  "resolutionSource": {
    "name": "Pyth Network BTC/USD",
    "url": "https://hermes.pyth.network/v2/updates/price/latest?ids[]=0xe62df6...",
    "field": "parsed[0].price.price",
    "description": "Pyth BTC/USD price at 00:00:00 UTC on the resolution date"
  },
  "resolutionCriteria": "Resolves YES if the Pyth Network BTC/USD price feed reads > 70000000000 (in 8-decimal format) at or after the end date. Resolves NO otherwise.",
  "disputeWindow": "48h",
  "resolutionTier": 1
}
```
