// client/src/pages/Login.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from '../context/AppContext';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '', });
    const { email, password } = formData;
    
    const navigate = useNavigate();
    // 🔑 CONTEXT: Consume state and action
    const { loginUser, isAuthenticated, isLoading, error } = useContext(AppContext);

    useEffect(() => {
        if (error) { alert(error); }
        if (isAuthenticated) { navigate("/"); }
    }, [isAuthenticated, error, navigate]);

    const onChange = (e) => { setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value, })); };

    const onSubmit = (e) => {
        e.preventDefault();
        // 🔑 ACTION: Call context action
        loginUser({ email, password });
    };

    if (isLoading) { return <h2 className="text-center mt-5">Loading...</h2>; }

    return (
        <div className="container mt-5" style={{ maxWidth: "500px" }}>
            <h2 className="mb-4">Login</h2>
                <form onSubmit={onSubmit}>
                <div className="form-group mb-3">
                    <label>Email</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                    />
                </div>

                <div className="form-group mb-3">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={password}
                        onChange={onChange}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-success w-100">
                    Login
                </button>
            
            </form>
        </div>
    );
}
export default Login;