import React from "react";
import Chart from "react-apexcharts";
import CircularProgress from "@mui/material/CircularProgress";
import PropTypes from "prop-types";
import maxBy from "lodash/maxBy";
import minBy from "lodash/minBy";

import "./styles.scss";

class IntegerTileContentGraph extends React.Component {
  render() {
    const { loadingData } = this.props;

    return (
      <React.Fragment>
        {loadingData && (
          <div className="integer-tile-graph">
            <CircularProgress size={60} thickness={5} />
          </div>
        )}
        {loadingData === false && this.renderChart()}
      </React.Fragment>
    );
  }

  renderChart = () => {
    const { data, configuration, loadingData } = this.props;

    if (loadingData) {
      return;
    }

    const unit = configuration.unit;
    let min = minBy(data, "value")?.value;
    let max = maxBy(data, "value")?.value;

    const series = [
      {
        name: unit || "Value",
        data: data.map((i) => [new Date(i.addedOn).getTime(), i.value]),
      },
    ];

    const options = {
      chart: {
        zoom: {
          enabled: false,
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
      annotations: {
        position: "back",
        yaxis: [
          {
            y: max,
            strokeDashArray: 0,
            borderColor: "mediumvioletred",
            borderWidth: 2,
            label: {
              text: `${max}${unit || ""}`,
              position: "left",
              borderWidth: 0,
              textAnchor: "start",
              style: {
                background: "mediumvioletred",
              },
            },
          },
          {
            y: min,
            strokeDashArray: 0,
            opacity: 0.2,
            borderColor: "lightgreen",
            borderWidth: 2,
            label: {
              text: `${min}${unit || ""}`,
              borderWidth: 0,
              position: "left",
              textAnchor: "start",
              offsetY: 18,
              style: {
                background: "darkgreen",
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
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      tooltip: {
        x: {
          format: "dd MMM",
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
        type="line"
        height="100%"
        width="100%"
      />
    );
  };
}

IntegerTileContentGraph.propTypes = {
  data: PropTypes.array.isRequired,
  configuration: PropTypes.object.isRequired,
  loadingData: PropTypes.bool,
};

export default IntegerTileContentGraph;
