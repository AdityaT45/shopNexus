// client/src/pages/ProfileScreen.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

function ProfileScreen() {
    const navigate = useNavigate();
    const { user, logoutUser, updateUser } = useContext(AppContext);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        photo: '',
        gender: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                photo: user.photo || '',
                gender: user.gender || ''
            });
            setImagePreview(user.photo || '');
        }
    }, [user]);

    const getConfig = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user ? user.token : null;
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const preview = URL.createObjectURL(file);
            setImagePreview(preview);
        }
    };

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post('/api/upload', formData, {
                ...getConfig(),
                headers: {
                    ...getConfig().headers,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.imageUrl;
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            let photoUrl = formData.photo;

            // Upload new image if selected
            if (selectedFile) {
                photoUrl = await uploadImage(selectedFile);
            }

            const updateData = {
                ...formData,
                photo: photoUrl
            };

            const response = await axios.put('/api/users/profile', updateData, getConfig());
            
            // Update user in context
            if (updateUser) {
                updateUser(response.data);
            }
            
            // Update localStorage
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser) {
                storedUser.name = response.data.name;
                storedUser.email = response.data.email;
                storedUser.photo = response.data.photo;
                storedUser.gender = response.data.gender;
                localStorage.setItem('user', JSON.stringify(storedUser));
            }

            setSuccess('Profile updated successfully!');
            setSelectedFile(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            return;
        }

        if (!window.confirm('This will permanently delete your account and all associated data. Are you absolutely sure?')) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            await axios.delete('/api/users/profile', getConfig());
            logoutUser();
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete account');
            setLoading(false);
        }
    };

    if (!user) {
        return <h2 className='text-center mt-5'>Please login to view your profile</h2>;
    }

    return (
        <div className='container mt-4'>
            <div className='row justify-content-center'>
                <div className='col-md-8'>
                    <h1 className='mb-4'>My Profile</h1>
                    
                    {error && <div className='alert alert-danger'>{error}</div>}
                    {success && <div className='alert alert-success'>{success}</div>}

                    <div className='card'>
                        <div className='card-body'>
                            <form onSubmit={handleSubmit}>
                                {/* Profile Photo */}
                                <div className='mb-4 text-center'>
                                    <div className='position-relative d-inline-block'>
                                        <img
                                            src={imagePreview || `https://ui-avatars.com/api/?name=${formData.name}&size=150&background=0d6efd&color=fff`}
                                            alt='Profile'
                                            className='rounded-circle'
                                            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                            onError={(e) => {
                                                e.target.src = `https://ui-avatars.com/api/?name=${formData.name}&size=150&background=0d6efd&color=fff`;
                                            }}
                                        />
                                        <label className='btn btn-sm btn-primary position-absolute bottom-0 end-0 rounded-circle' style={{ cursor: 'pointer' }}>
                                            <i className='fas fa-camera'></i>
                                            <input
                                                type='file'
                                                accept='image/*'
                                                onChange={handleFileSelect}
                                                style={{ display: 'none' }}
                                                disabled={loading}
                                            />
                                        </label>
                                    </div>
                                    <p className='text-muted small mt-2'>Click camera icon to change photo</p>
                                </div>

                                {/* Name */}
                                <div className='mb-3'>
                                    <label className='form-label'>Name *</label>
                                    <input
                                        type='text'
                                        className='form-control'
                                        name='name'
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                {/* Email */}
                                <div className='mb-3'>
                                    <label className='form-label'>Email *</label>
                                    <input
                                        type='email'
                                        className='form-control'
                                        name='email'
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                {/* Gender */}
                                <div className='mb-3'>
                                    <label className='form-label'>Gender</label>
                                    <select
                                        className='form-select'
                                        name='gender'
                                        value={formData.gender}
                                        onChange={handleChange}
                                        disabled={loading}
                                    >
                                        <option value=''>Select Gender</option>
                                        <option value='Male'>Male</option>
                                        <option value='Female'>Female</option>
                                        <option value='Other'>Other</option>
                                    </select>
                                </div>

                                {/* Submit Button */}
                                <div className='d-flex gap-2 mb-3'>
                                    <button
                                        type='submit'
                                        className='btn btn-primary'
                                        disabled={loading}
                                    >
                                        {loading ? 'Updating...' : 'Update Profile'}
                                    </button>
                                </div>
                            </form>

                            <hr />

                            {/* Danger Zone */}
                            <div className='mt-4'>
                                <h5 className='text-danger'>Danger Zone</h5>
                                <div className='d-flex gap-2'>
                                    <button
                                        className='btn btn-outline-danger'
                                        onClick={handleDeleteAccount}
                                        disabled={loading}
                                    >
                                        <i className='fas fa-trash me-2'></i>
                                        Delete Account
                                    </button>
                                </div>
                                <p className='text-muted small mt-2'>
                                    Once you delete your account, there is no going back. Please be certain.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileScreen;






