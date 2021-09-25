import React from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import "../css/App.css";
import clsx from "clsx";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Link, Menu, MenuItem } from "@material-ui/core";
import { useStyles, icons, elements } from "./MainStyle";
import { useAuth } from "../context/ChannelContext";

export default function Navbar() {
  const [
    AddCircleIcon,
    ExitToAppIcon,
    MoreIcon,
    EditIcon,
    MenuIcon,
    ChevronLeftIcon,
    ListItemIcon,
    SettingsIcon,
  ] = [
    icons.AddCircleIcon,
    icons.ExitToAppIcon,
    icons.MoreIcon,
    icons.EditIcon,
    icons.MenuIcon,
    icons.ChevronLeftIcon,
    icons.ListItemIcon,
    icons.SettingsIcon,
  ];
  const navIcon_list = [<AddCircleIcon />, <EditIcon />, <SettingsIcon />];
  const classes = useStyles();
  const { login } = useAuth();
  const { signOut, loading } = login;
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
    handleLogout();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      history.push("/login");
    } catch {
      alert("Failed to sign out");
    }
  };

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}>
      <MenuItem onClick={handleMobileMenuClose}>
        <ExitToAppIcon />
        <p>Sign out</p>
      </MenuItem>
    </Menu>
  );

  return (
    loading && (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
              })}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Utürk Admin Panel
            </Typography>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={handleMobileMenuClose}
                color="inherit">
                <Link color="inherit" underline="none">
                  <ExitToAppIcon />
                </Link>
              </IconButton>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit">
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}>
          <List>
            <ListItem
              button
              className={classes.toolbar}
              style={{ width: "100%" }}
              onClick={handleDrawerClose}>
              <ListItemIcon>
                <ChevronLeftIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText primary="" />
            </ListItem>
            <Divider />
            {elements.nav_links.map(({ link, text }, index) => (
              <Link
                className={classes.links}
                key={index}
                to={link}
                component={RouterLink}
                underline="none">
                <ListItem button>
                  <ListItemIcon>{navIcon_list[index]}</ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="h6">{text}</Typography>}
                  />
                </ListItem>
              </Link>
            ))}
          </List>
          <Divider />
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
        </main>
      </div>
    )
  );
}
