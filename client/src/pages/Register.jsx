// client/src/pages/Register.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from '../context/AppContext';

function Register() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "", password2: "", });
    const { name, email, password, password2 } = formData;
    
    const navigate = useNavigate();
    // 🔑 CONTEXT: Consume state and action
    const { registerUser, isAuthenticated, isLoading, error } = useContext(AppContext);

    useEffect(() => {
        if (error) { alert(error); }
        if (isAuthenticated) {
            const stored = JSON.parse(localStorage.getItem('user'));
            // New registrations are typically users, but check just in case
            if (stored?.role === 'Admin' || stored?.isAdmin) {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }
        }
    }, [isAuthenticated, error, navigate]);

    const onChange = (e) => {
        setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value, }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (password !== password2) {
            alert("Passwords do not match");
        } else {
            const userData = { name, email, password };
            // 🔑 ACTION: Call context action
            registerUser(userData);
        }
    };

    if (isLoading) { return <h2 className="text-center mt-5">Loading...</h2>; }

    return (
        <div className="container mt-5" style={{ maxWidth: "500px" }}>
            <h2 className="mb-4">Create Account</h2>
            
                <form onSubmit={onSubmit}>
        <div className="form-group mb-3">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>

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

        <div className="form-group mb-3">
          <label>Confirm Password</label>
          <input
            type="password"
            className="form-control"
            name="password2"
            value={password2}
            onChange={onChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Register
        </button>
      </form>
            
        </div>
    );
}
export default Register;