import { useState } from 'react';
import { AuthenticatedSidebar } from '@/components/layout/AuthenticatedSidebar';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


const RPC_URL = 'https://starknet-mainnet.public.blastapi.io';

// Helper to fetch latest block number
async function getLatestBlockNumber() {
  const body = {
    jsonrpc: "2.0",
    method: "starknet_blockNumber",
    params: [],
    id: 1
  };
  const res = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  return data.result;
}

// Helper to fetch block timestamp
async function getBlockTimestamp(block_number: number) {
  const body = {
    jsonrpc: "2.0",
    method: "starknet_getBlockWithTxs",
    params: [{ block_number }],
    id: 1
  };
  const res = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  return data.result?.timestamp;
}

// Estimate the block number from two weeks ago
async function estimateBlockFromTwoWeeksAgo() {
  const now = Math.floor(Date.now() / 1000);
  const twoWeeksAgo = now - 14 * 24 * 60 * 60;
  const latest = await getLatestBlockNumber();
  let low = 0;
  let high = latest;
  let result = 0;
  // Binary search for block closest to twoWeeksAgo
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const ts = await getBlockTimestamp(mid);
    if (!ts) break;
    if (ts < twoWeeksAgo) {
      low = mid + 1;
    } else {
      result = mid;
      high = mid - 1;
    }
  }
  return result;
}

async function fetchEvents(contractAddress: string) {
  const latest = await getLatestBlockNumber();
  const fromBlock = await estimateBlockFromTwoWeeksAgo();
  const body = {
    jsonrpc: "2.0",
    method: "starknet_getEvents",
    params: {
      filter: {
        address: contractAddress,
        from_block: { block_number: fromBlock },
        to_block: { block_number: latest },
        keys: []
      },
      chunk_size: 100
    },
    id: 1
  };
  const res = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  return data.result ? data.result.events : [];
}

export default function ContractEventsEDA() {
  const [address, setAddress] = useState('');
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetch = async () => {
    setLoading(true);
    setError('');
    try {
      const evs = await fetchEvents(address);
      setEvents(evs);
    } catch (e) {
      setError('Failed to fetch events.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <AuthenticatedSidebar />
        <div className="flex-1">
          <Header title="Contract Events EDA" subtitle="Basic event analysis for any Starknet contract" />
          <main className="p-6 space-y-6">
            <Card className="glass max-w-xl mx-auto">
              <CardHeader>
                <CardTitle>Enter Mainnet Contract Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Input
                    placeholder="0x..."
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleFetch} disabled={loading || !address}>
                    {loading ? 'Loading...' : 'Fetch Events'}
                  </Button>
                </div>
                {error && <div className="text-red-500 mt-2">{error}</div>}
              </CardContent>
            </Card>
            {events.length > 0 && (
              <Card className="glass max-w-3xl mx-auto">
                <CardHeader>
                  <CardTitle>Events (last 2 weeks, latest 100)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr>
                          <th className="px-2 py-1 text-left">Block</th>
                          <th className="px-2 py-1 text-left">Event Keys</th>
                          <th className="px-2 py-1 text-left">Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        {events.map((ev, i) => (
                          <tr key={i} className="border-b border-border">
                            <td className="px-2 py-1">{ev.block_number}</td>
                            <td className="px-2 py-1 break-all">{ev.keys?.join(', ')}</td>
                            <td className="px-2 py-1 break-all">{ev.data?.join(', ')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
