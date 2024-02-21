const db = require("./../db");
const mongoose = require("mongoose");
const User = require("../model/userSchema.model");
const Credentials = require("../model/credentialsSchema.model");
const Roles = require("./../model/roleSchema.model");
const Division = require("../model/divisionSchema.model");
const OrgUnit = require("./../model/orgUnitsSchema.model");
// const functions = require('./../')
// const findCredentials = (req, res) => {
//     // const name = "Ryan Fredericks";

//     Credentials.find({})
//     .then((data) => {
//         if ( data.length === 0) {
//             res.status(200).json({ message: "No Data" });
//         }
//         else {
//             res.status(200).json(data)
//         }
//         console.log(data)
//     })
//     .catch((e) => {
//         console.error(e);
//         res.status(500).json({ message: "Some error occurred while retrieving data" })
//     })
// }
const findCredentials = async () => {
  try {
    const data = await Credentials.find({});
    return data;
  } catch (e) {
    console.error(e);
    throw new Error("Error occurred while retrieving data");
  }
};

const getRole = async (roleID) => {
  try {
    const data = await Roles.findOne({ _id: roleID });
    const roleName = data.roleName;
    return roleName;
    // return data
  } catch (error) {
    console.error(error);
    throw new Error("Error occured when retrieving data");
  }
};

const findUser = async (credentialsID) => {
  try {
    const user = await User.findOne({ credentialsID: credentialsID });
    // console.log(user[0]);
    return user;
    // const userID = user._id
    // console.log(userID);
    // return userID;
  } catch (error) {
    console.error(error);
    throw new Error("Error occurred while retrieving user");
  }
};

const registerUser = async (
  fullName,
  usr,
  pwd,
  role,
  orgUnits,
  divisions,
  credentialsID
) => {
  try {
    const newUser = new User({
      fullName: fullName,
      username: usr,
      role: role,
      orgUnits: orgUnits,
      divisions: divisions,
      credentialsID: credentialsID,
    });

    const savedUser = await newUser.save();
    return savedUser;
  } catch (error) {
    console.error(error);
    throw new Error("Error occurred while adding user");
  }
};

const registerUserCredentials = async (
  fullName,
  usr,
  pwd,
  role,
  orgUnits,
  divisions,
  credentialsID
) => {
  const newUser = await registerUser(
    fullName,
    usr,
    pwd,
    role,
    orgUnits,
    divisions,
    credentialsID
  );

  console.log(newUser);
  const user = await findUser(credentialsID);
  const userID = user._id;
  const roleName = await getRole(role);
  console.log(roleName);
  // console.log(`UserID: ${userID}`);
  try {
    const newCredentials = new Credentials({
      _id: credentialsID,
      fullName: fullName,
      userID: userID,
      username: usr,
      role: roleName,
      password: pwd,
    });

    const savedCredentials = await newCredentials.save();
  } catch (error) {
    console.error(error);
    throw new Error("Error occured while adding credentials");
  }
};

