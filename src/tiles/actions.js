import fetch from "cross-fetch";
import config from "../config";
import {
  GET_ALL_TILES_REQUEST,
  GET_ALL_TILES_COMPLETED,
  GET_ALL_TILES_FAILED,
  GET_TILE_REQUEST,
  GET_TILE_COMPLETED,
  GET_TILE_FAILED,
} from "./actionTypes";

export function getAllTilesRequest() {
  return { type: GET_ALL_TILES_REQUEST };
}

export function getAllTilesCompleted(json) {
  return {
    type: GET_ALL_TILES_COMPLETED,
    tiles: json,
  };
}

export function getAllTilesFailed(error) {
  return {
    type: GET_ALL_TILES_FAILED,
    error: error,
  };
}

export function getTileRequest(tileName, tileType) {
  return { type: GET_TILE_REQUEST, tileName, tileType };
}

export function getTileCompleted(json, tileName, tileType) {
  return { type: GET_TILE_COMPLETED, data: json, tileName, tileType };
}

export function getTileFailed(error) {
  return { type: GET_TILE_FAILED, error: error };
}

export function getAllTiles() {
  return function (dispatch) {
    dispatch(getAllTilesRequest());

    return fetch(`${config.api.URL}/tiles/all`, {
      headers: {
        Authorization: localStorage.getItem("secret"),
      },
    })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error("Bad response from server");
        }

        return response.json();
      })
      .then((json) => dispatch(getAllTilesCompleted(json)))
      .catch((error) => dispatch(getAllTilesFailed(error.message)));
  };
}

export function getTile(tileName, tileType, newValue) {
  return function (dispatch) {
    dispatch(getTileCompleted(newValue, tileName, tileType));
  };
}
