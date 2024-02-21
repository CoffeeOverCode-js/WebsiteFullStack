import { useEffect, useState } from "react";
import Select from "react-select";

const UpdateUserRole = ({ roleData }) => {
  const [availableRoles, setAvailableRoles] = useState([]);
  const [newRoleSelection, NewRoleSelection] = useState({
    value: null,
    label: "Select..."
  });

  useEffect(() => {
    try {
      const roles = [
        { value: 1, label: "Normal User" },
        { value: 2, label: "Management User" },
        { value: 3, label: "Admin User" },
      ];
      const oldRole = roleData.oldRole;
      const roleIndex = roles.findIndex((role) => role.value === oldRole);

      // const roleObj = [
      //   {
      //     value: roles[0];
      //     label: ""
      //   }
      // ]

      roles.splice(roleIndex, 1);
      console.log(roles);
      setAvailableRoles(roles);
    } catch (error) {
      console.error("Error while fetching data: ", error);
    }
  }, []);

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
      background: "#808080",
      marginTop: "8px", // Adjust the top margin to create space between dropdowns
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)", // Example box shadow
      position: "relative",
      marginLeft: "100px",
      width: "400px"
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

  const handleRoleChange = (role) => {
    console.log(role);
  };

  return (
    <div>
      <h1> </h1>
      <Select
        options={availableRoles}
        name="roles"
        value={newRoleSelection}
        onChange={handleRoleChange}
        styles={customStyles}
      />
    </div>
  );
};

export default UpdateUserRole;
