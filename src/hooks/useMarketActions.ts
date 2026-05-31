import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import {
  buildCreateMarketTx,
  buildMintSharesTx,
  buildResolveTx,
  buildClaimYesTx,
  buildClaimNoTx,
} from '../services/marketTransactions';

export function useMarketActions() {
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const handleTxResponse = async (response: any) => {
    if (response.digest) {
      return response.digest;
    } else {
      throw new Error('Transaction failed or digest missing');
    }
  };

  const createMarket = async (description: string, yesTreasuryId: string, noTreasuryId: string) => {
    const tx = buildCreateMarketTx(description, yesTreasuryId, noTreasuryId);
    const response = await signAndExecuteTransaction({
      transaction: tx,
    });
    return handleTxResponse(response);
  };

  const mintShares = async (marketId: string, suiAmount: string | number, userAddress: string) => {
    const tx = buildMintSharesTx(marketId, suiAmount, userAddress);
    const response = await signAndExecuteTransaction({
      transaction: tx,
    });
    return handleTxResponse(response);
  };

  const resolveMarket = async (marketId: string, adminCapId: string, winner: 1 | 2) => {
    const tx = buildResolveTx(marketId, adminCapId, winner);
    const response = await signAndExecuteTransaction({
      transaction: tx,
    });
    return handleTxResponse(response);
  };

  const claimYes = async (marketId: string, yesTokenId: string, userAddress: string) => {
    const tx = buildClaimYesTx(marketId, yesTokenId, userAddress);
    const response = await signAndExecuteTransaction({
      transaction: tx,
    });
    return handleTxResponse(response);
  };

  const claimNo = async (marketId: string, noTokenId: string, userAddress: string) => {
    const tx = buildClaimNoTx(marketId, noTokenId, userAddress);
    const response = await signAndExecuteTransaction({
      transaction: tx,
    });
    return handleTxResponse(response);
  };

  return {
    createMarket,
    mintShares,
    resolveMarket,
    claimYes,
    claimNo,
  };
}
