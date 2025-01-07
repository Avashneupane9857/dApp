import { useWallet } from "@solana/wallet-adapter-react";

export function Airdrop() {
  const wallet = useWallet();
  const publicKey = wallet?.publicKey?.toString();
  if (!publicKey) {
    return <p>loading.........</p>;
  }
  return (
    <div className="relative top-10 text-black flex justify-center">
      <h1>Hi Your public key is {publicKey}</h1>
      <input className="bg-slate-800" type="text" placeholder="amount" />
      <button className="bg-slate-400 text-black rounded-2xl w-32">
        Send airdrop
      </button>
    </div>
  );
}
