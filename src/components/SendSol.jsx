import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useState } from "react";
import { Buffer } from "buffer";
window.Buffer = Buffer;

function SendSol() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [sol, setSol] = useState("");
  const [client, setClient] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateInput = () => {
    if (!sol || isNaN(Number(sol)) || Number(sol) <= 0) {
      setError("Please enter a valid SOL amount");
      return false;
    }
    if (!client) {
      setError("Please enter a recipient address");
      return false;
    }
    try {
      new PublicKey(client);
      return true;
    } catch {
      setError("Invalid recipient address");
      return false;
    }
  };

  const sendToken = async () => {
    setError("");
    if (!validateInput()) return;
    try {
      setIsLoading(true);
      const lamports = Number(sol) * LAMPORTS_PER_SOL;
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: new PublicKey(client),
          lamports,
        })
      );
      const latestBlockhash = await connection.getLatestBlockhash();
      transaction.recentBlockhash = latestBlockhash.blockhash;
      transaction.feePayer = wallet.publicKey;
      const signature = await wallet.sendTransaction(transaction, connection);
      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      });
      if (confirmation.value.err) throw new Error("Transaction failed");
      alert(
        `Transaction successful!\nAmount: ${sol} SOL\nRecipient: ${client}\nSignature: ${signature}`
      );
      setSol("");
      setClient("");
    } catch (err) {
      setError(`Transaction failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!wallet.connected) {
    return (
      <div className="flex items-center justify-center h-40 bg-slate-800 rounded-lg text-white text-lg">
        Please connect your wallet to send SOL
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="bg-slate-800 rounded-lg p-6 shadow-lg space-y-6">
        <div className="text-sm text-gray-400 break-all bg-slate-900 p-3 rounded-lg">
          From: {wallet.publicKey.toString()}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Amount</label>
            <input
              value={sol}
              onChange={(e) => setSol(e.target.value.trim())}
              type="number"
              step="0.000000001"
              min="0"
              className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="Enter SOL amount"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Recipient
            </label>
            <input
              value={client}
              onChange={(e) => setClient(e.target.value.trim())}
              type="text"
              className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="Enter recipient address"
              disabled={isLoading}
            />
          </div>

          <button
            onClick={sendToken}
            disabled={isLoading}
            className={`w-full bg-purple-600 text-white py-3 rounded-lg font-medium
              ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-purple-700"
              } 
              transition-colors`}
          >
            {isLoading ? "Processing Transaction..." : "Send SOL"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SendSol;
