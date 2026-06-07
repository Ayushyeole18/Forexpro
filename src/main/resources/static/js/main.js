// =============================================
// FOREXPRO - MAIN JAVASCRIPT
// =============================================

const API_BASE = '/api';

// =============================================
// THEME MANAGEMENT
// =============================================
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    if (icon) {
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

// =============================================
// CURRENCY DATA
// =============================================
const CURRENCIES = {
    'USD': { name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
    'EUR': { name: 'Euro', symbol: '€', flag: '🇪🇺' },
    'GBP': { name: 'British Pound', symbol: '£', flag: '🇬🇧' },
    'JPY': { name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
    'INR': { name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
    'AUD': { name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
    'CAD': { name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
    'CHF': { name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭' },
    'CNY': { name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
    'SGD': { name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
    'AED': { name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
    'SAR': { name: 'Saudi Riyal', symbol: '﷼', flag: '🇸🇦' },
    'MYR': { name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
    'HKD': { name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
    'KRW': { name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
    'BRL': { name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
    'ZAR': { name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
    'MXN': { name: 'Mexican Peso', symbol: '$', flag: '🇲🇽' },
    'NZD': { name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
    'THB': { name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' }
};

// =============================================
// CONVERTER FUNCTIONS
// =============================================
async function convertCurrency() {
    const amount = document.getElementById('amount')?.value;
    const fromCurrency = document.getElementById('fromCurrency')?.value;
    const toCurrency = document.getElementById('toCurrency')?.value;

    if (!amount || amount <= 0) {
        showToast('Please enter a valid amount', 'warning');
        return;
    }

    if (fromCurrency === toCurrency) {
        showToast('Please select different currencies', 'warning');
        return;
    }

    showLoading(true);

    try {
        const response = await fetch(`${API_BASE}/convert`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fromCurrency: fromCurrency,
                toCurrency: toCurrency,
                amount: parseFloat(amount)
            })
        });

        const data = await response.json();

        if (data.status === 'success') {
            displayResult(data);
            updateRateDisplay(data);
        } else {
            showToast('Conversion failed: ' + data.message, 'danger');
        }
    } catch (error) {
        showToast('Error connecting to server', 'danger');
        console.error('Conversion error:', error);
    } finally {
        showLoading(false);
    }
}

function displayResult(data) {
    const resultBox = document.getElementById('resultBox');
    const resultAmount = document.getElementById('resultAmount');
    const resultRate = document.getElementById('resultRate');
    const fromSymbol = CURRENCIES[data.fromCurrency]?.symbol || '';
    const toSymbol = CURRENCIES[data.toCurrency]?.symbol || '';
    const fromFlag = CURRENCIES[data.fromCurrency]?.flag || '';
    const toFlag = CURRENCIES[data.toCurrency]?.flag || '';

    if (resultAmount) {
        resultAmount.innerHTML = `
            ${toFlag} ${toSymbol}${formatNumber(data.convertedAmount)}
        `;
    }

    if (resultRate) {
        resultRate.innerHTML = `
            ${fromFlag} 1 ${data.fromCurrency} = 
            ${toFlag} ${data.exchangeRate} ${data.toCurrency}
        `;
    }

    if (resultBox) {
        resultBox.style.display = 'block';
        resultBox.style.animation = 'fadeIn 0.5s ease';
    }
}

function updateRateDisplay(data) {
    const rateDisplay = document.getElementById('liveRate');
    if (rateDisplay) {
        rateDisplay.textContent =
            `1 ${data.fromCurrency} = ${data.exchangeRate} ${data.toCurrency}`;
    }
}

function swapCurrencies() {
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');

    if (fromSelect && toSelect) {
        const temp = fromSelect.value;
        fromSelect.value = toSelect.value;
        toSelect.value = temp;

        const swapBtn = document.querySelector('.swap-btn');
        if (swapBtn) {
            swapBtn.style.transform = 'rotate(180deg)';
            setTimeout(() => {
                swapBtn.style.transform = 'rotate(0deg)';
            }, 300);
        }

        const amount = document.getElementById('amount')?.value;
        if (amount && amount > 0) convertCurrency();
    }
}

// =============================================
// LIVE RATES
// =============================================
async function loadLiveRates() {
    try {
        const response = await fetch(`${API_BASE}/rates/USD`);
        const data = await response.json();
        updateRateTicker(data);
        updateRateTable(data);
    } catch (error) {
        console.error('Error loading rates:', error);
    }
}

function updateRateTicker(rates) {
    const ticker = document.getElementById('tickerContent');
    if (!ticker) return;

    const mainPairs = [
        'EUR', 'GBP', 'JPY', 'INR',
        'AUD', 'CAD', 'CHF', 'CNY',
        'SGD', 'AED', 'KRW', 'MXN'
    ];
    let tickerHtml = '';

    mainPairs.forEach(currency => {
        if (rates[currency]) {
            const flag = CURRENCIES[currency]?.flag || '🏳️';
            const rate = parseFloat(rates[currency]).toFixed(4);
            const change = (Math.random() * 0.5 - 0.25).toFixed(2);
            const isUp = parseFloat(change) > 0;
            const arrow = isUp ? '▲' : '▼';
            const color = isUp ? '#4ade80' : '#f87171';

            tickerHtml += `${flag} <strong>USD/${currency}</strong>: ${rate} `;
            tickerHtml += `<span style="color:${color}">${arrow} ${Math.abs(change)}%</span>`;
            tickerHtml += `&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;`;
        }
    });

    ticker.innerHTML = tickerHtml;
}

function updateRateTable(rates) {
    const tbody = document.getElementById('ratesTableBody');
    if (!tbody) return;

    const mainPairs = ['EUR', 'GBP', 'JPY', 'INR', 'AUD', 'CAD', 'CHF', 'CNY',
        'SGD', 'AED', 'SAR', 'MYR', 'HKD', 'KRW', 'BRL'];
    tbody.innerHTML = '';

    mainPairs.forEach(currency => {
        if (rates[currency]) {
            const flag = CURRENCIES[currency]?.flag || '';
            const name = CURRENCIES[currency]?.name || currency;
            const change = (Math.random() * 2 - 1).toFixed(2);
            const isUp = parseFloat(change) > 0;

            const row = `
                <tr>
                    <td>
                        <span class="me-2">${flag}</span>
                        <strong>${currency}</strong>
                    </td>
                    <td>${name}</td>
                    <td><strong>${rates[currency].toFixed(4)}</strong></td>
                    <td class="text-${isUp ? 'success' : 'danger'}">
                        ${isUp ? '▲' : '▼'} ${Math.abs(change)}%
                    </td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary"
                            onclick="quickConvert('USD', '${currency}')">
                            Convert
                        </button>
                    </td>
                </tr>`;
            tbody.innerHTML += row;
        }
    });
}

function quickConvert(from, to) {
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');
    if (fromSelect) fromSelect.value = from;
    if (toSelect) toSelect.value = to;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =============================================
// AUTO REFRESH
// =============================================
let autoRefreshInterval = null;

function startAutoRefresh() {
    const toggle = document.getElementById('autoRefresh');
    if (toggle?.checked) {
        autoRefreshInterval = setInterval(() => {
            loadLiveRates();
            showToast('Rates refreshed', 'success');
        }, 60000);
    } else {
        if (autoRefreshInterval) {
            clearInterval(autoRefreshInterval);
        }
    }
}

// =============================================
// FAVORITES
// =============================================
async function toggleFavorite(from, to, btn) {
    const isFav = btn.classList.contains('active');
    const method = isFav ? 'DELETE' : 'POST';
    const url = `${API_BASE}/favorites/${isFav ? 'remove' : 'add'}` +
        `?from=${from}&to=${to}`;

    try {
        const response = await fetch(url, { method });
        const data = await response.json();

        if (data.status === 'success') {
            btn.classList.toggle('active');
            showToast(data.message, 'success');
        } else {
            showToast(data.message, 'warning');
        }
    } catch (error) {
        showToast('Please login to use favorites', 'warning');
    }
}

// =============================================
// VOICE COMMANDS
// =============================================
let recognition = null;

function initVoiceCommand() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';

        recognition.onresult = function(event) {
            const transcript =
                event.results[0][0].transcript.toLowerCase();
            processVoiceCommand(transcript);
        };

        recognition.onend = function() {
            const voiceBtn = document.getElementById('voiceBtn');
            if (voiceBtn) voiceBtn.classList.remove('listening');
        };
    }
}

function toggleVoice() {
    const voiceBtn = document.getElementById('voiceBtn');
    if (!recognition) {
        showToast('Voice not supported in this browser', 'warning');
        return;
    }

    if (voiceBtn?.classList.contains('listening')) {
        recognition.stop();
        voiceBtn.classList.remove('listening');
    } else {
        recognition.start();
        voiceBtn?.classList.add('listening');
        showToast('Listening... Say "convert 100 USD to EUR"', 'info');
    }
}

function processVoiceCommand(transcript) {
    showToast(`Heard: "${transcript}"`, 'info');

    const pattern =
        /convert\s+(\d+(?:\.\d+)?)\s+([a-z]+)\s+to\s+([a-z]+)/i;
    const match = transcript.match(pattern);

    if (match) {
        const amount = match[1];
        const from = match[2].toUpperCase();
        const to = match[3].toUpperCase();

        const amountInput = document.getElementById('amount');
        const fromSelect = document.getElementById('fromCurrency');
        const toSelect = document.getElementById('toCurrency');

        if (amountInput) amountInput.value = amount;
        if (fromSelect) fromSelect.value = from;
        if (toSelect) toSelect.value = to;

        convertCurrency();
    } else {
        showToast('Try: "convert 100 USD to EUR"', 'warning');
    }
}

// =============================================
// EXPORT FUNCTIONS
// =============================================
function exportCSV() {
    const table = document.getElementById('historyTable');
    if (!table) return;

    let csv = [];
    const rows = table.querySelectorAll('tr');

    rows.forEach(row => {
        const cols = row.querySelectorAll('td, th');
        const rowData = Array.from(cols).map(col =>
            `"${col.textContent.trim()}"`);
        csv.push(rowData.join(','));
    });

    const blob = new Blob([csv.join('\n')],
        { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'forexpro_history.csv';
    link.click();

    showToast('CSV exported successfully!', 'success');
}

function exportPDF() {
    window.print();
    showToast('Opening print dialog for PDF', 'info');
}

// =============================================
// UTILITY FUNCTIONS
// =============================================
function formatNumber(num) {
    if (!num) return '0.00';
    const n = parseFloat(num);
    if (n >= 1000000) return (n/1000000).toFixed(2) + 'M';
    if (n >= 1000) return n.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    return n.toFixed(4);
}

function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    const convertBtn = document.getElementById('convertBtn');
    if (spinner) spinner.style.display = show ? 'block' : 'none';
    if (convertBtn) convertBtn.disabled = show;
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const icons = {
        'success': '✅',
        'danger': '❌',
        'warning': '⚠️',
        'info': 'ℹ️'
    };

    const toast = document.createElement('div');
    toast.className =
        `alert alert-${type} alert-dismissible fade show mb-2`;
    toast.innerHTML = `
        ${icons[type] || ''} ${message}
        <button type="button" class="btn-close"
            data-bs-dismiss="alert"></button>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

// =============================================
// INITIALIZE
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initVoiceCommand();
    loadLiveRates();

    const amountInput = document.getElementById('amount');
    if (amountInput) {
        amountInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') convertCurrency();
        });
    }

    setInterval(loadLiveRates, 300000);
});
// =============================================
// SERVICE WORKER REGISTRATION
// =============================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('SW registered:', reg.scope))
            .catch(err => console.log('SW failed:', err));
    });
}

// =============================================
// OFFLINE DETECTION
// =============================================
window.addEventListener('online', () => {
    showToast('✅ Back online! Refreshing rates...', 'success');
    loadLiveRates();
});

window.addEventListener('offline', () => {
    showToast('⚠️ You are offline. Using cached data.', 'warning');
});

// =============================================
// STORE RATES GLOBALLY FOR EXPORT
// =============================================
async function loadLiveRatesWithStore() {
    try {
        const response = await fetch(`${API_BASE}/rates/USD`);
        const data = await response.json();
        window.currentRates = data;
        updateRateTicker(data);
        updateRateTable(data);
    } catch (error) {
        console.error('Error loading rates:', error);
    }
}