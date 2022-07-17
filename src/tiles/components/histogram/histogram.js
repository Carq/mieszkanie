import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { Tooltip, Zoom } from "@mui/material";
import maxBy from "lodash/maxBy";
import minBy from "lodash/minBy";
import sortBy from "lodash/sortBy";
import uniqueId from "lodash/uniqueId";
import {
  colorStatusToBackgroundClassNames,
  convertToTimeOnly,
  convertToDateWithoutYearOnly,
  convertToMonthOnly,
  calculateDateTimeFormat,
} from "../../utils";
import { histogramData } from "../../propTypes";
import { colorStatuses, dateTimeFormatTypes } from "../../constants";
import "./styles.scss";

class Histogram extends React.Component {
  render() {
    const {
      data,
      colorData,
      formatValue,
      valueSuffix,
      minimalStep,
    } = this.props;

    if (data.length === 0) {
      return <div className="histogram"></div>;
    }

    const sortedData = sortBy(data, "date");
    const max = Math.max(maxBy(data, "value")["value"]);
    const min = Math.min(minBy(data, "value")["value"]);
    const dateTimeFormat = calculateDateTimeFormat(data.map((i) => i.date));

    return (
      <div className="histogram">
        <div className="histogram__bars">
          {sortedData.map((x) => {
            const tooltipText = `${
              formatValue ? formatValue(x.value) : x.value
            }${valueSuffix || ""} ${this.formatDateTime(
              x.date,
              dateTimeFormat
            )}`;

            return (
              <Tooltip
                key={uniqueId()}
                TransitionComponent={Zoom}
                title={tooltipText}
                arrow
              >
                <div
                  className={classNames(
                    (colorData &&
                      colorStatusToBackgroundClassNames(colorData(x.value))) ||
                      colorStatusToBackgroundClassNames(colorStatuses.SILVER),
                    `histogram__bar-${this.calculateRank(
                      x.value,
                      min,
                      max,
                      minimalStep
                    )}`
                  )}
                />
              </Tooltip>
            );
          })}
        </div>
      </div>
    );
  }

  formatDateTime = (date, dateTimeFormat) => {
    switch (dateTimeFormat) {
      case dateTimeFormatTypes.TIMEONLY:
        return convertToTimeOnly(date);
      case dateTimeFormatTypes.MONTHONLY:
        return convertToMonthOnly(date);
      default:
        return convertToDateWithoutYearOnly(date);
    }
  };

  calculateRank = (value, min, max, minimalStep) => {
    if (min === max) return 3;

    const step = Math.max(((max - min) / 4).toFixed(1), minimalStep);

    if (value >= max) return 5;
    if (value >= max - step) return 4;
    if (value >= max - step * 2) return 3;
    if (value >= max - step * 3) return 2;
    return 1;
  };
}

Histogram.propTypes = {
  data: PropTypes.arrayOf(histogramData),
  colorData: PropTypes.func,
  formatValue: PropTypes.func,
  valueSuffix: PropTypes.string,
  minimalStep: PropTypes.number,
  dateTimeFormat: PropTypes.string,
};

Histogram.defaultProps = {
  minimalStep: 0.1,
  dateTimeFormat: dateTimeFormatTypes.TIMEONLY,
};

export default Histogram;
