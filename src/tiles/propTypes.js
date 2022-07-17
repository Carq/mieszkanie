import { PropTypes } from "prop-types";
import { tileTypes, metricTypes } from "./constants";

export const tileBasicData = PropTypes.shape({
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(Object.values(tileTypes)),
});

export const metricConfiguration = PropTypes.shape({
  limit: PropTypes.number.isRequired,
  wish: PropTypes.number,
  goal: PropTypes.number,
  metricType: PropTypes.oneOf(Object.values(metricTypes)).isRequired,
});

export const integerConfiguration = PropTypes.shape({
  unit: PropTypes.string,
});

export const heartBeatConfiguration = PropTypes.shape({
  applicationUrl: PropTypes.string.isRequired,
  applicationHeartBeatUrl: PropTypes.string.isRequired,
});

export const heartBeatData = PropTypes.shape({
  responseTimeInMs: PropTypes.number.isRequired,
  AppVersion: PropTypes.string,
  addedOn: PropTypes.string.isRequired,
});

export const weatherData = PropTypes.shape({
  temperature: PropTypes.number.isRequired,
  humidity: PropTypes.number,
  addedOn: PropTypes.string.isRequired,
});

export const dualData = PropTypes.shape({
  primary: PropTypes.number.isRequired,
  secondary: PropTypes.number.isRequired,
  addedOn: PropTypes.string.isRequired,
});

export const dualConfiguration = PropTypes.shape({
  primaryName: PropTypes.string,
  primaryUnit: PropTypes.string,
  primaryIntegerOnly: PropTypes.boolean,
  primaryMaxGraphValue: PropTypes.number,
  primaryMinGraphValue: PropTypes.number,
  primaryGraphColor: PropTypes.string,
  primaryGreenValue: PropTypes.number,
  primaryYellowValue: PropTypes.number,
  primaryRedValue: PropTypes.number,
  secondaryName: PropTypes.string,
  secondaryUnit: PropTypes.string,
  secondaryIntegerOnly: PropTypes.boolean,
  secondaryMaxGraphValue: PropTypes.number,
  secondaryMinGraphValue: PropTypes.number,
  secondaryGraphColor: PropTypes.string,
  secondaryGreenValue: PropTypes.number,
  secondaryYellowValue: PropTypes.number,
  secondaryRedValue: PropTypes.number,
  primaryAndSecondaryHaveTheSameYAxis: PropTypes.boolean,
  lowerIsBetter: PropTypes.boolean,
});

export const histogramData = PropTypes.shape({
  value: PropTypes.number.isRequired,
  date: PropTypes.string.isRequired,
});
