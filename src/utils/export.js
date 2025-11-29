/**
 * Export utilities for analytics data
 */

/**
 * Export data as CSV
 */
export function exportToCSV(data, filename = 'export.csv') {
  if (!data || data.length === 0) {
    console.error('No data to export')
    return
  }

  // Get headers from first object
  const headers = Object.keys(data[0])
  
  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        // Handle values with commas or quotes
        if (value === null || value === undefined) return ''
        const stringValue = String(value)
        if (stringValue.includes(',') || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      }).join(',')
    )
  ].join('\n')

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

/**
 * Export tips data as CSV
 */
export function exportTipsToCSV(tips, eventName = 'tips') {
  const csvData = tips.map(tip => ({
    Date: new Date(tip.created_at).toLocaleDateString(),
    Time: new Date(tip.created_at).toLocaleTimeString(),
    Amount: `$${parseFloat(tip.amount).toFixed(2)}`,
    Tipper: tip.tipper_name || 'Anonymous',
    Message: tip.message || '',
    Status: tip.status || 'completed',
  }))

  const filename = `${eventName}_tips_${new Date().toISOString().split('T')[0]}.csv`
  exportToCSV(csvData, filename)
}

/**
 * Export analytics summary as CSV
 */
export function exportAnalyticsToCSV(analytics, eventName = 'analytics') {
  const csvData = [
    {
      Metric: 'Total Tips',
      Value: `$${analytics.totalAmount?.toFixed(2) || '0.00'}`,
    },
    {
      Metric: 'Tip Count',
      Value: analytics.tipCount || 0,
    },
    {
      Metric: 'Average Tip',
      Value: `$${analytics.averageTip?.toFixed(2) || '0.00'}`,
    },
    {
      Metric: 'Peak Hour',
      Value: analytics.peakHour || 'N/A',
    },
    {
      Metric: 'Time Range',
      Value: analytics.timeRange || 'N/A',
    },
  ]

  const filename = `${eventName}_analytics_${new Date().toISOString().split('T')[0]}.csv`
  exportToCSV(csvData, filename)
}

/**
 * Generate PDF report (using browser print functionality)
 */
export function exportToPDF(title = 'Report') {
  window.print()
}

/**
 * Generate PDF content for download (simplified version)
 */
export function generatePDFContent(analytics, tips, eventName) {
  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${eventName} - Analytics Report</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #667eea; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #667eea; color: white; }
        .summary { background: #f7fafc; padding: 15px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <h1>${eventName} - Analytics Report</h1>
      <div class="summary">
        <h2>Summary</h2>
        <p><strong>Total Tips:</strong> $${analytics.totalAmount?.toFixed(2) || '0.00'}</p>
        <p><strong>Tip Count:</strong> ${analytics.tipCount || 0}</p>
        <p><strong>Average Tip:</strong> $${analytics.averageTip?.toFixed(2) || '0.00'}</p>
        <p><strong>Peak Hour:</strong> ${analytics.peakHour || 'N/A'}</p>
      </div>
      <h2>Tips Details</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Tipper</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          ${tips.map(tip => `
            <tr>
              <td>${new Date(tip.created_at).toLocaleString()}</td>
              <td>$${parseFloat(tip.amount).toFixed(2)}</td>
              <td>${tip.tipper_name || 'Anonymous'}</td>
              <td>${tip.message || ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <p style="margin-top: 30px; color: #718096; font-size: 12px;">
        Generated on ${new Date().toLocaleString()}
      </p>
    </body>
    </html>
  `

  return content
}

/**
 * Download PDF report
 */
export function downloadPDFReport(analytics, tips, eventName) {
  const content = generatePDFContent(analytics, tips, eventName)
  const blob = new Blob([content], { type: 'text/html' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${eventName}_report_${new Date().toISOString().split('T')[0]}.html`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

