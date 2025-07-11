import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import { Alert, Badge } from "react-bootstrap";
import { useState } from "react";
import { ethers } from "ethers";
import Papa from "papaparse";
import "./style.css";

const SenderTable = (props) => {
  const { wallets, setWallets, isConnected } = props;
  const [newAddress, setNewAddress] = useState("");
  const [error, setError] = useState("");

  // Validate Ethereum address
  const isValidAddress = (address) => {
    try {
      return ethers.isAddress(address);
    } catch {
      return false;
    }
  };

  // Handle CSV file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setError("Please upload a valid CSV file");
      return;
    }

    Papa.parse(file, {
      complete: (results) => {
        try {
          const addresses = [];
          const invalidAddresses = [];
          const duplicates = new Set();

          results.data.forEach((row, index) => {
            // Handle different CSV formats
            const address = row[0] || row.address || row.wallet;
            
            if (address && address.trim()) {
              const cleanAddress = address.trim();
              
              if (isValidAddress(cleanAddress)) {
                if (!duplicates.has(cleanAddress.toLowerCase())) {
                  addresses.push(cleanAddress);
                  duplicates.add(cleanAddress.toLowerCase());
                } else {
                  console.warn(`Duplicate address found: ${cleanAddress}`);
                }
              } else {
                invalidAddresses.push(`Row ${index + 1}: ${cleanAddress}`);
              }
            }
          });

          if (invalidAddresses.length > 0) {
            setError(`Invalid addresses found: ${invalidAddresses.slice(0, 5).join(", ")}${invalidAddresses.length > 5 ? "..." : ""}`);
          } else {
            setError("");
          }

          setWallets(addresses);
          
          if (addresses.length > 0) {
            alert(`Successfully loaded ${addresses.length} valid addresses${invalidAddresses.length > 0 ? ` (${invalidAddresses.length} invalid addresses skipped)` : ""}`);
          }
        } catch (err) {
          setError("Error parsing CSV file");
          console.error("CSV parsing error:", err);
        }
      },
      header: false,
      skipEmptyLines: true,
    });

    // Reset file input
    event.target.value = "";
  };

  // Add single address
  const handleAddAddress = () => {
    if (!newAddress.trim()) {
      setError("Please enter an address");
      return;
    }

    const cleanAddress = newAddress.trim();
    
    if (!isValidAddress(cleanAddress)) {
      setError("Invalid Ethereum address format");
      return;
    }

    if (wallets.some(addr => addr.toLowerCase() === cleanAddress.toLowerCase())) {
      setError("Address already exists in the list");
      return;
    }

    setWallets([...wallets, cleanAddress]);
    setNewAddress("");
    setError("");
  };

  // Remove address
  const handleRemoveAddress = (index) => {
    const newWallets = wallets.filter((_, i) => i !== index);
    setWallets(newWallets);
  };

  // Clear all addresses
  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all addresses?")) {
      setWallets([]);
      setError("");
    }
  };

  // Load sample addresses
  const loadSampleAddresses = () => {
    const sampleAddresses = [
      "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
      "0x8ba1f109551bD432803012645Hac136c9c1e3a9e",
      "0x1234567890123456789012345678901234567890",
    ];
    setWallets(sampleAddresses);
    setError("");
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">📋 Recipient Addresses</h3>
        <div>
          <span className={`modern-badge ${wallets.length > 0 ? 'modern-badge-success' : 'modern-badge-primary'}`}>
            {wallets.length} addresses loaded
          </span>
        </div>
      </div>

      {error && (
        <div className="modern-alert modern-alert-danger">
          <strong>Validation Error:</strong> {error}
          <button 
            className="btn-close float-end" 
            onClick={() => setError("")}
          ></button>
        </div>
      )}

      {/* File Upload Area */}
      <div className="file-upload-area mb-4" onClick={() => document.getElementById("csvFileInput").click()}>
        <div className="file-upload-icon">📁</div>
        <h5>Upload CSV File</h5>
        <p className="text-muted mb-0">Click here or drag and drop your CSV file with recipient addresses</p>
        <Form.Control
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          disabled={!isConnected}
          style={{ display: "none" }}
          id="csvFileInput"
        />
      </div>

      {/* Manual Address Input */}
      <div className="modern-input-group">
        <InputGroup size="lg">
          <InputGroup.Text>🔗 Address</InputGroup.Text>
          <Form.Control
            placeholder="Enter Ethereum address (0x...)"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddAddress()}
            disabled={!isConnected}
            className="modern-input"
          />
          <Button 
            className="modern-btn modern-btn-primary"
            onClick={handleAddAddress}
            disabled={!isConnected}
          >
            Add
          </Button>
        </InputGroup>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <span
          className="quick-action-btn"
          onClick={loadSampleAddresses}
          style={{ display: !isConnected ? 'none' : 'inline-block' }}
        >
          📝 Load Sample
        </span>
        
        {wallets.length > 0 && (
          <span
            className="quick-action-btn"
            onClick={handleClearAll}
            style={{ borderColor: '#ff416c', color: '#ff416c' }}
          >
            🗑️ Clear All
          </span>
        )}
      </div>

      {/* Addresses Table */}
      <div style={{ maxHeight: "400px", overflowY: "auto", borderRadius: "16px" }}>
        <Table className="modern-table" responsive>
          <thead>
            <tr>
              <th style={{ width: "80px" }}>#</th>
              <th>Wallet Address</th>
              <th style={{ width: "120px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {wallets && wallets.length > 0 ? (
              wallets.map((address, idx) => (
                <tr key={idx}>
                  <td className="fw-bold">{idx + 1}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <code style={{ fontSize: "0.9em", background: "rgba(102, 126, 234, 0.1)", padding: "4px 8px", borderRadius: "6px" }}>
                        {address}
                      </code>
                      {!isValidAddress(address) && (
                        <span className="modern-badge modern-badge-danger ms-2">Invalid</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <Button
                      className="modern-btn modern-btn-danger"
                      size="sm"
                      onClick={() => handleRemoveAddress(idx)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-muted py-5">
                  {isConnected 
                    ? "🔍 No addresses loaded. Upload a CSV file or add addresses manually." 
                    : "🔒 Please connect your wallet to manage addresses."
                  }
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* CSV Format Help */}
      <div className="mt-4 p-3" style={{ background: "rgba(102, 126, 234, 0.05)", borderRadius: "12px", border: "1px solid rgba(102, 126, 234, 0.1)" }}>
        <h6 className="text-primary mb-2">📋 CSV Format Guide</h6>
        <small className="text-muted">
          Each line should contain one Ethereum address. Headers are optional.<br/>
          <strong>Example:</strong> <code>0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6</code>
        </small>
      </div>
    </div>
  );
};

export default SenderTable;
          {error}
        </Alert>
      )}

      {/* Address Input */}
      <div className="mb-3">
        <InputGroup>
          <Form.Control
            placeholder="Enter Ethereum address (0x...)"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddAddress()}
            disabled={!isConnected}
          />
          <Button 
            variant="primary" 
            onClick={handleAddAddress}
            disabled={!isConnected}
          >
            Add Address
          </Button>
        </InputGroup>
      </div>

      {/* File Upload and Actions */}
      <div className="tableButton mb-3">
        <div className="d-flex gap-2 flex-wrap">
          <div>
            <Form.Control
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={!isConnected}
              style={{ display: "none" }}
              id="csvFileInput"
            />
            <Button
              variant="success"
              onClick={() => document.getElementById("csvFileInput").click()}
              disabled={!isConnected}
            >
              📁 Upload CSV
            </Button>
          </div>
          
          <Button
            variant="info"
            onClick={loadSampleAddresses}
            disabled={!isConnected}
            size="sm"
          >
            Load Sample
          </Button>
          
          {wallets.length > 0 && (
            <Button
              variant="danger"
              onClick={handleClearAll}
              size="sm"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Addresses Table */}
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        <Table responsive striped bordered hover>
          <thead className="table-dark">
            <tr>
              <th style={{ width: "80px" }}>No</th>
              <th>Wallet Address</th>
              <th style={{ width: "100px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {wallets && wallets.length > 0 ? (
              wallets.map((address, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>
                    <code style={{ fontSize: "0.9em" }}>{address}</code>
                    {!isValidAddress(address) && (
                      <Badge bg="danger" className="ms-2">Invalid</Badge>
                    )}
                  </td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveAddress(idx)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-muted">
                  {isConnected 
                    ? "No addresses loaded. Upload a CSV file or add addresses manually." 
                    : "Please connect your wallet to manage addresses."
                  }
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* CSV Format Help */}
      <div className="mt-3">
        <small className="text-muted">
          <strong>CSV Format:</strong> Each line should contain one Ethereum address. 
          Headers are optional. Example: 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6
        </small>
      </div>
    </div>
  );
};

export default SenderTable;