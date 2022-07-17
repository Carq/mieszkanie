import React from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import InputAdornment from "@mui/material/InputAdornment";
import DialogTitle from "@mui/material/DialogTitle";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import AddIcon from "@mui/icons-material/Add";
import config from "config";
import { tileTypes } from "tiles/constants";

import "./styles.scss";

export default function AddTileDataDialog(tileData) {
  const [open, setOpen] = React.useState(false);
  const [loadingDate, setLoadingData] = React.useState(false);
  const [primaryValue, setPrimaryValue] = React.useState();
  const [secondaryValue, setSecondaryValue] = React.useState();
  const [occurredOnValue, setOccurredOnValue] = React.useState(new Date());

  const handleClickOpen = () => {
    setOpen(true);
    setOccurredOnValue(new Date());
  };

  const handleClose = () => {
    setOpen(false);
    setPrimaryValue(null);
    setSecondaryValue(null);
    setOccurredOnValue(null);
  };

  const saveTileData = () => {
    setLoadingData(true);

    fetch(`${config.api.URL}/tiles/${tileData.type}/${tileData.name}/record`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("writeSecret"),
      },
      body: JSON.stringify({
        ...(tileData.type === tileTypes.DUAL && {
          primary: primaryValue,
          secondary: secondaryValue,
        }),
        ...(tileData.type === tileTypes.INTEGER && { value: primaryValue }),
        occurredOn: occurredOnValue,
      }),
    })
      .then((res) => {})
      .then(
        (result) => {
          setLoadingData(false);
          handleClose();
        },
        (error) => {
          setLoadingData(false);
          console.error(error);
        }
      );
  };

  return (
    <div>
      <IconButton onClick={handleClickOpen} size="medium">
        <AddIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Tile Data</DialogTitle>
        <DialogContent>
          <div className="add-tile-data__dialog-content">
            <TextField
              size="small"
              id="outlined-adornment-basic"
              label={
                tileData.primaryName || tileData.description || "Primary value"
              }
              value={primaryValue}
              InputProps={{
                endAdornment: (tileData.primaryUnit || tileData.unit) && (
                  <InputAdornment position="end">
                    {tileData.primaryUnit || tileData.unit}
                  </InputAdornment>
                ),
              }}
              type="number"
              variant="outlined"
              disabled={loadingDate}
              onChange={(e) => setPrimaryValue(e.target.value)}
            />
            {tileData.type === tileTypes.DUAL && (
              <TextField
                size="small"
                id="outlined-basic"
                label={tileData.secondaryName || "Secondary value"}
                value={secondaryValue}
                InputProps={{
                  endAdornment: tileData.secondaryUnit && (
                    <InputAdornment position="end">
                      {tileData.secondaryUnit}
                    </InputAdornment>
                  ),
                }}
                type="number"
                variant="outlined"
                disabled={loadingDate}
                onChange={(e) => setSecondaryValue(e.target.value)}
              />
            )}
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DateTimePicker
                size="small"
                id="outlined-basic"
                label="Occurred on"
                value={occurredOnValue}
                variant="outlined"
                ampm={false}
                disabled={loadingDate}
                onChange={(newValue) => setOccurredOnValue(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={saveTileData} disabled={loadingDate}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
