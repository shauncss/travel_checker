// --- Configuration ---
const API_KEYS = {
    WEATHER: import.meta.env.VITE_WEATHER_API_KEY,
    CURRENCY: import.meta.env.VITE_CURRENCY_API_KEY
};

// --- Utilities ---
async function safeFetchJSON(url, options = {}) {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
        throw new SyntaxError("API returned HTML instead of JSON data.");
    }
    return await res.json();
}

// --- Services ---

export async function getLiveCurrency(base, target) {
    const data = await safeFetchJSON(`https://v6.exchangerate-api.com/v6/${API_KEYS.CURRENCY}/pair/${base}/${target}`);
    return data.conversion_rate;
}

export async function getHistoricalCurrency(base, target, startStr, endStr) {
    const data = await safeFetchJSON(`https://api.frankfurter.app/${startStr}..${endStr}?from=${base}&to=${target}`);
    return data;
}

export async function getWeather(city) {
    return await safeFetchJSON(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEYS.WEATHER}`);
}

export async function getTimezone(city) {
    const data = await safeFetchJSON(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEYS.WEATHER}`);
    
    const offsetHours = data.timezone / 3600;
    const utcString = offsetHours >= 0 ? `UTC+${offsetHours}` : `UTC${offsetHours}`;
    
    const localTime = new Date(new Date().getTime() + (data.timezone * 1000));
    const timeString = localTime.getUTCHours().toString().padStart(2, '0') + ":" + localTime.getUTCMinutes().toString().padStart(2, '0');
    
    return { name: data.name, time: timeString, utc: utcString };
}

export async function getMainCities(countryName, capital) {
    try {
        const data = await safeFetchJSON('https://countriesnow.space/api/v0.1/countries/states', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ country: countryName })
        });
        
        let mainCities = data.data.states.map(s => s.name.replace(/ State| Province| Region/ig, '').trim());
        
        if (mainCities.includes(capital)) {
            mainCities = mainCities.filter(c => c !== capital);
        }
        mainCities.unshift(capital);
        
        return [...new Set(mainCities)];
    } catch (e) {
        return [capital];
    }
}