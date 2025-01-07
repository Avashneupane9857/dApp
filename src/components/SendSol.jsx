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
      <div className="text-center p-4">
        Please connect your wallet to send SOL
      </div>
    );
  }

  return (
    <div className="relative top-11 flex flex-col items-center gap-4 max-w-md mx-auto">
      {error && (
        <div className="text-red-500 text-sm w-full text-center">{error}</div>
      )}

      <div className="flex flex-col w-full gap-4">
        <input
          value={sol}
          onChange={(e) => setSol(e.target.value.trim())}
          type="number"
          step="0.000000001"
          min="0"
          className="bg-slate-800 text-white p-2 rounded"
          placeholder="Amount in SOL"
          disabled={isLoading}
        />

        <input
          value={client}
          onChange={(e) => setClient(e.target.value.trim())}
          type="text"
          className="bg-slate-800 text-white p-2 rounded"
          placeholder="Recipient Address"
          disabled={isLoading}
        />

        <button
          onClick={sendToken}
          disabled={isLoading}
          className={`bg-black text-white p-2 rounded ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
          }`}
        >
          {isLoading ? "Sending..." : "Send SOL"}
        </button>
      </div>

      {wallet.publicKey && (
        <div className="text-sm text-gray-400 text-center">
          From: {wallet.publicKey.toString()}
        </div>
      )}
    </div>
  );
}

export default SendSol;
