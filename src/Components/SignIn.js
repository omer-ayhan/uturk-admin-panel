import React, { useRef } from "react";
import {
  Backdrop,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@material-ui/core";
import { useStyles, icons } from "./MainStyle";
import { useAuth } from "../context/ChannelContext";
import { useHistory } from "react-router-dom";

function SignIn() {
  const classes = useStyles();
  const emailRef = useRef(null);
  const passRef = useRef(null);
  const { login } = useAuth();
  const { signIn, loadEl, setLoadEl, setLoading } = login;
  const history = useHistory();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      setLoadEl(true);
      history.push("/login");
      await signIn(emailRef.current.value, passRef.current.value);
      setLoading(true);
      history.push("/");
    } catch {
      alert("Failed to sign in");
    }
    setLoadEl(false);
  };
  return (
    <Container maxWidth="sm" className={classes.container}>
      <Backdrop className={classes.backdrop} open={loadEl}>
        <CircularProgress color="primary" />
        <Typography variant="h6">Signing In...</Typography>
      </Backdrop>
      <Card className={classes.loginBox}>
        <form
          onSubmit={handleSignIn}
          className={classes.root}
          autoComplete="off">
          <Box
            width="100%"
            height="300px"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="flex-start"
            style={{ gap: "20px" }}
            mt="20px">
            <img className={classes.loginLogo} src={icons.uturk} alt="" />
            <TextField
              inputRef={emailRef}
              type="email"
              required
              className={classes.loginInput}
              label="Email"
              variant="outlined"
            />
            <TextField
              inputRef={passRef}
              className={classes.loginInput}
              required={true}
              label="Password"
              type="password"
              variant="outlined"
            />
            <Button
              type="submit"
              className={classes.loginBtn}
              variant="contained"
              color="primary"
              disabled={loadEl}>
              Sign In
            </Button>
          </Box>
        </form>
      </Card>
    </Container>
  );
}

export default SignIn;
