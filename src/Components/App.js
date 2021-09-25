import { Box } from "@material-ui/core";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ChannelProvider } from "../context/ChannelContext";
import AddChannel from "./AddChannel";
import EditChannel from "./EditChannel";
import Navbar from "./Navbar";
import PrivateRoute from "./PrivateRoute";
import Settings from "./Settings";
import SignIn from "./SignIn";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <ChannelProvider>
            <PrivateRoute exact path={["/", "/edit", "/settings"]}>
              <Navbar />
            </PrivateRoute>
            <PrivateRoute exact path="/">
              <Box p="20px 80px 20px 130px">
                <AddChannel />
              </Box>
            </PrivateRoute>
            <PrivateRoute exact path="/edit">
              <Box p="20px 80px 20px 130px">
                <EditChannel />
              </Box>
            </PrivateRoute>
            <PrivateRoute exact path="/settings">
              <Settings />
            </PrivateRoute>
            <Route exact path="/login" component={SignIn}></Route>
          </ChannelProvider>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
