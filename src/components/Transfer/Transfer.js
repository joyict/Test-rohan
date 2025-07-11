import React from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Badge } from "react-bootstrap";
import "./Transfer.css";

const Transfer = (props) => {
  const { quantity, setQuantity, totalQuantity, balanceAmount, tokenSymbol } = props;

  const isInsufficientBalance = balanceAmount < totalQuantity;

  return (
    <div className="eth_transfer">
      <div className="_ethamount">
        <InputGroup size="lg" className="eth_amount">
          <InputGroup.Text id="inputGroup-sizing-lg">
            Quantity per wallet
          </InputGroup.Text>
          <Form.Control
            aria-label="Large"
            aria-describedby="inputGroup-sizing-sm"
            type="number"
            step="0.000001"
            min="0"
            placeholder="Enter amount per recipient"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
          {tokenSymbol && (
            <InputGroup.Text>
              <Badge bg="primary">{tokenSymbol}</Badge>
            </InputGroup.Text>
          )}
        </InputGroup>
      </div>
      
      <div className="totalToken">
        <h4 style={{ color: isInsufficientBalance ? "red" : "green" }}>
          Total Required: {totalQuantity.toFixed(6)} {tokenSymbol}
          {isInsufficientBalance && (
            <div>
              <Badge bg="danger">Insufficient Balance!</Badge>
            </div>
          )}
        </h4>
        <small className="text-muted">
          Available: {balanceAmount.toFixed(6)} {tokenSymbol}
        </small>
      </div>
    </div>
  );
};

export default Transfer;