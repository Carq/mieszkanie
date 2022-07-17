import React from "react";
import Chart from "react-apexcharts";
import CircularProgress from "@mui/material/CircularProgress";
import PropTypes from "prop-types";
import maxBy from "lodash/maxBy";
import minBy from "lodash/minBy";
import meanBy from "lodash/meanBy";
import { calculateDateTimeFormatAsString } from "../../utils";

import "./styles.scss";

class WeatherTileContentGraph extends React.Component {
  render() {
    const { loadingData } = this.props;

    return (
      <React.Fragment>
        {loadingData && (
          <div className="weather-tile-graph">
            <CircularProgress size={60} thickness={5} />
          </div>
        )}
        {loadingData === false && this.renderChart()}
      </React.Fragment>
    );
  }

  renderChart = () => {
    const { data } = this.props;

    const series = [
      {
        name: "Temperature",
        data: data.map((i) => [new Date(i.addedOn).getTime(), i.temperature]),
      },
      {
        name: "Humidity",
        data: data.map((i) => [new Date(i.addedOn).getTime(), i.humidity]),
      },
    ];

    let tempMaxData = maxBy(data, "temperature");
    let tempMax = tempMaxData?.temperature;
    let tempMaxDate = new Date(tempMaxData?.addedOn).getTime();

    let tempMinData = minBy(data, "temperature");
    let tempMin = tempMinData?.temperature;
    let tempMinDate = new Date(tempMinData?.addedOn).getTime();
    const tempAvg = meanBy(data, "temperature")?.toFixed(1);
    let diff = tempMax - tempMin;

    let tempOffset = 0.5;
    if (diff <= 3) {
      tempOffset = 5 - diff;
    }

    let humidityMax = 105;
    let humidityMin = 10;

    const options = {
      chart: {
        zoom: {
          enabled: false,
          autoScaleYaxis: true,
        },
        toolbar: {
          show: false,
        },
      },
      grid: {
        show: true,
        borderColor: "#747474",
        strokeDashArray: 0,
        row: {
          colors: ["#b6b6b6", "#747474"],
          opacity: 0.1,
        },
      },
      annotations: {
        position: "front",
        points: [
          {
            x: tempMaxDate,
            y: tempMax,
            marker: {
              fillColor: "red",
              strokeWidth: 2,
              strokeColor: "#f2f2f2",
              size: 6,
            },
            label: {
              borderWidth: 0,
              offsetX: tempMaxDate > tempMinDate ? -15 : 0,
              style: {
                background: "#e60073",
              },

              text: "Max " + tempMax + "°C",
            },
          },
          {
            x: tempMinDate,
            y: tempMin,
            marker: {
              fillColor: "darkgreen",
              strokeWidth: 2,
              strokeColor: "#f2f2f2",
              size: 6,
            },
            label: {
              borderWidth: 0,
              offsetY: 40,
              offsetX: tempMaxDate > tempMinDate ? 15 : 0,
              style: {
                background: "darkgreen",
              },

              text: "Min " + tempMin + "°C",
            },
          },
        ],
        yaxis: [
          {
            y: tempAvg,
            strokeDashArray: 5,
            borderColor: "#bf80ff",
            borderWidth: 1,
            label: {
              text: tempAvg + "°C",
              position: "left",
              offsetY: 5,
              borderWidth: 0,
              textAnchor: "right",
              style: {
                background: "#b366ff",
              },
            },
          },
        ],
      },
      xaxis: {
        type: "datetime",
        labels: {
          datetimeUTC: false,
        },
        axisTicks: {
          show: true,
        },
      },
      yaxis: [
        {
          show: false,
          tickAmount: 5,
          min: tempMin - tempOffset,
          max: tempMax + tempOffset,
          labels: {
            show: true,
          },
        },
        { show: false, min: humidityMin, max: humidityMax, tickAmount: 5 },
      ],
      dataLabels: {
        enabled: false,
      },
      colors: ["#ff6600", "#99ccff"],
      fill: {
        type: "solid",
        opacity: [0.05, 0.05],
      },
      legend: {
        show: false,
      },
      tooltip: {
        x: {
          format: calculateDateTimeFormatAsString(data.map((i) => i.addedOn)),
        },
      },
      theme: {
        mode: "dark",
      },
    };

    return (
      <Chart
        options={options}
        series={series}
        type="area"
        height="100%"
        width="100%"
      />
    );
  };
}

WeatherTileContentGraph.propTypes = {
  data: PropTypes.array.isRequired,
  loadingData: PropTypes.bool,
};

export default WeatherTileContentGraph;
