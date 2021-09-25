const admin = require("firebase-admin");
const serviceAccount = require("../firebaseAdminKey.json");
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL:
      "https://uturk-admin-website-default-rtdb.europe-west1.firebasedatabase.app",
  });
}

module.exports = (req, res) => {
  let anonNum = 0;
  return admin
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
};
