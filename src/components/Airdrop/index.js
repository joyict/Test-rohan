import Button from "react-bootstrap/Button";
import { Badge } from "react-bootstrap";

const Airdrop = (props) => {
  const { isConnected, handleAirdrop, walletCount, totalTokens, totalFee } = props;

  return (
    <div className="text-center">
      <div className="mb-3">
        <h5>Airdrop Summary</h5>
        <div className="d-flex justify-content-center gap-3 mb-3">
          <Badge bg="info">Recipients: {walletCount}</Badge>
          <Badge bg="success">Total Tokens: {totalTokens.toFixed(6)}</Badge>
          <Badge bg="warning">Total Gas: {totalFee.toFixed(6)} ETH</Badge>
        </div>
      </div>
      
      <Button
        className={isConnected ? "btn btn-success btn-lg" : "btn btn-secondary btn-lg"}
        onClick={handleAirdrop}
        disabled={!isConnected}
        style={{ minWidth: "200px" }}
      >
        {isConnected ? (
          <>🚀 Start Airdrop</>
        ) : (
          <>⚠️ Requirements Not Met</>
        )}
      </Button>
      
      {!isConnected && (
        <div className="mt-2">
          <small className="text-muted">
            Ensure wallet is connected, addresses are loaded, and you have sufficient balance
          </small>
        </div>
      )}
    </div>
  );
};

export default Airdrop;