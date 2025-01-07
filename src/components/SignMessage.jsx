import { ed25519 } from "@noble/curves/ed25519";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import bs58 from "bs58";
function SignMessage() {
  const { publicKey, signMessage } = useWallet();
  const [input, setInput] = useState("");
  async function onClick() {
    if (!publicKey) throw new Error("Wallet not connected!");
    if (!signMessage)
      throw new Error("Wallet does not support message signing!");

    const encodedMessage = new TextEncoder().encode(input);
    const signature = await signMessage(encodedMessage);
    if (!ed25519.verify(signature, encodedMessage, publicKey.toBytes())) {
      throw new Error("Message signature invalid");
    }
    alert(`success Message is signed successfully ${bs58.encode(signature)}`);
  }

  return (
    <div className="relative top-8 flex justify-center">
      <input
        className="bg-slate-600 text-white w-20 h-6"
        onChange={(e) => {
          setInput(e.target.value.trim());
        }}
        type="text"
        name=""
        id=""
      />
      <button className="bg-slate-950 w-28 text-white" onClick={onClick}>
        Sign Message
      </button>
    </div>
  );
}

export default SignMessage;
