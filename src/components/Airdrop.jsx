import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";

export function Airdrop() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [sol, setSol] = useState();
  const publicKey = wallet?.publicKey?.toString();

  if (!publicKey) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-pulse text-purple-500 text-lg">
          Connecting wallet...
        </div>
      </div>
    );
  }

  const handleAirdrop = async () => {
    if (!sol || isNaN(sol)) {
      alert("Please enter a valid amount of SOL.");
      return;
    }
    const lamports = parseFloat(sol) * 1_000_000_000;
    try {
      const signature = await connection.requestAirdrop(
        wallet.publicKey,
        lamports
      );
      alert("Airdrop successful");
      console.log(`Airdrop successful: ${signature}`);
    } catch (error) {
      alert(`Airdrop failed`);
      console.error("Airdrop failed:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <div className="bg-slate-800 rounded-lg p-4 text-sm text-gray-300 break-all">
        Wallet: {publicKey}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          onChange={(e) => {
            setSol(e.target.value.trim());
          }}
          className="flex-1 bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          type="text"
          placeholder="Enter SOL amount"
        />
        <button
          onClick={handleAirdrop}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          Request Airdrop
        </button>
      </div>
    </div>
  );
}
