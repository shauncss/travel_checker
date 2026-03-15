const WEATHER_API_KEY = 'b434ff3976028ba7857717d7199e82dc';
const CURRENCY_API_KEY = '34e27998104b1a49bd15e736';
let myChart;

// Tab Switcher
function switchTab(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId + 'Tab').classList.add('active');
    btn.classList.add('active');
}

// Dropdown Search Logic
const cityInput = document.getElementById('cityInput');
const suggestionsBox = document.getElementById('suggestions');

cityInput.addEventListener('input', async (e) => {
    const query = e.target.value.trim();
    if (query.length < 3) { suggestionsBox.innerHTML = ''; return; }
    
    try {
        const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${WEATHER_API_KEY}`);
        const cities = await res.json();
        suggestionsBox.innerHTML = cities.map(c => `
            <div class="suggestion-item" onclick="selectCity('${c.name.replace(/'/g, "\\'")}', '${c.country}')">
                ${c.name}, ${c.country}
            </div>
        `).join('');
    } catch (err) { console.error("Dropdown error", err); }
});

function selectCity(name, country) {
    const label = `${name}, ${country}`;
    cityInput.value = label;
    suggestionsBox.innerHTML = '';
    fetchAllData(label);
}

// Main Fetch for Dashboard
async function fetchAllData(city) {
    try {
        const wRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${WEATHER_API_KEY}`);
        const w = await wRes.json();
        
        // Update weather UI
        updateWeatherUI(w);
        
        // Automatically switch target currency to the searched country's currency
        const detectedCurrency = getCurrencyCode(w.sys.country);
        const targetDropdown = document.getElementById('targetCurrency');
        
        // If the currency isn't in our dropdown, add it temporarily so it works
        if (![...targetDropdown.options].map(o => o.value).includes(detectedCurrency)) {
            targetDropdown.add(new Option(detectedCurrency, detectedCurrency));
        }
        targetDropdown.value = detectedCurrency;
        
        // Run the new conversion logic
        calculateConversion();
    } catch (err) { alert("Data fetch failed. Please check the city name."); }
}

function updateWeatherUI(w) {
    const tempPct = Math.min(Math.max((w.main.temp + 10) * 2, 0), 100);
    const humPct = w.main.humidity;
    const windPct = Math.min(w.wind.speed * 5, 100);

    document.getElementById('weatherContent').innerHTML = `
        <div class="weather-header">
            <h4>${w.name}, ${w.sys.country}</h4>
        </div>
        <div class="weather-grid">
            ${renderStat("Temperature", w.main.temp + " °C", tempPct)}
            ${renderStat("Humidity", w.main.humidity + " %", humPct)}
            ${renderStat("Wind Speed", w.wind.speed + " m/s", windPct)}
        </div>
    `;
}

function renderStat(label, val, pct) {
    return `
        <div class="stat-row">
            <div class="stat-header"><span class="stat-label">${label}</span><span class="stat-value">${val}</span></div>
            <div class="meter-bar"><div class="meter-fill" style="width: ${pct}%"></div></div>
        </div>
    `;
}

// Full Currency Conversion Logic [Requirements 3 & 4]
async function calculateConversion() {
    const amount = document.getElementById('convertAmount').value || 1;
    const base = document.getElementById('baseCurrency').value;
    const target = document.getElementById('targetCurrency').value;

    try {
        const res = await fetch(`https://v6.exchangerate-api.com/v6/${CURRENCY_API_KEY}/pair/${base}/${target}/${amount}`);
        const data = await res.json();
        
        document.getElementById('displayAmount').innerText = parseFloat(amount).toFixed(2);
        document.getElementById('displayBase').innerText = base;
        
        if (data.result === "success") {
            document.getElementById('convertedValue').innerText = `${data.conversion_result.toLocaleString(undefined, {minimumFractionDigits: 2})} ${target}`;
            renderChart(target, data.conversion_rate); 
        } else {
            document.getElementById('convertedValue').innerText = "Error";
        }
    } catch (e) { console.error("Conversion error", e); }
}

// Swap Functionality [Requirement 3]
function swapCurrencies() {
    const baseSelect = document.getElementById('baseCurrency');
    const targetSelect = document.getElementById('targetCurrency');
    
    // Swap the values
    const temp = baseSelect.value;
    baseSelect.value = targetSelect.value;
    targetSelect.value = temp;
    
    // Recalculate based on new swapped values
    calculateConversion();
}

function renderChart(code, rate) {
    const ctx = document.getElementById('currencyChart').getContext('2d');
    if (myChart) myChart.destroy();
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['M','T','W','T','F','Today'],
            datasets: [{ label: `Rate Trend`, data: [rate*0.98, rate*1.01, rate*1.02, rate*0.99, rate*1.01, rate], borderColor: '#38bdf8', tension: 0.4 }]
        },
        options: { plugins: { legend: { display: false } } }
    });
}

// Time Zones Comparison
async function compareTimeZones() {
    const c1 = document.getElementById('tzCity1').value;
    const c2 = document.getElementById('tzCity2').value;
    const resultDiv = document.getElementById('timezoneResult');
    if(!c1 || !c2) return alert("Select two cities");

    const fetchTime = async (city) => {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}`);
        const data = await res.json();
        const localTime = new Date(new Date().getTime() + (data.timezone * 1000));
        return { name: data.name, time: localTime.getUTCHours().toString().padStart(2, '0') + ":" + localTime.getUTCMinutes().toString().padStart(2, '0') };
    };

    try {
        const [t1, t2] = await Promise.all([fetchTime(c1), fetchTime(c2)]);
        resultDiv.innerHTML = `
            <div class="time-card"><h4>${t1.name}</h4><div class="time-val">${t1.time}</div></div>
            <div class="time-card"><h4>${t2.name}</h4><div class="time-val">${t2.time}</div></div>
        `;
    } catch (e) { resultDiv.innerHTML = "Error loading time data."; }
}

// Comparison Tool
async function compareSystems() {
    const c1 = document.getElementById('city1').value;
    const c2 = document.getElementById('city2').value;
    const resultBox = document.getElementById('compareResult');
    if (!c1 || !c2) return alert("Enter two cities");
    
    resultBox.innerHTML = "Loading...";
    const getComp = async (city) => {
        const wRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${WEATHER_API_KEY}`);
        return await wRes.json();
    };

    try {
        const [w1, w2] = await Promise.all([getComp(c1), getComp(c2)]);
        resultBox.innerHTML = `
            <div class="card"><h4>${w1.name}</h4><p>Temp: ${w1.main.temp}°C</p><p>Wind: ${w1.wind.speed} m/s</p></div>
            <div class="card"><h4>${w2.name}</h4><p>Temp: ${w2.main.temp}°C</p><p>Wind: ${w2.wind.speed} m/s</p></div>
        `;
    } catch (e) { resultBox.innerHTML = "Error fetching comparison."; }
}

// Currency Mapper
function getCurrencyCode(cc) {
    const map = { 'US':'USD','GB':'GBP','FR':'EUR','DE':'EUR','JP':'JPY','IN':'INR','CA':'CAD','AU':'AUD','MY':'MYR' };
    return map[cc] || 'USD';
}

// Initialize default calculation on load
window.onload = () => { calculateConversion(); };