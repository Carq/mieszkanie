import { connect } from "react-redux";
import { withSnackbar } from "notistack";
import { getAllTiles, getTile } from "../actions";
import Dashboard from "../components/dashboard";

const mapStateToProps = (state) => {
  return {
    tiles: state.tiles.items,
    isLoadingMetrics: state.tiles.isLoadingMetrics,
    error: state.tiles.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllTiles: () => dispatch(getAllTiles()),
    getTile: (tileName, tileType, newValue) =>
      dispatch(getTile(tileName, tileType, newValue)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSnackbar(Dashboard));
