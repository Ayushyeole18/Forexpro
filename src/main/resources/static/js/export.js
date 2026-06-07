// =============================================
// FOREXPRO - EXPORT FUNCTIONS
// =============================================

// =============================================
// EXPORT TO CSV
// =============================================
function exportTableToCSV(tableId, filename) {
    const table = document.getElementById(tableId);
    if (!table) {
        showToast('No data to export', 'warning');
        return;
    }

    const rows = table.querySelectorAll('tr');
    const csvData = [];

    rows.forEach(row => {
        const cols = row.querySelectorAll('td, th');
        const rowData = Array.from(cols).map(col => {
            let text = col.textContent.trim();
            text = text.replace(/"/g, '""');
            return `"${text}"`;
        });
        if (rowData.length > 0) {
            csvData.push(rowData.join(','));
        }
    });

    const csvContent = csvData.join('\n');
    const blob = new Blob(
        ['\ufeff' + csvContent],
        { type: 'text/csv;charset=utf-8;' }
    );
    downloadFile(blob, filename || 'forexpro_export.csv');
    showToast('✅ CSV exported successfully!', 'success');
}

// =============================================
// EXPORT TO EXCEL (XLSX)
// =============================================
function exportToExcel(tableId, filename) {
    const table = document.getElementById(tableId);
    if (!table) {
        showToast('No data to export', 'warning');
        return;
    }

    const rows = table.querySelectorAll('tr');
    let excelContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office"
              xmlns:x="urn:schemas-microsoft-com:office:excel"
              xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="UTF-8">
            <!--[if gte mso 9]>
            <xml>
                <x:ExcelWorkbook>
                    <x:ExcelWorksheets>
                        <x:ExcelWorksheet>
                            <x:Name>ForexPro Export</x:Name>
                            <x:WorksheetOptions>
                                <x:DisplayGridlines/>
                            </x:WorksheetOptions>
                        </x:ExcelWorksheet>
                    </x:ExcelWorksheets>
                </x:ExcelWorkbook>
            </xml>
            <![endif]-->
            <style>
                table { border-collapse: collapse; }
                th {
                    background-color: #334155;
                    color: white;
                    font-weight: bold;
                    padding: 8px;
                    border: 1px solid #ccc;
                }
                td {
                    padding: 6px 8px;
                    border: 1px solid #ddd;
                }
                tr:nth-child(even) td {
                    background-color: #f8fafc;
                }
            </style>
        </head>
        <body>
            <h2 style="color:#334155">ForexPro - Conversion History</h2>
            <p style="color:#64748b">
                Exported on: ${new Date().toLocaleString()}
            </p>
            <table>`;

    rows.forEach((row, index) => {
        excelContent += '<tr>';
        const cols = row.querySelectorAll('td, th');
        cols.forEach(col => {
            const tag = index === 0 ? 'th' : 'td';
            excelContent +=
                `<${tag}>${col.textContent.trim()}</${tag}>`;
        });
        excelContent += '</tr>';
    });

    excelContent += '</table></body></html>';

    const blob = new Blob([excelContent], {
        type: 'application/vnd.ms-excel;charset=utf-8;'
    });
    downloadFile(blob, filename || 'forexpro_export.xls');
    showToast('✅ Excel exported successfully!', 'success');
}

// =============================================
// EXPORT RATES TO CSV
// =============================================
function exportRatesToCSV() {
    const rates = window.currentRates;
    if (!rates) {
        showToast('No rates data available', 'warning');
        return;
    }

    let csvContent = '"Currency","Rate vs USD","Date"\n';
    const date = new Date().toLocaleString();

    Object.entries(rates).forEach(([currency, rate]) => {
        csvContent += `"${currency}","${rate}","${date}"\n`;
    });

    const blob = new Blob(
        ['\ufeff' + csvContent],
        { type: 'text/csv;charset=utf-8;' }
    );
    downloadFile(blob, 'forexpro_rates.csv');
    showToast('✅ Rates exported successfully!', 'success');
}

// =============================================
// PRINT / PDF
// =============================================
function exportToPDF(title) {
    const printTitle = title || 'ForexPro Export';
    const originalTitle = document.title;
    document.title = printTitle;

    const style = document.createElement('style');
    style.innerHTML = `
        @media print {
            .navbar, .btn, .theme-toggle,
            .voice-btn, footer { display: none !important; }
            .table-container { box-shadow: none !important; }
            body { background: white !important; color: black !important; }
            .stat-card { border: 1px solid #ddd !important; }
        }
    `;
    document.head.appendChild(style);

    window.print();

    setTimeout(() => {
        document.title = originalTitle;
        document.head.removeChild(style);
    }, 1000);

    showToast('📄 Opening print dialog...', 'info');
}

// =============================================
// DOWNLOAD HELPER
// =============================================
function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
}

// =============================================
// EXPORT CONVERSION HISTORY
// =============================================
function exportHistory(format) {
    const formats = {
        'csv': () => exportTableToCSV(
            'historyTable', 'forexpro_history.csv'
        ),
        'excel': () => exportToExcel(
            'historyTable', 'forexpro_history.xls'
        ),
        'pdf': () => exportToPDF('ForexPro - Conversion History')
    };

    if (formats[format]) {
        formats[format]();
    } else {
        showToast('Invalid export format', 'warning');
    }
}