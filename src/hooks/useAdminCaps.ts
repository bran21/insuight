import { useEffect, useState } from 'react';
import { useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import { CUSTOM_MARKET_PACKAGE } from '../constants';

export function useAdminCaps() {
  const suiClient = useSuiClient();
  const account = useCurrentAccount();
  const [adminCaps, setAdminCaps] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAdminCaps() {
      if (!account) {
        setAdminCaps({});
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const adminCapsResponse = await suiClient.getOwnedObjects({
          owner: account.address,
          filter: { StructType: `${CUSTOM_MARKET_PACKAGE}::market::AdminCap` },
          options: { showContent: true },
        });

        const capsMap: Record<string, string> = {};
        adminCapsResponse.data.forEach((obj) => {
          if (obj.data?.content?.dataType === 'moveObject') {
            const fields = obj.data.content.fields as any;
            if (fields.market_id) {
              capsMap[fields.market_id] = obj.data.objectId;
            }
          }
        });

        setAdminCaps(capsMap);
      } catch (err) {
        console.error("Failed to fetch admin caps:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAdminCaps();
    const interval = setInterval(fetchAdminCaps, 15000);
    window.addEventListener('refreshMarkets', fetchAdminCaps);
    return () => {
      clearInterval(interval);
      window.removeEventListener('refreshMarkets', fetchAdminCaps);
    };
  }, [suiClient, account]);

  return { adminCaps, isLoadingAdminCaps: isLoading };
}
