import { combineReducers } from "redux";
import { tilesReducer } from "./tiles/reducers";

export default combineReducers({ tiles: tilesReducer });
