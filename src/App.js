import React, { Suspense } from "react";
import { Helmet } from "react-helmet";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import SecretProvider from "./tiles/components/secretProvider";
import theme from "./Theme/theme";
import configStore from "./configuration/configStore";
import config from "./config";

import "./App.scss";

const DashboardLazyLoading = React.lazy(() =>
  import("./tiles/container/dashboard")
);

const store = configStore();

class App extends React.Component {
  state = {
    isAuth: false,
  };

  render() {
    const { isAuth } = this.state;

    return (
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <div className="App">
              <Helmet>
                <title>{config.dashboard.name || "Tiles Dashboard"}</title>
              </Helmet>
              <SnackbarProvider>
                {(!config.api.protectReadEndpoints || isAuth) && (
                  <Suspense fallback="Loading...">
                    <DashboardLazyLoading />
                  </Suspense>
                )}
                {config.api.protectReadEndpoints && !isAuth && (
                  <SecretProvider onSuccess={this.onSuccess} />
                )}
              </SnackbarProvider>
            </div>
          </Provider>
        </ThemeProvider>
      </StyledEngineProvider>
    );
  }

  onSuccess = () => {
    this.setState({
      isAuth: true,
    });
  };
}

export default App;
