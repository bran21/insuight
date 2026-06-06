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
export const CUSTOM_MARKET_PACKAGE = '0x84bee788cd260e3c5697d0047856a5f596f8d2aee9baa3dc578266f3466ff78d'; // Deployed predict package
export const CUSTOM_MARKET_YES_TYPE = `${CUSTOM_MARKET_PACKAGE}::yes::YES`;
export const CUSTOM_MARKET_NO_TYPE = `${CUSTOM_MARKET_PACKAGE}::no::NO`;

// ─── Insuight Agent Constants ───
export const INSUIGHT_PACKAGE = '0xa40e0dc106887a4e18aeb5c0e7195b6859d9f8f228acc3552d316159a96b4b20'; // Deployed insuight package
export const YES_TREASURY_CAP = '0x39a137030061b48e25ac45aa42748856466b30ed2ae22d793160374b864abc6b';
export const NO_TREASURY_CAP = '0xf1aa861a660e705a4c3f1c9a3ab41bb75c9922ad3dd8a6ebf0d6f7118ab20f11';
export const ADMIN_ADDRESS = '0x2e1666ae83f393acc2db2ff53255f09a1ebe30a1d8036a9da5d3b5abdb7cbbb0'; // Deployer address
