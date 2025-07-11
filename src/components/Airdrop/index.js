import Button from "react-bootstrap/Button";
import { Badge } from "react-bootstrap";

const Airdrop = (props) => {
  const { isConnected, handleAirdrop, walletCount, totalTokens, totalFee } = props;

  return (
    <div className="text-center position-relative">
      <h3 className="mb-4">🚀 Launch Airdrop</h3>
      
      <div className="summary-stats">
        <div className="summary-stat">
          <span className="summary-stat-number">{walletCount}</span>
          <span className="summary-stat-label">Recipients</span>
        </div>
        <div className="summary-stat">
          <span className="summary-stat-number">{totalTokens.toFixed(2)}</span>
          <span className="summary-stat-label">Total Tokens</span>
        </div>
        <div className="summary-stat">
          <span className="summary-stat-number">{totalFee.toFixed(4)}</span>
          <span className="summary-stat-label">Total Gas (ETH)</span>
        </div>
      </div>
      
      <Button
        className={isConnected ? "modern-btn modern-btn-success" : "modern-btn modern-btn-outline"}
        onClick={handleAirdrop}
        disabled={!isConnected}
        style={{ 
          minWidth: "250px", 
          fontSize: "1.2rem", 
          padding: "15px 30px",
          position: "relative",
          zIndex: 1
        }}
      >
        {isConnected ? (
          <>🚀 Execute Airdrop</>
        ) : (
          <>⚠️ Check Requirements</>
        )}
      </Button>
      
      {!isConnected && (
        <div className="mt-3 position-relative" style={{ zIndex: 1 }}>
          <small style={{ color: "rgba(255, 255, 255, 0.8)" }}>
            ✓ Connect wallet ✓ Load addresses ✓ Check balances
          </small>
        </div>
      )}
    </div>
  );
};

export default Airdrop;