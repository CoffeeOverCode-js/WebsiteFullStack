import { useEffect } from "react";

const Homepage = ({ formData, setFormData, loggedIn, setLoggedIn }) => {

    // useEffect(() => {


    //     sessionStorage.setItem('token', token)
    // }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('http://localhost:8080/view-credentials', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': ''
                },
            })
        } catch (error) {
            console.error(error)
        }
    }
    console.log(formData);

    return (
        <>
            {/* {loggedIn ? <div className="homepage-body"> */}
            {loggedIn ? <div>
                <h1 className="heading-1">Welcome, {formData.fullName}</h1>
                {/* <form action="http://localhost:8080/view-credentials" method="post">
                    <label>Enter divisionID</label>
                    <input
                        type="number"
                        name="divisionID"
                        required
                    />
                    <button type="submit">Submit</button>
                </form> */}
                {/* <form action="http://localhost:8080/add-credential" method="post">
                    <label>Select Option:</label>
                    <input
                        type="text"
                        name="repo"
                        value={}
                    />
                </form> */}
            </div> : <div><p>please log in</p></div>}
            {/* </div> : <div className="homepage-body"><p>please log in</p></div>} */}

        </>

    );
};

export default Homepage;