import React, { Component } from 'react';
import Weather from './components/Weather';
import UVI from './components/UVI';
import Footer from './components/Footer';
import './App.scss';

const OPEN_WEATHER_API_KEY = process.env.REACT_APP_OPEN_WEATHER_API_KEY;
const OPEN_UV_API_KEY = process.env.REACT_APP_OPEN_UV_API_KEY;

class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      error: false,
      errorMessage: '',
      latitude: undefined,
      longitude: undefined,
      temperature: undefined,
      weatherIcon: undefined,
      cityName: undefined,
      countryCode: undefined,
      uvi: undefined,
      uviLevel: '',
      bgColor: ''
    };

    this.reloadPage = this.reloadPage.bind(this);
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    this.getCoordinates();
  }

  componentDidUpdate() {
    console.log(this.state);
  }

  getCoordinates() {
    const success = (position) => {
      this.setState({ isLoading: true });

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      this.setState({
        latitude: latitude,
        longitude: longitude
      })

      this.getData(latitude, longitude);
    }

    const error = (err) => {
      this.setState({ error: true, errorMessage: err.message });
      alert('Unable to retrieve location.');
    }

    if (navigator.geolocation) {
      this.setState({ isLoading: true });
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      alert('Your browser does not support location tracking, or permission is denied.');
    }
  }

  getData(latitude, longitude) {
    const openWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPEN_WEATHER_API_KEY}&units=metric`;

    const openUVUrl = `https://api.openuv.io/api/v1/uv?lat=${latitude}&lng=${longitude}`;

    Promise.all([fetch(openWeatherUrl), fetch(openUVUrl, { headers: { 'x-access-token': OPEN_UV_API_KEY } })])
      .then(responses => Promise.all(responses.map(response => response.json())))
      .then(data => {
        this.setState({
          temperature: Math.floor(data[0].main.temp),
          weatherIcon: data[0].weather[0].icon.substring(0, data[0].weather[0].icon.length - 1),
          cityName: data[0].name,
          countryCode: data[0].sys.country,
          uvi: Math.round((data[1].result.uv + Number.EPSILON) * 100) / 100,
          isLoading: false
        })
        console.log(data[0].weather[0].icon.substring(0, data[0].weather[0].icon.length - 1))

        this.getUVLevel(data[1].result.uv);
      })
      .catch(error => {
        this.setState({
          error: true,
          errorMessage: error.message
        });
        console.warn(`ERROR(${error.code}): ${error.message}`);
      })
  }

  getUVLevel(uvi) {
    let uviLevel = {
      name: '',
      color: ''
    };

    if (0 <= uvi && uvi < 3) {
      uviLevel.name = 'Low';
      uviLevel.color = '#558B2F';
    } else if (3 <= uvi && uvi < 6) {
      uviLevel.name = 'Moderate';
      uviLevel.color = '#F9A825';
    } else if (6 <= uvi && uvi < 8) {
      uviLevel.name = 'High';
      uviLevel.color = '#EF6C00';
    } else if (8 <= uvi && uvi < 11) {
      uviLevel.name = 'Very High';
      uviLevel.color = '#B71C1C';
    } else if (11 <= uvi) {
      uviLevel.name = 'Extreme';
      uviLevel.color = '#6A1B9A';
    }

    this.setState({
      uviLevel: uviLevel.name,
      bgColor: uviLevel.color
    });

    this.setBgColor(uviLevel.color);
  }

  setBgColor(color) {
    document.body.style.backgroundColor = color;
  }

  reloadPage() {
    window.location.reload(false);
  }

  render() {
    return (
      <div className='app-wrapper'>
        <Weather temperature={this.state.temperature}
          weatherIcon={this.state.weatherIcon}
          countryCode={this.state.countryCode}
          cityName={this.state.cityName} />
        <UVI uvi={this.state.uvi}
          uviLevel={this.state.uviLevel} />
        <Footer reloadPage={this.reloadPage} />
      </div>
    );
  }
}

export default App;
