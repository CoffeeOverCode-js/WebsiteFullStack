import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


const NavBar = ({ loginForm, setLoginForm, homepageData }) => {

    const navigate = useNavigate();

    const handleLoginClick = () => {
        setLoginForm(true)
    };

    console.log(homepageData.roleName);

    return (
        <div>
            <header className="header">
                <Link to="/" className="logo btn btn-link">Cool Tech</Link>

                <nav className="navbar">
                    { homepageData.roleName === 'Admin User' ? <button className='btn btn-success btn-lg' onClick={(e) => {
                        e.preventDefault();
                        navigate('/admin-dashboard')
                    }}>Admin Dashboard</button> : null }
                    <Link to="/login" className="logo btn btn-link" onClick={handleLoginClick}>Login</Link>
                    <Link to="/register" className="logo btn btn-link">Register</Link>
                    <Link to="#" className="logo btn btn-link">More Info</Link>
                </nav>

            </header>
        </div>



    );
};

export default NavBar;
