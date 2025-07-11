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
    <div className="tokenaddr">
      <InputGroup size="lg" className="inputgroup">
        <InputGroup.Text id="inputGroup-sizing-lg">
          Token Address
        </InputGroup.Text>
        <Form.Control
          aria-label="Large"
          aria-describedby="inputGroup-sizing-sm"
          placeholder="Enter ERC-20 token contract address"
          value={tokenaddress}
          onChange={handleAddressChange}
        />
        <Button variant="outline-secondary" onClick={handleRefresh}>
          🔄
        </Button>
      </InputGroup>
      
      {/* Quick Select Common Tokens */}
      <div className="mt-2 mb-3">
        <small className="text-muted">Quick select: </small>
        {commonTokens.map((token) => (
          <Badge
            key={token.address}
            bg="secondary"
            className="me-2 cursor-pointer"
            style={{ cursor: "pointer" }}
            onClick={() => setTokenAddress(token.address)}
          >
            {token.symbol}
          </Badge>
        ))}
      </div>

      <div className="balanceToken">
        <h4>
          Balance: {balanceAmount.toFixed(6)} {tokenSymbol && <Badge bg="primary">{tokenSymbol}</Badge>}
        </h4>
      </div>
    </div>
  );
};

export default TokenPart;