import { useEffect, useState } from 'react';
import { useSuiClient } from '@mysten/dapp-kit';
import { CUSTOM_MARKET_PACKAGE, ADMIN_ADDRESS } from '../constants';
import type { OracleState } from '../services/predictApi';

export function useCustomMarkets() {
  const suiClient = useSuiClient();
  const [customMarkets, setCustomMarkets] = useState<OracleState[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomMarkets() {
      try {
        setIsLoading(true);

        // 1. Fetch AdminCaps owned by the ADMIN_ADDRESS
        const adminCapsResponse = await suiClient.getOwnedObjects({
          owner: ADMIN_ADDRESS,
          filter: { StructType: `${CUSTOM_MARKET_PACKAGE}::market::AdminCap` },
          options: { showContent: true },
        });

        const marketIds: string[] = [];
        adminCapsResponse.data.forEach((obj) => {
          if (obj.data?.content?.dataType === 'moveObject') {
            const fields = obj.data.content.fields as any;
            if (fields.market_id) {
              marketIds.push(fields.market_id);
            }
          }
        });

        if (marketIds.length === 0) {
          setCustomMarkets([]);
          setIsLoading(false);
          return;
        }

        // 2. Fetch the actual Market objects
        const marketsResponse = await suiClient.multiGetObjects({
          ids: marketIds,
          options: { showContent: true },
        });

        // 3. Map to OracleState
        const mappedMarkets: OracleState[] = marketsResponse
          .map((obj) => {
            if (obj.data?.content?.dataType === 'moveObject') {
              const fields = obj.data.content.fields as any;
              
              // Calculate a basic implied prob if vault SUI and total supply exist
              // For a simple UI default, we just use 0.5 (50%)
              
              return {
                oracle_id: obj.data.objectId,
                name: fields.description || `Custom Market ${obj.data.objectId.slice(0, 8)}`,
                spot: 0.5,
                forward: 0.5,
                expiry: Date.now() + 86400000 * 30, // Default to 30 days in future for UI
                expiry_date: new Date(Date.now() + 86400000 * 30).toISOString(),
                status: fields.resolved ? 'settled' : 'active',
                isCustom: true // Useful flag for UI rendering if we want
              } as OracleState & { isCustom: boolean };
            }
            return null;
          })
          .filter((m) => m !== null) as OracleState[];

        setCustomMarkets(mappedMarkets);
      } catch (err) {
        console.error("Failed to fetch custom markets:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCustomMarkets();
    const interval = setInterval(fetchCustomMarkets, 15000);
    return () => clearInterval(interval);
  }, [suiClient]);

  return { customMarkets, isLoadingCustomMarkets: isLoading };
}
