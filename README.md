# Travel Checker

Travel Checker is a dynamic web application that allows users to seamlessly compare essential travel information between a home country and a destination country. 

## 🌟 Features

* **Smart Setup:** Utilizes a localized, modular dataset of over 195 countries to populate the dropdown menus, entirely eliminating CORS errors and API rate limits. It automatically pre-fills comparison cities using the respective capital cities.
* **Currency Conversion & Graphing:** Calculates real-time exchange rates and visualizes a 30-day historical trend. The graph implementation strictly utilizes the HTML5 `<canvas>` element for high-performance, flicker-free rendering.
* **Weather Comparison:** Retrieves and compares real-time weather data between two cities, displaying the current temperature (in Celsius), general weather condition, and humidity percentage.
* **Time Zone Tracking:** Compares the current local time and displays the exact UTC offset for the selected locations.
* **Modern UI:** Features a sleek, dark-themed user interface utilizing glassmorphism effects, powered by a custom CSS layout and the "Plus Jakarta Sans" font family. 

## 🛠️ Technologies Used

* **Vite:** Next-generation frontend tooling providing a fast development server and optimized builds.
* **HTML5 Canvas & CSS3:** For structuring the responsive UI and rendering the dynamic currency trendlines.
* **Vanilla JavaScript (ES6+):** Handles modular data imports (`countries.js`), asynchronous data fetching, and DOM manipulation.
* **Chart.js:** Leverages the native Canvas API to render the responsive 1-month currency exchange rate line chart.

## 🔌 API Integrations

The application relies on a hybrid data architecture:
1.  **ExchangeRate-API** (`v6.exchangerate-api.com`): Fetches the live conversion rate pairs.
2.  **Frankfurter API** (`api.frankfurter.app`): Retrieves reliable, 30-day historical exchange data sourced directly from the European Central Bank (includes an algorithmic fallback for non-ECB tracked currencies).
3.  **OpenWeatherMap API** (`api.openweathermap.org`): Used for both the Weather Tab (fetching temperature/conditions) and the Time Zone Tab (utilizing the geolocation's timezone offset).
4.  **CountriesNow API** (`countriesnow.space`): Fetches a supplemental list of major cities for the selected countries to populate the comparison dropdowns.

## 🚀 Setup & Usage

This project utilizes Vite, requiring Node.js to run the local development server.

1.  Clone or download the project files into a single directory.
2.  Open your terminal and navigate to the project folder.
3.  Install the required Node packages and dependencies:
    ```bash
    npm install
    ```
4.  Boot up the development server:
    ```bash
    npm run dev
    ```
5.  Open the provided `localhost` URL in any modern web browser.
6.  Select a "Home Country" and a "Destination Country", then click "Compare Destinations" to load the datasets. 

> **Note on Security:** API Keys for OpenWeather and ExchangeRate-API are currently hardcoded in `script.js` for local demonstration purposes. Before deploying to production, migrate these to environment variables (`.env`).