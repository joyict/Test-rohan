import React from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Badge } from "react-bootstrap";
import "./style.css";

const Fee = (props) => {
  const { fee, setFee, totalFee, ethBalance } = props;

  const isInsufficientGas = ethBalance < totalFee;

  return (
    <div className="mb-4">
      <h4 className="mb-3">⛽ Gas Fee Configuration</h4>
      
      <div className="modern-input-group">
        <InputGroup size="lg">
          <InputGroup.Text>
            ⛽ Gas per Transaction
          </InputGroup.Text>
          <Form.Control
            type="number"
            step="0.0001"
            min="0"
            placeholder="Estimated gas fee per transaction"
            value={fee}
            onChange={(e) => setFee(Number(e.target.value))}
          />
          <InputGroup.Text style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", color: "white", border: "none" }}>
            ETH
          </InputGroup.Text>
        </InputGroup>
      </div>
      
      {/* Gas Calculation Display */}
      <div className={`p-3 rounded-3 ${isInsufficientGas ? 'border border-danger bg-danger bg-opacity-10' : 'border border-success bg-success bg-opacity-10'}`}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className={`mb-1 ${isInsufficientGas ? 'text-danger' : 'text-success'}`}>
              ⛽ Total Gas Cost
            </h5>
            <div className="d-flex align-items-center">
              <span className="h4 mb-0 me-2">{totalFee.toFixed(6)}</span>
              <span className={`modern-badge ${isInsufficientGas ? 'modern-badge-danger' : 'modern-badge-warning'}`}>
                ETH
              </span>
            </div>
          </div>
          <div className="text-end">
            <small className="text-muted">Available: {ethBalance.toFixed(6)} ETH</small>
            {isInsufficientGas && (
              <div className="mt-1">
                <span className="modern-badge modern-badge-danger">⚠️ Insufficient ETH!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fee;