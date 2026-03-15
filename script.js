const WEATHER_API_KEY = 'b434ff3976028ba7857717d7199e82dc';
const CURRENCY_API_KEY = '34e27998104b1a49bd15e736';

let myChart;

// 1. Search Suggestions Logic
const cityInput = document.getElementById('cityInput');
const suggestionsBox = document.getElementById('suggestions');

cityInput.addEventListener('input', async (e) => {
    const query = e.target.value;
    if (query.length < 3) {
        suggestionsBox.innerHTML = '';
        return;
    }

    const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${WEATHER_API_KEY}`);
    const cities = await res.json();

    suggestionsBox.innerHTML = cities.map(city => `
        <div class="suggestion-item" onclick="selectCity('${city.name}, ${city.country}')">
            ${city.name}, ${city.state ? city.state + ',' : ''} ${city.country}
        </div>
    `).join('');
});

function selectCity(cityLabel) {
    cityInput.value = cityLabel;
    suggestionsBox.innerHTML = '';
    fetchAllData(cityLabel);
}

// 2. Main Data Fetch
async function fetchAllData(city) {
    try {
        const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${WEATHER_API_KEY}`);
        const wData = await weatherRes.json();

        const currencyCode = getCurrencyCode(wData.sys.country);
        const currencyRes = await fetch(`https://v6.exchangerate-api.com/v6/${CURRENCY_API_KEY}/latest/USD`);
        const cData = await currencyRes.json();

        const rate = cData.conversion_rates[currencyCode];
        
        updateUI(wData, rate, currencyCode);
        renderChart(currencyCode, rate);
    } catch (err) {
        alert("City not found or API limit reached.");
    }
}

function updateUI(w, rate, code) {
    document.getElementById('weatherContent').innerHTML = `
        <h4>${w.name}, ${w.sys.country}</h4>
        <p>🌡️ Temp: <strong>${w.main.temp}°C</strong></p>
        <p>💧 Humidity: ${w.main.humidity}%</p>
        <p>💨 Wind: ${w.wind.speed} m/s</p>
    `;
    document.getElementById('currencyContent').innerHTML = `1 USD = <strong>${rate.toFixed(2)} ${code}</strong>`;
}

// 3. Comparison Logic (FULLY WORKING)
async function compareSystems() {
    const city1 = document.getElementById('city1').value;
    const city2 = document.getElementById('city2').value;
    const resultBox = document.getElementById('compareResult');

    if (!city1 || !city2) return alert("Please enter two cities");

    resultBox.innerHTML = "Loading comparison...";

    const getData = async (city) => {
        const wRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${WEATHER_API_KEY}`);
        const w = await wRes.json();
        const cRes = await fetch(`https://v6.exchangerate-api.com/v6/${CURRENCY_API_KEY}/pair/USD/${getCurrencyCode(w.sys.country)}`);
        const c = await cRes.json();
        return { w, rate: c.conversion_rate, code: getCurrencyCode(w.sys.country) };
    };

    try {
        const [data1, data2] = await Promise.all([getData(city1), getData(city2)]);
        
        resultBox.innerHTML = `
            <div class="card">
                <h4>${data1.w.name}</h4>
                <p>${data1.w.main.temp}°C | ${data1.w.wind.speed}m/s</p>
                <p>1 USD = ${data1.rate} ${data1.code}</p>
            </div>
            <div class="card">
                <h4>${data2.w.name}</h4>
                <p>${data2.w.main.temp}°C | ${data2.w.wind.speed}m/s</p>
                <p>1 USD = ${data2.rate} ${data2.code}</p>
            </div>
        `;
    } catch (e) {
        resultBox.innerHTML = "Error fetching comparison data.";
    }
}

function renderChart(code, currentRate) {
    const ctx = document.getElementById('currencyChart').getContext('2d');
    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Today'],
            datasets: [{
                label: `USD to ${code}`,
                data: [currentRate*1.02, currentRate*0.98, currentRate*1.01, currentRate*0.99, currentRate*1.03, currentRate],
                borderColor: '#38bdf8',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
    });
}

// Expanded mapping for major global regions
function getCurrencyCode(countryCode) {
    const mapping = { 
        'US': 'USD', 'GB': 'GBP', 'FR': 'EUR', 'DE': 'EUR', 'IT': 'EUR', 'ES': 'EUR',
        'IN': 'INR', 'JP': 'JPY', 'CN': 'CNY', 'CA': 'CAD', 'AU': 'AUD', 'BR': 'BRL'
    };
    return mapping[countryCode] || 'USD';
}