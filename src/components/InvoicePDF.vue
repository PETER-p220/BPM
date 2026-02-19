<template>
  <div class="invoice-pdf" ref="pdfContent">
    <div class="page">

      <!-- Decorative left spine -->
      <div class="spine">
        <div class="spine-text">INVOICE</div>
      </div>

      <!-- Main content area -->
      <div class="main">

        <!-- Header -->
        <div class="header">
          <div class="header-left">
            <div class="logo-mark">
              <img src="/images/tera.jpeg" alt="TERA Logo" class="company-logo-img" />
            </div>
            <div class="company-block">
              <div class="company-name">{{ company.name }}</div>
              <div class="company-tagline">{{ company.address }}</div>
              <div class="company-tagline">{{ company.contacts }}</div>
            </div>
          </div>
          <div class="header-right">
            <div class="invoice-num-label">Document No.</div>
            <div class="invoice-num">#{{ invoice.invoice_number }}</div>
            <span
              class="status-chip"
              :style="{ '--chip-bg': statusBadge.bg, '--chip-fg': statusBadge.fg }"
            >{{ statusBadge.text }}</span>
          </div>
        </div>

        <!-- Date row -->
        <div class="meta-strip">
          <div class="meta-item">
            <div class="meta-label">Issued</div>
            <div class="meta-value">{{ invoice.invoice_date }}</div>
          </div>
          <div class="meta-divider"></div>
          <div class="meta-item">
            <div class="meta-label">Due Date</div>
            <div class="meta-value due">{{ invoice.due_date }}</div>
          </div>
          <div class="meta-divider"></div>
          <div class="meta-item">
            <div class="meta-label">Tax Rate</div>
            <div class="meta-value">{{ invoice.tax_rate }}%</div>
          </div>
          <div class="meta-divider"></div>
          <div class="meta-item">
            <div class="meta-label">Currency</div>
            <div class="meta-value">TZS</div>
          </div>
        </div>

        <!-- Billing & Tax grid -->
        <div class="info-section">
          <div class="info-card bill-card">
            <div class="card-eyebrow">Billed To</div>
            <div class="client-name">{{ invoice.client_name }}</div>
            <table class="detail-table">
              <tr v-for="info in clientInfo" :key="info.label">
                <td class="d-lbl">{{ info.label }}</td>
                <td class="d-val">{{ info.value }}</td>
              </tr>
            </table>
          </div>

          <div class="info-card">
            <div class="card-eyebrow">Tax Details</div>
            <table class="detail-table" style="margin-top: 20px;">
              <tr v-for="info in taxInfo" :key="info.label">
                <td class="d-lbl">{{ info.label }}</td>
                <td class="d-val">{{ info.value }}</td>
              </tr>
            </table>
          </div>

          <div class="info-card amount-card">
            <div class="card-eyebrow">Total Due</div>
            <div class="total-amount">{{ formatCurrency(invoice.total_amount) }}</div>
            <div class="total-currency">Tanzanian Shilling</div>
            <div class="due-badge">Payment Pending</div>
          </div>
        </div>

        <!-- Line items -->
        <div class="section-header">
          <span class="section-title">Services & Deliverables</span>
          <div class="section-rule"></div>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th class="th-wide">Description</th>
              <th class="th-center">Qty</th>
              <th class="th-right">Unit Price</th>
              <th class="th-right">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr class="item-row">
              <td class="td-desc">
                <div class="item-name">{{ invoice.item_description }}</div>
                <div class="item-meta">Service period: {{ invoice.period_months }} month{{ invoice.period_months !== 1 ? 's' : '' }}</div>
              </td>
              <td class="td-center">
                <span class="qty-badge">{{ invoice.number_of_cars }}</span>
              </td>
              <td class="td-right">{{ formatCurrency(invoice.unit_price) }}</td>
              <td class="td-right td-total">{{ formatCurrency(invoice.total_amount) }}</td>
            </tr>
          </tbody> 
        </table>
 
        <!-- Totals + Notes -->
        <div class="bottom-section">
          <div class="notes-block">
            <div class="card-eyebrow">Notes</div>
            <p class="notes-text">{{ notes || 'No additional notes provided for this invoice.' }}</p>
            <div class="thank-you">Thank you for your continued business.</div>
          </div>

          <div class="totals-block">
            <div class="totals-row">
              <span class="tr-label">Subtotal</span>
              <span class="tr-value">{{ formatCurrency(invoice.gross_value) }}</span>
            </div>
            <div class="totals-row">
              <span class="tr-label">VAT ({{ invoice.tax_rate }}%)</span>
              <span class="tr-value">{{ formatCurrency(invoice.tax_amount) }}</span>
            </div>
            <div class="totals-row total-final">
              <span class="tr-label">Amount Due</span>
              <span class="tr-value">{{ formatCurrency(invoice.total_amount) }}</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <div class="footer-left">
            <span class="footer-dot"></span>
            {{ company.name }} &mdash; Confidential Document
          </div>
          <div class="footer-right">Generated {{ new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'long', year:'numeric' }) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  invoiceData: {
    type: Object,
    required: true
  }
})

