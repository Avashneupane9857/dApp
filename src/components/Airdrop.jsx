import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";

export function Airdrop() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [sol, setSol] = useState();
  const publicKey = wallet?.publicKey?.toString();
  if (!publicKey) {
    return <p>loading.........</p>;
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
    <div className="relative top-10 text-black flex justify-center">
      <h1>Hi Your public key is {publicKey}</h1>
      <input
        onChange={(e) => {
          setSol(e.target.value.trim());
        }}
        className="bg-slate-800 text-white"
        type="text"
        placeholder="amount"
      />
      <button
        onClick={handleAirdrop}
        className="bg-slate-400 text-black rounded-2xl w-32"
      >
        Send airdrop
      </button>
    </div>
  );
}