const registerDivCredentials = async (credentialsID, divisions) => {
  try {
    for (let i = 0; i < divisions.length; i++) {
      const divisionId = divisions[i];
      const updatedDivision = await Division.findOneAndUpdate(
        { _id: divisionId },
        { $addToSet: { credentialsID: credentialsID } },
        { returnOriginal: false }
      );

      console.log("Updated Division:", updatedDivision.value);
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error occurred while updating divisions");
  }
};

const registerOrgCredentials = async (credentialsID, orgUnits) => {
  try {
    for (let i = 0; i < orgUnits.length; i++) {
      const orgUnitID = orgUnits[i];
      const updatedOrgUnits = await OrgUnit.findOneAndUpdate(
        { _id: orgUnitID },
        { $addToSet: { credentialsID: credentialsID } },
        { returnOriginal: false }
      );
      console.log("Updated OrgUnit:", updatedOrgUnits);
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error occurres while updating orgUnits");
  }
};

const retrieveDivison = async (res, divisionID) => {
  try {
    const division = await Division.findOne({ _id: divisionID });

    console.log(division);

    const divCredIDs = division.credentialsID;

    console.log(divCredIDs);

    const userCreds = [];

    for (let i = 0; i < divCredIDs.length; i++) {
      const userCredentials = await Credentials.findOne({ _id: divCredIDs[i] });
      userCreds.push(userCredentials);
    }
    console.log(userCreds);
    res.send(userCreds);
  } catch (error) {
    console.error(error);
    throw new Error("Error occurred while retrieving data");
  }
};

const addCredentials = async (collectionName, credentialsID, repoID) => {
  if (collectionName === "division") {
    try {
      const updatedDivision = await Division.findOneAndUpdate(
        { _id: repoID },
        { $addToSet: { credentialsID: credentialsID } },
        { returnOriginal: false }
      );
      console.log("Updated Division:", updatedDivision);
      const updatedUser = await User.findOneAndUpdate(
        { credentialsID: credentialsID },
        { $addToSet: { divisions: updatedDivision._id } },
        { returnOriginal: false }
      );
      console.log("Updated User:", updatedUser.divisions);
    } catch (error) {
      console.error(error);
      throw new Error("Error occurred while retrieving data");
    }
  } else {
    try {
      const updatedOrgUnits = await OrgUnit.findOneAndUpdate(
        { _id: repoID },
        { $addToSet: { credentialsID: credentialsID } },
        { returnOriginal: false }
      );
      console.log("Updated OrgUnit:", updatedOrgUnits);
      const updatedUser = await User.findOneAndUpdate(
        { credentialsID: credentialsID },
        { $addToSet: { orgUnits: updatedOrgUnits._id } },
        { returnOriginal: false }
      );
      console.log("Updated User:", updatedUser.orgUnits);
    } catch (error) {
      console.error(error);
      throw new Error("Error occurred while retrieving data");
    }
  }
};

const getUserCredentials = async (
  req,
  res,
  credentialsID,
  oldUnitID,
  selection
) => {
  try {
    let data = {};
    let Repo = selection === "division" ? Division : OrgUnit;

    const userDetails = await User.find({ credentialsID: credentialsID });
    const RepoCredentials = await Repo.find({ _id: oldUnitID });
    console.log("Test:", RepoCredentials);

    // console.log(userDetails);
    const divisions = userDetails[0].divisions;
    // console.log(divisions);

    if (Repo === Division) {
      const divisions = userDetails[0].divisions;
      console.log("Divisions:", divisions); // Check the value of divisions
      // console.log('Org ID:', oldUnitID); // Check the value of oldUnitID
      let index = divisions.indexOf(oldUnitID);
      // console.log('Index:', index); // Check the index

      const divisionsCredIds = RepoCredentials[0].credentialsID;
      const indexToRemove = divisionsCredIds.indexOf(credentialsID);
      data = {
        divisions: divisions,
        index: index,
        divisionsCredIds: divisionsCredIds,
        indexToRemove: indexToRemove,
      };
      return data;
    } else if (Repo === OrgUnit) {
      const orgUnits = userDetails[0].orgUnits;
      console.log("org:", orgUnits);
      let index = orgUnits.indexOf(oldUnitID);

      const orgUnitsCredIds = RepoCredentials[0].credentialsID;
      const indexToRemove = orgUnitsCredIds.indexOf(credentialsID);
      data = {
        orgUnits: orgUnits,
        index: index,
        orgUnitsCredIds: orgUnitsCredIds,
        indexToRemove: indexToRemove,
      };
      return data;
    } else {
      res.send("No user found with the provided credentialsID");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error occurred while retrieving data");
  }
};

const updateUserCredentials = async (
  req,
  res,
  credentialsID,
  oldUnitID,
  newUnitID,
  data,
  selection
) => {
  try {
    const Repo = selection === "division" ? Division : OrgUnit;
    if (Repo === Division) {
      let divisions = data.divisions;
      const index = data.index;
      console.log(`Data: ${data}`);
      console.log(`Div: ${divisions}`);
      console.log(newUnitID);

      divisions[index] = newUnitID;

      const updatedUser = await User.findOneAndUpdate(
        { credentialsID: credentialsID },
        { $set: { divisions: divisions } },
        { new: true }
      );
      console.log(updatedUser);

      const credIDs = data.divisionsCredIds;
      console.log(credIDs);
      const indexToRemove = data.indexToRemove;
      console.log(indexToRemove);
      credIDs.splice(indexToRemove, 1);
      console.log(credIDs);

      const removedDivision = await Division.findOneAndUpdate(
        { _id: oldUnitID },
        { $set: { credentialsID: credIDs } },
        { new: true }
      );
      console.log(removedDivision);

      const addedDivision = await Division.findOneAndUpdate(
        { _id: newUnitID },
        { $addToSet: { credentialsID: credentialsID } },
        { new: true }
      );

      console.log(addedDivision);

      res.send("Division Updated");
    } else {
      let orgUnits = data.orgUnits;
      const index = data.index;

      orgUnits[index] = newUnitID;

      const updatedUser = await User.findOneAndUpdate(
        { credentialsID: credentialsID },
        { $set: { orgUnits: orgUnits } },
        { new: true }
      );
      console.log(updatedUser);

      const credIDs = data.orgUnitsCredIds;
      console.log(credIDs);
      const indexToRemove = data.indexToRemove;
      console.log(indexToRemove);
      credIDs.splice(indexToRemove, 1);
      console.log(credIDs);

      const removedOrgUnit = await OrgUnit.findOneAndUpdate(
        { _id: oldUnitID },
        { $set: { credentialsID: credIDs } },
        { new: true }
      );
      console.log(removedOrgUnit);

      const addedOrgUnit = await OrgUnit.findOneAndUpdate(
        { _id: newUnitID },
        { $addToSet: { credentialsID: credentialsID } },
        { new: true }
      );
      console.log(addedOrgUnit);
      res.send("OrgUnit Updated");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error occurred while updating data");
  }
};
//1, 2, 4, 5, 6
const getUserDivisions = async (credentialsID) => {
  const divNames = [];
  const user = await User.find({ credentialsID: credentialsID });
  console.log(user);

  const divisions = user[0].divisions;
  console.log(divisions);

  for (let i = 0; i < divisions.length; i++) {
    const division = await Division.find({ _id: divisions[i] });
    // console.log(division);
    console.log(division[0].divisionName);
    divNames.push(division[0].divisionName);
  }

  return divNames;
};

const getOrgUnits = async (credentialsID) => {
  const orgUnitNames = [];
  const user = await User.find({ credentialsID: credentialsID });
  console.log(user);

  const orgUnits = user[0].orgUnits;
  console.log(orgUnits);

  for (let i = 0; i < orgUnits.length; i++) {
    const orgUnit = await OrgUnit.find({ _id: orgUnits[i] });
    console.log(orgUnit[0].OU_Name);
    orgUnitNames.push(orgUnit[0].OU_Name);
  }

  return orgUnitNames;
};

const getAvailableCreds = async (credentialsID, collectionName) => {
  if (collectionName === "division") {
    const availableDivs = [];
    const divObjs = await Division.find({
      credentialsID: { $ne: credentialsID },
    });

    for (let i = 0; i < divObjs.length; i++) {
      const DivObj = {
        value: divObjs[i]._id,
        label: divObjs[i].divisionName,
      };
      console.log(DivObj);
      availableDivs.push(DivObj);
    }
    console.log("end");

    return availableDivs;
  } else {
    console.log("start");
    const availableOrgUnits = [];
    const orgUnitObjs = await OrgUnit.find({
      credentialsID: { $ne: credentialsID },
    });
    for (let i = 0; i < orgUnitObjs.length; i++) {
      const OrgUnitObj = {
        value: orgUnitObjs[i]._id,
        label: orgUnitObjs[i].OU_Name,
      };
      console.log(`OrgUnit: ${OrgUnitObj}`);
      availableOrgUnits.push(OrgUnitObj);
    }
    console.log("end");
    return availableOrgUnits;
  }
};

const getOriginalCreds = async (credentialsID, collectionName) => {
  if (collectionName === "division") {
    const originalCreds = [];
    const originalCredsObjs = await Division.find({
      credentialsID: credentialsID,
    });
    for (let i = 0; i < originalCredsObjs.length; i++) {
      const originalCredsObj = {
        value: originalCredsObjs[i]._id,
        label: originalCredsObjs[i].divisionName,
      };
      console.log(`Division: ${originalCredsObj}`);
      originalCreds.push(originalCredsObj);
    }
    return originalCreds;
  } else {
    const originalCreds = [];
    const originalCredsObjs = await OrgUnit.find({
      credentialsID: credentialsID,
    });
    for (let i = 0; i < originalCredsObjs.length; i++) {
      const originalCredsObj = {
        value: originalCredsObjs[i]._id,
        label: originalCredsObjs[i].OU_Name,
      };
      console.log(`Division: ${originalCredsObj}`);
      originalCreds.push(originalCredsObj);
    }
    return originalCreds;
  }
};

const retrieveAllUsers = async () => {
  const userCreds = await Credentials.find({});
  const usernames = [];
  console.log(userCreds);

  for (let i = 0; i < userCreds.length; i++) {
    const userNameObj = {
      value: userCreds[i]._id,
      label: userCreds[i].username,
    };
    usernames.push(userNameObj);
  }

  return usernames;
};

const updateUserRole = async (credentialsID, newRole) => {
  let roleName = "";
  const updatedUser = await User.findOneAndUpdate(
    { credentialsID: credentialsID },
    { $set: { role: newRole } },
    { new: true }
  );
  console.log(updatedUser);

  if (newRole === 1) {
    roleName = "Normal User"
  }
  else if (newRole === 2) {
    roleName = "Management User"
  }
  else {
    roleName = "Admin User"
  }

  const updatedCreds = await Credentials.findOneAndUpdate(
    { _id: credentialsID },
    { $set: { role: roleName } },
    { new: true }
  );
  console.log(updatedCreds);
};

module.exports = {
  findCredentials,
  findUser,
  getRole,
  registerUser,
  registerUserCredentials,
  registerDivCredentials,
  registerOrgCredentials,
  retrieveDivison,
  addCredentials,
  getUserCredentials,
  updateUserCredentials,
  getUserDivisions,
  getOrgUnits,
  getAvailableCreds,
  getOriginalCreds,
  retrieveAllUsers,
  updateUserRole
};
