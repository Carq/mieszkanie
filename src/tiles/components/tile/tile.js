import React from "react";
import {
  Box,
  Card,
  IconButton,
  CardActions,
  CardContent,
  Typography,
  Tooltip,
  CardHeader,
} from "@mui/material";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import classNames from "classnames";
import PropTypes from "prop-types";
import { tileTypes, viewModes } from "tiles/constants";
import { tileBasicData } from "tiles/propTypes";
import WeatherTileContent from "../weatherTileContent";
import WeatherTileContentGraph from "../weatherTileContentGraph";
import MetricTileContent from "../metricTileContent";
import MetricTileContentGraph from "../metricTileContentGraph";
import IntegerTileContent from "../integerTileContent";
import IntegerTileContentGraph from "../integerTileContentGraph";
import HeartBeatTileContent from "../heartBeatTileContent";
import DualTileContent from "../dualTileContent";
import DualTileContentGraph from "../dualTileContentGraph";
import AddTileDataDialog from "../addTileDataDialog";

import { convertDateTime, addHours } from "tiles/utils";
import "./styles.scss";
import config from "config";

class Tile extends React.Component {
  state = {
    tileData: [],
    loadingData: false,
    view: viewModes.CURRENT,
    animate: true,
  };

  render() {
    const { basicData, data, configuration } = this.props;
    const { tileData, view, loadingData, animate } = this.state;
    const lastUpdated = data[0].addedOn;
    const graphSupport = basicData.type !== tileTypes.HEARTBEAT;
    const writeModeIsActive =
      (basicData.type === tileTypes.DUAL ||
        basicData.type === tileTypes.INTEGER) &&
      localStorage.getItem("writeSecret");
    const isGraph = view === viewModes.GRAPH;

    if (animate) {
      this.animationInterval = setInterval(this.resetAnimation, 2000);
    }

    return (
      <Card
        className={classNames("card", {
          metric: basicData.type === tileTypes.METRIC && !isGraph,
          weather: basicData.type === tileTypes.WEATHER && !isGraph,
          animate: animate,
        })}
      >
        <CardHeader
          className="card-header"
          style={{ padding: "6px" }}
          title={basicData.name}
          action={
            <React.Fragment>
              {writeModeIsActive && (
                <AddTileDataDialog {...basicData} {...configuration} />
              )}
              {graphSupport && (
                <Tooltip title="History">
                  <IconButton
                    onClick={this.toggleView}
                    color={isGraph ? "primary" : "inherit"}
                    size="medium"
                  >
                    <TimelineOutlinedIcon />
                  </IconButton>
                </Tooltip>
              )}
            </React.Fragment>
          }
        />
        {isGraph && (
          <div className="card__tile-graph">
            {this.renderTileGraph(basicData.type, tileData, loadingData)}
          </div>
        )}
        {view === viewModes.CURRENT && (
          <React.Fragment>
            <CardContent style={{ padding: "4px" }}>
              {this.renderTileContent(basicData.type)}
            </CardContent>
            <CardActions m={0} disableSpacing>
              <Box color="text.hint" fontSize={12} textAlign="left" top={100}>
                Last update: {lastUpdated && convertDateTime(lastUpdated)}
              </Box>
            </CardActions>
          </React.Fragment>
        )}
      </Card>
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.lastUpdated !== this.props.lastUpdated) {
      this.setState({
        animate: true,
      });
    }
  }

  resetAnimation = () => {
    clearInterval(this.animationInterval);
    this.setState({
      animate: false,
    });
  };

  renderTileContent = (type) => {
    const { data, configuration } = this.props;

    switch (type) {
      case tileTypes.WEATHER:
        return this.renderWeatherTileContent(data[0], data);
      case tileTypes.METRIC:
        return this.renderMetricTileContent(data[0], data, configuration);
      case tileTypes.INTEGER:
        return this.renderIntegerTileContent(data[0], data, configuration);
      case tileTypes.HEARTBEAT:
        return this.renderHearBeatTileContent(data[0], data, configuration);
      case tileTypes.DUAL:
        return this.renderDualTileContent(data[0], data, configuration);
      default:
        return this.renderUnsupportedTile();
    }
  };

