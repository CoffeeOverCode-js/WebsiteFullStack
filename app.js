const chalk = require("chalk");
const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");
const PORT = process.env.PORT || 8080;
const CORS = require("cors");
const axios = require("axios");
const functions = require("./controller/user.controller");
const jwt = require("jsonwebtoken");
const Credentials = require("./model/credentialsSchema.model");

const app = express();
app.use(CORS());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// async function fetchUserCredentials(username, req, res) {
//     try {
//         const credentials = functions.findCredentials(req, res)
//     } catch (e) {

//     }
// }

app.get("/", (req, res) => {
  res.send("Homepage");
});

// app.post('/test', (req, res) => {
//     const fullName = req.body.fullName;
//     const usr = req.body.username;
//     const pwd = req.body.password;
//     const orgUnits = req.body.orgUnits;
//     const divisions = req.body.divisions;
//     res.send(`${orgUnits}, \n ${divisions}`)
// })

app.get("/data", (req, res) => {
  const credentials = functions.findCredentials(req, res);
  // res.send(credentials)
});

app.post("/login", async (req, res) => {
  try {
    const usr = req.body.usr;
    const pwd = req.body.pwd;

    console.log(pwd);
    console.log(usr);

    const credentials = await functions.findCredentials();
    const validUser = credentials.find(
      (user) => user.username === usr && user.password === pwd
    );

    // console.log(credentials);
    // console.log(validUser);

    if (validUser) {
      const payload = {
        username: validUser.username,
        password: validUser.password,
        role: validUser.role,
      };
      console.log(validUser.credentialsID);
      const token = jwt.sign(JSON.stringify(payload), "jwt-secret", {
        algorithm: "HS256",
      });
      res.json({ jwt: token, credentialsID: validUser._id });
    } else {
      res.status(403).send({ err: "Incorrect login!" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Some error occurred while processing the request" });
  }
});

app.post("/register", async (req, res) => {
  try {
    const credentials = await functions.findCredentials();

    const fullName = req.body.fullName;
    const usr = req.body.username;
    const pwd = req.body.password;
    const role = 1;
    const orgUnits = req.body.orgUnits;
    const divisions = req.body.divisions;
    const credentialsID = credentials.length + 1;

    console.log(
      ` ${fullName} \n ${usr} \n ${pwd} \n ${role} \n ${orgUnits} \n ${divisions} \n ${credentialsID}`
    );
    // res.send("Registered User")
    await functions.registerUserCredentials(
      fullName,
      usr,
      pwd,
      role,
      orgUnits,
      divisions,
      credentialsID
    );

    await functions.registerDivCredentials(credentialsID, divisions);
    await functions.registerOrgCredentials(credentialsID, orgUnits);
    // const user = await functions.findUser(credentialsID)
    // const userID = user
    // console.log(userID);

    // console.log(user);
    // functions.registerUserCredentials(req, res, credentialsID, fullName, usr, role, pwd)
    res.send("User and User credentials was added");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Some error occurred while processing the request" });
  }
});

app.post("/view-credentials", (req, res) => {
  const token = req.headers["authorization"]
    ? req.headers["authorization"].split(" ")[1]
    : "none";
  try {
    const divisionID = req.body.divisionID;
    console.log(`First Step: ${divisionID}`);
    if (token != "none") {
      const decoded = jwt.verify(token, "jwt-secret");
      console.log(`Second Step: ${decoded}`);
      const allowedUsers = ["Normal User", "Management User", "Admin User"];
      // let hasPermissions = false;

      const role = decoded.role;
      console.log(`Third Step: ${role}`);

      if (allowedUsers.includes(role)) {
        functions.retrieveDivison(res, divisionID);
      } else {
        res.send({
          msg: "You do not have valid permissions to view this endpoint",
        });
      }
    } else {
      res.send({ msg: "You do not have an account or are not logged in" });
    }
  } catch (error) {
    res.status(403).send({
      msg: "Your JWT was verified, but you do not have permission to access this endpoint",
    });
  }
});

app.post("/add-credential", async (req, res) => {
  const collectionName = req.body.collectionName; //either 1(Division) or 2(OrgUnit)
  const credentialsID = req.body.credentialsID;
  const repoID = req.body.repoID;
  const token = req.headers["authorization"]
    ? req.headers["authorization"].split(" ")[1]
    : "none";

  try {
    if (token != "none") {
      const decoded = jwt.verify(token, "jwt-secret");
      const allowedUsers = ["Normal User", "Management User", "Admin User"];

      const role = decoded.role;

      if (allowedUsers.includes(role)) {
        const divisionName = await functions.addCredentials(
          collectionName,
          credentialsID,
          repoID
        );
        res.send({ msg: "Added Credential" });
      } else {
        res.send({
          msg: "You do not have valid permissions  to view this endpoint",
        });
      }
    } else {
      res.send({ msg: "You do not have an account or are not logged in" });
    }
  } catch (error) {
    res.status(403).send({
      msg: "Your JWT was verified, but you do not have permission to access this endpoint",
    });
  }
});

app.post("/update-credential", async (req, res) => {
  const selection = req.body.selection;
  const credentialsID = req.body.credentialsID;
  const oldUnitID = req.body.oldUnitID;
  const newUnitID = req.body.newUnitID;

  console.log(newUnitID);

  const token = req.headers["authorization"]
    ? req.headers["authorization"].split(" ")[1]
    : "none";

  if (token != "none") {
    const decoded = jwt.verify(token, "jwt-secret");
    const allowedUsers = ["Management User", "Admin User"];
    const role = decoded.role;

    if (allowedUsers.includes(role)) {
      const data = await functions.getUserCredentials(
        req,
        res,
        credentialsID,
        oldUnitID,
        selection
      );
      console.log(data);
      // if (data.index === -1) {
      //     res.send('')
      // }
      await functions.updateUserCredentials(
        req,
        res,
        credentialsID,
        oldUnitID,
        newUnitID,
        data,
        selection
      );
      // await functions.
    } else {
      res.send({ msg: "You do not have valid permissions to update Users" });
    }
  } else {
    res.send({ msg: "You do not have an account or are not logged in" });
  }
});

app.post("/getUser", async (req, res) => {
  const credentialsID = req.body.credentialsID;
  const user = await functions.findUser(credentialsID);
  res.json(user);
});

app.post("/getSingleCred", async (req, res) => {
  const credentialsID = req.body.credentialsID;
  const userCred = await Credentials.find({ _id: credentialsID });
  res.json(userCred[0]);
});

app.post("/getCredentials", async (req, res) => {
  const credentialsID = req.body.credentialsID;
  const userCreds = await functions.findCredentials(credentialsID);
  res.json(userCreds);
});

app.post("/getRole", async (req, res) => {
  const credentialsID = req.body.credentialsID;
  console.log(credentialsID);
  const user = await functions.findUser(credentialsID);
  console.log(user);
  const roleID = user.role;
  console.log(roleID);
  const roleName = await functions.getRole(roleID);
  console.log(roleName);
  res.send(roleName);
});

app.post("/getDivisions", async (req, res) => {
  const credentialsID = req.body.credentialsID;
  const divisions = await functions.getUserDivisions(credentialsID);
  res.send(divisions);
});

app.post("/getOrgUnits", async (req, res) => {
  const credentialsID = req.body.credentialsID;
  const orgUnits = await functions.getOrgUnits(credentialsID);
  res.send(orgUnits);
});

app.post("/availableCreds", async (req, res) => {
  console.log("start");
  const credentialsID = req.body.credentialsID;
  const collectionName = req.body.collectionName;
  const availableCreds = await functions.getAvailableCreds(
    credentialsID,
    collectionName
  );
  res.send(availableCreds);
});

app.post("/originalCreds", async (req, res) => {
  const credentialsID = req.body.credentialsID;
  const collectionName = req.body.collectionName;
  const originalCreds = await functions.getOriginalCreds(
    credentialsID,
    collectionName
  );
  res.send(originalCreds);
});

app.get("/retrieveAllUsers", async (req, res) => {
  const usernames = await functions.retrieveAllUsers();
  res.send(usernames);
});

app.post("/updateUserRole", async (req, res) => {
  const credentialsID = req.body.credentialsID;
  const newRole = req.body.newRole;

  const token = req.headers["authorization"]
    ? req.headers["authorization"].split(" ")[1]
    : "none";

  if (token != "none") {
    const decoded = jwt.verify(token, "jwt-secret");
    const allowedUser = "Admin User";
    const role = decoded.role;

    if (role === allowedUser) {
      await functions.updateUserRole(credentialsID, newRole);
      res.send("User Role Updated");
    } else {
      res.send({
        msg: "You do not have valid permissions to update Users Roles",
      });
    }
  } else {
    res.send({ msg: "You do not have an account or are not logged in" });
  }
});

app.post("/test", (req, res) => {
  const test = req.body.test;
  res.send(test);
});

app.listen(PORT, () => {
  console.log(chalk.yellow(`Server running on port: ${PORT}`));
});
