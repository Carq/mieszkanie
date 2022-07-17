import React from "react";
import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { colorStatuses } from "../../constants";
import { colorStatusToClassNames } from "../../utils";
import { weatherData } from "../../propTypes";
import Histogram from "../histogram";
import classNames from "classnames";
import "./styles.scss";

class WeatherTileContent extends React.Component {
  render() {
    const { temperature, humidity, data } = this.props;

    var colorStatus = this.calculateTemperatureColor(temperature);

    return (
      <div className="weather-tile__content">
        <Box justifyContent="center">
          <div className="weather-tile__section">
            <div className="weather-tile__temperature-histogram">
              <Histogram
                data={data.map((item) => ({
                  value: item.temperature,
                  date: item.addedOn,
                }))}
                valueSuffix={"°C"}
                colorData={this.calculateTemperatureColor}
              />
            </div>
            <Typography
              className={classNames(colorStatusToClassNames(colorStatus))}
              variant="h3"
              align="center"
            >{`${temperature.toFixed(1)}°C`}</Typography>
          </div>

          <Typography align="center" color="textSecondary">
            Temperature
          </Typography>
        </Box>
        <Box mt={2}>
          <div className="weather-tile__section">
            <div className="weather-tile__humidity-histogram">
              <Histogram
                data={data.map((item) => ({
                  value: item.humidity,
                  date: item.addedOn,
                }))}
                valueSuffix={"%"}
                minimalStep={1}
                colorData={() => colorStatuses.AQUA}
              />
            </div>
            <Typography variant="h5" align="center">{`${humidity.toFixed(
              0
            )}%`}</Typography>
          </div>
          <Typography align="center" color="textSecondary">
            Humidity
          </Typography>
        </Box>
      </div>
    );
  }

  calculateTemperatureColor = (temperature) => {
    if (temperature > 25) return colorStatuses.RED;
    if (temperature > 23) return colorStatuses.AMBER;
    if (temperature > 19) return colorStatuses.LIGHTGREEN;
    if (temperature > 4) return colorStatuses.LIGHTBLUE;
    return colorStatuses.BLUE;
  };
}

WeatherTileContent.propTypes = {
  temperature: PropTypes.number.isRequired,
  humidity: PropTypes.number,
  data: PropTypes.arrayOf(weatherData),
};

export default WeatherTileContent;
