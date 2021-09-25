import React from "react";
import PropTypes from "prop-types";
import { Button, Typography } from "@material-ui/core";

function ChannelItem({ image, name }) {
  return (
    <Button fullWidth={true}>
      <div className="channelItem" style={{ height: "80px", padding: "20px" }}>
        <div
          className="teamsBox"
          style={{
            paddingBottom: "8px",
            justifyContent: "flex-start",
            gap: "20px",
          }}>
          <div className="team-logo" style={{ width: "55px", height: "55px" }}>
            <img src={image} alt="channel logo" />
          </div>
          <Typography variant="h6" align="center">
            <b>{name}</b>
          </Typography>
        </div>
      </div>
    </Button>
  );
}

ChannelItem.propTypes = {
  image: PropTypes.string,
  name: PropTypes.string,
};

export default ChannelItem;
