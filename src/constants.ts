/**
 * Insuight — DeepBook Predict Constants
 * All values from: https://docs.sui.io/onchain-finance/deepbook-predict/contract-information
 * Branch: predict-testnet-4-16
 */

export const PREDICT_PACKAGE = '0xf5ea2b3749c65d6e56507cc35388719aadb28f9cab873696a2f8687f5c785138';
export const PREDICT_OBJECT = '0xc8736204d12f0a7277c86388a68bf8a194b0a14c5538ad13f22cbd8e2a38028a';
export const REGISTRY_OBJECT = '0x43af14fed5480c20ff77e2263d5f794c35b9fab7e2212903127062f4fe2a6e64';
export const DUSDC_TYPE = '0xe95040085976bfd54a1a07225cd46c8a2b4e8e2b6732f140a0fc49850ba73e1a::dusdc::DUSDC';
export const DUSDC_METADATA = '0xf3000dff421833d4bb8ed58fac146d691a3aaba2785aa1989af65a7089ca3e9c';
export const PLP_TYPE = `${PREDICT_PACKAGE}::plp::PLP`;

export const PREDICT_SERVER = '/predict-api'; // proxied via vite to https://predict-server.testnet.mystenlabs.com
export const PREDICT_SERVER_DIRECT = 'https://predict-server.testnet.mystenlabs.com';

// ─── Custom Market Constants (Pending Deployment) ───
export const CUSTOM_MARKET_PACKAGE = '0xf0f2c0bc4efefc22a05ff79bb5783abdeaeca71921b4597db88ec02ca490b5e1'; // Deployed predict package
export const CUSTOM_MARKET_YES_TYPE = `${CUSTOM_MARKET_PACKAGE}::yes::YES`;
export const CUSTOM_MARKET_NO_TYPE = `${CUSTOM_MARKET_PACKAGE}::no::NO`;

// ─── Insuight Agent Constants ───
export const INSUIGHT_PACKAGE = '0xa40e0dc106887a4e18aeb5c0e7195b6859d9f8f228acc3552d316159a96b4b20'; // Deployed insuight package
export const ADMIN_ADDRESS = '0x2e1666ae83f393acc2db2ff53255f09a1ebe30a1d8036a9da5d3b5abdb7cbbb0'; // Deployer address
