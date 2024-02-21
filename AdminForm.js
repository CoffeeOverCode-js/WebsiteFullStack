import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddAdminDivForm from './AdminContent/AddAdminDivForm'

const AdminForm = ({
  homepageData,
  setHomepageData,
  updateData,
  setUpdateData,
  usernames,
  setUsernames,
  credData,
  setCredData,
  selectOPT,
  setSelectOPT
}) => {
  const [divisions, setDivisions] = useState([]);
  const [orgUnits, setOrgUnits] = useState([]);
  const [reload, setReload] = useState(0);
  const navigate = useNavigate();

  console.log(homepageData);

  // return (
  //     <p>form {homepageData.roleName}</p>
  // )

  useEffect(() => {
    const fetchData = async () => {
      try {
        const credentialsID = homepageData.credentialsID;
        const divRes = await fetch("http://localhost:8080/getDivisions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ credentialsID }),
        });

        const orgUnitRes = await fetch("http://localhost:8080/getOrgUnits", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ credentialsID }),
        });

        if (divRes.ok) {
          const divisions = await divRes.json();
          setDivisions(divisions);
          // console.log(divisions);
        }
        if (orgUnitRes.ok) {
          const orgUnits = await orgUnitRes.json();
          setOrgUnits(orgUnits);
          // console.log(orgUnits);
        }
        if (homepageData.roleName === "Admin User") {
          const usernamesRes = await fetch(
            "http://localhost:8080/retrieveAllUsers",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (usernamesRes.ok) {
            const usernames = await usernamesRes.json();
            setUsernames(usernames);
            console.log(usernames);
          }
        }
        console.log("Divisions: " + divisions);
      } catch (error) {
        // Handle error, e.g., set error state or log it
        console.error("Error fetching divisions:", error);
      }
    };

    fetchData(); // Invoke the inner async function immediately

    // No dependencies specified (empty dependency array []), so this runs only once on mount
  }, [reload, homepageData.credentialsID]); // Include any dependencies that should trigger re-execution

  return (
    // <div>Admin Form</div>
    <div className="leftSide">
      <h3>User Role: {homepageData.roleName}</h3>
      <div className="divisions-box">
        <h5>Credentials:</h5>
        <ul>
          {divisions.map((division, index) => (
            <li key={index}>{division}</li>
          ))}
        </ul>
      </div>
      <button
        className="btn btn-dark"
        onClick={(e) => {
          e.preventDefault();
          setUpdateData((prevState) => ({
            ...prevState,
            collectionName: "division",
          }));
          setSelectOPT("divisionUPDATE")
          //   navigate("/update-form");
        }}
      >
        Update
      </button>
      <button
        className="btn btn-dark"
        onClick={(e) => {
          e.preventDefault();
          setSelectOPT("divisionADD")
          // navigate("/add-divisionAdmin")
        }}
      >
        Add
      </button>
      <div className="orgUnits-box">
        <h5>Org Units</h5>
        <ul>
          {orgUnits.map((orgUnit, index) => (
            <li key={index}>{orgUnit}</li>
          ))}
        </ul>
      </div>
      <button
        className="btn btn-dark"
        onClick={(e) => {
          e.preventDefault();
          setUpdateData((prevState) => ({
            ...prevState,
            collectionName: "orgUnit",
          }));
          setSelectOPT("orgUnitUPDATE")
        }}
      >
        Update
      </button>
      <button
        className="btn btn-dark"
        onClick={(e) => {
          e.preventDefault();
          setSelectOPT("orgUnitADD")
        }}
      >
        Add
      </button>
    </div>
  );
};

export default AdminForm;
