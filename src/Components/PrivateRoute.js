import React from "react";
import { Redirect, Route } from "react-router";
import { useAuth } from "../context/ChannelContext";

function PrivateRoute({ component: Component, ...rest }) {
  const { user } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) =>
        user ? <Component {...props} /> : <Redirect to="/login" />
      }></Route>
  );
}

export default PrivateRoute;
