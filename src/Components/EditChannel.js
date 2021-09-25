import React, { useContext, useEffect, useState } from "react";
import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  Snackbar,
  Typography,
} from "@material-ui/core";
import ChipInput from "material-ui-chip-input";
import ChannelTabs from "./ChannelTabs";
import { db, storage } from "../firebaseConf";
import firebase from "firebase/compat/app";
import { useStyles, icons, cat_keys } from "./MainStyle";
import { ChannelContext, useAuth } from "../context/ChannelContext";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import ChannelInputs from "./ChannelInputs";

function EditChannel({ history }) {
  const [cat, setCat] = useState("football");
  let snapshot = db.collection(cat);
  const { login } = useAuth();
  const { loading } = login;
  const [open, setOpen] = useState(false);
  const [snack, setSnack] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const { channelDatas, radioStat } = useContext(ChannelContext);
  const [filesEdit, setFileEdit] = useState(cat_keys.event_files);
  const [channelEdit, setChannelEdit] = useState(cat_keys.events);
  const [channelData, setChannelData] = channelDatas;
  const [radio, setRadio] = radioStat;

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      setChannelEdit(channelData);
    }
    return () => {
      isMounted = false;
    };
  }, [channelData]);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      if (radio === null) {
        setDisabled(true);
      } else setDisabled(false);
    }
    return () => {
      isMounted = false;
    };
  }, [radio]);

  const classes = useStyles();
  const [DeleteIcon, CloudUploadIcon] = [icons.DeleteIcon, icons.SaveIcon];
  const handleAddChip = (event) => {
    setChannelEdit({
      ...channelEdit,
      tags: [...channelEdit.tags, event],
    });
  };
  const handleDeleteChip = (event) => {
    setChannelEdit({
      ...channelEdit,
      tags: channelEdit.tags.filter((t) => t !== event),
    });
  };

  const resetAll = (channel, file) => {
    setRadio(null);
    setDisabled(true);
    setChannelEdit(channel);
    setChannelData(channel);
    setFileEdit(file);
  };

  history.listen((location, action) => {
    if (location.pathname === "/edit")
      resetAll(cat_keys.events, cat_keys.event_files);
  });

  const handleInputChange = (val) => {
    const key = val.target;
    const value = key.type === "checkbox" ? key.checked : key.value;
    setChannelEdit({
      ...channelEdit,
      [key.name]: value,
    });
  };

  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  const updateChannel = async (data) => {
    data.preventDefault();
    if (radio === null) {
      alert("You have to choose a channel to edit");
      return;
    }
    let isUpload = false;
    let uploadEdit = {
      logo1: "",
      logo2: "",
    };
    const keys = Object.keys(filesEdit);
    setOpen(true);
    if (filesEdit["logo1"] !== "" || filesEdit["logo2"] !== "") {
      isUpload = true;
    }
    if (isUpload) {
      if (cat !== "permanent") {
        for (let i = 0; i < keys.length; i++) {
          if (filesEdit[keys[i]] === "") {
            delete uploadEdit[keys[i]];
            continue;
          }
          const path = `${Date.now()}_${filesEdit[keys[i]].name}`;
          const Imgref = storage.ref().child(`images/${path}`);
          const uploadTask = Imgref.put(filesEdit[keys[i]]);
          uploadTask
            .then(async () => {
              const url = await Imgref.getDownloadURL();
              if (i % 2 === 0 && url !== uploadEdit["logo2"]) {
                storage.refFromURL(channelData.logo1).delete();
                uploadEdit["logo1"] = url;
              } else {
                storage.refFromURL(channelData.logo2).delete();
                uploadEdit["logo2"] = url;
              }
            })
            .catch((err) => alert(err));
        }
        while (uploadEdit["logo1"] === "" || uploadEdit["logo2"] === "") {
          console.log("loading");
          await timeout(4000);
        }
      } else {
        if (filesEdit["channel_img"] !== "") {
          const path = `${Date.now()}_${filesEdit["channel_img"].name}`;
          const Imgref = storage.ref().child(`images/${path}`);
          const uploadTask = Imgref.put(filesEdit["channel_img"]);
          uploadTask
            .then(async () => {
              const url = await Imgref.getDownloadURL();
              storage.refFromURL(channelData.logo2).delete();
              uploadEdit["logo2"] = url;
            })
            .catch((err) => alert(err));
          while (uploadEdit["logo2"] === "") {
            console.log("loading");
            await timeout(5000);
          }
        } else {
          delete uploadEdit.logo1;
          delete uploadEdit.logo2;
        }
      }
    }
    if (isUpload) {
      snapshot
        .doc(channelData.id)
        .set({
          ...channelEdit,
          ...uploadEdit,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then((doc) => {
          if (channelEdit.isLive || cat === "permanent") {
            db.collection("notifications")
              .doc(channelData.id)
              .set({
                ...channelEdit,
                ...uploadEdit,
                cat: cat,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              });
          }
        })
        .catch((err) => alert(err));
    } else {
      snapshot
        .doc(channelData.id)
        .set({
          ...channelEdit,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then((doc) => {
          if (channelEdit.isLive || cat === "permanent") {
            db.collection("notifications")
              .doc(channelData.id)
              .set({
                ...channelEdit,
                cat: cat,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              });
          }
        })
        .catch((err) => alert(err));
    }
    console.log("all updated");
    if (cat === "permanent") {
      resetAll(cat_keys.channels, cat_keys.channel_file);
    } else {
      resetAll(cat_keys.events, cat_keys.event_files);
    }
    setRadio(null);
    setOpen(false);
    setSnackMsg("Channel Updated");
    setSnack(true);
  };

  const deleteChannel = () => {
    if (radio === null) {
      alert("You have to choose a channel to delete");
      return;
    }
    const keys = Object.keys(channelData);
    keys.forEach((item) => {
      if (item === "logo1" || item === "logo2") {
        storage.refFromURL(channelData[item]).delete();
      }
    });
    snapshot
      .doc(channelData.id)
      .delete()
      .then(() => {
        db.collection("notifications").doc(channelData.id).delete();
      });
    if (cat === "permanent") {
      resetAll(cat_keys.channels, cat_keys.channel_file);
    } else {
      resetAll(cat_keys.events, cat_keys.event_files);
    }
    setSnackMsg("Channel Deleted");
    setSnack(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnack(false);
  };

  return (
    loading && (
      <Grid
        container
        spacing={3}
        direction="row"
        alignItems="center"
        justifyContent="center">
        <Backdrop className={classes.backdrop} open={open}>
          <CircularProgress color="primary" />
          <Typography variant="h6">Uploading...</Typography>
        </Backdrop>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={snack}
          autoHideDuration={3000}
          onClose={handleClose}
          message={snackMsg}
        />

        <Grid item xs={12} sm={7}>
          <form onSubmit={updateChannel} style={{ width: "100%" }}>
            <Box mb="15px" display="flex">
              <Box flexGrow={1}>
                <Typography
                  style={{ fontWeight: "bold" }}
                  component="h6"
                  variant="h6">
                  Edit Channels
                </Typography>
              </Box>
              <Button
                style={{ fontWeight: "bold" }}
                type="submit"
                variant="contained"
                color="primary"
                endIcon={<CloudUploadIcon />}>
                Upload
              </Button>
              <Button
                onClick={deleteChannel}
                style={{ marginLeft: "20px" }}
                variant="contained"
                component="span"
                className={classes.delete}
                color="secondary"
                endIcon={<DeleteIcon />}>
                Delete
              </Button>
            </Box>
            <Divider style={{ marginBottom: "15px" }} />
            <Grid
              container
              spacing={4}
              direction="row"
              alignItems="center"
              justifyContent="center">
              <Grid item xs={12} sm={6}>
                <ChannelInputs
                  dividerShow={"none"}
                  cat={cat}
                  channel={channelEdit}
                  handleInputChange={handleInputChange}
                  disabled={disabled}
                  handleFile={(e) => {
                    setFileEdit({
                      ...filesEdit,
                      [e.target.name]: e.target.files[0],
                    });
                  }}
                  files={filesEdit}
                  streamSet={false}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ChannelInputs
                  marginVal={"0"}
                  dividerShow={"none"}
                  cat={cat}
                  channel={channelEdit}
                  handleInputChange={handleInputChange}
                  disabled={disabled}
                  handleFile={(e) => {
                    setFileEdit({
                      ...filesEdit,
                      [e.target.name]: e.target.files[0],
                    });
                  }}
                  files={filesEdit}
                  streamSet={true}
                />

                <FormControlLabel
                  style={{
                    display: cat === "permanent" ? "none" : "block",
                    margin: " 0  0 20px 0",
                  }}
                  control={
                    <Checkbox
                      name="isLive"
                      checked={channelEdit.isLive}
                      onChange={handleInputChange}
                      color="primary"
                    />
                  }
                  label="Online"
                  labelPlacement="start"
                />
                <ChipInput
                  style={{
                    margin: " 0  0 20px 0",
                    width: "196px",
                  }}
                  value={channelEdit.tags}
                  name="tags"
                  onAdd={(chip) => {
                    handleAddChip(chip);
                  }}
                  onDelete={(chip, index) => handleDeleteChip(chip, index)}
                  newChipKeys={[" "]}
                  label="Stream Tags"
                />
              </Grid>
            </Grid>
          </form>
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box p="10px" width="100%" height="500px" className={classes.back}>
            <Select
              style={{
                width: "100%",
              }}
              variant="outlined"
              defaultValue={"football"}
              id="demo-mutiple-name"
              onChange={(cat) => {
                setCat(cat.target.value);
                if (cat.target.value === "permanent") {
                  resetAll(cat_keys.channels, cat_keys.channel_file);
                } else {
                  resetAll(cat_keys.events, cat_keys.event_files);
                }
                setRadio(null);
              }}>
              <MenuItem value={"football"}>Futbol</MenuItem>
              <MenuItem value={"basketball"}>Basketbol</MenuItem>
              <MenuItem value={"permanent"}>7/24</MenuItem>
            </Select>
            <ChannelTabs cat={cat} />
          </Box>
        </Grid>
      </Grid>
    )
  );
}

EditChannel.propTypes = {
  location: PropTypes.object,
};

export default withRouter(EditChannel);
