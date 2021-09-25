const express = require("express");
const app = express();
const port = 5000;
const admin = require("firebase-admin");
const serviceAccount = require("../firebaseAdminKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://notetab-8de87.firebaseio.com",
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.post("/auth", (req, res) => {
  let anonNum = 0;
  admin
    .auth()
    .listUsers(Number(req.query.num) + 1)
    .then((listUsersResult) => {
      listUsersResult.users.forEach(function (userRecord) {
        if (userRecord.providerData.length === 0) {
          //this user is anonymous
          console.log(userRecord); // do your delete here
          ++anonNum;
          admin
            .auth()
            .deleteUser(userRecord.uid)
            .then(function () {
              console.log("Successfully deleted user");
            })
            .catch(function (error) {
              console.log("Error deleting user:", error);
            });
        }
      });
      if (anonNum > 0) {
        res.send({ users: anonNum, msg: `${anonNum} users deleted` });
      } else {
        res.send({ users: 0, msg: "No anonymous users found" });
      }
    })
    .catch(function (error) {
      res.send({ users: 0, msg: "An error occured" });
    });
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
