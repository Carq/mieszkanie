import React from "react";
import { Typography } from "@mui/material";
import "./styles.scss";
import classNames from "classnames";
import Link from "@mui/material/Link";
import { colorStatuses } from "../../constants";
import { colorStatusToClassNames, convertToSeconds } from "../../utils";
import Histogram from "../histogram";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PropTypes, { object } from "prop-types";
import { heartBeatData, heartBeatConfiguration } from "../../propTypes";

class HeartBeatTileContent extends React.Component {
  render() {
    const { current, data, configuration } = this.props;
    const { applicationUrl, description } = configuration;
    const { responseTimeInMs, appVersion, additionalInfo } = current;

    const color = this.calculateColor(responseTimeInMs);
    const appIsRun = responseTimeInMs > 0;

    return (
      <div className="heartBeat-content">
        <div
          className={classNames(
            "heartBeat__icon-section",
            colorStatusToClassNames(color)
          )}
        >
          <FavoriteIcon
            fontSize="large"
            style={{
              color: colorStatusToClassNames(color),
              fontSize: appVersion === undefined ? 130 : 110,
            }}
          />
        </div>

        <div className="heartBeat__current-section ">
          <div className="heartBeat__histogram">
            <Histogram
              data={data.map((item) => ({
                value: item.responseTimeInMs,
                date: item.addedOn,
              }))}
              valueSuffix={"ms"}
              colorData={this.calculateColor}
            />
          </div>
          <Typography
            className={classNames(colorStatusToClassNames(color))}
            align="center"
          >
            {(appIsRun && `${convertToSeconds(responseTimeInMs)}s`) ||
              `No Response`}
          </Typography>
        </div>

        <div className="heartBeat__description-env">
          <Link href={applicationUrl} color="inherit">
            <Typography>{description || "Link"}</Typography>
          </Link>
        </div>

        {appVersion && (
          <div className="heartBeat__description-env">
            <Typography variant="caption">{`Version: ${appVersion}`}</Typography>
          </div>
        )}

        {additionalInfo && (
          <div className="heartBeat__description-additionalInfo">
            <Typography
              variant="caption"
              align="center"
              color="textSecondary"
              noWrap={true}
            >
              {additionalInfo}
            </Typography>
          </div>
        )}
      </div>
    );
  }

  calculateColor = (responseInMs) => {
    if (responseInMs <= 0) return colorStatuses.RED;
    if (responseInMs < 500) return colorStatuses.LIGHTGREEN;
    return colorStatuses.AMBER;
  };

  createDescription = (description, appVersion) => {
    const envName = description || "Link";

    if (appVersion) {
      return `${envName}: ${appVersion}`;
    }

    return envName;
  };
}

HeartBeatTileContent.propTypes = {
  current: heartBeatData.isRequired,
  configuration: heartBeatConfiguration.isRequired,
  data: PropTypes.arrayOf(object),
};

export default HeartBeatTileContent;
