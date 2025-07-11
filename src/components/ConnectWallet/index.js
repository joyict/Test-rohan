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
        <div className="mb-2 text-end">
          <div className="small text-muted">
            <div>Account: <strong>{formatAddress(account)}</strong></div>
            <div>Network: <Badge bg="info">{getNetworkName(chainId)}</Badge></div>
            <div>ETH Balance: <strong>{ethBalance.toFixed(4)} ETH</strong></div>
          </div>
        </div>
      )}
      <Button
        className={isConnected ? "btn btn-success" : "btn btn-primary"}
        onClick={handleConnect}
        size="lg"
      >
        {isConnected ? "🟢 Connected" : "🔗 Connect MetaMask"}
      </Button>
    </div>
  );
};

export default ConnectWallet;