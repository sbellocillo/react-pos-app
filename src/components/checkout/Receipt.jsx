import React from 'react';
import './styles/Receipt.css'; // Dedicated CSS for printing

const PROVIDER_INFO = {
  name: "RFG-MIS",
  address: "Bacolod City, Philippines",
  tin: "000-000-000-000",
  accreditation_no: "000-0000000000-000000",
  date_issued: "01-01-2024",
  valid_until: "07-31-2029"
};

// Use forwardRef so the print function can "target" this component
export const Receipt = React.forwardRef(({ cartItems, totals, orderNumber, date, terminalData, cashReceived }, ref) => {

  const formatSimpleDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    
    const month = d.getMonth() + 1; // 1-12 (No leading zero)
    const day = d.getDate();        // 1-31 (No leading zero)
    const year = d.getFullYear();   // 2026

    return `${month}-${day}-${year}`;
  };

  const fullAddress = terminalData
    ? `${terminalData.street_name || ''}, ${terminalData.barangay || ''}, ${terminalData.city_municipality || ''}`
    : 'Branch Address Loading...';

  return (
    <div ref={ref} className="receipt-container">
      {/* Header */}
      <div className="receipt-header">
        <div className="receipt-meta">
          {/* Branch Name & Address (From DB) */}
          <p className="store-name">RIBSHACK GRILL CORPORATION</p>
          <p>{fullAddress}</p>
          <p>VAT REG TIN: {terminalData?.branch_tin || '000-000-000-000'}</p>

          <div className="divider-dashed">--------------------------------</div>

          {/* Machine Specifics (From DB) */}
          <p>MIN: {terminalData?.min_num}</p>
          <p>Serial No: {terminalData?.pos_serial_number}</p>
          <p>Permit No: {terminalData?.permit_num}</p>
          
          <p>Date Issued: {formatSimpleDate(date)}</p>

          <p>--- S A L E S  I N V O I C E ---</p>
          <p>Order #: {orderNumber}</p>
        </div>
      </div>

      {/* Items */}
      <div className="receipt-items">
        <div className="row">
            <span>QTY ITEM</span>
            <span>TOTAL</span>
        </div>
        {cartItems.map((item, index) => (
          <div key={index} className="receipt-item-row">
            <span className="qty">{item.quantity}x</span>
            <span className="name">{item.item_name}</span>
            <span className="price">{Number(item.price).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="receipt-footer">
        <div className="row">
            <span>Subtotal</span>
            <span>{Number(totals.subtotal).toFixed(2)}</span>
        </div>
        <div className="row">
            <span>Cash Tendered</span>
            <span>{Number(cashReceived || 0).toFixed(2)}</span>
        </div>
        <div className="row">
            <span>Change</span>
            <span>{Number((cashReceived || 0) - totals.total).toFixed(2)}</span>
        </div>

         <div className="row section">
            <span>Vatable Sales</span>
            <span>{Number(totals.subtotal).toFixed(2)}</span>
        </div>
        <div className="row">
            <span>VAT</span>
            <span>{Number(totals.tax).toFixed(2)}</span>
        </div>
        
        <div className="row total">
            <span>TOTAL</span>
            <span>{Number(totals.total).toFixed(2)}</span>
        </div>
      </div>
      
      {/* Footer: Legal / Accredited Supplier Info (Required by BIR) */}
      <div className="receipt-legal-footer" style={{fontSize: '9px', textAlign: 'center', marginTop: '20px'}}>
        <p>Accredited Supplier: {PROVIDER_INFO.name}</p>
        <p>Address: {PROVIDER_INFO.address}</p>
        <p>TIN: {PROVIDER_INFO.tin}</p>
        <p>
            Accreditation No: {PROVIDER_INFO.accreditation_no}<br/>
            Date Issued: {PROVIDER_INFO.date_issued} &nbsp; Valid Until: {PROVIDER_INFO.valid_until}
        </p>
        <p style={{marginTop: '5px'}}>
            PTU No: {terminalData?.permit_num}<br/>
            Issued: {formatSimpleDate(terminalData?.permit_date_issued)}<br/>
            Valid Until: {formatSimpleDate(terminalData?.permit_valid_until)}
        </p>
      </div>

      <div className="receipt-thank-you">Thank you for dining with us!</div>
    </div>
  );
});