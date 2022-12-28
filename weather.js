import axios from "axios"

// https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,windspeed_10m_max&current_weather=true&timeformat=unixtime&timezone=Europe%2FBerlin

export function getWeather(lat, lon, timezone) {
    axios.get("https://api.open-meteo.com/v1/forecast")
}