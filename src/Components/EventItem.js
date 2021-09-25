import React from "react";
import PropTypes from "prop-types";
import { Button, Typography } from "@material-ui/core";
import { icons, useStyles } from "./MainStyle";

function EventItem({
  isLive,
  image_team1,
  image_team2,
  name_team1,
  name_team2,
  start,
}) {
  const classes = useStyles();
  const [locked, live] = [icons.locked, icons.live];

  return (
    <Button fullWidth={true} disabled={!isLive}>
      <div className="channelItem">
        {isLive ? (
          <div className="logo_container">
            <object className="logo_live" type="image/svg+xml" data={live}>
              svg-animation
            </object>
            <Typography variant="button" align="center">
              Canlı
            </Typography>
          </div>
        ) : (
          <div className="disabledScreen">
            <img className={classes.lockedBtn} src={locked} alt="" />
          </div>
        )}
        <div className="teamsBox">
          <div className="team-logo-box">
            <div className="team-logo">
              <img src={image_team1} alt="right team" />
            </div>
            <Typography variant="h6" align="center">
              <b>{name_team1}</b>
            </Typography>
          </div>
          <div className="team-status">
            <div className="score">
              <Typography variant="h3" align="center">
                <b>-</b>
              </Typography>
            </div>
            <div className="start-time">
              <Typography variant="body1" align="center">
                <b>{start}</b>
              </Typography>
            </div>
          </div>
          <div className="team-logo-box">
            <div className="team-logo">
              <img src={image_team2} alt="left team" />
            </div>
            <Typography variant="h6" align="center">
              <b>{name_team2}</b>
            </Typography>
          </div>
        </div>
      </div>
    </Button>
  );
}

EventItem.propTypes = {
  isLive: PropTypes.bool,
  image_team1: PropTypes.string,
  image_team2: PropTypes.string,
  name_team1: PropTypes.string,
  name_team2: PropTypes.string,
  start: PropTypes.string,
};

export default EventItem;
