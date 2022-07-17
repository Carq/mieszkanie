import React from "react";
import PropTypes from "prop-types";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { Box, Typography } from "@mui/material";
import groupBy from "lodash/groupBy";
import orderBy from "lodash/orderBy";
import config from "config";
import "./styles.scss";
import TilesGroup from "../tilesGroup";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

class Dashboard extends React.Component {
  state = { lastGroups: undefined, lastAccordionsState: {} };

  componentDidMount = () => {
    const { getAllTiles } = this.props;
    var groups = localStorage.getItem("groups");
    if (groups) {
      this.setState({
        lastGroups: JSON.parse(groups),
      });
    }

    var lastAccordionsState = localStorage.getItem("lastAccordionsState");
    if (lastAccordionsState) {
      this.setState({
        lastAccordionsState: JSON.parse(lastAccordionsState),
      });
    }

    this.setupNotifications();

    getAllTiles();
  };

  setupNotifications() {
    const signalRConnection = new HubConnectionBuilder()
      .withUrl(`${config.api.URL}/notifications`)
      .build();
    signalRConnection.start().catch((err) => {
      console.log("Connection error" + err);
    });
    signalRConnection.on("NewData", (tileName, tileType, newValue) => {
      const { getTile } = this.props;
      getTile(tileName, tileType.toLowerCase(), newValue);
    });
  }

  componentDidUpdate(prevProps) {
    const { error, enqueueSnackbar, tiles, isLoadingMetrics } = this.props;
    if (prevProps.error !== error && error) {
      enqueueSnackbar(error, {
        variant: "error",
      });
    }

    if (prevProps.tiles.length !== tiles.length && !isLoadingMetrics) {
      var grouped = this.groupTiles(tiles);
      localStorage.setItem(
        "groups",
        JSON.stringify(
          grouped.map((group) => ({
            name: group.name,
            count: group.tiles.length,
          }))
        )
      );
    }
  }

  render() {
    const { isLoadingMetrics, tiles } = this.props;
    const { lastGroups, lastAccordionsState } = this.state;

    var grouped = isLoadingMetrics ? lastGroups : this.groupTiles(tiles);

    return (
      <div className="dashboard">
        <Typography variant="h3" color="primary">
          <Box lineHeight={1.4} textAlign="center">
            {config.dashboard.name || "Tiles"}
          </Box>
        </Typography>

        {grouped &&
          grouped.map((group) => (
            <Accordion
              key={group.name}
              className="accordion"
              disableGutters
              expanded={lastAccordionsState[group.name] ?? true}
              onChange={(event, expanded) =>
                this.saveStateOfAccordion(group.name, expanded)
              }
            >
              <AccordionSummary
                className="accordion-header"
                expandIcon={<ExpandMoreIcon />}
              >
                <Typography>{!group.name ? "Main" : group.name}</Typography>
              </AccordionSummary>
              <AccordionDetails className="accordion-details">
                <TilesGroup
                  isLoadingMetrics={isLoadingMetrics}
                  tiles={group.tiles}
                  lastTilesAmount={group.count}
                />
              </AccordionDetails>
            </Accordion>
          ))}
      </div>
    );
  }

  saveStateOfAccordion(groupName, expanded) {
    const { lastAccordionsState } = this.state;
    lastAccordionsState[groupName] = expanded;

    this.setState({
      lastAccordionsState: lastAccordionsState,
    });

    localStorage.setItem(
      "lastAccordionsState",
      JSON.stringify(lastAccordionsState)
    );
  }

  groupTiles(tiles) {
    return Object.entries(
      groupBy(
        orderBy(tiles, (x) => x.group.order, "asc"),
        (tile) => tile.group.name
      )
    ).map((group) => ({
      name: group[0] === "undefined" ? undefined : group[0],
      tiles: group[1],
    }));
  }
}

Dashboard.propTypes = {
  tiles: PropTypes.array,
  isLoadingMetrics: PropTypes.bool.isRequired,
  getAllTiles: PropTypes.func.isRequired,
  getTile: PropTypes.func.isRequired,
};

export default Dashboard;
