// client/src/pages/Register.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppContext } from '../context/AppContext';

function Register() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "", password2: "" });
    const { name, email, password, password2 } = formData;
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    
    const navigate = useNavigate();
    const { registerUser, isAuthenticated, isLoading, error } = useContext(AppContext);

    useEffect(() => {
        if (error) { 
            // Error will be shown in the form
        }
        if (isAuthenticated) {
            const stored = JSON.parse(localStorage.getItem('user'));
            if (stored?.role === 'Admin' || stored?.isAdmin) {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }
        }
    }, [isAuthenticated, error, navigate]);

    useEffect(() => {
        if (password && password2) {
            if (password !== password2) {
                setPasswordError('Passwords do not match');
            } else if (password.length < 6) {
                setPasswordError('Password must be at least 6 characters');
            } else {
                setPasswordError('');
            }
        } else {
            setPasswordError('');
        }
    }, [password, password2]);

    const onChange = (e) => {
        setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (password !== password2) {
            setPasswordError("Passwords do not match");
            return;
        }
        if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            return;
        }
        setPasswordError('');
        const userData = { name, email, password };
        registerUser(userData);
    };

    // Style specifically for the full-page background container with 0 margin/padding
    const backgroundStyle = {
        position: 'fixed', 
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        margin: 0,
        padding: 0,
        overflowY: 'auto' 
    };

    // Custom style for smaller form floating labels to match form-control-sm
    const formFloatingSmStyle = {
        '--bs-form-check-label-font-size': '0.875rem', 
        '--bs-form-floating-line-height': '1.25',
        '--bs-form-floating-padding-y': '0.75rem',
        '--bs-form-floating-padding-x': '0.75rem',
    };

    if (isLoading) { 
        return (
            <div className="d-flex justify-content-center align-items-center bg-light" style={backgroundStyle}>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Creating your account...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex align-items-center justify-content-center bg-light" style={backgroundStyle}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-7 col-lg-6"> {/* Slightly smaller column for a compact form */}
                        <div className="card shadow-lg border-0"> 
                            
                            {/* Header Section */}
                            <div className="card-header bg-primary text-white text-center py-3 border-0"> {/* Reduced padding to py-3 */}
                                <div className="mb-2"> {/* Reduced margin to mb-2 */}
                                    <i className="fas fa-user-plus" style={{ fontSize: '2rem' }}></i> {/* Slightly smaller icon */}
                                </div>
                                <h3 className="mb-1 fw-bold">Create Account</h3> {/* H3 for smaller heading */}
                                <p className="mb-0 opacity-75 small">Join ShopNexus and start shopping today</p>
                            </div>

                            {/* Form Section */}
                            <div className="card-body p-4 bg-white">
                                {error && (
                                    <div className="alert alert-danger d-flex align-items-center p-2" role="alert">
                                        <i className="fas fa-exclamation-circle me-2"></i>
                                        <div className="small">{error}</div>
                                    </div>
                                )}

                                <form onSubmit={onSubmit}>
                                    <div className="form-floating mb-3" style={formFloatingSmStyle}>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            id="name"
                                            name="name"
                                            value={name}
                                            onChange={onChange}
                                            placeholder="Full Name"
                                            required
                                        />
                                        <label htmlFor="name"><i className="fas fa-user me-2 text-primary"></i>Full Name</label>
                                    </div>

                                    <div className="form-floating mb-3" style={formFloatingSmStyle}>
                                        <input
                                            type="email"
                                            className="form-control form-control-sm"
                                            id="email"
                                            name="email"
                                            value={email}
                                            onChange={onChange}
                                            placeholder="Email"
                                            required
                                        />
                                        <label htmlFor="email"><i className="fas fa-envelope me-2 text-primary"></i>Email</label>
                                    </div>

                                    {/* Password fields in one line using row/col/g-3 */}
                                    <div className="row g-3 mb-3">
                                        
                                        {/* Password Field */}
                                        <div className="col-md-6">
                                            <div className="position-relative">
                                                <div className="form-floating" style={formFloatingSmStyle}>
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        className="form-control form-control-sm"
                                                        id="password"
                                                        name="password"
                                                        value={password}
                                                        onChange={onChange}
                                                        placeholder="Create password (min. 6)"
                                                        required
                                                        style={{ paddingRight: '45px' }}
                                                    />
                                                    <label htmlFor="password"><i className="fas fa-lock me-2 text-primary"></i>Password</label>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-2" // Reduced padding to pe-2
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    style={{ border: 'none', background: 'none', color: '#6c757d', fontSize: '0.875rem' }} // Smaller icon size
                                                >
                                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Confirm Password Field */}
                                        <div className="col-md-6">
                                            <div className="position-relative">
                                                <div className="form-floating" style={formFloatingSmStyle}>
                                                    <input
                                                        type={showPassword2 ? "text" : "password"}
                                                        className={`form-control form-control-sm ${password2 && passwordError ? 'is-invalid' : ''} ${password2 && !passwordError ? 'is-valid' : ''}`}
                                                        id="password2"
                                                        name="password2"
                                                        value={password2}
                                                        onChange={onChange}
                                                        placeholder="Confirm password"
                                                        required
                                                        style={{ paddingRight: '45px' }}
                                                    />
                                                    <label htmlFor="password2"><i className="fas fa-lock me-2 text-primary"></i>Confirm</label>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-2"
                                                    onClick={() => setShowPassword2(!showPassword2)}
                                                    style={{ border: 'none', background: 'none', color: '#6c757d', fontSize: '0.875rem' }}
                                                >
                                                    <i className={`fas ${showPassword2 ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Password Error/Match Feedback */}
                                    {passwordError && (
                                        <div className="alert alert-danger p-2 small mt-3">
                                            <i className="fas fa-exclamation-triangle me-1"></i>
                                            {passwordError}
                                        </div>
                                    )}
                                    {!passwordError && password2 && password === password2 && (
                                        <div className="alert alert-success p-2 small mt-3">
                                            <i className="fas fa-check-circle me-1"></i>
                                            Passwords match
                                        </div>
                                    )}

                                    <div className="form-check mb-3"> {/* Reduced margin to mb-3 */}
                                        <input className="form-check-input" type="checkbox" id="terms" required />
                                        <label className="form-check-label small" htmlFor="terms"> {/* Added 'small' class */}
                                            I agree to the{' '}
                                            <a href="#" className="text-primary text-decoration-none">Terms & Conditions</a>
                                            {' '}and{' '}
                                            <a href="#" className="text-primary text-decoration-none">Privacy Policy</a>
                                        </label>
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="btn btn-primary btn-md w-100 mb-3" // Changed to btn-md
                                        disabled={isLoading || !!passwordError}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Creating Account...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-user-plus me-2"></i>
                                                Create Account
                                            </>
                                        )}
                                    </button>
                                </form>

                                {/* Divider */}
                                <div className="text-center my-3"> {/* Reduced margin to my-3 */}
                                    <div className="d-flex align-items-center">
                                        <hr className="flex-grow-1" />
                                        <span className="px-3 text-muted small">OR</span>
                                        <hr className="flex-grow-1" />
                                    </div>
                                </div>

                                {/* Login Link */}
                                <div className="text-center">
                                    <p className="mb-0 text-muted small">
                                        Already have an account?{' '}
                                        <Link to="/login" className="text-primary fw-bold text-decoration-none">
                                            Sign In
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="text-center mt-3">
                            <p className="text-muted mb-0">
                                <small>
                                    <i className="fas fa-shield-alt me-1"></i>
                                    Your data is secure and encrypted
                                </small>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;