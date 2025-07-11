import React from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Badge } from "react-bootstrap";
import "./Transfer.css";

const Transfer = (props) => {
  const { quantity, setQuantity, totalQuantity, balanceAmount, tokenSymbol } = props;

  const isInsufficientBalance = balanceAmount < totalQuantity;

  return (
    <div className="mb-4">
      <h4 className="mb-3">💸 Transfer Configuration</h4>
      
      <div className="modern-input-group">
        <InputGroup size="lg">
          <InputGroup.Text>
            💰 Amount per Recipient
          </InputGroup.Text>
          <Form.Control
            type="number"
            step="0.000001"
            min="0"
            placeholder="Enter amount per recipient"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
          {tokenSymbol && (
            <InputGroup.Text style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", border: "none" }}>
              {tokenSymbol}
            </InputGroup.Text>
          )}
        </InputGroup>
      </div>
      
      {/* Total Calculation Display */}
      <div className={`p-3 rounded-3 ${isInsufficientBalance ? 'border border-danger bg-danger bg-opacity-10' : 'border border-success bg-success bg-opacity-10'}`}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className={`mb-1 ${isInsufficientBalance ? 'text-danger' : 'text-success'}`}>
              📊 Total Required
            </h5>
            <div className="d-flex align-items-center">
              <span className="h4 mb-0 me-2">{totalQuantity.toFixed(6)}</span>
              {tokenSymbol && (
                <span className={`modern-badge ${isInsufficientBalance ? 'modern-badge-danger' : 'modern-badge-success'}`}>
                  {tokenSymbol}
                </span>
              )}
            </div>
          </div>
          <div className="text-end">
            <small className="text-muted">Available: {balanceAmount.toFixed(6)} {tokenSymbol}</small>
            {isInsufficientBalance && (
              <div className="mt-1">
                <span className="modern-badge modern-badge-danger">⚠️ Insufficient Balance!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transfer;