const pdfContent = ref(null)
const invoice   = ref(props.invoiceData.invoice)
const company   = ref(props.invoiceData.company)
const statusBadge = ref(props.invoiceData.status_badge)
const clientInfo  = ref(props.invoiceData.client_info)
const taxInfo     = ref(props.invoiceData.tax_info)
const notes       = ref(props.invoiceData.notes)

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
    minimumFractionDigits: 2
  }).format(amount || 0)

const generatePDF = async () => {
  if (!pdfContent.value) return
  
  // Debug: Log invoice data
  console.log('Invoice data:', invoice.value)
  console.log('Number of cars:', invoice.value.number_of_cars)
  
  try {
    // Import html2pdf.js with proper error handling
    let html2pdf
    try {
      html2pdf = (await import('html2pdf.js')).default
    } catch (importError) {
      console.error('Failed to import html2pdf.js:', importError)
      throw new Error('PDF library not available')
    }
    
    // Configure PDF options for direct download
    const opt = {
      margin: 0,
      filename: props.invoiceData.filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff'
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      }
    }
    
    // Generate PDF and force download
    console.log('Generating PDF...')
    await html2pdf()
      .set(opt)
      .from(pdfContent.value)
      .save()
    
    console.log('PDF generated successfully')
    
  } catch (error) {
    console.error('PDF generation error:', error)
    
    // Fallback: create download link for HTML
    const link = document.createElement('a')
    link.download = props.invoiceData.filename.replace('.pdf', '.html')
    link.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${invoice.value.invoice_number}</title>
        <meta charset="utf-8">
        <style>
          ${getPDFStyles()}
        </style>
      </head>
      <body>
        ${pdfContent.value.innerHTML}
      </body>
      </html>
    `)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    alert('PDF generation failed. Downloaded HTML file instead.')
  }
}

const getPDFStyles = () => `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink:    #0d1117;
    --smoke:  #f5f4f0;
    --linen:  #faf9f7;
    --rust:   #c0392b;
    --gold:   #b8860b;
    --muted:  #6b7280;
    --border: #e5e0d8;
    --spine-w: 42px;
    --radius: 10px;
  }

  body {
    font-family: 'DM Sans', 'Helvetica Neue', sans-serif;
    font-size: 12px;
    color: var(--ink);
    background: #fff;
    line-height: 1.6;
  }

  /* ─── PAGE ─── */
  .page {
    width: 210mm;
    min-height: 297mm;
    background: #fff;
    display: flex;
    position: relative;
  }

  /* ─── SPINE ─── */
  .spine {
    width: var(--spine-w);
    min-height: 297mm;
    background: var(--ink);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    position: relative;
  }
  .spine::after {
    content: '';
    position: absolute;
    right: 0; top: 0; bottom: 0;
    width: 3px;
    background: var(--rust);
  }
  .spine-text {
    color: rgba(255,255,255,0.18);
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: 10px;
    letter-spacing: 6px;
    text-transform: uppercase;
    writing-mode: vertical-rl;
    transform: rotate(180deg);
  }

  /* ─── MAIN ─── */
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0;
    overflow: hidden;
  }

  /* ─── HEADER ─── */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 36px 42px 28px;
    border-bottom: 1px solid var(--border);
  }
  .header-left { display: flex; align-items: flex-start; gap: 16px; }
  .logo-mark {
    width: 48px; height: 48px;
    background: var(--ink);
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .logo-mark span {
    color: #fff;
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: 22px;
    line-height: 1;
  }
  .company-name {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: 18px;
    color: var(--ink);
    letter-spacing: 0.5px;
    margin-bottom: 3px;
  }
  .company-tagline { font-size: 10px; color: var(--muted); line-height: 1.6; }

  .header-right { text-align: right; }
  .invoice-num-label {
    font-size: 9px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 2px;
    color: var(--muted); margin-bottom: 4px;
  }
  .invoice-num {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: 30px; color: var(--ink); line-height: 1;
    margin-bottom: 10px;
  }
  .status-chip {
    display: inline-block;
    background: var(--chip-bg, #e5e7eb);
    color: var(--chip-fg, #374151);
    padding: 4px 14px;
    border-radius: 100px;
    font-size: 9px; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase;
  }

  /* ─── META STRIP ─── */
  .meta-strip {
    display: flex;
    background: var(--smoke);
    border-bottom: 1px solid var(--border);
  }
  .meta-item { padding: 14px 22px; flex: 1; }
  .meta-divider { width: 1px; background: var(--border); }
  .meta-label {
    font-size: 8px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 1.5px;
    color: var(--muted); margin-bottom: 4px;
  }
  .meta-value { font-size: 12px; font-weight: 600; color: var(--ink); }
  .meta-value.due { color: var(--rust); }

  /* ─── INFO SECTION ─── */
  .info-section {
    display: flex; gap: 0;
    border-bottom: 1px solid var(--border);
  }
  .info-card {
    flex: 1;
    padding: 26px 28px;
    border-right: 1px solid var(--border);
  }
  .info-card:last-child { border-right: none; }
  .card-eyebrow {
    font-size: 8px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 2px;
    color: var(--rust);
    padding-bottom: 8px;
    border-bottom: 1.5px solid var(--rust);
    margin-bottom: 14px;
    display: inline-block;
  }
  .client-name {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: 15px; color: var(--ink);
    margin-bottom: 12px;
  }
  .detail-table { width: 100%; border-collapse: collapse; }
  .detail-table td { padding: 3px 0; font-size: 10.5px; }
  .d-lbl { color: var(--muted); width: 75px; font-weight: 500; }
  .d-val { color: var(--ink); font-weight: 500; }

  /* Amount card */
  .amount-card { background: var(--ink); }
  .amount-card .card-eyebrow { color: rgba(255,255,255,0.45); border-color: rgba(255,255,255,0.2); }
  .total-amount {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: 22px; color: #fff;
    margin: 12px 0 4px;
    line-height: 1.15;
  }
  .total-currency { font-size: 10px; color: rgba(255,255,255,0.5); margin-bottom: 18px; }
  .due-badge {
    display: inline-block;
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 100px;
    padding: 4px 12px;
    font-size: 9px; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase;
    color: rgba(255,255,255,0.7);
  }

  /* ─── SECTION HEADER ─── */
  .section-header {
    display: flex; align-items: center; gap: 14px;
    padding: 22px 42px 0;
  }
  .section-title {
    font-size: 8.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 2px;
    color: var(--muted); white-space: nowrap;
  }
  .section-rule { flex: 1; height: 1px; background: var(--border); }

  /* ─── ITEMS TABLE ─── */
  .items-table {
    width: calc(100% - 84px);
    margin: 14px 42px 0;
    border-collapse: collapse;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
  }
  .items-table thead tr {
    background: var(--smoke);
  }
  .items-table thead th {
    padding: 11px 16px;
    font-size: 8.5px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 1.5px;
    color: var(--muted); border-bottom: 1px solid var(--border);
  }
  .th-wide { text-align: left; }
  .th-center { text-align: center; width: 60px; }
  .th-right { text-align: right; width: 110px; }

  .item-row td { padding: 18px 16px; border-bottom: 1px solid var(--border); }
  .item-row:last-child td { border-bottom: none; }
  .td-desc {}
  .item-name { font-size: 12px; font-weight: 600; color: var(--ink); margin-bottom: 4px; }
  .item-meta { font-size: 10px; color: var(--muted); }
  .td-center { text-align: center; }
  .qty-badge {
    display: inline-block;
    background: var(--smoke);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 3px 10px;
    font-size: 11px; font-weight: 600;
    color: var(--ink);
  }
  .td-right { text-align: right; font-size: 11.5px; color: var(--ink); }
  .td-total { font-weight: 700; color: var(--ink); }

  /* ─── BOTTOM SECTION ─── */
  .bottom-section {
    display: flex; gap: 0;
    margin: 24px 42px 0;
  }
  .notes-block {
    flex: 1.2;
    padding-right: 32px;
    border-right: 1px solid var(--border);
  }
  .notes-block .card-eyebrow { margin-bottom: 10px; }
  .notes-text {
    font-size: 10.5px; color: var(--muted);
    line-height: 1.7; margin-bottom: 20px;
  }
  .thank-you {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: 13px; color: var(--ink);
    font-style: italic;
  }

  .totals-block {
    flex: 1;
    padding-left: 32px;
    display: flex; flex-direction: column; justify-content: flex-end;
  }
  .totals-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 9px 0;
    border-bottom: 1px solid var(--border);
  }
  .totals-row:last-child { border-bottom: none; }
  .tr-label { font-size: 11px; color: var(--muted); font-weight: 500; }
  .tr-value { font-size: 12px; font-weight: 600; color: var(--ink); }

  .total-final {
    margin-top: 4px;
    padding: 14px 18px;
    background: var(--ink);
    border-radius: var(--radius);
  }
  .total-final .tr-label {
    font-size: 11px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 1px;
    color: rgba(255,255,255,0.65);
  }
  .total-final .tr-value {
    font-family: 'DM Serif Display', Georgia, serif;
    font-size: 16px; color: #fff;
  }

  /* ─── FOOTER ─── */
  .footer {
    display: flex; justify-content: space-between; align-items: center;
    padding: 18px 42px;
    margin-top: auto;
    border-top: 1px solid var(--border);
    background: var(--smoke);
    font-size: 9px; color: var(--muted);
    letter-spacing: 0.5px;
  }
  .footer-left { display: flex; align-items: center; gap: 8px; }
  .footer-dot {
    display: inline-block;
    width: 6px; height: 6px;
    background: var(--rust);
    border-radius: 50%;
  }
  }


defineExpose({ generatePDF })
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --ink:    #0d1117;
  --smoke:  #f5f4f0;
  --linen:  #faf9f7;
  --rust:   #c0392b;
  --gold:   #b8860b;
  --muted:  #6b7280;
  --border: #e5e0d8;
  --spine-w: 42px;
  --radius: 10px;
}