  renderTileGraph = (type, tileData, loadingData) => {
    const { configuration } = this.props;

    switch (type) {
      case tileTypes.WEATHER:
        return this.renderWeatherTileGraph(tileData, loadingData);
      case tileTypes.METRIC:
        return this.renderMetricTileGraph(tileData, configuration, loadingData);
      case tileTypes.INTEGER:
        return this.renderIntegerTileGraph(
          tileData,
          configuration,
          loadingData
        );
      case tileTypes.DUAL:
        return this.renderDualTileGraph(tileData, loadingData, configuration);
      default:
        return this.renderUnsupportedTile();
    }
  };

  renderWeatherTileContent = (currentData, recentData) => (
    <WeatherTileContent
      temperature={currentData.temperature}
      humidity={currentData.humidity}
      data={recentData}
    />
  );

  renderWeatherTileGraph = (tileData, loadingData) => (
    <WeatherTileContentGraph data={tileData} loadingData={loadingData} />
  );

  renderMetricTileContent = (data, recentData, configuration) => (
    <MetricTileContent
      current={data.value}
      data={recentData}
      configuration={configuration}
    />
  );

  renderMetricTileGraph = (tileData, configuration, loadingData) => (
    <MetricTileContentGraph
      data={tileData}
      configuration={configuration}
      loadingData={loadingData}
    />
  );

  renderIntegerTileContent = (data, recentData, configuration) => (
    <IntegerTileContent
      current={data.value}
      data={recentData}
      configuration={configuration}
    />
  );

  renderIntegerTileGraph = (tileData, configuration, loadingData) => (
    <IntegerTileContentGraph
      data={tileData}
      configuration={configuration}
      loadingData={loadingData}
    />
  );

  renderHearBeatTileContent = (data, recentData, configuration) => (
    <HeartBeatTileContent
      current={data}
      data={recentData}
      configuration={configuration}
    />
  );

  renderDualTileContent = (data, recentData, configuration) => (
    <DualTileContent
      primary={data.primary}
      secondary={data.secondary}
      data={recentData}
      configuration={configuration}
    />
  );

  renderDualTileGraph = (tileData, loadingData, configuration) => (
    <DualTileContentGraph
      data={tileData}
      loadingData={loadingData}
      configuration={configuration}
    />
  );

  renderUnsupportedTile = () => (
    <Box textAlign="center">
      <Typography color="error">Unsupported Tile</Typography>
    </Box>
  );

  toggleView = () => {
    const { view } = this.state;

    this.setState(
      {
        view: view === viewModes.CURRENT ? viewModes.GRAPH : viewModes.CURRENT,
      },
      this.loadDataForGraphs
    );
  };

  loadDataForGraphs = () => {
    const { basicData } = this.props;
    const { loadingData, loadedDate, view } = this.state;

    if (view !== viewModes.GRAPH) {
      return;
    }

    if (loadingData || (loadedDate && addHours(loadedDate, 1) > Date.now())) {
      return;
    }

    this.setState(
      {
        loadingData: true,
      },
      this.makeRequestForTileData(basicData)
    );
  };

  makeRequestForTileData(basicData) {
    var query =
      basicData.type === tileTypes.WEATHER
        ? "since?hours=16"
        : "recent?amountOfData=30";

    fetch(
      `${config.api.URL}/tiles/${basicData.type}/${basicData.name}/${query}`,
      {
        headers: {
          Authorization: localStorage.getItem("secret"),
        },
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            tileData: result,
            loadingData: false,
            loadedDate: Date.now(),
          });
        },
        (error) => {
          this.setState({
            loadingData: false,
          });
          console.error(error);
        }
      );
  }
}

Tile.propTypes = {
  basicData: tileBasicData.isRequired,
  data: PropTypes.arrayOf(PropTypes.object),
  configuration: PropTypes.object,
  lastUpdated: PropTypes.string,
};

export default Tile;
