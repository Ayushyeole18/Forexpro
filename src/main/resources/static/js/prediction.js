// =============================================
// FOREXPRO - AI CURRENCY PREDICTION
// =============================================

// =============================================
// SIMPLE MOVING AVERAGE PREDICTION
// =============================================
function predictWithSMA(rates, periods) {
    if (!rates || rates.length < periods) return [];

    const predictions = [];
    const lastRates = [...rates];

    for (let i = 0; i < periods; i++) {
        const window = lastRates.slice(-7);
        const sma = window.reduce((a, b) => a + b, 0) / window.length;
        const noise = (Math.random() - 0.5) * 0.002 * sma;
        const predicted = sma + noise;
        predictions.push(parseFloat(predicted.toFixed(6)));
        lastRates.push(predicted);
    }

    return predictions;
}

// =============================================
// LINEAR REGRESSION PREDICTION
// =============================================
function linearRegression(rates) {
    const n = rates.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = rates;

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) /
        (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
}

function predictWithRegression(rates, periods) {
    const { slope, intercept } = linearRegression(rates);
    const n = rates.length;
    const predictions = [];

    for (let i = 0; i < periods; i++) {
        const predicted = slope * (n + i) + intercept;
        const noise = (Math.random() - 0.5) * 0.001 * predicted;
        predictions.push(parseFloat((predicted + noise).toFixed(6)));
    }

    return predictions;
}

// =============================================
// WEIGHTED MOVING AVERAGE
// =============================================
function predictWithWMA(rates, periods) {
    if (rates.length < 5) return [];
    const predictions = [];
    const lastRates = [...rates];

    for (let i = 0; i < periods; i++) {
        const window = lastRates.slice(-5);
        const weights = [1, 2, 3, 4, 5];
        const weightedSum = window.reduce(
            (acc, rate, idx) => acc + rate * weights[idx], 0
        );
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        const predicted = weightedSum / totalWeight;
        const noise = (Math.random() - 0.5) * 0.001 * predicted;
        predictions.push(parseFloat((predicted + noise).toFixed(6)));
        lastRates.push(predicted);
    }

    return predictions;
}

// =============================================
// MAIN PREDICTION FUNCTION
// =============================================
async function runAIPrediction() {
    const from = document.getElementById('predFrom')?.value || 'USD';
    const to = document.getElementById('predTo')?.value || 'EUR';
    const algorithm = document.getElementById('predAlgorithm')?.value
        || 'sma';
    const periods = parseInt(
        document.getElementById('predPeriods')?.value || '7'
    );

    showPredictionLoading(true);

    try {
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            .toISOString().split('T')[0];

        const response = await fetch(
            `/api/historical?from=${from}&to=${to}` +
            `&startDate=${startDate}&endDate=${endDate}`
        );
        const data = await response.json();

        if (!data.rates || data.rates.length === 0) {
            showToast('No historical data available', 'warning');
            return;
        }

        let predictedRates;
        let algorithmName;

        switch(algorithm) {
            case 'regression':
                predictedRates = predictWithRegression(
                    data.rates, periods
                );
                algorithmName = 'Linear Regression';
                break;
            case 'wma':
                predictedRates = predictWithWMA(data.rates, periods);
                algorithmName = 'Weighted Moving Average';
                break;
            default:
                predictedRates = predictWithSMA(data.rates, periods);
                algorithmName = 'Simple Moving Average';
        }

        const predDates = generateFutureDates(periods);

        const predictionData = {
            dates: predDates,
            rates: predictedRates
        };

        renderPredictionChart(data, predictionData, from, to);
        displayPredictionResults(
            predictedRates, data.rates, from, to,
            algorithmName, periods
        );

        showToast(
            `AI Prediction complete using ${algorithmName}`,
            'success'
        );

    } catch (error) {
        console.error('Prediction error:', error);
        showToast('Error running prediction', 'danger');
    } finally {
        showPredictionLoading(false);
    }
}