.invoice-pdf {
  font-family: 'DM Sans', 'Helvetica Neue', sans-serif;
  font-size: 12px;
  color: var(--ink);
  background: #e8e4dd;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

/* ─── PAGE ─── */
.page {
  width: 794px;
  min-height: 1123px;
  background: #fff;
  box-shadow: 0 20px 80px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.08);
  display: flex;
  position: relative;
  border-radius: 2px;
  overflow: hidden;
}

/* ─── SPINE ─── */
.spine {
  width: var(--spine-w);
  min-height: 100%;
  background: var(--ink);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
}
.spine::after {
  content: '';
  position: absolute;
  right: 0; top: 0; bottom: 0;
  width: 3px;
  background: var(--rust);
}
.spine-text {
  color: rgba(255,255,255,0.14);
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: 9px;
  letter-spacing: 6px;
  text-transform: uppercase;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  user-select: none;
}

/* ─── MAIN ─── */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ─── HEADER ─── */
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 36px 42px 28px;
  border-bottom: 1px solid var(--border);
}
.header-left { display: flex; align-items: flex-start; gap: 16px; }
.logo-mark {
  width: 80px; height: 80px;
  background: var(--ink);
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.logo-mark span {
  color: #fff;
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: 22px; line-height: 1;
}
.company-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 4px;
}
.company-name {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: 18px; color: var(--ink);
  letter-spacing: 0.5px; margin-bottom: 3px;
}
.company-tagline { font-size: 10px; color: var(--muted); line-height: 1.6; }

