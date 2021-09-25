import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebaseConf";
import { useHistory } from "react-router-dom";
import firebase from "firebase/compat/app";

export const ChannelContext = createContext();

export function useAuth() {
  return useContext(ChannelContext);
}

export function ChannelProvider({ children }) {
  const [channelData, setChannelData] = useState({});
  const [radio, setRadio] = useState(null);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [loadEl, setLoadEl] = useState();
  const history = useHistory();

  const signIn = (email, pass) => {
    return auth.signInWithEmailAndPassword(email, pass);
  };

  const signOut = () => {
    return auth.signOut();
  };

  useEffect(() => {
    const unsubscribe = () =>
      auth.onAuthStateChanged(async (user) => {
        if (auth.currentUser) {
          setLoading(true);
          history.push("/");
        } else {
          history.push("/login");
          setUser(user);
        }
      });
    return unsubscribe();
  }, [history]);

  const logVal = {
    user,
    signIn,
    signOut,
    loading,
    setLoading,
    loadEl,
    setLoadEl,
  };

  return (
    <ChannelContext.Provider
      value={{
        channelDatas: [channelData, setChannelData],
        radioStat: [radio, setRadio],
        login: logVal,
      }}>
      {children}
    </ChannelContext.Provider>
  );
}
