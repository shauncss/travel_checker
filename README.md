# Travel Checker

Travel Checker is a dynamic web application that allows users to seamlessly compare essential travel information between a home country and a destination country. 

## 🌟 Features

* **Smart Setup:** Utilizes a localized, modular dataset of over 195 countries to populate the dropdown menus, entirely eliminating CORS errors and API rate limits. It automatically pre-fills comparison cities using the respective capital cities.
* **Currency Conversion & Graphing:** Calculates real-time exchange rates and visualizes a 30-day historical trend. The graph implementation strictly utilizes the HTML5 `<canvas>` element for high-performance, flicker-free rendering.
* **Weather Comparison:** Retrieves and compares real-time weather data between two cities, displaying the current temperature (in Celsius), general weather condition, and humidity percentage.
* **Time Zone Tracking:** Compares the current local time and displays the exact UTC offset for the selected locations.
* **Modern UI:** Features a sleek, dark-themed user interface utilizing glassmorphism effects, powered by a custom CSS layout and the "Plus Jakarta Sans" font family. 

## 🛠️ Technologies & Architecture

* **Vite:** Next-generation frontend tooling providing a fast development server and optimized builds.
* **Modular Architecture:** Source code is neatly organized within a `src/` directory, with network requests securely decoupled into a dedicated `services/api.js` layer for improved maintainability.
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

1.  Clone or download the project files.
2.  Open your terminal and navigate to the root project folder.
3.  Install the required Node packages and dependencies:
    ```bash
    npm install
    ```
4.  **Environment Variables:** For security, API keys are kept out of the source code. Create a file named exactly `.env` in the root directory (next to `package.json`). Add your keys using the required Vite prefix:
    ```env
    VITE_WEATHER_API_KEY=your_openweathermap_api_key_here
    VITE_CURRENCY_API_KEY=your_exchangerate_api_key_here
    ```
5.  **Launch the Server:** 
    *   **Option A (Quick Launch):** Double-click the provided `run.bat` (Windows) or execute `./run.sh` (Mac/Linux) to automatically start the server and open your default web browser.
    *   **Option B (Terminal):** Boot up the development server manually:
        ```bash
        npm run dev -- --open
        ```
6.  Select a "Home Country" and a "Destination Country", then click "Compare Destinations" to load the datasets.