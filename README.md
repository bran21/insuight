# Insuight

Insuight is a Sui-based prediction market built with React, Vite, and TypeScript. It leverages `@mysten/sui`, `@mysten/dapp-kit`, and `@mysten/deepbook-v3` to provide a robust, decentralized platform for prediction markets.

## About the Project

Insuight allows users to interact with prediction markets on the Sui blockchain. The application includes a responsive frontend interface, an integrated agent vault implementation, and a resolution bot for market outcomes. 

### Key Features
- **Decentralized Prediction Markets:** Participate in markets built on the Sui ecosystem.
- **Deepbook V3 Integration:** Advanced on-chain order book functionalities.
- **Resolution Bot:** Automated market resolution scripts.
- **Modern Tech Stack:** React, TypeScript, Tailwind CSS, and Vite for a fast and aesthetic user experience.

## Installation and Setup

Follow these steps to run the Insuight project locally:

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` (Node Package Manager)

### 1. Clone the repository
Ensure you have the repository cloned to your local machine, then navigate to the project directory:
```bash
cd insuight
```

### 2. Install dependencies
Install the required packages using npm:
```bash
npm install
```

### 3. Environment Variables
If the project requires environment variables, create a `.env` file in the root directory and fill in your specific environment details (like RPC endpoints or network configurations).

### 4. Run the Development Server
Start the frontend application locally:
```bash
npm run dev
```
Open your browser and navigate to the local server URL provided in the terminal (usually `http://localhost:5173`).

### 5. Running the Resolution Bot (Optional)
If you need to run the automated resolution bot:
```bash
npm run start-bot
```

## Documentation

Detailed architecture and integration plans can be found in the `/docs` directory:
- [Testnet Deployments & Addresses](./docs/deployments.md) *(Required for Hackathon)*
- [Backend Architecture](./docs/prediction_market_backend.md)
- [Agent Vault Implementation](./docs/onchain_implementation.md)
- [Resolution Sources](./docs/resolution_sources.md)

## Building for Production

To create an optimized production build of the application:
```bash
npm run build
```
