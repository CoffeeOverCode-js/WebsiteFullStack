import { useState } from "react";
import Select from 'react-select';
import { useNavigate } from "react-router-dom";


const CredentialsForm = ({ formData, setFormData }) => {

    const navigate = useNavigate()
    const [orgUnits, setOrgUnits] = useState([]);
    const [divisions, setDivisions] = useState([]);

    // const testJSON = {
    //     fullName: 'Ryan Fredericks',
    //     username: 'ryanfredericksuni',
    //     password: 'password',
    //     orgUnits: [1, 2], // Sample array with multiple values
    //     divisions: [1, 2]
    // }

    const customStyles = {
        // Example of custom styles for the control
        control: (provided, state) => ({
            ...provided,
            background: "transparent"
            // Add your custom styles here
        }),

        // Example of custom styles for the menu
        menu: (provided, state) => ({
            ...provided,
            background: "transparent",
            marginTop: '8px', // Adjust the top margin to create space between dropdowns
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Example box shadow
            position: "relative",
            // '&:hover': {
            //     backgroundColor: 'black'
            // }
            // Add your custom styles here
        }),
        option: (provided, state) => ({
            ...provided,
            '&:hover': {
              backgroundColor: 'black', // Change the background color on hover
              color: 'white', // Change text color on hover
            },
            '&:not(:hover)': {
                backgroundColor: 'transparent', // Change background color when not hovered
                color: 'white', // Change text color when not hovered
              },
          }),

        // Add more styles for other components as needed
    };

    const orgUnitsOptions = [
        { value: 1, label: 'News management' },
        { value: 2, label: 'Software reviews' },
        { value: 3, label: 'Hardware reviews' },
        { value: 4, label: 'Opinion publishing' }
    ]

    const divisionsOptions = [
        { value: 1, label: 'Finances ' },
        { value: 2, label: 'IT' },
        { value: 3, label: 'Writing' },
        { value: 4, label: 'Development' },
        { value: 5, label: 'Software Developement' },
        { value: 6, label: 'Network Administration' },
        { value: 7, label: 'Content Writer' },
        { value: 8, label: 'Human Resources' },
        { value: 9, label: 'Customer Support' },
        { value: 10, label: 'Quality Assurance' }
    ]

    const handleOrgUnitsChange = (orgUnits) => {
        setOrgUnits(orgUnits);
        setFormData({ ...formData, orgUnits: orgUnits.map(option => option.value) })
        console.log(formData)
    }

    const handleDivisionsChange = (divisions) => {
        setDivisions(divisions);
        setFormData({
            ...formData, divisions: divisions.map(option =>
                option.value)
        })
        console.log(formData)
    }

    const postState = async (e) => {
        e.preventDefault();
        try {
            console.log(formData); // Check the output in the console
            const postData = {
                fullName: formData.fullName,
                username: formData.username,
                password: formData.password,
                orgUnits: formData.orgUnits,
                divisions: formData.divisions
            };
            const res = await fetch('http://localhost:8080/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify(postData)
            });

            if (res.ok) {
                const data = await res.text(); // Parse the response JSON if needed
                alert(data)
                } else {
                console.error('Failed to post data:', res.statusText);
                // Handle other error cases here
            }
            navigate('/login')
        } catch (error) {
            console.error(error);
        }
    };




    return (
        <div className="wrapper">
            {/* <form action="http://localhost:8080/register" method="post" className="login-form"> */}
                <form onSubmit={postState} className="login-form">
                {/* <form onSubmit={handleSubmit} className="login-form"> */}
                <h1>Credentials</h1>
                <div className="select-box"
                >
                    <Select
                        options={orgUnitsOptions}
                        name="orgUnits"
                        isMulti
                        value={orgUnits}
                        onChange={handleOrgUnitsChange}
                        styles={customStyles}
                    />
                </div>
                    <div className="select-space"/>
                <div className="select-box">
                    <Select
                        options={divisionsOptions}
                        name="divisions"
                        isMulti
                        value={divisions}
                        onChange={handleDivisionsChange}
                        styles={customStyles}
                    // className="select-box"
                    />
                </div>


                {/* <div className="input-box">
                    <input
                        type="hidden"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                        className="hidden-input"
                    />

                    <img src={user} alt='user' className='user-lock' />
                </div>
                <div className='space-input'></div>
                <div className="input-box">
                    <input
                        type="hidden"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                        className="hidden-input"
                    />

                    <img src={user} alt='user' className='user-lock' />
                </div>
                <div className='space-input'></div>
                <div className="input-box">
                    <input
                        type="hidden"
                        name="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Password"
                        required
                        className="hidden-input"
                    />
                    <img src={lock} alt='lock' className='user-lock' />
                </div>
                <div className='space'></div> */}
                <button type="submit" className="custom-btn">Add Credentials</button>
                <div className="register-link">
                    <p>Don't have an account? <a href='#'>Register</a>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default CredentialsForm;