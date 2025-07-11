import "./App.css";
import Nav from "./Nav/Nav";
import TokenPart from "./Token/Token";
import SenderTable from "./Table";
import Transfer from "./Transfer/Transfer";
import ConnectWallet from "./ConnectWallet";
import Fee from "./Fee";
import Airdrop from "./Airdrop";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spinner, Alert } from "react-bootstrap";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  // State variables
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [tokenAddress, setTokenAddress] = useState("0xdAC17F958D2ee523a2206206994597C13D831ec7"); // USDT
  const [wallets, setWallets] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [fee, setFee] = useState(0.001); // ETH for gas
  const [loading, setLoading] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [ethBalance, setEthBalance] = useState(0);
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState(18);
  const [error, setError] = useState("");

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== "undefined" && typeof window.ethereum !== "undefined";
  };

  // Initialize MetaMask connection on component mount
  useEffect(() => {
    if (isMetaMaskInstalled()) {
      checkConnection();
      setupEventListeners();
    }
  }, []);

  // Fetch balances when account or token changes
  useEffect(() => {
    if (isConnected && account && tokenAddress) {
      getTokenBalance();
      getEthBalance();
    }
  }, [isConnected, account, tokenAddress]);

  // Check if already connected
  const checkConnection = async () => {
    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        await connectWallet();
      }
    } catch (error) {
      console.error("Error checking connection:", error);
    }
  };

  // Setup MetaMask event listeners
  const setupEventListeners = () => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
      window.ethereum.on("disconnect", handleDisconnect);
    }
  };

  // Handle account changes
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      handleDisconnect();
    } else {
      setAccount(accounts[0]);
      getTokenBalance();
      getEthBalance();
    }
  };

  // Handle chain changes
  const handleChainChanged = (chainId) => {
    setChainId(chainId);
    window.location.reload(); // Recommended by MetaMask
  };

  // Handle disconnect
  const handleDisconnect = () => {
    setIsConnected(false);
    setAccount("");
    setProvider(null);
    setSigner(null);
    setChainId(null);
    setBalanceAmount(0);
    setEthBalance(0);
    setError("");
  };

  // Connect to MetaMask
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      setError("MetaMask is not installed. Please install MetaMask to continue.");
      toast.error("MetaMask is not installed!");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length === 0) {
        throw new Error("No accounts found");
      }

      // Get provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      setProvider(provider);
      setSigner(signer);
      setAccount(accounts[0]);
      setChainId(network.chainId.toString());
      setIsConnected(true);

      toast.success("Wallet connected successfully!");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setError(error.message);
      toast.error("Failed to connect wallet: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Get ETH balance
  const getEthBalance = async () => {
    if (!provider || !account) return;

    try {
      const balance = await provider.getBalance(account);
      setEthBalance(Number(ethers.formatEther(balance)));
    } catch (error) {
      console.error("Error fetching ETH balance:", error);
    }
  };

  // Get token balance and info
  const getTokenBalance = async () => {
    if (!provider || !account || !tokenAddress) return;

    try {
      const erc20ABI = [
        "function balanceOf(address account) external view returns (uint256)",
        "function decimals() view returns (uint8)",
        "function symbol() view returns (string)",
        "function name() view returns (string)",
      ];

      const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, provider);
      
      const [balance, decimals, symbol] = await Promise.all([
        tokenContract.balanceOf(account),
        tokenContract.decimals(),
        tokenContract.symbol(),
      ]);

      setTokenDecimals(decimals);
      setTokenSymbol(symbol);
      setBalanceAmount(Number(ethers.formatUnits(balance, decimals)));
    } catch (error) {
      console.error("Error fetching token balance:", error);
      setError("Invalid token address or network error");
      toast.error("Failed to fetch token info. Please check the token address.");
    }
  };

  // Handle wallet connection/disconnection
  const handleConnect = async () => {
    if (isConnected) {
      const confirmDisconnect = window.confirm("Do you want to disconnect your wallet?");
      if (confirmDisconnect) {
        handleDisconnect();
        toast.info("Wallet disconnected");
      }
    } else {
      await connectWallet();
    }
  };

  // Validate Ethereum address
  const isValidAddress = (address) => {
    try {
      return ethers.isAddress(address);
    } catch {
      return false;
    }
  };

  // Airdrop logic with proper error handling
  const handleAirdrop = async () => {
    if (!isConnected || !signer) {
      toast.error("Please connect your wallet first!");
      return;
    }

    if (!tokenAddress || wallets.length === 0 || quantity <= 0) {
      toast.error("Please fill in all parameters correctly!");
      return;
    }

    // Validate all addresses
    const invalidAddresses = wallets.filter(address => !isValidAddress(address));
    if (invalidAddresses.length > 0) {
      toast.error(`Invalid addresses found: ${invalidAddresses.slice(0, 3).join(", ")}${invalidAddresses.length > 3 ? "..." : ""}`);
      return;
    }

    // Check for sufficient balance
    const totalRequired = wallets.length * quantity;
    if (totalRequired > balanceAmount) {
      toast.error(`Insufficient token balance! Required: ${totalRequired}, Available: ${balanceAmount.toFixed(6)}`);
      return;
    }

    // Estimate gas costs
    const estimatedGasCost = wallets.length * fee;
    if (estimatedGasCost > ethBalance) {
      toast.error(`Insufficient ETH for gas fees! Required: ${estimatedGasCost.toFixed(6)} ETH, Available: ${ethBalance.toFixed(6)} ETH`);
      return;
    }

    setLoading(true);
    let successCount = 0;
    let failCount = 0;

    try {
      const erc20ABI = [
        "function transfer(address to, uint256 value) public returns (bool)",
        "function decimals() view returns (uint8)",
      ];

      const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, signer);
      const amount = ethers.parseUnits(quantity.toString(), tokenDecimals);

      toast.info(`Starting airdrop to ${wallets.length} addresses...`);

      for (let i = 0; i < wallets.length; i++) {
        const recipient = wallets[i];
        try {
          console.log(`Transferring ${quantity} ${tokenSymbol} to ${recipient}...`);
          
          const tx = await tokenContract.transfer(recipient, amount);
          toast.info(`Transaction sent to ${recipient.slice(0, 6)}...${recipient.slice(-4)}`);
          
          await tx.wait();
          successCount++;
          console.log(`✅ Successfully sent to ${recipient}`);
          
          // Small delay between transactions to avoid nonce issues
          if (i < wallets.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          failCount++;
          console.error(`❌ Failed to send to ${recipient}:`, error);
          toast.error(`Failed to send to ${recipient.slice(0, 6)}...${recipient.slice(-4)}: ${error.message}`);
        }
      }

      // Final summary
      if (successCount > 0) {
        toast.success(`Airdrop completed! ✅ ${successCount} successful, ❌ ${failCount} failed`);
      } else {
        toast.error("Airdrop failed completely!");
      }

      // Refresh balances
      await getTokenBalance();
      await getEthBalance();

    } catch (error) {
      console.error("Airdrop failed:", error);
      toast.error("Airdrop failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Check if airdrop is possible
  const canAirdrop = () => {
    return (
      isConnected &&
      wallets.length > 0 &&
      quantity > 0 &&
      wallets.length * quantity <= balanceAmount &&
      wallets.length * fee <= ethBalance
    );
  };

  return (
    <div className="App">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <div className="loading-text">Processing transactions...</div>
        </div>
      )}
      
      <div className="modern-container">
        {/* Modern Header */}
        <div className="gradient-header">
          <h1>🚀 Airdrop Multisender</h1>
          <p>Distribute tokens efficiently to multiple recipients</p>
        </div>

        {/* Navigation with Connect Wallet */}
        <div className="modern-nav d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <span className="fw-bold text-primary">Dashboard</span>
          </div>
          <ConnectWallet
            handleConnect={handleConnect}
            isConnected={isConnected}
            account={account}
            chainId={chainId}
            ethBalance={ethBalance}
          />
        </div>

        <div className="p-4">
          {/* Error Display */}
          {error && (
            <div className="modern-alert modern-alert-danger">
              <strong>Error:</strong> {error}
              <button 
                className="btn-close float-end" 
                onClick={() => setError("")}
              ></button>
            </div>
          )}

          {/* MetaMask Installation Warning */}
          {!isMetaMaskInstalled() && (
            <div className="modern-alert modern-alert-warning">
              <h5>MetaMask Required</h5>
              <p>
                Please install MetaMask to use this application.{" "}
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none fw-bold"
                >
                  Download MetaMask →
                </a>
              </p>
            </div>
          )}

          {/* Stats Overview */}
          {isConnected && (
            <div className="stats-grid fade-in">
              <div className="stat-card">
                <div className="stat-number">{wallets.length}</div>
                <div className="stat-label">Recipients</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{balanceAmount.toFixed(2)}</div>
                <div className="stat-label">{tokenSymbol || 'Token'} Balance</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{ethBalance.toFixed(4)}</div>
                <div className="stat-label">ETH Balance</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{(wallets.length * quantity).toFixed(2)}</div>
                <div className="stat-label">Total to Send</div>
              </div>
            </div>
          )}

          {/* Recipient Addresses Table */}
          <div className="glass-card slide-up">
            <SenderTable 
              wallets={wallets} 
              setWallets={setWallets} 
              isConnected={isConnected}
            />
          </div>

          {/* Token and Transfer Configuration */}
          <div className="glass-card slide-up">
            <TokenPart
              tokenaddress={tokenAddress}
              setTokenAddress={setTokenAddress}
              balanceAmount={balanceAmount}
              tokenSymbol={tokenSymbol}
              onTokenChange={getTokenBalance}
            />
            <Transfer
              quantity={quantity}
              setQuantity={setQuantity}
              totalQuantity={wallets?.length ? wallets.length * quantity : 0}
              balanceAmount={balanceAmount}
              tokenSymbol={tokenSymbol}
            />
            <Fee
              fee={fee}
              setFee={setFee}
              totalFee={wallets?.length ? wallets.length * fee : 0}
              ethBalance={ethBalance}
            />
          </div>

          {/* Airdrop Summary and Button */}
          <div className="airdrop-summary slide-up">
            <Airdrop
              isConnected={canAirdrop()}
              handleAirdrop={handleAirdrop}
              walletCount={wallets.length}
              totalTokens={wallets.length * quantity}
              totalFee={wallets.length * fee}
            />
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;