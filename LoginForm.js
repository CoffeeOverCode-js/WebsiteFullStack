import 'boxicons'
import lock from './../Images/lock.png'
import user from './../Images/user.png'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';



const LoginForm = ({ loggedIn, setLoggedIn, formData, setFormData, homepageData, setHomepageData, token, setToken }) => {
    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    });
    const navigate = useNavigate()

    const getUser = async (credentialsID) => {
        const res = await fetch('http://localhost:8080/getUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ credentialsID })
        })
        if (res.ok) {
            const user = await res.json();
            return user;
        };
    }

    const getRole = async (credentialsID) => {
        const res = await fetch('http://localhost:8080/getRole', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ credentialsID })
        })
        if (res.ok) {
            const roleData = await res.text();
            console.log(roleData);
            return roleData;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const usr = loginData.username;
        const pwd = loginData.password;

        console.log(usr);
        console.log(pwd);

        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ usr, pwd })
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.jwt
                const id = data.credentialsID
                // console.log('Received token:', token);
                // console.log(token);
                console.log(token);
                console.log(id);
                setLoggedIn(true)

                const user = await getUser(id)
                console.log(user);
                const fullName = user.fullName;
                const username = user.username;
                const password = pwd;
                const orgUnits = user.orgUnits;
                const divisions = user.divisions;

                const roleName = await getRole(id)
                // const roleName = roleData.roleName;
                setFormData({
                    fullName: fullName,
                    username: username,
                    password: password,
                    orgUnits: orgUnits,
                    divisions: divisions
                })
                setHomepageData({
                    credentialsID: id,
                    roleName: roleName
                    
                });
                setToken(token)
                // console.log(homepageData);

                navigate('/')
                // Handle the token, e.g., store it in localStorage
            } else {
                const error = await response.text()
                alert(error)
                // Handle the error, e.g., display an error message to the user
            }
        } catch (error) {
            console.error('Error occurred:', error);
            // Handle other errors
        }
    };



    return (
        <div className="wrapper">
            {/* <form action="http://localhost:8080/login" method="post" className="login-form"> */}
            <form onSubmit={handleSubmit} className="login-form">
                <h1>Login</h1>
                <div className="input-box">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={loginData.username}
                        onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                        required
                    />

                    <img src={user} alt='user' className='user-lock' />
                </div>
                <div className='space-input'></div>
                <div className="input-box">
                    <input
                        type="password"
                        name="password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        placeholder="Password"
                        required
                    />
                    <img src={lock} alt='lock' className='user-lock' />
                </div>
                <div className='space'></div>
                <button type="submit" className="custom-btn">Login</button>
                <div className="register-link">
                    <p>Don't have an account? <a href='/register'>Register</a>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;