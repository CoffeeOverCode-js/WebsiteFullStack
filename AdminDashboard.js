import { useState } from "react";
import Select from "react-select";
import AdminForm from "./AdminForm";
import AddAdminDivForm from "./AdminContent/AddAdminDivForm";
import AddAdminOrgUnitForm from "./AdminContent/AddAdminOrgUnitForm";
import UpdateForm from "./UpdateForm";
import UpdateUserRole from "./AdminContent/UpdateUserRole";
const AdminDashboard = ({ usernames, token, setUsernames }) => {
  const [selectedUser, setSelectedUser] = useState({
    value: null,
    label: "Select...",
  });

  const [homepageData, setHomepageData] = useState({
    credentialsID: null,
    roleName: "",
  });

  const [updateData, setUpdateData] = useState({
    token: token,
    collectionName: "",
    oldUnitID: null,
    newUnitID: null,
    credentialsID: null,
  });

  const [selectOPT, setSelectOPT] = useState("");

  // const [usernames, setUsernames] = useState([]);

  const [loaded, setLoaded] = useState("");

  const [userData, setUserData] = useState({});
  const [credData, setCredData] = useState({});
  const [submitClicked, setSubmitClicked] = useState(false);
  const [roleData, setRoleData] = useState({
    credentialsID: null,
    oldRole: null,
    newRole: null,
  });

  const customStyles = {
    // Example of custom styles for the control
    control: (provided, state) => ({
      ...provided,
      background: "transparent",
      width: "400px",
      marginLeft: "100px",
      // Add your custom styles here
    }),

    // Example of custom styles for the menu
    menu: (provided, state) => ({
      ...provided,
      background: "transparent",
      marginTop: "8px", // Adjust the top margin to create space between dropdowns
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)", // Example box shadow
      position: "relative",
      marginLeft: "100px",
      // '&:hover': {
      //     backgroundColor: 'black'
      // }
      // Add your custom styles here
    }),
    option: (provided, state) => ({
      ...provided,
      "&:hover": {
        backgroundColor: "black", // Change the background color on hover
        color: "white", // Change text color on hover
      },
      "&:not(:hover)": {
        backgroundColor: "transparent", // Change background color when not hovered
        color: "white", // Change text color when not hovered
      },
      // marginLeft: '100px'
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: "white",
    }),
    // Add more styles for other components as needed
  };

  const handleUsernameChange = (username) => {
    const value = username.value;
    const label = username.label;
    setSelectedUser({
      value: value,
      label: label,
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const credentialsID = selectedUser.value;

      const userRes = await fetch("http://localhost:8080/getUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credentialsID }),
      });
      if (userRes.ok) {
        const data = await userRes.json();
        setUserData(data);
        console.log(data);
      }

      const credsRes = await fetch("http://localhost:8080/getSingleCred", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credentialsID }),
      });
      if (credsRes.ok) {
        const data = await credsRes.json();
        setCredData(data);
        console.log(data);

        const roleName = data.role;

        setHomepageData({
          credentialsID: credentialsID,
          roleName: roleName,
        });
        console.log(homepageData);
      }

      // console.log(credData);

      setUpdateData({
        token: token,
        collectionName: "",
        oldUnitID: null,
        newUnitID: null,
        credentialsID: credentialsID,
      });
      setLoaded("loaded");
      setSubmitClicked(true);
      console.log(userData);
    } catch (error) {
      console.error("Error occurred while fetching data", error);
    }
  };

  const handleRoleUpdate = (e) => {
    e.preventDefault();
    const roleName = homepageData.roleName;
    let oldRole = null;
    if (roleName === 'Admin User') {
      oldRole = 3;
    }
    else if (roleName === 'Management User') {
      oldRole = 2;
    }
    else {
      oldRole = 1;
    }
    setRoleData({
      credentialsID: homepageData.credentialsID,
      oldRole: oldRole,
      newRole: null,
    });
    console.log("Clicked");
    setSelectOPT("updateUserRole");
  };

  console.log(userData);
  console.log(credData);

  return (
    <div className="admin-container">
      <div className="admin-leftside">
        <h1>Admin Dashboard</h1>
        <Select
          options={usernames}
          name="username"
          value={selectedUser}
          onChange={handleUsernameChange}
          styles={customStyles}
        />
        <button
          className="btn btn-dark admin-Submit-Btn"
          onClick={handleSubmit}
        >
          Submit
        </button>
        {submitClicked ? (
          <button
            className="btn btn-danger admin-UpdateRole-Btn"
            onClick={handleRoleUpdate}
          >
            Update Role
          </button>
        ) : null}
      </div>
      <div className="admin-rightside">
        {loaded !== "" ? (
          <>
            {selectOPT === "" && (
              <>
                <p>selected</p>
                <AdminForm
                  homepageData={homepageData}
                  setHomepageData={setHomepageData}
                  updateData={updateData}
                  setUpdateData={setUpdateData}
                  usernames={usernames}
                  setUsernames={setUsernames}
                  credData={credData}
                  setCredData={setCredData}
                  selectOPT={selectOPT}
                  setSelectOPT={setSelectOPT}
                />
              </>
            )}
            {selectOPT === "divisionADD" && (
              <>
                <AddAdminDivForm
                  credData={credData}
                  setCredData={setCredData}
                  homepageData={homepageData}
                  token={token}
                />
              </>
            )}
            {selectOPT === "divisionUPDATE" && (
              <>
                <UpdateForm
                  updateData={updateData}
                  setUpdateData={setUpdateData}
                  homepageData={homepageData}
                  token={token}
                />
              </>
            )}
            {selectOPT === "orgUnitADD" && (
              <>
                <AddAdminOrgUnitForm
                  credData={credData}
                  setCredData={setCredData}
                  homepageData={homepageData}
                  token={token}
                />
              </>
            )}
            {selectOPT === "orgUnitUPDATE" && (
              <>
                <UpdateForm
                  updateData={updateData}
                  setUpdateData={setUpdateData}
                  homepageData={homepageData}
                  token={token}
                />
              </>
            )}
            {selectOPT === "updateUserRole" && (
              <>
                <UpdateUserRole roleData={roleData} />
              </>
            )}
          </>
        ) : (
          <h1>No User has been selected...</h1>
        )}
      </div>

      {/* <Routes>
      <Route exact path='/add-divisionAdmin' element={AddAdminDivForm}/>
      </Routes> */}
    </div>
  );
};

export default AdminDashboard;
