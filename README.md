# Current Weather

 
Current Weather is an application which enables a user to search for a current weather of any city. Multiple different languages are supported. The application fetches weather data from the OpenWeatherMap API and displays the temperature, description, time, wind speed, humidity, sunrise, and sunset times for the specified city.

- Search for current weather using input
- Enjoy attractive loader 
- Get needed details about a current weather of the city

## Prerequisites

- Node.js and npm should be installed on your machine.

## Getting Started

Follow the steps below to get started with the Current Weather Application:

1. Clone the repository:

   ```bash
   git clone https://github.com/JohnnyKoshev/CurrentWeather.git
   ```

2. Navigate to the project directory:

   ```bash
   cd CurrentWeather
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Replace the `apiKey` variable in the `Weather` class (`index.ts`) with your OpenWeatherMap API key. You can obtain an API key by signing up at [OpenWeatherMap](https://openweathermap.org/).

5. Build the TypeScript code:

   ```bash
   npm run build
   ```

6. Open the `index.html` file in your preferred web browser.

## Features

### ************************************************************
- Only one input (on any language) is needed to get the weather data
- The result is displayed when the loader becomes unvisible
- Humidity, Wind speed, Temperature and even current time with sunrise/sunset times are available to be seen
- You can reinput using the bottom field for input
- If the city is not found, then the user-friendly error message is demonstrated

### ************************************************************

## User Flow -- Operations
- Introduction Page
    - Initially, you are asked to type the name of the city
     
    ![](https://i.ibb.co/HtRdH2D/Screenshot-1.png)
    ![](https://i.ibb.co/HqgRxz6/Screenshot-2.png)
    
    - Then, a loader will be shown to you
    
    ![](https://iili.io/r3gOhv.md.png)
    
    - After that, if the city is found, all the weather data becomes visible for a user
     
    ![](https://i.ibb.co/TLWTWn1/Screenshot-6.png)
    
    - From this page, you are able to search for the weather of another city too. Just type into a bottom field
    
    ![](https://i.ibb.co/jGxSHgp/Screenshot-8.png)
    
    - Then, defaultly, the information about this city will be demonstrated to you
    
    ![](https://i.ibb.co/Q8z8q5x/Screenshot-9.png)
    
    Notice that, everytime the weather state icon changes depending on the weather
    
    - In case you type an error name of the city, then you get following results:
    
    ![](https://i.ibb.co/SRwsfDn/Screenshot-10.png)
    ![](https://i.ibb.co/nfBySNt/Screenshot-11.png)
    
    - Lastly, in order to return back to the Introduction Page, click on the corresponding button:
    
    ![](https://i.ibb.co/G7fDPP6/Screenshot-12.png)
    
## License

The project is licensed under the MIT License.
