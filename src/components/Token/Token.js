import React from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import { Badge } from "react-bootstrap";
import "./Token.css";

const TokenPart = (props) => {
  const { balanceAmount, tokenaddress, setTokenAddress, tokenSymbol, onTokenChange } = props;

  const handleAddressChange = (e) => {
    setTokenAddress(e.target.value);
  };

  const handleRefresh = () => {
    if (onTokenChange) {
      onTokenChange();
    }
  };

  const commonTokens = [
    { address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", symbol: "USDT", name: "Tether USD" },
    { address: "0xA0b86a33E6441b8C4505B8C4505B8C4505B8C4505", symbol: "USDC", name: "USD Coin" },
    { address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", symbol: "DAI", name: "Dai Stablecoin" },
  ];

  return (
    <div className="mb-4">
      <h4 className="mb-3">🪙 Token Configuration</h4>
      
      <div className="modern-input-group">
        <InputGroup size="lg">
          <InputGroup.Text>
            🔗 Token Contract
        </InputGroup.Text>
        <Form.Control
          placeholder="Enter ERC-20 token contract address"
          value={tokenaddress}
          onChange={handleAddressChange}
        />
          <Button className="modern-btn modern-btn-outline" onClick={handleRefresh}>
          🔄
        </Button>
      </InputGroup>
      </div>
      
      {/* Quick Select Common Tokens */}
      <div className="mb-3">
        <small className="text-muted fw-bold">Quick select popular tokens:</small>
        <div className="quick-actions mt-2">
        {commonTokens.map((token) => (
          <span
            key={token.address}
            className="quick-action-btn"
            onClick={() => setTokenAddress(token.address)}
          >
            💰 {token.symbol}
          </span>
        ))}
        </div>
      </div>

      {/* Token Balance Display */}
      <div className="d-flex align-items-center justify-content-between p-3" 
           style={{ background: "rgba(102, 126, 234, 0.05)", borderRadius: "12px", border: "1px solid rgba(102, 126, 234, 0.1)" }}>
        <div>
          <h5 className="mb-1">💰 Your Balance</h5>
          <div className="d-flex align-items-center">
            <span className="h4 mb-0 me-2">{balanceAmount.toFixed(6)}</span>
            {tokenSymbol && (
              <span className="modern-badge modern-badge-primary">
                {tokenSymbol}
              </span>
            )}
          </div>
        </div>
        {tokenSymbol && (
          <div className="text-end">
            <small className="text-muted">Token detected ✅</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenPart;