/* eslint-disable react/prop-types */
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { Airdrop } from "./components/Airdrop";
import ShowSolBalance from "./components/ShowSolBalance";
import SignMessage from "./components/SignMessage";
import SendSol from "./components/SendSol";
import { useState } from "react";

const NavLink = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg transition-colors ${
      active ? "bg-purple-600 text-white" : "text-gray-700 hover:bg-purple-100"
    }`}
  >
    {children}
  </button>
);

function App() {
  const [activeTab, setActiveTab] = useState("balance");

  const renderContent = () => {
    switch (activeTab) {
      case "balance":
        return <ShowSolBalance />;
      case "send":
        return <SendSol />;
      case "sign":
        return <SignMessage />;
      default:
        return <ShowSolBalance />;
    }
  };

  return (
    <ConnectionProvider
      endpoint={
        "https://solana-devnet.g.alchemy.com/v2/pxIMU-70pUbKHm7JakxP84uVwLfp9Qeb"
      }
    >
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-md p-4">
              <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <h1 className="text-xl font-bold text-purple-600">
                    Solana dApp
                  </h1>
                  <WalletMultiButton className="bg-purple-600" />
                  <WalletDisconnectButton className="bg-gray-600" />
                </div>

                <div className="flex gap-2">
                  <NavLink
                    active={activeTab === "balance"}
                    onClick={() => setActiveTab("balance")}
                  >
                    Balance
                  </NavLink>
                  <NavLink
                    active={activeTab === "send"}
                    onClick={() => setActiveTab("send")}
                  >
                    Send SOL
                  </NavLink>
                  <NavLink
                    active={activeTab === "sign"}
                    onClick={() => setActiveTab("sign")}
                  >
                    Sign Message
                  </NavLink>
                </div>
              </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg">
              <div className="space-y-6">
                {/* Airdrop is always visible */}
                <div className="mb-8">
                  <Airdrop />
                </div>

                {/* Dynamic content based on active tab */}
                {renderContent()}
              </div>
            </main>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
