import { Box, Button, Divider, TextField, Typography } from "@material-ui/core";
import React from "react";
import PropTypes from "prop-types";
import { elements, icons, useStyles } from "./MainStyle";

function ChannelInputs({
  cat,
  channel,
  handleInputChange,
  disabled,
  handleFile,
  files,
  streamSet,
  marginVal,
  dividerShow,
}) {
  const classes = useStyles();
  const [AddIcon] = [icons.AddIcon];

  return (
    <>
      {streamSet === false ? (
        <>
          {cat !== "permanent" ? (
            elements.Teaminput_set.map(
              ({ input_text, label, input_img }, index) => (
                <Box m="10px 0" key={index}>
                  <Typography variant="h6">{label} Team</Typography>
                  <Divider style={{ display: dividerShow }} />
                  <TextField
                    style={{ display: "block", marginBottom: "20px" }}
                    name={input_text}
                    value={channel[input_text]}
                    label={`${label} Team Name`}
                    onChange={handleInputChange}
                  />
                  <input
                    disabled={disabled}
                    accept="image/*"
                    style={{ display: "none" }}
                    id={input_img}
                    type="file"
                    onChange={handleFile}
                    name={input_img}
                  />
                  <label style={{ textSize: "1rem" }} htmlFor={input_img}>
                    <Button
                      disabled={disabled}
                      variant="contained"
                      component="span"
                      className={classes.button}
                      color="primary"
                      endIcon={<AddIcon />}>
                      {label} Team Logo
                    </Button>
                  </label>
                  <Typography
                    style={{ fontWeight: "bold" }}
                    color="primary"
                    variant="subtitle2"
                    component="p">
                    {files[input_img].name || "None"}
                  </Typography>
                </Box>
              )
            )
          ) : (
            <Box>
              <Typography variant="h6" component="h6">
                Channel Name
              </Typography>
              <TextField
                style={{ display: "block", marginBottom: "20px" }}
                name="channel_name"
                value={channel["channel_name"]}
                label="Channel Name"
                onChange={handleInputChange}
              />
              <input
                disabled={disabled}
                accept="image/*"
                style={{ display: "none" }}
                id="channel_upload"
                type="file"
                onChange={handleFile}
                name="channel_img"
              />
              <label style={{ textSize: "1rem" }} htmlFor="channel_upload">
                <Button
                  disabled={disabled}
                  variant="contained"
                  component="span"
                  className={classes.button}
                  color="primary"
                  endIcon={<AddIcon />}>
                  Channel Logo
                </Button>
              </label>
              <Typography
                style={{ fontWeight: "bold" }}
                color="primary"
                variant="subtitle2">
                {files["channel_img"].name || "None"}
              </Typography>
            </Box>
          )}
        </>
      ) : (
        <>
          <Typography style={{ marginTop: marginVal }} variant="h6">
            Stream Settings
          </Typography>
          <Divider style={{ display: dividerShow }} />

          {cat !== "permanent"
            ? elements.Streaminput_set_event.map(
                ({ input_text, label }, index) => (
                  <TextField
                    key={index}
                    style={{
                      display: "block",
                      marginBottom: "20px 0",
                    }}
                    value={channel[input_text]}
                    name={input_text}
                    onChange={handleInputChange}
                    label={label}
                  />
                )
              )
            : elements.Streaminput_set_channel.map(
                ({ input_text, label }, index) => (
                  <TextField
                    key={index}
                    style={{
                      display: "block",
                      marginBottom: "20px 0",
                    }}
                    value={channel[input_text]}
                    name={input_text}
                    onChange={handleInputChange}
                    label={label}
                  />
                )
              )}
        </>
      )}
    </>
  );
}
ChannelInputs.propTypes = {
  cat: PropTypes.string.isRequired,
  channel: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func,
  disabled: PropTypes.bool,
  handleFile: PropTypes.func,
  files: PropTypes.object,
  streamSet: PropTypes.bool,
  marginVal: PropTypes.string,
  dividerShow: PropTypes.string,
};

export default ChannelInputs;
