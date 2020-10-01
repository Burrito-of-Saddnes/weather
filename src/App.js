import React from 'react';
import { YMaps, Map } from 'react-yandex-maps';

let mapState = { center: [55.75, 37.62], zoom: 10 };

const PLACES = [
  { name: "Moscow", zip: "119296" },
  { name: "Saint Petersburg", zip: "190000" },
  { name: "Vladivostok", zip: "690091" },
  { name: "Angarsk", zip: "600000" }
];

class WeatherDisplay extends React.Component {
  constructor() {
    super();
    this.state = {
      weatherData: null
    };
  }
  componentDidMount() {
    const zip = this.props.zip;
    const URL = "http://api.openweathermap.org/data/2.5/weather?q=" +
      zip +
      "&appid=b1b35bba8b434a28a0be2a3e1071ae5b&units=imperial";
    fetch(URL).then(res => res.json()).then(json => {
      this.setState({ weatherData: json });
    });
  }
  render() {
    const weatherData = this.state.weatherData;
    if (!weatherData) return <div>Loading</div>;
    const weather = weatherData.weather[0];
    const iconUrl = "http://openweathermap.org/img/w/" + weather.icon + ".png";
    return (
      <div>
        <h1>
          {weather.main} in {weatherData.name}
          <img src={iconUrl} alt={weatherData.description}/>
        </h1>
        <p>Current: {(weatherData.main.temp - 32) * 5 / 9}°</p>
        <p>High: {(weatherData.main.temp_max - 32) * 5 / 9}°</p>
        <p>Low: {(weatherData.main.temp_min - 32) * 5 / 9}°</p>
        <p>Wind Speed: {weatherData.wind.speed * 1.6} km/hr</p>
        <p>Coord Lat: {weatherData.coord.lat} lat</p>
        <p>Coord Lon: {weatherData.coord.lon} lon</p>
      </div>
    );
  }
}

class MapBasics extends React.Component {
  state = { showMap: true };

  toggleMap() {
    const { showMap } = this.state;
    this.setState({ showMap: !showMap });
  }

  render() {
    const { showMap } = this.state;
    return (
      <YMaps>
        <div id="map-basics">
          {showMap && <Map state={mapState} />}
          <button onClick={() => this.toggleMap()}>
            {showMap ? 'Delete map' : 'Show map'}
          </button>
        </div>
      </YMaps>
    );
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      activePlace: 0
    };
  }
  render() {
    const activePlace = this.state.activePlace;
    return (
      <div className="App">
        {PLACES.map((place, index) => (
          <button
            key={index}
            onClick={() => {
              this.setState({ activePlace: index });
            }}
          >
            {place.name}
          </button>
        ))}
        <WeatherDisplay key={activePlace} zip={PLACES[activePlace].zip} />
        <MapBasics/>
      </div>
    );
  }
}

export default App;