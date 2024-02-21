import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useLocation } from "react-router-dom";
import Select from "react-select";

const AddCredForm = ({ credData, setCredData, homepageData, token }) => {

  const [availableCreds, setAvailableCreds] = useState([]);
  const [credential, setCredential] = useState({
    value: null,
    label: "Select...",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const credentialsID = homepageData.credentialsID;
        const collectionName = "division";

        const res = await fetch("http://localhost:8080/availableCreds", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ credentialsID, collectionName }),
        });

        if (res.ok) {
          const data = await res.json();
          console.log(data);
          setAvailableCreds(data);
        }
      } catch (error) {
        // Handle errors here
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the async function immediately inside useEffect
  }, [homepageData.credentialsID]); // Include dependencies if needed

  const customStyles = {
    // Example of custom styles for the control
    control: (provided, state) => ({
      ...provided,
      background: "transparent",
      // Add your custom styles here
    }),

    // Example of custom styles for the menu
    menu: (provided, state) => ({
      ...provided,
      background: "transparent",
      marginTop: "8px", // Adjust the top margin to create space between dropdowns
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)", // Example box shadow
      position: "relative",
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
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: "white",
    }),
    // Add more styles for other components as needed
  };
  console.log(availableCreds);

  const handleCredentialChange = (credential) => {
    console.log(credential);
    const value = credential.value;
    const label = credential.label;
    console.log(`Value: ${value} \nLabel: ${label}`);
    setCredential({
      value: value,
      label: label,
    });
    // console.log(`Credential: ${credential}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const credentialsID = homepageData.credentialsID;
      const jwttoken = token;
      const collectionName = "division";
      const repoID = credential.value;

      const res = await fetch("http://localhost:8080/add-credential", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwttoken}`,
        },
        body: JSON.stringify({ credentialsID, collectionName, repoID }),
      });
      if (res.ok) {
        const data = await res.text();
        alert(data);
      }

      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="wrapper">
        {/* <form action="http://localhost:8080/login" method="post" className="login-form"> */}
        <form onSubmit={handleSubmit} className="login-form">
          <h1>Add Credential</h1>
          <div className="select-box">
            <Select
              options={availableCreds}
              name="repo"
              value={credential}
              onChange={handleCredentialChange}
              styles={customStyles}
            />

            {/* <img src={user} alt='user' className='user-lock' /> */}
          </div>
          <button type="submit" className="custom-btn">
            Add Credential
          </button>
        </form>
      </div>{" "}
    </div>
  );
};

export default AddCredForm;
