import React from "react";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { withSnackbar } from "notistack";

import "./styles.scss";
import config from "config";

class SecretProvider extends React.Component {
  state = {
    loadingData: false,
    secret: "",
  };

  componentDidMount = () => {
    var secret = localStorage.getItem("secret");
    if (secret) {
      this.checkSecret(secret);
    }
  };

  render() {
    const { loadingData, secret } = this.state;

    return (
      <div className="secret-provider">
        <TextField
          size="small"
          id="outlined-basic"
          disabled={loadingData}
          label="Secret"
          value={secret}
          type="password"
          onChange={this.textChanged}
          variant="outlined"
        />
        <Button
          size="small"
          variant="contained"
          disabled={loadingData}
          color="primary"
          onClick={this.onClick}
        >
          Check
        </Button>
      </div>
    );
  }

  textChanged = (e) => {
    this.setState({
      secret: e.target.value,
    });
  };

  onClick = () => {
    const { secret } = this.state;
    this.checkSecret(secret);
  };

  checkSecret = (secret) => {
    this.setState({
      loadingData: true,
    });

    fetch(`${config.api.URL}/check`, {
      headers: {
        Authorization: secret,
      },
    })
      .then((response) => {
        if (response.ok) {
          localStorage.setItem("secret", secret);

          this.setState({
            loadingData: false,
          });

          this.props.onSuccess();
          return;
        } else {
          throw new Error("Something went wrong.");
        }
      })
      .catch(() => {
        localStorage.setItem("secret", "");

        this.setState({
          loadingData: false,
        });

        this.props.enqueueSnackbar("Incorrect secret", {
          variant: "error",
        });
      });
  };
}

SecretProvider.propTypes = {
  onSuccess: PropTypes.func,
};

export default withSnackbar(SecretProvider);
