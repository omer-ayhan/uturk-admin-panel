import React, { useState } from "react";
import {
  Backdrop,
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import { useStyles } from "./MainStyle";
import axios from "axios";
import { useAuth } from "../context/ChannelContext";

function Settings() {
  const [num, setNum] = useState(1);
  const [open, setOpen] = useState(false);
  const [snack, setSnack] = useState(false);
  const [snackMsg, setSnackMsg] = useState(false);
  const { login } = useAuth();
  const { loading } = login;
  const classes = useStyles();

  const cleanAnon = (e) => {
    e.preventDefault();
    if (num > 0) {
      setOpen(true);
      axios
        .post(`https://uturk-admin-panel.vercel.app/auth?num=${num}`)
        .then((res) => {
          setOpen(false);
          setSnack(true);
          setSnackMsg(res.data.msg);
        })
        .catch((err) => {
          setOpen(false);
          setSnack(true);
          setSnackMsg(`${err}`);
        });
    } else {
      alert("You have to enter a number bigger than 0");
      return;
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnack(false);
  };
  return (
    loading && (
      <form onSubmit={cleanAnon}>
        <Box
          width="100%"
          display="flex"
          alignContent="center"
          alignItems="flex-start"
          justifyContent="center"
          flexDirection="column"
          flexWrap="wrap"
          height="200px">
          <Backdrop className={classes.backdrop} open={open}>
            <CircularProgress color="primary" />
            <Typography variant="h6">Deleting Anonymous Users...</Typography>
          </Backdrop>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            open={snack}
            autoHideDuration={2000}
            onClose={handleClose}
            message={snackMsg}
          />
          <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
            Data and Authentication
          </Typography>
          <Card className={classes.settingsPaper}>
            <Box
              mb="20px"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap">
              <Typography variant="subtitle1" component="span">
                Clean Anonymous Users Data
              </Typography>
              <TextField
                id="standard-number"
                label="Number"
                type="number"
                min="1"
                value={num}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => setNum(e.target.value)}
              />
              <Button
                type="submit"
                style={{ width: "150px", height: "40px" }}
                variant="contained"
                color="primary">
                <Typography variant="body1">Clear Data</Typography>
              </Button>
            </Box>
            <Divider />
          </Card>
        </Box>
      </form>
    )
  );
}

export default Settings;
