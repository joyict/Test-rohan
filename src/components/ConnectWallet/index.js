import Button from "react-bootstrap/Button";
import { Badge } from "react-bootstrap";

const ConnectWallet = (props) => {
  const { handleConnect, isConnected, account, chainId, ethBalance } = props;

  const getNetworkName = (chainId) => {
    const networks = {
      "1": "Ethereum Mainnet",
      "5": "Goerli Testnet",
      "11155111": "Sepolia Testnet",
      "137": "Polygon Mainnet",
      "80001": "Polygon Mumbai",
    };
    return networks[chainId] || `Chain ID: ${chainId}`;
  };

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="d-flex flex-column align-items-end">
      {isConnected && (
        <div className="mb-3 text-end">
          <div className="small">
            <div className="mb-1">
              <span className="modern-badge modern-badge-info me-2">
                {formatAddress(account)}
              </span>
            </div>
            <div className="mb-1">
              <span className="modern-badge modern-badge-primary me-2">
                {getNetworkName(chainId)}
              </span>
            </div>
            <div>
              <span className="modern-badge modern-badge-warning">
                {ethBalance.toFixed(4)} ETH
              </span>
            </div>
          </div>
        </div>
      )}
      <Button
        className={isConnected ? "connect-wallet-modern connected" : "connect-wallet-modern"}
        onClick={handleConnect}
        size="lg"
      >
        {isConnected ? "✅ Connected" : "🔗 Connect MetaMask"}
      </Button>
    </div>
  );
};

export default ConnectWallet;