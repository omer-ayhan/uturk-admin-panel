import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Tabs,
  Tab,
  AppBar,
  Typography,
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { db } from "../firebaseConf";
import EventItem from "./EventItem";
import ChannelItem from "./ChannelItem";
import { useStyles } from "./MainStyle";
import { ChannelContext } from "../context/ChannelContext";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}>
      {value === index && (
        <Box p="2px 8px">
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

function ChannelTabs({ cat }) {
  const classes = useStyles();
  let snapshot = db.collection(cat);
  const { channelDatas, radioStat } = useContext(ChannelContext);
  const [data, setData] = useState(null);
  const [radio, setRadio] = radioStat;
  const [channelData, setChannelData] = channelDatas;

  useEffect(() => {
    const unsubscribe = snapshot
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        let channels = [];
        setData(null);
        snapshot.docs.map((doc, index) =>
          channels.push({ ...doc.data(), id: doc.id })
        );
        setData([...channels]);
      });
    return () => {
      unsubscribe();
    };
  }, [cat]);

  const getData = async (id) => {
    setRadio(id);
    let dataDoc = snapshot.doc(id).get();
    await dataDoc
      .then((query) => setChannelData({ ...query.data(), id: id }))
      .catch((err) => console.error(err));
  };

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const showPreview = () => {
    if (data?.length > 0 && data !== null) {
      if (cat !== "permanent") {
        return data.map((item) => (
          <Box
            display="flex"
            style={{ cursor: "pointer" }}
            key={item.id}
            onClick={() => getData(item.id)}>
            <FormControlLabel
              value={item.id}
              control={<Radio color="primary" />}
            />
            <EventItem
              isLive={item.isLive}
              image_team1={item.logo1}
              image_team2={item.logo2}
              start={item.start_time}
              name_team1={item.team_name1}
              name_team2={item.team_name2}
            />
          </Box>
        ));
      } else {
        return data.map((item) => (
          <Box
            key={item.id}
            style={{ cursor: "pointer" }}
            display="flex"
            onClick={() => getData(item.id)}>
            <FormControlLabel
              value={item.id}
              control={<Radio color="primary" />}
              label=""
            />
            <ChannelItem
              key={item.id}
              image={item.logo2}
              name={item.channel_name}
            />
          </Box>
        ));
      }
    } else {
      return (
        <Box fontWeight="fontWeightBold" textAlign="center">
          <Typography variant="h5" component="div">
            No Data
          </Typography>
        </Box>
      );
    }
  };

  return (
    <>
      <AppBar position="static">
        <Tabs
          TabIndicatorProps={{
            style: { background: "#90CD5D" },
          }}
          centered={true}
          value={value}
          onChange={handleChange}
          aria-label="menu tabs">
          {["All Channels"].map((e, index) => (
            <Tab
              key={index}
              style={{
                minWidth: "126px",
                fontSize: ".95rem",
                fontWeight: "bold",
                color: value === index ? "#90CD5D" : "#fff",
              }}
              label={e}
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
      </AppBar>
      <TabPanel
        id="channelCard"
        className={classes.allChannels}
        value={value}
        index={0}>
        <RadioGroup value={radio}>{showPreview()}</RadioGroup>
      </TabPanel>
    </>
  );
}

ChannelTabs.propTypes = {
  cat: PropTypes.string,
};

export default ChannelTabs;
