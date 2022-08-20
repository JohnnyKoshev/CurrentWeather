export type WeatherDataPromise = Promise<WeatherData>;
export type WeatherData = {
    base: string;
    clouds: { all: number };
    cod: number;
    coord: { lon: number; lat: number };
    dt: number;
    id: number;
    main: {
        temp: number; feels_like: number; temp_min: number; temp_max: number; pressure: number; humidity: number;
    }
    name: string;
    sys: { type: number; id: number; country: string; sunrise: number; sunset: number; }
    timezone: number;
    visibility: number;
    weather: [{
        description: string;
        icon: string;
        id: number;
        main: string;
    }]
    wind: { speed: number; deg: number; }
}
export type Coordinates = Promise<{ lon: number, lat: number }>;
export type CurrentDate = {
    time: string;
    day: string;
}
export type WeatherInfo = {
    cityName: string;
    countryName: string;
    cityDate: string;
    weatherTemp: string;
    weatherDescription: string;
    dayTime: string;
    weatherSunrise: string;
    weatherSunset: string;
    weatherWind: string;
    weatherHumidity: string;
    weatherIconSrc: string;
    weatherMain: string;
}
export type Time = { hours: number; minutes: number }