.header-right { text-align: right; }
.invoice-num-label {
  font-size: 9px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 2px;
  color: var(--muted); margin-bottom: 4px;
}
.invoice-num {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: 30px; color: var(--ink); line-height: 1;
  margin-bottom: 10px;
}
.status-chip {
  display: inline-block;
  background: v-bind('statusBadge.bg');
  color: v-bind('statusBadge.fg');
  padding: 4px 14px;
  border-radius: 100px;
  font-size: 9px; font-weight: 700;
  letter-spacing: 1.5px; text-transform: uppercase;
}

/* ─── META STRIP ─── */
.meta-strip {
  display: flex;
  background: var(--smoke);
  border-bottom: 1px solid var(--border);
}
.meta-item { padding: 14px 22px; flex: 1; }
.meta-divider { width: 1px; background: var(--border); }
.meta-label {
  font-size: 8px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 1.5px;
  color: var(--muted); margin-bottom: 4px;
}
.meta-value { font-size: 12px; font-weight: 600; color: var(--ink); }
.meta-value.due { color: var(--rust); }

/* ─── INFO SECTION ─── */
.info-section {
  display: flex;
  border-bottom: 1px solid var(--border);
}
.info-card {
  flex: 1;
  padding: 26px 28px;
  border-right: 1px solid var(--border);
}
.info-card:last-child { border-right: none; }