// =============================================
// DISPLAY PREDICTION RESULTS
// =============================================
function displayPredictionResults(
    predictions, historical, from, to,
    algorithm, periods) {

    const container = document.getElementById('predictionResults');
    if (!container) return;

    const lastHistorical = historical[historical.length - 1];
    const lastPrediction = predictions[predictions.length - 1];
    const change = ((lastPrediction - lastHistorical) /
        lastHistorical * 100).toFixed(2);
    const isUp = parseFloat(change) >= 0;

    const avgPrediction = predictions.reduce((a, b) => a + b, 0) /
        predictions.length;
    const minPrediction = Math.min(...predictions);
    const maxPrediction = Math.max(...predictions);
    const confidence = Math.max(60, Math.min(90,
        85 - Math.abs(parseFloat(change)) * 2
    )).toFixed(0);

    container.innerHTML = `
        <div class="prediction-result-card">
            <div class="row g-3">
                <div class="col-12">
                    <div class="alert alert-${isUp ? 'success' : 'danger'} mb-0">
                        <div class="d-flex align-items-center gap-3">
                            <span style="font-size:2rem">
                                ${isUp ? '📈' : '📉'}
                            </span>
                            <div>
                                <strong>
                                    ${from}/${to} — 
                                    ${isUp ? 'BULLISH' : 'BEARISH'} Outlook
                                </strong><br>
                                <small>
                                    Predicted ${isUp ? 'increase' : 'decrease'} 
                                    of ${Math.abs(change)}% over 
                                    next ${periods} days
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-6 col-md-3">
                    <div class="stat-card text-center">
                        <div class="stat-label">Current Rate</div>
                        <div class="stat-value" style="font-size:1.2rem">
                            ${lastHistorical.toFixed(6)}
                        </div>
                    </div>
                </div>
                <div class="col-6 col-md-3">
                    <div class="stat-card text-center"
                         style="border-left-color:#7c3aed">
                        <div class="stat-label">Predicted Rate</div>
                        <div class="stat-value" style="font-size:1.2rem;
                             color:#7c3aed">
                            ${lastPrediction.toFixed(6)}
                        </div>
                    </div>
                </div>
                <div class="col-6 col-md-3">
                    <div class="stat-card text-center"
                         style="border-left-color:${isUp ?
        '#059669' : '#dc2626'}">
                        <div class="stat-label">Expected Change</div>
                        <div class="stat-value" style="font-size:1.2rem;
                             color:${isUp ? '#059669' : '#dc2626'}">
                            ${isUp ? '+' : ''}${change}%
                        </div>
                    </div>
                </div>
                <div class="col-6 col-md-3">
                    <div class="stat-card text-center"
                         style="border-left-color:#d97706">
                        <div class="stat-label">Confidence</div>
                        <div class="stat-value" style="font-size:1.2rem;
                             color:#d97706">
                            ${confidence}%
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="table-container">
                        <table class="table table-sm mb-0">
                            <thead>
                                <tr>
                                    <th>Algorithm</th>
                                    <th>Avg Prediction</th>
                                    <th>Min</th>
                                    <th>Max</th>
                                    <th>Trend</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>${algorithm}</td>
                                    <td>${avgPrediction.toFixed(6)}</td>
                                    <td>${minPrediction.toFixed(6)}</td>
                                    <td>${maxPrediction.toFixed(6)}</td>
                                    <td class="text-${isUp ?
        'success' : 'danger'}">
                                        ${isUp ? '▲ Upward' : '▼ Downward'}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="col-12">
                    <small class="text-muted">
                        ⚠️ <strong>Disclaimer:</strong> 
                        These predictions are generated using mathematical 
                        models for educational purposes only. 
                        Do NOT use for actual trading decisions.
                    </small>
                </div>
            </div>
        </div>
    `;

    container.style.display = 'block';
}

// =============================================
// UTILITY
// =============================================
function generateFutureDates(days) {
    const dates = [];
    for (let i = 1; i <= days; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
}

function showPredictionLoading(show) {
    const btn = document.getElementById('predictBtn');
    const loader = document.getElementById('predictionLoader');
    if (btn) {
        btn.disabled = show;
        btn.innerHTML = show ?
            '<span class="spinner-border spinner-border-sm me-2"></span>Analyzing...' :
            '🔮 Run AI Prediction';
    }
    if (loader) loader.style.display = show ? 'block' : 'none';
}