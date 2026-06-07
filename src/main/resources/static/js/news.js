// =============================================
// FOREXPRO - FOREX NEWS
// =============================================

const NEWS_SOURCES = [
    {
        title: "Fed Signals Potential Rate Cut in Coming Months",
        source: "Reuters",
        summary: "The Federal Reserve indicated it may consider cutting interest rates as inflation shows signs of cooling, impacting USD strength globally.",
        category: "Central Banks",
        time: "2 hours ago",
        icon: "🏦",
        url: "https://reuters.com",
        impact: "high",
        currency: "USD"
    },
    {
        title: "EUR/USD Hits 3-Month High on Strong EU Data",
        source: "Bloomberg",
        summary: "The Euro strengthened against the Dollar after eurozone economic data exceeded expectations, pushing EUR/USD to its highest level in three months.",
        category: "Market Update",
        time: "4 hours ago",
        icon: "📈",
        url: "https://bloomberg.com",
        impact: "medium",
        currency: "EUR"
    },
    {
        title: "Bank of Japan Maintains Ultra-Low Interest Rates",
        source: "Financial Times",
        summary: "The Bank of Japan kept its benchmark interest rate unchanged, continuing its accommodative monetary policy stance despite rising inflation pressures.",
        category: "Central Banks",
        time: "6 hours ago",
        icon: "🏛️",
        url: "https://ft.com",
        impact: "medium",
        currency: "JPY"
    },
    {
        title: "GBP Strengthens on UK Employment Data",
        source: "BBC Business",
        summary: "The British Pound gained against major currencies after UK employment figures showed stronger than expected job creation in the services sector.",
        category: "Economic Data",
        time: "8 hours ago",
        icon: "📊",
        url: "https://bbc.com",
        impact: "medium",
        currency: "GBP"
    },
    {
        title: "Indian Rupee Hits New Record Against Dollar",
        source: "Economic Times",
        summary: "The Indian Rupee touched a new all-time low against the US Dollar amid rising crude oil prices and foreign fund outflows from Indian markets.",
        category: "Emerging Markets",
        time: "10 hours ago",
        icon: "🇮🇳",
        url: "https://economictimes.com",
        impact: "high",
        currency: "INR"
    },
    {
        title: "Gold Prices Surge Amid Dollar Weakness",
        source: "CNBC",
        summary: "Gold prices jumped to a two-week high as the US Dollar weakened following disappointing retail sales data, boosting safe-haven demand.",
        category: "Commodities",
        time: "12 hours ago",
        icon: "🥇",
        url: "https://cnbc.com",
        impact: "low",
        currency: "XAU"
    },
    {
        title: "Chinese Yuan Stabilizes After PBOC Intervention",
        source: "South China Morning Post",
        summary: "The Chinese Yuan stabilized against major currencies after the People's Bank of China set a stronger-than-expected daily fixing rate.",
        category: "Asia Markets",
        time: "14 hours ago",
        icon: "🇨🇳",
        url: "https://scmp.com",
        impact: "medium",
        currency: "CNY"
    },
    {
        title: "Oil Prices Impact CAD and NOK Exchange Rates",
        source: "Wall Street Journal",
        summary: "Commodity currencies including the Canadian Dollar and Norwegian Krone saw volatility as crude oil prices swung on supply uncertainty.",
        category: "Commodities",
        time: "16 hours ago",
        icon: "🛢️",
        url: "https://wsj.com",
        impact: "medium",
        currency: "CAD"
    },
    {
        title: "Swiss Franc Gains Safe-Haven Appeal",
        source: "Reuters",
        summary: "The Swiss Franc strengthened as global risk sentiment deteriorated, with investors seeking safe-haven assets amid geopolitical tensions.",
        category: "Safe Haven",
        time: "18 hours ago",
        icon: "🇨🇭",
        url: "https://reuters.com",
        impact: "low",
        currency: "CHF"
    }
];

