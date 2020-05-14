import React, { Component } from 'react';
import Weather from './components/Weather';
import UVI from './components/UVI';
import Footer from './components/Footer';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      openUV: {},
      openWeather: {}
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        this.getUVI(latitude, longitude);
        this.getWeather(latitude, longitude);
      })
    } else {
      alert(`Geolocation not supported.`)
    }
  }

  getUVI(latitude, longitude) {
    const openUVKey = `8abf53f19a2e2ef1d14f967f20d313fe`;
    const openUVUrl = `https://api.openuv.io/api/v1/uv?lat=${latitude}&lng=${longitude}`;

    fetch(openUVUrl, {
      headers: {
        'x-access-token': openUVKey
      }
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          isLoading: false,
          openUV: data.result
        })
      })
  }

  getWeather(latitude, longitude) {
    const openWeatherKey = `d3b81061825386ec550afeccafc9425d`;
    const openWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openWeatherKey}`;

    fetch(openWeatherUrl)
      .then(response => response.json())
      .then(data => {
        this.setState({
          isLoading: false,
          openWeather: data
        })
      })
  }

  render() {

    return (
      <div>
        <Weather />
        <UVI />
        <Footer />
      </div>
    )
  }
}

export default App;
