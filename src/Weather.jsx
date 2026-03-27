import { useEffect, useState } from "react";

function Weather() {

  const [weather,setWeather] = useState(null);

  useEffect(()=>{

    fetch("https://api.weatherapi.com/v1/current.json?key=332999ba288d41549d1112711261403&q=Cairo")
    .then(res=>res.json())
    .then(data=>{
      setWeather(data);
    })

  },[])

  if(!weather) return <p>Loading...</p>

  return(

    <div className="weatherBox">

      <h3>{weather.location.name}</h3>

      <img src={weather.current.condition.icon} alt="weather"/>

      <h1>{weather.current.temp_c}°C</h1>

      <p>{weather.current.condition.text}</p>

      <p>Humidity: {weather.current.humidity}%</p>

      <p>Wind: {weather.current.wind_kph} km/h</p>

    </div>

  )

}

export default Weather