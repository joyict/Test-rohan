import React from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Badge } from "react-bootstrap";
import "./style.css";

const Fee = (props) => {
  const { fee, setFee, totalFee, ethBalance } = props;

  const isInsufficientGas = ethBalance < totalFee;

  return (
    <div className="eth_transfer">
      <div className="_ethamount">
        <InputGroup size="lg" className="eth_amount">
          <InputGroup.Text id="inputGroup-sizing-lg">
            Gas Fee per TX
          </InputGroup.Text>
          <Form.Control
            aria-label="Large"
            aria-describedby="inputGroup-sizing-sm"
            type="number"
            step="0.0001"
            min="0"
            placeholder="Estimated gas fee per transaction"
            value={fee}
            onChange={(e) => setFee(Number(e.target.value))}
          />
          <InputGroup.Text>
            <Badge bg="warning">ETH</Badge>
          </InputGroup.Text>
        </InputGroup>
      </div>
      
      <div className="totalToken">
        <h4 style={{ color: isInsufficientGas ? "red" : "green" }}>
          Total Gas: {totalFee.toFixed(6)} ETH
          {isInsufficientGas && (
            <div>
              <Badge bg="danger">Insufficient ETH!</Badge>
            </div>
          )}
        </h4>
        <small className="text-muted">
          Available: {ethBalance.toFixed(6)} ETH
        </small>
      </div>
    </div>
  );
};

export default Fee;