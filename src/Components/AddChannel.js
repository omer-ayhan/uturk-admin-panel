import React, { useEffect, useState } from "react";
import {
  Backdrop,
  Box,
  Checkbox,
  CircularProgress,
  Fab,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Typography,
} from "@material-ui/core";
import ChipInput from "material-ui-chip-input";
import { useStyles, icons, cat_keys } from "./MainStyle";
import { db, storage } from "../firebaseConf";
import firebase from "firebase/compat/app";
import EventItem from "./EventItem";
import "../css/ChannelList.css";
import ChannelItem from "./ChannelItem";
import ChannelInputs from "./ChannelInputs";
import { useAuth } from "../context/ChannelContext";

export default function AddChannel() {
  const [cat, setCat] = useState("football");
  let notifyId = [];
  let snapshot = db.collection(cat);
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [snack, setSnack] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const { login } = useAuth();
  const { loading, loadEl } = login;
  const [files, setFile] = useState(cat_keys.event_files);
  const [channel, setChannel] = useState(cat_keys.events);
  const [SaveIcon] = [icons.SaveIcon];
  const classes = useStyles();

  useEffect(() => {
    let isMounted = true;
    if (loadEl && isMounted) {
      setSnackMsg("User Signed In");
      setSnack(true);
    }
    return () => {
      isMounted = false;
    };
  }, [loadEl]);

  useEffect(() => {
    const getChannels = [];
    const preview = snapshot
      .orderBy("timestamp", "desc")
      .limit(1)
      .onSnapshot((snapshot) => {
        if (snapshot.size < 1) {
          setData(null);
          return;
        }
        snapshot.forEach((doc) => getChannels.push(doc.data()));
        setData(getChannels[0]);
      });
    return preview;
  }, [open, cat]);

  const handleInputChange = (val) => {
    const key = val.target;
    const value = key.type === "checkbox" ? key.checked : key.value;
    setChannel({
      ...channel,
      [key.name]: value,
    });
  };

  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  const resetAll = (channel, file) => {
    setChannel(channel);
    setFile(file);
  };
  const addChannel = async (data) => {
    data.preventDefault();
    if (channel.tags.length === 0) {
      alert("you have to add at least one tag");
      return;
    }
    const keys = Object.keys(files);
    for (let key of keys) {
      if (files[key] === "") {
        alert("you have to add all logo images");
        return;
      }
    }
    setOpen(true);
    if (cat !== "permanent") {
      keys.forEach((key, index) => {
        const path = `${Date.now()}_${files[key].name}`;
        const Imgref = storage.ref().child(`images/${path}`);
        const uploadTask = Imgref.put(files[key]);
        uploadTask
          .then(async () => {
            const url = await Imgref.getDownloadURL();
            if (index % 2 === 0 && url !== channel["logo2"]) {
              channel["logo1"] = url;
            } else {
              channel["logo2"] = url;
            }
          })
          .catch((err) => alert(err));
      });
      while (channel["logo1"] === "" || channel["logo2"] === "") {
        console.log("loading");
        await timeout(4000);
      }
    } else {
      const path = `${Date.now()}_${files["channel_img"].name}`;
      const Imgref = storage.ref().child(`images/${path}`);
      const uploadTask = Imgref.put(files["channel_img"]);
      uploadTask
        .then(async () => {
          const url = await Imgref.getDownloadURL();
          channel["logo2"] = url;
        })
        .catch((err) => alert(err));
      while (channel["logo2"] === "") {
        console.log("loading");
        await timeout(5000);
      }
    }

    snapshot
      .add({
        ...channel,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then((doc) => {
        if (channel.isLive || cat === "permanent") {
          db.collection("notifications")
            .doc(doc.id)
            .set({
              ...channel,
              cat: cat,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
        }
      });

    console.log("all uploaded");
    if (cat === "permanent") {
      resetAll(cat_keys.channels, cat_keys.channel_file);
    } else {
      resetAll(cat_keys.events, cat_keys.event_files);
    }
    setOpen(false);
    setSnackMsg("Channel Added");
    setSnack(true);
  };

  const handleAddChip = (event) => {
    setChannel({
      ...channel,
      tags: [...channel.tags, event],
    });
  };
  const handleDeleteChip = (event) => {
    setChannel({
      ...channel,
      tags: channel.tags.filter((t) => t !== event),
    });
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnack(false);
  };

  const showPreview = () => {
    if (data !== null) {
      if (cat !== "permanent") {
        return (
          <EventItem
            isLive={data?.isLive}
            image_team1={data.logo1}
            image_team2={data.logo2}
            start={data.start_time}
            name_team1={data.team_name1}
            name_team2={data.team_name2}
          />
        );
      } else {
        return <ChannelItem image={data.logo2} name={data.channel_name} />;
      }
    } else
      return (
        <Box fontWeight="fontWeightBold" textAlign="center">
          <Typography variant="h5">No Data</Typography>
        </Box>
      );
  };

  return (
    loading && (
      <Box
        className={classes.addBox}
        display="flex"
        flexDirection="column"
        alignItems="center">
        <Typography variant="h5">Preview</Typography>
        <Box id="channelCard" mb="20px" className={classes.preview}>
          {showPreview()}
        </Box>
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
        <form onSubmit={addChannel}>
          <Box>
            <InputLabel id="demo-mutiple-name-label">Category</InputLabel>
            <Select
              defaultValue={"football"}
              labelId="demo-mutiple-name-label"
              id="demo-mutiple-name"
              onChange={(cat) => {
                setCat(cat.target.value);
                if (cat.target.value === "permanent") {
                  resetAll(cat_keys.channels, cat_keys.channel_file);
                } else {
                  resetAll(cat_keys.events, cat_keys.event_files);
                }
              }}>
              <MenuItem value={"football"}>Futbol</MenuItem>
              <MenuItem value={"basketball"}>Basketbol</MenuItem>
              <MenuItem value={"permanent"}>7/24</MenuItem>
            </Select>
          </Box>
          <Fab type="submit" className={classes.fab} color="primary">
            <SaveIcon />
          </Fab>
          <Box
            style={{ gap: "80px" }}
            mt="30px"
            display="flex"
            flexDirection="row"
            alignItems="flex-start">
            <ChannelInputs
              dividerShow={"block"}
              cat={cat}
              channel={channel}
              handleInputChange={handleInputChange}
              disabled={false}
              handleFile={(e) => {
                setFile({
                  ...files,
                  [e.target.name]: e.target.files[0],
                });
              }}
              files={files}
              streamSet={false}
            />
            <Box>
              <ChannelInputs
                marginVal={"10px"}
                dividerShow={"block"}
                cat={cat}
                channel={channel}
                handleInputChange={handleInputChange}
                disabled={false}
                handleFile={(e) => {
                  setFile({
                    ...files,
                    [e.target.name]: e.target.files[0],
                  });
                }}
                files={files}
                streamSet={true}
              />
              <FormControlLabel
                style={{
                  display: cat === "permanent" ? "none" : "block",
                  margin: " 0  0 20px 0",
                }}
                value=""
                control={
                  <Checkbox
                    name="isLive"
                    checked={channel.isLive}
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
                  width: "180px",
                }}
                value={channel.tags}
                name="tags"
                onAdd={(chip) => {
                  handleAddChip(chip);
                }}
                onDelete={(chip, index) => handleDeleteChip(chip, index)}
                newChipKeys={[" "]}
                label="Stream Tags"
              />
            </Box>
          </Box>
        </form>
      </Box>
    )
  );
}
