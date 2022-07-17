import {
  GET_ALL_TILES_REQUEST,
  GET_ALL_TILES_COMPLETED,
  GET_ALL_TILES_FAILED,
  GET_TILE_REQUEST,
  GET_TILE_COMPLETED,
  GET_TILE_FAILED,
} from "./actionTypes";

const initialState = {
  items: [],
  isLoadingMetrics: false,
  error: "",
};

export function tilesReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_TILES_REQUEST:
      return {
        ...state,
        isLoadingMetrics: true,
      };
    case GET_ALL_TILES_COMPLETED:
      return {
        ...state,
        items: action.tiles,
        isLoadingMetrics: false,
      };
    case GET_ALL_TILES_FAILED:
      return {
        ...state,
        error: action.error,
        isLoadingMetrics: false,
      };
    case GET_TILE_REQUEST:
      return {
        ...state,
      };
    case GET_TILE_COMPLETED:
      const { items } = state;

      return {
        ...state,
        items: updateTileDataInArray(
          items,
          action.tileName,
          action.tileType,
          action.data
        ),
      };
    case GET_TILE_FAILED:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
}

function updateTileDataInArray(tiles, tileName, tileType, data) {
  return tiles.map((tile) => {
    if (
      tile.name !== tileName ||
      tile.type.toUpperCase() !== tileType.toUpperCase()
    ) {
      return tile;
    }

    let oldData = tile.data;
    oldData.pop();
    oldData.unshift(data);

    const updatedTile = {
      ...tile,
      data: oldData,
    };

    return {
      ...tile,
      ...updatedTile,
    };
  });
}
