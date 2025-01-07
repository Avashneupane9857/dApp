import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

function ShowSolBalance() {
  const { connection } = useConnection();
  const [balance, setBalance] = useState("");
  const wallet = useWallet();

  async function getBalance() {
    if (wallet.publicKey) {
      const balu = await connection.getBalance(wallet.publicKey);
      const solInlamp_ports = balu / LAMPORTS_PER_SOL;
      setBalance(solInlamp_ports);
    }
  }

  getBalance();

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="bg-slate-800 rounded-lg p-6 flex items-center justify-between">
        <span className="text-gray-400">Balance:</span>
        <span className="text-xl font-semibold text-white">
          {balance ? `${balance} SOL` : "Loading..."}
        </span>
      </div>
    </div>
  );
}

export default ShowSolBalance;
