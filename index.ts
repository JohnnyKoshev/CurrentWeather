import { Coordinates, CurrentDate, Time, WeatherData, WeatherDataPromise, WeatherInfo } from "./types/types";

class Weather {
    private apiKey = "e56499d5d95efb067dcb084616022700";
    private inputEls = document.querySelectorAll("input");
    private cityNameEl = document.querySelector(".city-name");
    private cityDateEl = document.querySelector(".city-date");
    private weatherTempEl = document.querySelector(".weather-temperature");
    private weatherDescriptionEl = document.querySelector(".weather-description");
    private weatherTimeEl = document.querySelector(".weather-time");
    private weatherSunriseEl = document.querySelector(".weather-sunrise-time");
    private weatherSunsetEl = document.querySelector(".weather-sunset-time");
    private weatherWindEl = document.querySelector(".weather-other-details-wind-value");
    private weatherHumidityEl = document.querySelector(".weather-other-details-humidity-value");
    private weatherIcon: HTMLImageElement | null = document.querySelector(".weather-icon");
    private welcomeContainer = document.querySelector(".welcome-container");
    private weatherDetailsContainer = document.querySelector(".weather-details-container");
    private isSettled: boolean = false;
    private loaderContainer = document.querySelector(".loader-container");
    private errorContainer = document.querySelector(".error-container");
    private errorBtn: HTMLButtonElement | null = document.querySelector(".error-button");
    private audioPlayer: HTMLAudioElement | null = document.querySelector(".audio-player");


