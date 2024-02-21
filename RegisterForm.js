import { useState } from "react";
import { useNavigate } from "react-router-dom";



const RegisterForm = ({ formData, setFormData }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault();
        const fullName = formData.fullName;
        const usr = formData.username;
        const pwd = formData.password;

        console.log(fullName);
        console.log(usr);
        console.log(pwd);
        
        setLoading(true)

        setTimeout(() => {
            navigate("/credentials")
        }, 2000)
    }

    return (
        <div className="wrapper">
            {/* <form action="http://localhost:8080/login" method="post" className="login-form"> */}
            <form onSubmit={handleSubmit} className="login-form">
                <h1>Register</h1>
                <div className="input-box">
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                    />

                    {/* <img src={user} alt='user' className='user-lock' /> */}
                </div>
                <div className='space-input'></div>
                <div className="input-box">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                    />

                    {/* <img src={user} alt='user' className='user-lock' /> */}
                </div>
                <div className='space-input'></div>
                <div className="input-box">
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Password"
                        required
                    />
                    {/* <img src={lock} alt='lock' className='user-lock' /> */}
                </div>
                <div className='space'></div>
                <button type="submit" className="custom-btn">{loading === true? 'Loading...' : 'Register' }</button>
                <div className="register-link">
                    <p>Already have an account? <a href='/login'>Login</a>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;