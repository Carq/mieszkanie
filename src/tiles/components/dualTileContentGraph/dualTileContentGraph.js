import React from "react";
import Chart from "react-apexcharts";
import CircularProgress from "@mui/material/CircularProgress";
import PropTypes from "prop-types";
import { dualConfiguration } from "../../propTypes";
import maxBy from "lodash/maxBy";
import { calculateDateTimeFormatAsString } from "../../utils";

import "./styles.scss";

class DualTileContentGraph extends React.Component {
  render() {
    const { loadingData } = this.props;

    return (
      <React.Fragment>
        {loadingData && (
          <div className="dual-tile-graph">
            <CircularProgress size={60} thickness={5} />
          </div>
        )}
        {loadingData === false && this.renderChart()}
      </React.Fragment>
    );
  }

  renderChart = () => {
    const { data, configuration } = this.props;

    const primaryDecimalPlaces = configuration.primaryIntegerOnly ? 0 : 1;
    const secondaryDecimalPlaces = configuration.secondaryIntegerOnly ? 0 : 1;
    const primaryColor = configuration.primaryGraphColor || "#0FDF7D";
    const secondaryColor = configuration.secondaryGraphColor || "#3797D5";

    const series = [
      {
        name:
          configuration.primaryName +
            (configuration.primaryUnit && ` ${configuration.primaryUnit}`) ||
          "Primary",
        data: data.map((i) => [
          new Date(i.addedOn).getTime(),
          i.primary.toFixed(primaryDecimalPlaces),
        ]),
      },
      {
        name:
          configuration.secondaryName +
            (configuration.secondaryUnit &&
              ` ${configuration.secondaryUnit}`) || "Secondary",
        data: data.map((i) => [
          new Date(i.addedOn).getTime(),
          i.secondary.toFixed(secondaryDecimalPlaces),
        ]),
      },
    ];

    let primaryHighestValue = Number(
      maxBy(data, "primary")?.primary.toFixed(primaryDecimalPlaces)
    );

    let secondaryHighestValue = Number(
      maxBy(data, "secondary")?.secondary.toFixed(primaryDecimalPlaces)
    );

    let primaryOffset = 5;

    let primaryMax =
      configuration.primaryMaxGraphValue || primaryHighestValue + primaryOffset;
    let primaryMin = isNaN(configuration.primaryMinGraphValue)
      ? 0
      : configuration.primaryMinGraphValue;
    let secondaryMax =
      configuration.secondaryMaxGraphValue ||
      secondaryHighestValue + primaryOffset;
    let secondaryMin = configuration.secondaryMinGraphValue || 0;

    if (
      configuration.primaryAndSecondaryHaveTheSameYAxis &&
      (!configuration.secondaryMaxGraphValue ||
        !configuration.primaryMaxGraphValue)
    ) {
      primaryMax = Math.max(primaryMax, secondaryMax);
      secondaryMax = Math.max(primaryMax, secondaryMax);
    }

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
      stroke: {
        curve: "smooth",
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
          min: primaryMin,
          max: primaryMax,
          labels: {
            show: true,
          },
        },
        { show: false, min: secondaryMin, max: secondaryMax, tickAmount: 5 },
      ],
      dataLabels: {
        enabled: false,
      },
      colors: [primaryColor, secondaryColor],
      fill: {
        type: "solid",
        opacity: [0.9, 0.6],
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

    if (
      !isNaN(configuration.primaryGreenValue) &&
      !isNaN(configuration.primaryYellowValue) &&
      !isNaN(configuration.primaryRedValue)
    ) {
      options.annotations = {
        position: "front",
        yaxis: [
          {
            y: configuration.primaryYellowValue,
            strokeDashArray: 0,
            borderColor: "#D5A406",
            borderWidth: 2,
            label: {
              text:
                configuration.primaryYellowValue +
                ` ${configuration.primaryUnit}`,
              position: "left",
              borderWidth: 0,
              textAnchor: "start",
              style: {
                background: "#D5A406",
              },
            },
          },
          {
            y: configuration.primaryRedValue,
            strokeDashArray: 0,
            borderColor: "red",
            borderWidth: 2,
            label: {
              text:
                configuration.primaryRedValue + ` ${configuration.primaryUnit}`,
              position: "left",
              borderWidth: 0,
              textAnchor: "start",
              style: {
                background: "red",
              },
            },
          },
          {
            y: Math.min(
              configuration.primaryYellowValue,
              configuration.primaryRedValue
            ),
            y2: Math.max(
              configuration.primaryYellowValue,
              configuration.primaryRedValue
            ),
            strokeDashArray: 0,
            opacity: 0.1,
            fillColor: "yellow",
            borderWidth: 0,
          },
          {
            y: Math.min(
              configuration.primaryGreenValue,
              configuration.primaryYellowValue
            ),
            y2: Math.max(
              configuration.primaryGreenValue,
              configuration.primaryYellowValue
            ),
            strokeDashArray: 0,
            opacity: 0.2,
            fillColor: "green",
            borderWidth: 1,
          },
          {
            y: configuration.primaryRedValue,
            y2: configuration.lowerIsBetter ? 10000 : 0,
            strokeDashArray: 0,
            opacity: 0.2,
            fillColor: "tomato",
          },
        ],
      };
    }

    return (
      <Chart
        options={options}
        series={series}
        type="line"
        height="100%"
        width="100%"
      />
    );
  };
}

DualTileContentGraph.propTypes = {
  data: PropTypes.array.isRequired,
  configuration: dualConfiguration,
  loadingData: PropTypes.bool,
};

export default DualTileContentGraph;
