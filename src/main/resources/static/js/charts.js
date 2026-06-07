// =============================================
// FOREXPRO - CHARTS & HISTORICAL DATA
// =============================================

let historicalChart = null;
let predictionChart = null;

// =============================================
// LOAD HISTORICAL CHART
// =============================================
async function loadHistoricalChart(from, to, days) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days || 30));

    const start = formatDate(startDate);
    const end = formatDate(endDate);

    try {
        showChartLoading(true);
        const response = await fetch(
            `/api/historical?from=${from}&to=${to}&startDate=${start}&endDate=${end}`
        );
        const data = await response.json();

        if (data.dates && data.rates) {
            renderHistoricalChart(data, from, to);
            updateChartStats(data.rates);
        }
    } catch (error) {
        console.error('Error loading chart:', error);
        showToast('Error loading chart data', 'danger');
    } finally {
        showChartLoading(false);
    }
}

// =============================================
// RENDER HISTORICAL CHART
// =============================================
function renderHistoricalChart(data, from, to) {
    const ctx = document.getElementById('historicalChart');
    if (!ctx) return;

    if (historicalChart) {
        historicalChart.destroy();
    }

    const isDark = document.documentElement
        .getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#f8fafc' : '#1e293b';
    const gridColor = isDark ?
        'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

    historicalChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.dates,
            datasets: [{
                label: `${from}/${to} Exchange Rate`,
                data: data.rates,
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37,99,235,0.1)',
                borderWidth: 2.5,
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 6,
                pointBackgroundColor: '#2563eb',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    labels: { color: textColor }
                },
                tooltip: {
                    backgroundColor: 'rgba(30,41,59,0.9)',
                    titleColor: '#fff',
                    bodyColor: '#94a3b8',
                    borderColor: '#2563eb',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return ` Rate: ${context.raw.toFixed(6)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColor,
                        maxTicksLimit: 10
                    },
                    grid: { color: gridColor }
                },
                y: {
                    ticks: {
                        color: textColor,
                        callback: function(value) {
                            return value.toFixed(4);
                        }
                    },
                    grid: { color: gridColor }
                }
            }
        }
    });
}

// =============================================
// AI PREDICTION CHART
// =============================================
function renderPredictionChart(historicalData, predictions, from, to) {
    const ctx = document.getElementById('predictionChart');
    if (!ctx) return;

    if (predictionChart) {
        predictionChart.destroy();
    }

    const allDates = [
        ...historicalData.dates.slice(-7),
        ...predictions.dates
    ];

    predictionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: allDates,
            datasets: [
                {
                    label: 'Historical',
                    data: [
                        ...historicalData.rates.slice(-7),
                        ...new Array(predictions.dates.length).fill(null)
                    ],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37,99,235,0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'AI Prediction',
                    data: [
                        ...new Array(7).fill(null),
                        ...predictions.rates
                    ],
                    borderColor: '#7c3aed',
                    backgroundColor: 'rgba(124,58,237,0.1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#f8fafc' }
                },
                tooltip: {
                    backgroundColor: 'rgba(30,41,59,0.95)',
                    callbacks: {
                        label: function(context) {
                            const prefix = context.datasetIndex === 1
                                ? '🔮 Predicted: '
                                : '📊 Actual: ';
                            return context.raw ?
                                prefix + context.raw.toFixed(6) : '';
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#94a3b8', maxTicksLimit: 8 },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                },
                y: {
                    ticks: {
                        color: '#94a3b8',
                        callback: v => v.toFixed(4)
                    },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                }
            }
        }
    });
}

// =============================================
// MULTI-CURRENCY COMPARISON CHART
// =============================================
async function loadMultiCurrencyChart() {
    const base = document.getElementById('multiBase')?.value || 'USD';
    const currencies = ['EUR', 'GBP', 'JPY', 'INR', 'AUD'];
    const colors = [
        '#2563eb', '#7c3aed', '#059669',
        '#d97706', '#dc2626'
    ];

    try {
        showToast('Loading comparison chart...', 'info');
        const endDate = formatDate(new Date());
        const startDate = formatDate(
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        );

        const datasets = [];
        const dates = [];

        for (let i = 0; i < currencies.length; i++) {
            const response = await fetch(
                `/api/historical?from=${base}&to=${currencies[i]}` +
                `&startDate=${startDate}&endDate=${endDate}`
            );
            const data = await response.json();

            if (i === 0 && data.dates) {
                dates.push(...data.dates);
            }

            if (data.rates) {
                const normalized = normalizeData(data.rates);
                datasets.push({
                    label: `${base}/${currencies[i]}`,
                    data: normalized,
                    borderColor: colors[i],
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    tension: 0.4,
                    pointRadius: 0
                });
            }
        }

        renderMultiChart(dates, datasets);
    } catch (error) {
        console.error('Multi chart error:', error);
    }
}

function normalizeData(data) {
    if (!data || data.length === 0) return [];
    const base = data[0];
    return data.map(v => ((v - base) / base * 100).toFixed(4));
}

function renderMultiChart(dates, datasets) {
    const ctx = document.getElementById('multiCurrencyChart');
    if (!ctx) return;

    if (window.multiChart) window.multiChart.destroy();

    window.multiChart = new Chart(ctx, {
        type: 'line',
        data: { labels: dates, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#94a3b8' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ` +
                                `${context.raw}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#94a3b8',
                        maxTicksLimit: 8
                    },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                },
                y: {
                    ticks: { color: '#94a3b8' },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                }
            }
        }
    });
}

// =============================================
// CHART STATS
// =============================================
function updateChartStats(rates) {
    if (!rates || rates.length === 0) return;

    const min = Math.min(...rates);
    const max = Math.max(...rates);
    const avg = rates.reduce((a, b) => a + b, 0) / rates.length;
    const change = ((rates[rates.length - 1] - rates[0]) / rates[0] * 100);
    const isUp = change >= 0;

    const minEl = document.getElementById('statMin');
    const maxEl = document.getElementById('statMax');
    const avgEl = document.getElementById('statAvg');
    const changeEl = document.getElementById('statChange');

    if (minEl) minEl.textContent = min.toFixed(6);
    if (maxEl) maxEl.textContent = max.toFixed(6);
    if (avgEl) avgEl.textContent = avg.toFixed(6);
    if (changeEl) {
        changeEl.textContent = `${isUp ? '+' : ''}${change.toFixed(2)}%`;
        changeEl.className = `stat-value ${isUp ? 'text-success' : 'text-danger'}`;
    }
}

// =============================================
// UTILITY
// =============================================
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function showChartLoading(show) {
    const loader = document.getElementById('chartLoader');
    if (loader) loader.style.display = show ? 'block' : 'none';
}