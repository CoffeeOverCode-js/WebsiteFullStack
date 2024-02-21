import { useEffect, useState } from 'react';
import { json, useNavigate } from 'react-router-dom';
import Select from 'react-select'

const UpdateForm = ({ updateData, setUpdateData, homepageData, token }) => {

    const [availableCreds, setAvailableCreds] = useState([]);
    const [credentials, setCredentials] = useState([]);
    const [selectedCred, setSelectedCred] = useState({
        value: null,
        label: 'Original...'
    });
    const [updateCred, setUpdateCred] = useState({
        value: null,
        label: 'Update...'
    })

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const credentialsID = homepageData.credentialsID
                const collectionName = updateData.collectionName;

                const availableCredRes = await fetch('http://localhost:8080/availableCreds', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ credentialsID, collectionName })
                });

                if (availableCredRes.ok) {
                    const data = await availableCredRes.json();
                    console.log(data);
                    setAvailableCreds(data)
                }
                const originalCredRes = await fetch('http://localhost:8080/originalCreds', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ credentialsID, collectionName })
                })
                if (originalCredRes.ok) {
                    const data = await originalCredRes.json();
                    console.log(data);
                    setCredentials(data)
                }
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        };
        fetchData();
    }, [homepageData.credentialsID])

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
        singleValue: (provided, state) => ({
            ...provided,
            color: 'white'
        }),
        // Add more styles for other components as needed
    };
    // console.log(availableCreds);
    console.log(credentials);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(selectedCred.value);
            console.log(updateCred.value);
            if (selectedCred.value !== null && updateCred.value !== null) {
                const credentialsID = homepageData.credentialsID;
                const jwttoken = token;
                const selection = updateData.collectionName;
                const oldUnitID = selectedCred.value;
                const newUnitID = updateCred.value;


                console.log(`CredentialsID: ${credentialsID} \nSelection: ${selection} \noldUnitID: ${oldUnitID} \nnewUnitID: ${newUnitID}`);

                const res = await fetch('http://localhost:8080/update-credential', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        credentialsID, selection, oldUnitID, newUnitID
                    })
                });
                if (res.ok) {
                    const data = await res.text();
                    alert(data)
                }
                navigate('/')
            }
            else {
                alert('Please fill in both Select Boxes')
            }

        } catch (error) {
            console.error('Error fetching data', error)
        }
    }

    const handleUpdateChange = (credential) => {
        console.log(credential);
        const value = credential.value;
        const label = credential.label;
        console.log(`Value: ${value} \nLabel: ${label}`);
        setUpdateCred({
            value: value,
            label: label
        });
        // console.log(`Credential: ${credential}`);
    }

    const handleOriginalChange = (credential) => {
        console.log(credential);
        const value = credential.value;
        const label = credential.label;
        console.log(`Value: ${value} \nLabel: ${label}`);
        setSelectedCred({
            value: value,
            label: label
        });

    }

    console.log(updateData.collectionName);
    return (
        <div>
            <div className="wrapper">
                {/* <form action="http://localhost:8080/login" method="post" className="login-form"> */}
                <form onSubmit={handleSubmit} className="login-form">
                    <h1>Update Credential({updateData.collectionName})</h1>
                    <div className='select-box'>
                        <Select
                            required
                            options={credentials}
                            name="originalCred"
                            value={selectedCred}
                            onChange={handleOriginalChange}
                            styles={customStyles}
                        />
                    </div>
                    <div className="select-box">
                        {/* <label>Select Update Option:</label> */}
                        <Select
                            required
                            options={availableCreds}
                            name="updateCred"
                            value={updateCred}
                            onChange={handleUpdateChange}
                            styles={customStyles}
                        />

                        {/* <img src={user} alt='user' className='user-lock' /> */}
                    </div>
                    <button type="submit" className="custom-btn">Add Credential</button>
                </form>
            </div>        </div>
    )
}

export default UpdateForm;