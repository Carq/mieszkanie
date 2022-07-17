import React from "react";
import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { colorStatuses } from "../../constants";
import { colorStatusToClassNames } from "../../utils";
import { dualData, dualConfiguration } from "../../propTypes";
import Histogram from "../histogram";
import classNames from "classnames";
import "./styles.scss";

class DualTileContent extends React.Component {
  render() {
    const { primary, secondary, data, configuration } = this.props;
    var primaryColorStatus = this.calculatePrimaryColor(primary);
    var secondaryColorStatus = this.calculateSecondaryColor(secondary);

    const primaryDecimalPlaces = configuration.primaryIntegerOnly ? 0 : 1;
    const secondaryDecimalPlaces = configuration.secondaryIntegerOnly ? 0 : 1;

    return (
      <div className="dual-tile__content">
        <Box justifyContent="center">
          <div className="dual-tile__section">
            <div className="dual-tile__primary-histogram">
              <Histogram
                data={data.map((item) => ({
                  value: Number(item.primary.toFixed(primaryDecimalPlaces)),
                  date: item.addedOn,
                }))}
                minimalStep={1}
                valueSuffix={configuration.primaryUnit}
                colorData={this.calculatePrimaryColor}
              />
            </div>
            <Typography
              className={classNames(
                colorStatusToClassNames(primaryColorStatus)
              )}
              variant="h2"
              align="center"
            >{`${primary.toFixed(primaryDecimalPlaces)}`}</Typography>
            <div className="dual-tile__primary-unit">
              <Typography
                align="center"
                className={classNames(
                  colorStatusToClassNames(primaryColorStatus)
                )}
                variant="subtitle1"
              >
                {configuration.primaryUnit}
              </Typography>
            </div>
          </div>

          <Typography align="center" color="textSecondary">
            {configuration.primaryName || "Primary"}
          </Typography>
        </Box>
        <Box mt={2}>
          <div className="dual-tile__section">
            <div className="dual-tile__secondary-histogram">
              <Histogram
                data={data.map((item) => ({
                  value: Number(item.secondary.toFixed(secondaryDecimalPlaces)),
                  date: item.addedOn,
                }))}
                valueSuffix={configuration.secondaryUnit}
                minimalStep={1}
                colorData={this.calculateSecondaryColor}
              />
            </div>
            <Typography
              variant="h4"
              align="center"
              className={classNames(
                colorStatusToClassNames(secondaryColorStatus)
              )}
            >{`${secondary.toFixed(secondaryDecimalPlaces)}`}</Typography>
            <div className="dual-tile__secondary-unit">
              <Typography
                align="center"
                className={classNames(
                  colorStatusToClassNames(secondaryColorStatus)
                )}
                variant="subtitle2"
              >
                {configuration.secondaryUnit}
              </Typography>
            </div>
          </div>
          <Typography align="center" color="textSecondary">
            {configuration.secondaryName || "Secondary"}
          </Typography>
        </Box>
      </div>
    );
  }

  calculateColor = (value, greenValue, yellowValue, redValue) => {
    if (!isNaN(redValue) && value > redValue) return colorStatuses.RED;
    if (!isNaN(yellowValue) && value > yellowValue) return colorStatuses.AMBER;
    if (!isNaN(greenValue) && value > greenValue) return colorStatuses.GREEN;
    return colorStatuses.SILVER;
  };

  calculatePrimaryColor = (value) => {
    const { configuration } = this.props;
    return this.calculateColor(
      value,
      configuration.primaryGreenValue,
      configuration.primaryYellowValue,
      configuration.primaryRedValue
    );
  };

  calculateSecondaryColor = (value) => {
    const { configuration } = this.props;
    return this.calculateColor(
      value,
      configuration.secondaryGreenValue,
      configuration.secondaryYellowValue,
      configuration.secondaryRedValue
    );
  };
}

DualTileContent.propTypes = {
  primary: PropTypes.number.isRequired,
  secondary: PropTypes.number,
  configuration: dualConfiguration,
  data: PropTypes.arrayOf(dualData),
};

export default DualTileContent;
