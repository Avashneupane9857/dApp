import { ed25519 } from "@noble/curves/ed25519";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import bs58 from "bs58";

function SignMessage() {
  const { publicKey, signMessage } = useWallet();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onClick() {
    if (!publicKey) throw new Error("Wallet not connected!");
    if (!signMessage)
      throw new Error("Wallet does not support message signing!");

    setIsLoading(true);
    try {
      const encodedMessage = new TextEncoder().encode(input);
      const signature = await signMessage(encodedMessage);
      if (!ed25519.verify(signature, encodedMessage, publicKey.toBytes())) {
        throw new Error("Message signature invalid");
      }
      alert(`Success! Message signed: ${bs58.encode(signature)}`);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-slate-800 rounded-lg p-6 space-y-4">
        <input
          className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          onChange={(e) => {
            setInput(e.target.value.trim());
          }}
          type="text"
          placeholder="Enter message to sign"
        />
        <button
          className={`w-full bg-blue-600 text-white py-3 rounded-lg font-medium
            ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            } 
            transition-colors`}
          onClick={onClick}
          disabled={isLoading || !input}
        >
          {isLoading ? "Signing..." : "Sign Message"}
        </button>
      </div>
    </div>
  );
}

export default SignMessage;
