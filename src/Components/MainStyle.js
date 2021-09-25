import { makeStyles } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import MoreIcon from "@material-ui/icons/MoreVert";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import EditIcon from "@material-ui/icons/Edit";
import SettingsIcon from "@material-ui/icons/Settings";
import AddIcon from "@material-ui/icons/Add";
import SaveIcon from "@material-ui/icons/Save";
import live from "../img/live.svg";
import locked from "../img/locked.png";
import uturk from "../img/uturk_logo.png";
import DeleteIcon from "@material-ui/icons/Delete";

const drawerWidth = 240;
const useStyles = makeStyles(
  (theme) => ({
    container: {
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    loginBox: {
      width: "350px",
      height: "380px",
      boxShadow:
        "rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    },
    loginLogo: {
      width: "140px",
      height: "auto",
      margin: " 20px 0 35px 0",
    },
    loginInput: {
      width: "80%",
      color: "#333",
    },
    loginBtn: {
      width: "80%",
      fontSize: "1rem",
      letterSpacing: "2.1px",
      fontWeight: 700,
    },
    delete: {
      background: "#f02233",
      fontWeight: "bold",
    },
    allChannels: {
      height: "370px",
      overflowX: "hidden",
      overflowY: "scroll",
    },
    preview: {
      backgroundColor: "rgba(191, 191, 191, 0.2)",
      width: "450px",
      height: "",
      borderRadius: "20px",
    },
    backdrop: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      zIndex: theme.zIndex.drawer + 1,
      textAlign: "center",
      color: "#fff",
    },
    back: {
      backgroundColor: "rgba(191, 191, 191, 0.15)",
      borderRadius: "20px",
    },
    addBox: {
      minWidth: "20px",
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    fab: { position: "fixed", bottom: "20px", right: "20px" },
    root: {
      display: "flex",
      height: "70px",
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    links: {
      textDecoration: "none",
      color: "#000",
    },
    lockedBtn: { position: "absolute", top: "10px", left: "10px" },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: "none",
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: "nowrap",
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: "hidden",
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      width: "100%",
      display: "flex",
      gap: "10px",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    grow: {
      flexGrow: 1,
    },

    sectionDesktop: {
      display: "none",
      [theme.breakpoints.up("md")]: {
        display: "flex",
      },
    },
    sectionMobile: {
      display: "flex",
      [theme.breakpoints.up("md")]: {
        display: "none",
      },
    },
    settingsPaper: {
      width: "60%",
      padding: "20px",
    },
  }),
  { index: 1 }
);

const icons = {
  AddCircleIcon: AddCircleIcon,
  ExitToAppIcon: ExitToAppIcon,
  MoreIcon: MoreIcon,
  EditIcon: EditIcon,
  MenuIcon: MenuIcon,
  ChevronLeftIcon: ChevronLeftIcon,
  ListItemIcon: ListItemIcon,
  AddIcon: AddIcon,
  SaveIcon: SaveIcon,
  DeleteIcon: DeleteIcon,
  SettingsIcon: SettingsIcon,
  uturk: uturk,
  live: live,
  locked: locked,
};

const elements = {
  nav_links: [
    { link: "/", text: "Add Channel" },
    { link: "/edit", text: "Edit Channels" },
    { link: "/settings", text: "Settings" },
  ],
  Teaminput_set: [
    { input_text: "team_name1", label: "First", input_img: "logo1" },
    { input_text: "team_name2", label: "Second", input_img: "logo2" },
  ],
  Streaminput_set_event: [
    { input_text: "start_time", label: "Start Time" },
    { input_text: "stream_url", label: "Stream URL" },
    { input_text: "stream_title", label: "Stream Title" },
  ],
  Streaminput_set_channel: [
    { input_text: "stream_url", label: "Stream URL" },
    { input_text: "stream_title", label: "Stream Title" },
  ],
};
const cat_keys = {
  channels: {
    channel_name: "",
    stream_url: "",
    stream_title: "",
    tags: [],
    logo2: "",
  },
  events: {
    team_name1: "",
    team_name2: "",
    start_time: "",
    stream_url: "",
    stream_title: "",
    isLive: true,
    tags: [],
    logo1: "",
    logo2: "",
  },
  event_files: { logo1: "", logo2: "" },
  channel_file: { channel_img: "" },
};

export { useStyles, icons, elements, cat_keys };