    private async getLonLat(city: string): Coordinates {
        const cityInfo = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${this.apiKey}&units=metric`)
            .then((res: Response) => {
                return res.json();
            })
            .then((data) => {
                return data;
            });
        if (cityInfo[0]) {
            const { lon, lat } = await cityInfo[0];
            return { lon, lat };
        } else
            throw new Error("Invalid City Name");
    }

    private getCurrentWeatherData(city: string) {
        const coordinates = this.getLonLat(city);
        return coordinates.then((data): WeatherDataPromise => {
            const { lat, lon } = data;
            return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`)
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    return data;
                });
        });
    }


    private getValidMinutes(minutes: number) {
        if (minutes < 10)
            return `0${minutes}`;
        return minutes.toString();
    }

    private getCurrentDay(fullDate: string) {
        const splitFullDate = fullDate.split(",");
        return splitFullDate[0];
    }

    private getCurrentTime(city: string) {
        const date = new Date();
        const weatherData = this.getCurrentWeatherData(city);
        return weatherData.then((data): CurrentDate => {
                date.setUTCHours(date.getUTCHours() + data.timezone / 3600);
                return {
                    time: `${date.getUTCHours()}:${this.getValidMinutes(date.getUTCMinutes())}`,
                    day: this.getCurrentDay(date.toUTCString())
                };
            }
        );
    }


    private assignInfo(obj: WeatherInfo) {
        const {
            cityName,
            countryName,
            cityDate,
            weatherTemp,
            weatherDescription,
            dayTime,
            weatherSunrise,
            weatherSunset,
            weatherWind,
            weatherHumidity,
            weatherIconSrc,
            weatherMain
        } = obj;
        if (
            this.cityNameEl &&
            this.cityDateEl &&
            this.weatherWindEl &&
            this.weatherSunsetEl &&
            this.weatherTimeEl &&
            this.weatherTempEl &&
            this.weatherSunriseEl &&
            this.weatherHumidityEl &&
            this.weatherDescriptionEl &&
            this.weatherIcon &&
            this.audioPlayer
        ) {
            this.cityNameEl.innerHTML = `${cityName}, ${countryName}`;
            this.cityDateEl.innerHTML = cityDate;
            this.weatherTempEl.innerHTML = `${weatherTemp}&#8451`;
            this.weatherDescriptionEl.innerHTML = weatherDescription;
            this.weatherTimeEl.innerHTML = dayTime;
            this.weatherSunriseEl.innerHTML = weatherSunrise;
            this.weatherSunsetEl.innerHTML = weatherSunset;
            this.weatherWindEl.innerHTML = `${weatherWind} m/s`;
            this.weatherHumidityEl.innerHTML = `${weatherHumidity} %`;
            this.weatherIcon.src = weatherIconSrc;
            this.audioPlayer.src = `audio/${weatherMain.toLowerCase()}.mp3`;
            this.audioPlayer.volume = 0.4;

            this.validateWeatherIcon(weatherMain, dayTime);
        }

    }

    private makeValidCityName(cityName: string): string {
        let cityNameArr = cityName.toLocaleLowerCase().split("");
        cityNameArr[0] = cityNameArr[0].toUpperCase();
        return cityNameArr.join("");
    }

    private convertEpochToTime(seconds: number, timezone: number = 0): Time {
        const date = new Date(seconds * 1000);
        date.setUTCHours(date.getUTCHours() + timezone);
        return {
            hours: date.getUTCHours(),
            minutes: date.getUTCMinutes()
        };
    }

    private detectDayTime(sunrise: Time, sunset: Time, currentTime: Time) {
        if ((currentTime.hours <= sunset.hours) && (currentTime.hours >= sunrise.hours)) {
            if (currentTime.hours === sunset.hours) {
                if (currentTime.minutes < sunset.minutes) {
                    return "day";
                }
            } else if (currentTime.hours === sunrise.hours) {
                if (currentTime.minutes > sunrise.minutes) {
                    return "day";
                }
            } else {
                return "day";
            }
        }
        return "night";
    }

    private getWeatherIconSrc(weatherCondition: string, dayTime: string = "") {
        const splitWeatherCondition = weatherCondition.toLowerCase().split(" ");
        if (splitWeatherCondition.length > 1) {
            return `img/${splitWeatherCondition[0]}-${splitWeatherCondition[1]}-${dayTime}.png`;
        }
        return `img/${splitWeatherCondition[0]}-${dayTime}.png`;
    }

    private validateWeatherIcon(weatherMain: string, dayTime: string) {
        this.weatherIcon?.addEventListener("error", () => {
            if (this.weatherIcon && this.weatherIcon.height === 0) {
                this.weatherIcon.src = this.getWeatherIconSrc(weatherMain, dayTime);
            }
        });
    }


    private handleCatch(inputEl: HTMLInputElement) {
        this.isSettled = true;
        this.loaderContainer?.classList.add("hidden");
        this.errorContainer?.classList.remove("hidden");
        this.weatherDetailsContainer?.classList.add("hidden");
        if (this.audioPlayer)
            this.audioPlayer.src = "";
        this.onErrBtnClick();
        if (inputEl)
            inputEl.value = "";
    }

    private async demonstrateInfo(inputEl: HTMLInputElement, data: WeatherData) {
        if (inputEl && this.welcomeContainer && this.weatherDetailsContainer && this.weatherIcon) {
            const currentTime = await this.getCurrentTime(inputEl.value);
            const currentTimeObj: Time = {
                hours: parseInt(currentTime.time.split(":")[0]),
                minutes: parseInt(currentTime.time.split(":")[1])
            };
            const sunriseTime = this.convertEpochToTime(data.sys.sunrise, data.timezone / 3600);
            const sunsetTime = this.convertEpochToTime(data.sys.sunset, data.timezone / 3600);
            const dayTime = this.detectDayTime(sunriseTime, sunsetTime, currentTimeObj);
            const weatherInfo: WeatherInfo = {
                cityName: this.makeValidCityName(data.name),
                countryName: data.sys.country,
                cityDate: `${currentTime.day}, ${currentTime.time}`,
                weatherTemp: data.main.temp.toString(),
                weatherDescription: data.weather[0].description,
                dayTime,
                weatherSunrise: `${sunriseTime.hours}:${this.getValidMinutes(sunriseTime.minutes)}`,
                weatherSunset: `${sunsetTime.hours}:${this.getValidMinutes(sunsetTime.minutes)}`,
                weatherWind: data.wind.speed.toString(),
                weatherHumidity: data.main.humidity.toString(),
                weatherIconSrc: this.getWeatherIconSrc(data.weather[0].description, dayTime),
                weatherMain: data.weather[0].main
            };
            this.assignInfo(weatherInfo);
            inputEl.value = "";
            this.isSettled = true;
        }
    }

    private onErrBtnClick() {
        this.errorBtn?.addEventListener("click", () => {
            this.errorContainer?.classList.add("hidden");
            this.welcomeContainer?.classList.remove("hidden");
        });
    }

    public listenToInput() {
        document.addEventListener("keydown", (e) => {
            if (this.inputEls) {
                this.inputEls.forEach((inputEl) => {
                    if (e.key === "Enter" && inputEl.value !== "") {
                        this.isSettled = false;
                        const interval = setInterval(() => {
                            if (!this.isSettled) {
                                this.loaderContainer?.classList.remove("hidden");
                                this.welcomeContainer?.classList.add("hidden");
                                this.weatherDetailsContainer?.classList.add("hidden");
                            }
                        }, 10);

                        setTimeout(() => {
                            this.getCurrentWeatherData(inputEl.value).then(async (data) => {
                                await this.demonstrateInfo(inputEl, data);
                                this.loaderContainer?.classList.add("hidden");
                                this.welcomeContainer?.classList.add("hidden");
                                this.weatherDetailsContainer?.classList.remove("hidden");
                                clearInterval(interval);
                            }).catch(() => {
                                this.handleCatch(inputEl);
                            });
                        }, 1000);

                    }
                });


            }
        });


    }
}

const weather = new Weather();

weather.listenToInput();




