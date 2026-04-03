# Travel Checker

Travel Checker is a dynamic web application that allows users to seamlessly compare essential travel information between a home country and a destination country. 

## 🌟 Features

* **Smart Setup:** Automatically fetches a list of over 195 countries to populate the home and destination dropdown menus, sorted alphabetically. It automatically pre-fills comparison cities using the respective capital cities of the selected countries.
* **Currency Conversion:** Calculates real-time exchange rates between the two countries' currencies and visualizes a simulated 30-day historical trend using a line chart.
* **Weather Comparison:** Retrieves and compares real-time weather data between two cities, displaying the current temperature (in Celsius), general weather condition, and humidity percentage.
* **Time Zone Tracking:** Compares the current local time and displays the exact UTC offset for the selected locations.
* **Modern UI:** Features a sleek, dark-themed user interface utilizing glassmorphism effects, powered by a custom CSS layout and the "Plus Jakarta Sans" font family. 

## 🛠️ Technologies Used

* **HTML5 & CSS3:** For structuring and styling the responsive, tab-based user interface.
* **Vanilla JavaScript:** Handles API data fetching, tab navigation logic, and DOM manipulation.
* **Chart.js:** Used via CDN to render the responsive 1-month currency exchange rate line chart.

## 🔌 APIs Integration

The application relies on several external APIs to gather data:
1.  **REST Countries API** (`restcountries.com`): Retrieves the global list of countries, their common names, 2-letter country codes, currencies, and capital cities.
2.  **ExchangeRate-API** (`v6.exchangerate-api.com`): Fetches the latest conversion rate pairs for the selected currencies.
3.  **OpenWeatherMap API** (`api.openweathermap.org`): Used for both the Weather Tab (fetching temperature and conditions) and the Time Zone Tab (utilizing the geolocation's timezone offset data).

## 🚀 Setup & Usage

1.  Clone or download the project files into a single directory.
2.  Open `index.html` in any modern web browser to run the application locally. No build step or package installation is required.
3.  Select a "Home Country" and a "Destination Country" from the dropdowns, then click "Compare" to load the results. 
4.  Navigate between the Currency, Weather, and Time Zone pill-shaped navigation tabs to view the different datasets.

*Note: API Keys for Weather and Currency are currently hardcoded in `script.js` for demonstration purposes. For production environments, it is recommended to secure these keys appropriately.*