.card-eyebrow {
  font-size: 8px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 2px;
  color: var(--rust);
  padding-bottom: 8px;
  border-bottom: 1.5px solid var(--rust);
  margin-bottom: 14px;
  display: inline-block;
}
.client-name {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: 15px; color: var(--ink); margin-bottom: 12px;
}
.detail-table { width: 100%; border-collapse: collapse; }
.detail-table td { padding: 3px 0; font-size: 10.5px; }
.d-lbl { color: var(--muted); width: 75px; font-weight: 500; }
.d-val { color: var(--ink); font-weight: 500; }

/* Amount card */
.amount-card { background: var(--ink); }
.amount-card .card-eyebrow {
  color: rgba(255,255,255,0.45);
  border-color: rgba(255,255,255,0.2);
}
.total-amount {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: 22px; color: #fff; margin: 12px 0 4px; line-height: 1.15;
}
.total-currency { font-size: 10px; color: rgba(255,255,255,0.5); margin-bottom: 18px; }
.due-badge {
  display: inline-block;
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 100px;
  padding: 4px 12px;
  font-size: 9px; font-weight: 700;
  letter-spacing: 1.5px; text-transform: uppercase;
  color: rgba(255,255,255,0.7);
}

/* ─── SECTION HEADER ─── */
.section-header {
  display: flex; align-items: center; gap: 14px;
  padding: 22px 42px 0;
}
.section-title {
  font-size: 8.5px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 2px;
  color: var(--muted); white-space: nowrap;
}
.section-rule { flex: 1; height: 1px; background: var(--border); }

/* ─── ITEMS TABLE ─── */
.items-table {
  width: calc(100% - 84px);
  margin: 14px 42px 0;
  border-collapse: collapse;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}
.items-table thead tr { background: var(--smoke); }
.items-table thead th {
  padding: 11px 16px;
  font-size: 8.5px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 1.5px;
  color: var(--muted); border-bottom: 1px solid var(--border);
}
.th-wide { text-align: left; }
.th-center { text-align: center; width: 60px; }
.th-right { text-align: right; width: 110px; }

.item-row td { padding: 18px 16px; border-bottom: 1px solid var(--border); }
.item-row:last-child td { border-bottom: none; }
.item-name { font-size: 12px; font-weight: 600; color: var(--ink); margin-bottom: 4px; }
.item-meta { font-size: 10px; color: var(--muted); }
.td-center { text-align: center; }
.qty-badge {
  display: inline-block;
  background: var(--smoke);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 3px 10px;
  font-size: 11px; font-weight: 600;
  color: var(--ink);
}
.td-right { text-align: right; font-size: 11.5px; color: var(--ink); }
.td-total { font-weight: 700; }

/* ─── BOTTOM SECTION ─── */
.bottom-section {
  display: flex;
  margin: 24px 42px 0;
}
.notes-block {
  flex: 1.2;
  padding-right: 32px;
  border-right: 1px solid var(--border);
}
.notes-block .card-eyebrow { margin-bottom: 10px; }
.notes-text {
  font-size: 10.5px; color: var(--muted);
  line-height: 1.7; margin-bottom: 20px;
}
.thank-you {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: 13px; color: var(--ink);
  font-style: italic;
}

.totals-block {
  flex: 1;
  padding-left: 32px;
  display: flex; flex-direction: column; justify-content: flex-end;
}
.totals-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 9px 0;
  border-bottom: 1px solid var(--border);
}
.totals-row:last-child { border-bottom: none; }
.tr-label { font-size: 11px; color: var(--muted); font-weight: 500; }
.tr-value { font-size: 12px; font-weight: 600; color: var(--ink); }

.total-final {
  margin-top: 4px;
  padding: 14px 18px;
  background: var(--ink);
  border-radius: var(--radius);
}
.total-final .tr-label {
  font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 1px;
  color: rgba(255,255,255,0.65);
}
.total-final .tr-value {
  font-family: 'DM Serif Display', Georgia, serif;
  font-size: 16px; color: #fff;
}

/* ─── FOOTER ─── */
.footer {
  display: flex; justify-content: space-between; align-items: center;
  padding: 18px 42px;
  margin-top: auto;
  border-top: 1px solid var(--border);
  background: var(--smoke);
  font-size: 9px; color: var(--muted);
  letter-spacing: 0.5px;
}
.footer-left { display: flex; align-items: center; gap: 8px; }
.footer-dot {
  display: inline-block;
  width: 6px; height: 6px;
  background: var(--rust);
  border-radius: 50%;
}
</style>