// =============================================
// LOAD NEWS
// =============================================
function loadForexNews(filter) {
    const container = document.getElementById('newsContainer');
    if (!container) return;

    container.innerHTML = '<div class="text-center py-4">' +
        '<div class="spinner mx-auto"></div>' +
        '<p class="mt-2 text-muted">Loading news...</p></div>';

    setTimeout(() => {
        let news = NEWS_SOURCES;

        if (filter && filter !== 'all') {
            news = NEWS_SOURCES.filter(n =>
                n.category.toLowerCase().includes(filter.toLowerCase()) ||
                n.currency === filter.toUpperCase()
            );
        }

        renderNews(news, container);
    }, 800);
}

function renderNews(news, container) {
    if (!news || news.length === 0) {
        container.innerHTML =
            '<p class="text-center text-muted py-4">No news found</p>';
        return;
    }

    container.innerHTML = news.map(item => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="news-card h-100">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <span class="news-source">${item.source}</span>
                    <span class="badge bg-${getImpactColor(item.impact)}">
                        ${item.impact.toUpperCase()} IMPACT
                    </span>
                </div>
                <div class="news-icon mb-2" style="font-size:1.5rem">
                    ${item.icon}
                </div>
                <h6 class="news-title">${item.title}</h6>
                <p class="text-muted small mb-3">${item.summary}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <span class="badge bg-light text-dark me-1">
                            ${item.category}
                        </span>
                        <span class="badge bg-primary bg-opacity-10 text-primary">
                            ${item.currency}
                        </span>
                    </div>
                    <span class="news-date">${item.time}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function getImpactColor(impact) {
    const colors = {
        'high': 'danger',
        'medium': 'warning',
        'low': 'success'
    };
    return colors[impact] || 'secondary';
}

// =============================================
// ECONOMIC CALENDAR
// =============================================
const ECONOMIC_EVENTS = [
    {
        date: 'Today',
        time: '14:30',
        event: 'US CPI Data Release',
        currency: 'USD',
        impact: 'high',
        forecast: '3.2%',
        previous: '3.4%'
    },
    {
        date: 'Today',
        time: '16:00',
        event: 'EU Industrial Production',
        currency: 'EUR',
        impact: 'medium',
        forecast: '0.3%',
        previous: '-0.1%'
    },
    {
        date: 'Tomorrow',
        time: '09:30',
        event: 'UK GDP Growth Rate',
        currency: 'GBP',
        impact: 'high',
        forecast: '0.2%',
        previous: '0.1%'
    },
    {
        date: 'Tomorrow',
        time: '12:00',
        event: 'Fed Chair Speech',
        currency: 'USD',
        impact: 'high',
        forecast: 'N/A',
        previous: 'N/A'
    },
    {
        date: 'In 2 days',
        time: '08:00',
        event: 'Japan Trade Balance',
        currency: 'JPY',
        impact: 'medium',
        forecast: '¥200B',
        previous: '¥180B'
    },
    {
        date: 'In 2 days',
        time: '15:30',
        event: 'Canada Employment Change',
        currency: 'CAD',
        impact: 'high',
        forecast: '25K',
        previous: '18K'
    }
];

function loadEconomicCalendar() {
    const container = document.getElementById('calendarContainer');
    if (!container) return;

    container.innerHTML = ECONOMIC_EVENTS.map(event => `
        <tr>
            <td>
                <small class="text-muted">${event.date}</small><br>
                <strong>${event.time}</strong>
            </td>
            <td>
                <span class="fw-semibold">${event.event}</span>
            </td>
            <td>
                <span class="badge bg-primary">${event.currency}</span>
            </td>
            <td>
                <span class="badge bg-${getImpactColor(event.impact)}">
                    ${'●'.repeat(
        event.impact === 'high' ? 3 :
            event.impact === 'medium' ? 2 : 1
    )}
                </span>
            </td>
            <td class="text-success">${event.forecast}</td>
            <td class="text-muted">${event.previous}</td>
        </tr>
    `).join('');
}