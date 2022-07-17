import React from "react";
import { Box, Typography } from "@mui/material";
import "./styles.scss";
import Histogram from "../histogram";
import PropTypes, { object } from "prop-types";
import { integerConfiguration } from "../../propTypes";

class IntegerTileContent extends React.Component {
  render() {
    const { current, data, configuration } = this.props;
    const { unit, description } = configuration;

    return (
      <div className="integer-tile-content">
        <Box justifyContent="center">
          <div className="integer-tile__current-section ">
            <Typography variant="h2" align="center">
              {current}
            </Typography>
            <div className="integer-tile__primary-unit">
              <Typography align="center">{unit}</Typography>
            </div>
          </div>
          <Typography color="textSecondary" align="center">
            {description}
          </Typography>
        </Box>
        <Box justifyContent="center">
          <div className="integer-tile__current-section ">
            <div className="integer-tile__histogram">
              <Histogram
                data={data.map((item) => ({
                  value: item.value,
                  date: item.addedOn,
                }))}
              />
            </div>
          </div>
          <Typography color="textSecondary" align="center">
            History
          </Typography>
        </Box>
      </div>
    );
  }

  renderValues = (value, unit) => {
    if (value === undefined || value === null) {
      return "-";
    }

    if (unit) {
      return `${value} ${unit}`;
    }

    return value;
  };
}

IntegerTileContent.propTypes = {
  current: PropTypes.number.isRequired,
  configuration: integerConfiguration,
  data: PropTypes.arrayOf(object),
};

export default IntegerTileContent;
