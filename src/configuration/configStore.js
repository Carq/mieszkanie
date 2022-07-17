import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import rootReducer from "../rootReducer";

export default function configureStore() {
  const composeEnhancers =
    (process.env.NODE_ENV !== "production" &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    compose;

  return createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunkMiddleware))
  );
}
