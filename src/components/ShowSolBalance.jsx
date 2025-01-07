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
  return <div>My sol balance is{balance}</div>;
}

export default ShowSolBalance;
