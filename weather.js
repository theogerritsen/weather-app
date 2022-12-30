import axios from "axios"

// https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,windspeed_10m_max&current_weather=true&timeformat=unixtime

export function getWeather(lat, lon, timezone) {
    return axios.get("https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,windspeed_10m_max&current_weather=true&timeformat=unixtime", {
        // ajout dynamique de la latitude, longitude et timezone
    params: {
            latitude: lat,
            longitude: lon,
            timezone
        }
    }).then(({data}) => {
        return {
            current: parseCurrentWeather(data),
            daily: parseDailyWeather(data),
            hourly: parseHourlyWeather(data),
        }
    })
}

// traitement des données
function parseCurrentWeather ({ current_weather, daily}) {
    const { 
        // on va chercher les quatre données suivantes
        temperature: currentTemp, 
        windspeed: windSpeed, 
        weathercode: iconCode
    } = current_weather
    const {
        // on va chercher les array des données suivantes et on prend uniquement
        // la première valeur (qui est la plus récente)
        temperature_2m_max: [maxTemp],
        temperature_2m_min: [minTemp],
        apparent_temperature_max: [maxFeelsLike],
        apparent_temperature_min: [minFeelsLike],
        precipitation_sum: [precip],
    } = daily
    return {
        // on redéfinit les variables (avec arrondi)
        currentTemp: Math.round(currentTemp),
        highTemp:  Math.round(maxTemp),
        lowTemp:  Math.round(minTemp),
        highFeelsLike:  Math.round(maxFeelsLike),
        lowFeelsLike:  Math.round(minFeelsLike),
        windSpeed: Math.round(windSpeed),
        precip:  Math.round(precip * 100) / 100,
        iconCode,
    }
}

function parseDailyWeather({ daily }) {
    return daily.time.map((time, index) => {
        return {
            timestamp: time * 1000,
            iconeCode: daily.weathercode[index],
            maxTemp: Math.round(daily.temperature_2m_max[index]),
        }
    })
}

function parseHourlyWeather({ hourly, current_weather}) {
    return hourly.time.map((time, index) => {
        return {
            timestamp: time * 1000,
            iconCode: hourly.weathercode[index],
            temp: Math.round(hourly.temperature_2m[index]),
            feelsLike: Math.round(hourly.apparent_temperature[index]),
            windSpeed: Math.round(hourly.windspeed_10m[index]),
            precip: Math.round(hourly.precipitation[index] * 100) / 100,
        }
    }).filter(({ timestamp}) => timestamp >= current_weather.time * 1000)
}