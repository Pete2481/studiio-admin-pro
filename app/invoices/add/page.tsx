"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Plus, X, Calendar, Upload, Settings, Share, Download, Eye, Save, DollarSign, ChevronDown } from "lucide-react";

interface InvoiceItem {
  id: string;
  item: string;
  cost: number;
  qty: number;
  price: number;
  discount: number;
}

export default function AddInvoicePage() {
  const [formData, setFormData] = useState({
    invoiceNumber: "#000",
    dateIssue: "",
    dateDue: "",
    productName: "",
    houseNo: "",
    landmark: "",
    city: "",
    pincode: "",
    paymentTerms: "",
    clientNote: "",
    tax: 0,
    paymentMethod: "Debit Card",
    paymentTermsEnabled: true,
    clientNotesEnabled: true,
    paymentStubEnabled: false
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: "1",
      item: "Stack Admin template",
      cost: 24,
      qty: 1,
      price: 24.00,
      discount: 0
    },
    {
      id: "2",
      item: "The most developer friendly & hig",
      cost: 0,
      qty: 0,
      price: 0,
      discount: 0
    }
  ]);

  const [showDueDateDropdown, setShowDueDateDropdown] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const dueDateOptions = [
    "Within 15 days",
    "Within 30 days", 
    "Within 45 days",
    "Within 60 days",
    "Within 90 days"
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (id: string, field: string, value: any) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        // Calculate price
        if (field === 'cost' || field === 'qty') {
          updatedItem.price = updatedItem.cost * updatedItem.qty * (1 - updatedItem.discount / 100);
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      item: "",
      cost: 0,
      qty: 0,
      price: 0,
      discount: 0
    };
    setItems(prev => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.price, 0);
  };

  const calculateDiscount = () => {
    return items.reduce((sum, item) => sum + (item.cost * item.qty * item.discount / 100), 0);
  };

  const calculateTax = () => {
    return (calculateSubtotal() - calculateDiscount()) * (formData.tax / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount() + calculateTax();
  };

  const handleDueDateSelect = (option: string) => {
    setFormData(prev => ({ ...prev, dateDue: option }));
    setShowDueDateDropdown(false);
  };

  const downloadPDF = () => {
    // Create HTML content for the invoice
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice ${formData.invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
          .sender-info { font-size: 14px; }
          .sender-info h2 { margin: 0 0 10px 0; font-size: 18px; }
          .sender-info p { margin: 5px 0; }
          .invoice-title { text-align: center; }
          .invoice-title h1 { color: #2563eb; font-size: 28px; margin: 0; }
          .logo { text-align: center; }
          .logo-box { width: 60px; height: 60px; background: #2563eb; color: white; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; margin-bottom: 5px; }
          .logo-text { font-size: 12px; font-weight: bold; }
          hr { border: none; border-top: 1px solid #d1d5db; margin: 20px 0; }
          .invoice-details { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .recipient-info h3 { margin: 0 0 10px 0; font-size: 16px; }
          .recipient-info p { margin: 5px 0; }
          .payment-info { display: flex; gap: 30px; }
          .payment-col { text-align: center; }
          .payment-col p:first-child { font-weight: bold; margin-bottom: 5px; }
          .order-details { margin-bottom: 20px; }
          .order-details p { font-weight: bold; margin: 0; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { text-align: left; padding: 12px 16px; font-weight: bold; border-bottom: 2px solid #d1d5db; }
          td { padding: 16px; border-bottom: 1px solid #e5e7eb; }
          .service { font-weight: bold; }
          .description { font-size: 12px; }
          .description p { margin: 2px 0; }
          .qty { text-align: center; }
          .rate, .amount { text-align: right; }
          .amount { font-weight: bold; }
          .totals-section { display: flex; justify-content: space-between; }
          .payment-instructions { width: 50%; }
          .payment-instructions h4 { margin: 0 0 15px 0; font-size: 16px; }
          .payment-instructions p { margin: 5px 0; font-size: 14px; }
          .totals { width: 30%; }
          .totals div { display: flex; justify-content: space-between; margin-bottom: 8px; }
          .total-due { border-top: 2px solid #d1d5db; padding-top: 8px; font-weight: bold; }
          .total-due .amount { color: #2563eb; text-decoration: underline; }
          .notes { margin-top: 30px; padding-top: 20px; border-top: 1px solid #d1d5db; }
          .notes h3 { margin: 0 0 15px 0; font-size: 16px; }
          .notes-content { background: #f9fafb; padding: 16px; border-radius: 8px; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="sender-info">
            <h2>Media Drive</h2>
            <p>Byron Bay NSW AUST</p>
            <p>0413979054</p>
            <p>pete@mediadrive.com.au</p>
            <p>ABN 72600082460</p>
          </div>
          <div class="invoice-title">
            <h1>Tax Invoice ${formData.invoiceNumber}</h1>
          </div>
          <div class="logo">
            <div class="logo-box">MD</div>
            <div class="logo-text">
              <div>MEDIA</div>
              <div>DRIVE</div>
            </div>
          </div>
        </div>

        <hr>

        <div class="invoice-details">
          <div class="recipient-info">
            <h3>INVOICE TO</h3>
            <p>${formData.productName || "Client Name"}</p>
            <p>${formData.houseNo || ""}</p>
            <p>${formData.landmark || ""}</p>
            <p>${formData.city || ""}, ${formData.pincode || ""}</p>
          </div>
          <div class="payment-info">
            <div class="payment-col">
              <p>Date</p>
              <p>${formData.dateIssue || "24/08/2025"}</p>
            </div>
            <div class="payment-col">
              <p>Please Pay</p>
              <p>A$${calculateTotal().toFixed(2)}</p>
            </div>
            <div class="payment-col">
              <p>Due Date</p>
              <p>${formData.dateDue || "08/09/2025"}</p>
            </div>
          </div>
        </div>

        <hr>

        <div class="order-details">
          <p>ORDER DETAILS: ${formData.landmark || "75 Carlisle Street, Wardell NSW, Australia"}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>SERVICE</th>
              <th>DESCRIPTION</th>
              <th>QTY</th>
              <th>RATE</th>
              <th>AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item, index) => `
              <tr>
                <td class="service">${item.item || "Essential Package"}</td>
                <td class="description">
                  ${index === 0 ? `
                    <p>• Up to 35 Images</p>
                    <p>• Branded Floor Plan & Site Plan</p>
                    <p>• Drone Photography</p>
                    <p>• AI Decluttering $10 (Per Image)</p>
                    <p>• Additional Images $15</p>
                  ` : item.item}
                </td>
                <td class="qty">${item.qty || 1}</td>
                <td class="rate">${item.cost || 550}</td>
                <td class="amount">${(item.price || 550).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals-section">
          <div class="payment-instructions">
            <h4>Please make payment to:</h4>
            <p><strong>Name:</strong> Media Drive Systems</p>
            <p><strong>BSB:</strong> 012554</p>
            <p><strong>Account:</strong> 461217149 (Reference Invoice No ONLY)</p>
          </div>
          <div class="totals">
            <div>
              <span>SUBTOTAL:</span>
              <span>A$${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div>
              <span>GST TOTAL:</span>
              <span>${calculateTax().toFixed(2)}</span>
            </div>
            <div>
              <span>TOTAL:</span>
              <span>A$${calculateTotal().toFixed(2)}</span>
            </div>
            <div class="total-due">
              <span>TOTAL DUE:</span>
              <span class="amount">A$${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

        ${(formData.paymentTerms || formData.clientNote) ? `
          <div class="notes">
            <h3>NOTES</h3>
            <div class="notes-content">
              ${formData.paymentTerms ? `
                <p><strong>Payment Terms:</strong> ${formData.paymentTerms}</p>
              ` : ''}
              ${formData.clientNote ? `
                <p><strong>Additional Notes:</strong> ${formData.clientNote}</p>
              ` : ''}
            </div>
          </div>
        ` : ''}
      </body>
      </html>
    `;

    // Create a blob with the HTML content
    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Open in new window for printing/downloading
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = function() {
        printWindow.print();
      };
    }
    
    // Also provide direct download option
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${formData.invoiceNumber}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Invoice data:", { formData, items });
    // Handle invoice creation logic here
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-68 min-h-screen bg-gray-50">
        {/* Top Header Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              HOME / INVOICE / INVOICE ADD
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Settings size={16} />
              <span className="text-sm">Settings</span>
              <ChevronDown size={12} />
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <Upload size={16} className="text-gray-600" />
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <Calendar size={16} className="text-gray-600" />
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Main Content */}
          <div className="flex-1 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Header Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Invoice#</label>
                    <input
                      type="text"
                      value={formData.invoiceNumber}
                      onChange={(e) => handleInputChange("invoiceNumber", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Issue</label>
                    <input
                      type="date"
                      value={formData.dateIssue}
                      onChange={(e) => handleInputChange("dateIssue", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Due</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Select Due Date"
                        value={formData.dateDue}
                        onClick={() => setShowDueDateDropdown(!showDueDateDropdown)}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer"
                      />
                      <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    {showDueDateDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                        {dueDateOptions.map((option, index) => (
                          <div
                            key={index}
                            onClick={() => handleDueDateSelect(option)}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-end">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">P</div>
                      <span className="font-semibold text-gray-900">PIXINVENT</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Invoice</h2>
                <input
                  type="text"
                  placeholder="Product Name"
                  value={formData.productName}
                  onChange={(e) => handleInputChange("productName", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Bill To Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Bill To</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">House no.</label>
                    <input
                      type="text"
                      placeholder="House no."
                      value={formData.houseNo}
                      onChange={(e) => handleInputChange("houseNo", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Landmark/Street</label>
                    <textarea
                      placeholder="Landmark/Street"
                      value={formData.landmark}
                      onChange={(e) => handleInputChange("landmark", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange("pincode", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Item List */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-2 font-medium text-gray-700">Item</th>
                        <th className="text-left py-2 px-2 font-medium text-gray-700">Cost</th>
                        <th className="text-left py-2 px-2 font-medium text-gray-700">Qty</th>
                        <th className="text-left py-2 px-2 font-medium text-gray-700">Price</th>
                        <th className="text-left py-2 px-2 font-medium text-gray-700"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={item.id} className="border-b border-gray-100">
                          <td className="py-2 px-2">
                            <input
                              type="text"
                              value={item.item}
                              onChange={(e) => handleItemChange(item.id, "item", e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                            />
                            {index === 1 && (
                              <div className="text-xs text-gray-500 mt-1">
                                Discount: {item.discount}% {item.discount}% {item.discount}%
                              </div>
                            )}
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="number"
                              value={item.cost}
                              onChange={(e) => handleItemChange(item.id, "cost", parseFloat(e.target.value) || 0)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="number"
                              value={item.qty}
                              onChange={(e) => handleItemChange(item.id, "qty", parseFloat(e.target.value) || 0)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <div className="px-2 py-1 text-gray-700">
                              ${item.price.toFixed(2)}
                            </div>
                          </td>
                          <td className="py-2 px-2">
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-red-600"
                            >
                              {index === 0 ? <X size={16} /> : <Settings size={16} />}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  onClick={addItem}
                  className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Button
                </button>
              </div>

              {/* Payment Terms and Client Note */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Add payment terms</label>
                    <input
                      type="text"
                      placeholder="Add payment terms"
                      value={formData.paymentTerms}
                      onChange={(e) => handleInputChange("paymentTerms", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Add client note</label>
                    <input
                      type="text"
                      placeholder="Add client note"
                      value={formData.clientNote}
                      onChange={(e) => handleInputChange("clientNote", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Totals Summary */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Subtotal:</span>
                      <span className="text-gray-700">$ {calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Discount:</span>
                      <span className="text-gray-700">-$ {calculateDiscount().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Tax:</span>
                      <span className="text-gray-700">{formData.tax}%</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span className="text-gray-900">Invoice Total:</span>
                      <span className="text-gray-900">$ {calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Paid To Date:</span>
                      <span className="text-gray-700">-$00.00</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span className="text-gray-900">Balance (USD):</span>
                      <span className="text-gray-900">$ {calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
                >
                  Preview
                </button>
              </div>
            </form>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 bg-white border-l border-gray-200 p-6 space-y-6">
            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium flex items-center justify-center gap-2"
              >
                <Share size={16} />
                Send Invoice
              </button>
              <button
                type="button"
                onClick={downloadPDF}
                className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium flex items-center justify-center gap-2"
              >
                <Download size={16} />
                Download Invoice
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium flex items-center justify-center gap-2"
              >
                <Eye size={16} />
                Preview
              </button>
              <button
                type="button"
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium flex items-center justify-center gap-2"
              >
                <Save size={16} />
                Save
              </button>
              <button
                type="button"
                className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium flex items-center justify-center gap-2"
              >
                <DollarSign size={16} />
                Payment
              </button>
            </div>

            {/* Accept Payment Via Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Accept Payment Via</h3>
              <input
                type="text"
                value={formData.paymentMethod}
                onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Payment Terms</span>
                  <button
                    type="button"
                    onClick={() => handleInputChange("paymentTermsEnabled", !formData.paymentTermsEnabled)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      formData.paymentTermsEnabled ? 'bg-teal-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      formData.paymentTermsEnabled ? 'translate-x-5' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Client Notes</span>
                  <button
                    type="button"
                    onClick={() => handleInputChange("clientNotesEnabled", !formData.clientNotesEnabled)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      formData.clientNotesEnabled ? 'bg-teal-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      formData.clientNotesEnabled ? 'translate-x-5' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Payment Stub</span>
                  <button
                    type="button"
                    onClick={() => handleInputChange("paymentStubEnabled", !formData.paymentStubEnabled)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      formData.paymentStubEnabled ? 'bg-teal-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      formData.paymentStubEnabled ? 'translate-x-5' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                             <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-semibold">Invoice Preview</h2>
                 <div className="flex items-center gap-3">
                   <button
                     onClick={downloadPDF}
                     className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium flex items-center gap-2"
                   >
                     <Download size={16} />
                     Download PDF
                   </button>
                   <button
                     onClick={() => setShowPreview(false)}
                     className="text-gray-500 hover:text-gray-700"
                   >
                     <X size={24} />
                   </button>
                 </div>
               </div>
              
                             {/* Preview Content */}
               <div className="bg-white p-8 max-w-4xl mx-auto">
                 {/* Header Section */}
                 <div className="flex justify-between items-start mb-8">
                   {/* Sender Information */}
                   <div className="text-sm text-gray-700">
                     <h2 className="text-xl font-bold text-gray-900 mb-2">Media Drive</h2>
                     <p>Byron Bay NSW AUST</p>
                     <p>0413979054</p>
                     <p>pete@mediadrive.com.au</p>
                     <p>ABN 72600082460</p>
                   </div>
                   
                   {/* Invoice Title */}
                   <div className="text-center">
                     <h1 className="text-3xl font-bold text-blue-600 mb-2">Tax Invoice {formData.invoiceNumber}</h1>
                   </div>
                   
                   {/* Logo */}
                   <div className="text-center">
                     <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-2">MD</div>
                     <div className="text-sm font-semibold text-gray-700">
                       <div>MEDIA</div>
                       <div>DRIVE</div>
                     </div>
                   </div>
                 </div>

                 <hr className="border-gray-300 mb-6" />

                 {/* Invoice Details Section */}
                 <div className="flex justify-between items-start mb-6">
                   {/* Recipient Information */}
                   <div>
                     <h3 className="font-bold text-gray-900 mb-2">INVOICE TO</h3>
                     <p className="text-gray-700">{formData.productName || "Client Name"}</p>
                     <p className="text-gray-700">{formData.houseNo}</p>
                     <p className="text-gray-700">{formData.landmark}</p>
                     <p className="text-gray-700">{formData.city}, {formData.pincode}</p>
                   </div>
                   
                   {/* Date and Payment Information */}
                   <div className="flex gap-8">
                     <div className="text-center">
                       <p className="font-semibold text-gray-700">Date</p>
                       <p className="text-gray-600">{formData.dateIssue || "24/08/2025"}</p>
                     </div>
                     <div className="text-center">
                       <p className="font-semibold text-gray-700">Please Pay</p>
                       <p className="text-gray-600">A${calculateTotal().toFixed(2)}</p>
                     </div>
                     <div className="text-center">
                       <p className="font-semibold text-gray-700">Due Date</p>
                       <p className="text-gray-600">{formData.dateDue || "08/09/2025"}</p>
                     </div>
                   </div>
                 </div>

                 <hr className="border-gray-300 mb-6" />

                 {/* Order Details */}
                 <div className="mb-6">
                   <p className="font-semibold text-gray-900">
                     ORDER DETAILS: {formData.landmark || "75 Carlisle Street, Wardell NSW, Australia"}
                   </p>
                 </div>

                 {/* Service Breakdown Table */}
                 <div className="mb-8">
                   <table className="w-full border-collapse">
                     <thead>
                       <tr className="border-b-2 border-gray-300">
                         <th className="text-left py-3 px-4 font-bold text-gray-900">SERVICE</th>
                         <th className="text-left py-3 px-4 font-bold text-gray-900">DESCRIPTION</th>
                         <th className="text-center py-3 px-4 font-bold text-gray-900">QTY</th>
                         <th className="text-right py-3 px-4 font-bold text-gray-900">RATE</th>
                         <th className="text-right py-3 px-4 font-bold text-gray-900">AMOUNT</th>
                       </tr>
                     </thead>
                     <tbody>
                       {items.map((item, index) => (
                         <tr key={item.id} className="border-b border-gray-200">
                           <td className="py-4 px-4 font-semibold text-gray-900">{item.item || "Essential Package"}</td>
                           <td className="py-4 px-4 text-gray-700">
                             {index === 0 ? (
                               <div className="text-sm">
                                 <p>• Up to 35 Images</p>
                                 <p>• Branded Floor Plan & Site Plan</p>
                                 <p>• Drone Photography</p>
                                 <p>• AI Decluttering $10 (Per Image)</p>
                                 <p>• Additional Images $15</p>
                               </div>
                             ) : (
                               item.item
                             )}
                           </td>
                           <td className="py-4 px-4 text-center text-gray-700">{item.qty || 1}</td>
                           <td className="py-4 px-4 text-right text-gray-700">{item.cost || 550}</td>
                           <td className="py-4 px-4 text-right font-semibold text-gray-900">{(item.price || 550).toFixed(2)}</td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>

                 {/* Totals Section */}
                 <div className="flex justify-between items-start">
                   {/* Payment Instructions */}
                   <div className="w-1/2">
                     <h4 className="font-bold text-gray-900 mb-3">Please make payment to:</h4>
                     <div className="text-sm text-gray-700 space-y-1">
                       <p><strong>Name:</strong> Media Drive Systems</p>
                       <p><strong>BSB:</strong> 012554</p>
                       <p><strong>Account:</strong> 461217149 (Reference Invoice No ONLY)</p>
                     </div>
                   </div>
                   
                   {/* Totals */}
                   <div className="w-1/3 space-y-2">
                     <div className="flex justify-between">
                       <span className="font-semibold text-gray-700">SUBTOTAL:</span>
                       <span className="text-gray-700">A${calculateSubtotal().toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="font-semibold text-gray-700">GST TOTAL:</span>
                       <span className="text-gray-700">{calculateTax().toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="font-semibold text-gray-700">TOTAL:</span>
                       <span className="text-gray-700">A${calculateTotal().toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between border-t-2 border-gray-300 pt-2">
                       <span className="font-bold text-gray-900">TOTAL DUE:</span>
                       <span className="font-bold text-blue-600 underline">A${calculateTotal().toFixed(2)}</span>
                     </div>
                   </div>
                 </div>

                 {/* Notes Section */}
                 {(formData.paymentTerms || formData.clientNote) && (
                   <div className="mt-8 pt-6 border-t border-gray-300">
                     <h3 className="font-bold text-gray-900 mb-3">NOTES</h3>
                     <div className="bg-gray-50 p-4 rounded-lg">
                       {formData.paymentTerms && (
                         <div className="mb-3">
                           <p className="font-semibold text-gray-700">Payment Terms:</p>
                           <p className="text-gray-600 text-sm">{formData.paymentTerms}</p>
                         </div>
                       )}
                       {formData.clientNote && (
                         <div>
                           <p className="font-semibold text-gray-700">Additional Notes:</p>
                           <p className="text-gray-600 text-sm">{formData.clientNote}</p>
                         </div>
                       )}
                     </div>
                   </div>
                 )}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
