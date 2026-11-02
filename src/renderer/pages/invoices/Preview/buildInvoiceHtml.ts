import type { InvoiceFromData } from '../../../shared/types/invoice';

export const buildInvoiceHtml = (invoice: InvoiceFromData, message: string): string => {
  const business = invoice.invoiceBusinessSnapshot;
  const client = invoice.invoiceClientSnapshot;
  const bank = invoice.invoiceBankSnapshot;
  const items = invoice.invoiceItems || [];
  
  const subtotal = invoice.subtotal || '0.00';
  const tax = invoice.taxAmount || '0.00';
  const total = invoice.totalAmount || '0.00';
  const currency = invoice.invoiceCurrencySnapshot?.currencySymbol || '$';

  const itemsHtml = items.map(item => `
    <tr>
      <td>${item.itemName || 'Item'}</td>
      <td style="text-align: right;">${item.quantity || 1}</td>
      <td style="text-align: right;">${currency}${item.unitPriceCents ? (parseInt(item.unitPriceCents) / 100).toFixed(2) : '0.00'}</td>
      <td style="text-align: right; font-weight: 600;">${currency}${((parseInt(item.unitPriceCents || '0') * parseFloat(item.quantity || '1')) / 100).toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 40px; }
        .invoice-box { max-width: 800px; margin: auto; padding: 40px; border: 1px solid #eee; box-shadow: 0 10px 30px rgba(0,0,0,0.05); background-color: #ffffff; border-radius: 12px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px; }
        .header-left h2 { margin: 0; color: #1e1e2f; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
        .header-right { text-align: right; }
        .header-right h1 { margin: 0; color: #6366f1; font-size: 36px; text-transform: uppercase; letter-spacing: 2px; }
        .details { width: 100%; margin-bottom: 30px; border-collapse: collapse; }
        .details td { padding: 5px 0; vertical-align: top; }
        .details .title { font-weight: 600; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .items-table th { background-color: #f8fafc; color: #475569; padding: 12px; text-align: left; font-weight: 600; font-size: 13px; text-transform: uppercase; border-bottom: 2px solid #e2e8f0; }
        .items-table td { padding: 15px 12px; border-bottom: 1px solid #e2e8f0; color: #1e293b; }
        .totals { width: 100%; max-width: 300px; margin-left: auto; border-collapse: collapse; }
        .totals td { padding: 10px; text-align: right; }
        .totals .total-row { font-size: 20px; font-weight: bold; color: #6366f1; border-top: 2px solid #e2e8f0; }
        .payment-info { background: linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%); padding: 25px; border-radius: 10px; margin-top: 40px; border-left: 5px solid #6366f1; }
        .payment-info h4 { margin-top: 0; color: #1e293b; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; }
        .payment-table { width: 100%; font-size: 14px; }
        .payment-table td { padding: 6px 0; color: #475569; }
        .payment-table strong { color: #1e293b; }
        .terms { background-color: #ecfdf5; padding: 15px; border-radius: 8px; margin-top: 20px; border: 1px solid #a7f3d0; color: #065f46; font-size: 14px; font-weight: 500; }
        .footer { margin-top: 50px; text-align: center; color: #94a3b8; font-size: 13px; }
        .custom-message { margin-bottom: 30px; font-size: 15px; line-height: 1.6; color: #334155; white-space: pre-wrap; }
      </style>
    </head>
    <body>
      <div class="invoice-box">
        <div class="custom-message">${message}</div>

        <table style="width: 100%; margin-bottom: 30px;">
          <tr>
            <td style="width: 50%;">
              <h2 style="margin: 0; color: #1e1e2f; font-size: 28px; font-weight: 800;">AISMARTLIVE SOLUTIONS PVT LTD</h2>
              <p style="color: #64748b; margin-top: 5px; font-size: 14px;">${business?.businessAddress?.replace(/\n/g, '<br/>') || ''}</p>
            </td>
            <td style="width: 50%; text-align: right;">
              <h1 style="margin: 0; color: #6366f1; font-size: 36px; text-transform: uppercase; letter-spacing: 2px;">${invoice.invoiceType || 'INVOICE'}</h1>
              <p style="color: #64748b; font-size: 14px;"><strong>Invoice #:</strong> ${invoice.invoiceFullNumber || ''}<br/><strong>Date:</strong> ${new Date(invoice.issuedAt || Date.now()).toLocaleDateString()}</p>
            </td>
          </tr>
        </table>
        
        <table class="details">
          <tr>
            <td style="width: 50%;">
              <div class="title">Billed To:</div>
              <div style="font-weight: 600; color: #1e293b; font-size: 16px; margin-top: 5px;">${client?.clientName || ''}</div>
              <div style="color: #64748b; font-size: 14px; margin-top: 5px;">${client?.clientAddress?.replace(/\n/g, '<br/>') || ''}<br/>${client?.clientEmail || ''}</div>
            </td>
          </tr>
        </table>

        <table class="items-table">
          <tr>
            <th>Item Description</th>
            <th style="text-align: right;">Qty</th>
            <th style="text-align: right;">Rate</th>
            <th style="text-align: right;">Amount</th>
          </tr>
          ${itemsHtml}
        </table>

        <table class="totals">
          <tr>
            <td style="color: #64748b;">Subtotal</td>
            <td style="font-weight: 600;">${currency}${subtotal}</td>
          </tr>
          <tr>
            <td style="color: #64748b;">Tax</td>
            <td style="font-weight: 600;">${currency}${tax}</td>
          </tr>
          <tr class="total-row">
            <td>Total Due</td>
            <td>${currency}${total}</td>
          </tr>
        </table>

        ${bank ? `
        <div class="payment-info">
          <h4>Payment Information</h4>
          <table class="payment-table">
            <tr><td style="width: 150px;"><strong>Bank Name:</strong></td><td>${bank.bankName || ''}</td></tr>
            <tr><td><strong>Account Name:</strong></td><td>${bank.accountHolder || ''}</td></tr>
            <tr><td><strong>Account Number:</strong></td><td>${bank.accountNumber || ''}</td></tr>
            <tr><td><strong>IFSC Code:</strong></td><td>${bank.ifscCode || ''}</td></tr>
            <tr><td><strong>Branch:</strong></td><td>${bank.branchCode || ''}</td></tr>
          </table>
        </div>
        ` : ''}

        ${invoice.termsConditionNotes ? `
        <div class="terms">
          ${invoice.termsConditionNotes.replace(/\n/g, '<br/>')}
        </div>
        ` : ''}

        <div class="footer">
          Thank you for your business. For any inquiries, contact ${business?.businessEmail || ''}.
        </div>
      </div>
    </body>
    </html>
  `;
};
