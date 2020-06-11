import React from 'react';

const Weather = props => {

  const getIconSrc = id => {
    return `./assets/${id}.svg`;
  }

  return (
    <div className="app-weather">
      <img className='weather-icon' src={getIconSrc(props.weatherIcon)} alt="weather icon" />
      <div className='weather-values'>
        <p className='weather-temp'>{props.temperature} °C</p>
        <p className='weather-local'>{props.cityName}, {props.countryCode}</p>
      </div>
    </div>
  );
}

export default Weather