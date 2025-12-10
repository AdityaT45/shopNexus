// client/src/pages/Admin/AdminFooterScreen.jsx
import React, { useEffect, useState, useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import axios from 'axios';

function AdminFooterScreen() {
    const { adminLoading, adminError, isUserAdmin } = useContext(AdminContext);
    const [sections, setSections] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingSection, setEditingSection] = useState(null);
    const [formData, setFormData] = useState({
        section: '',
        title: '',
        links: [],
        isActive: true,
        order: 0,
    });
    const [newLink, setNewLink] = useState({ text: '', url: '#', icon: '' });

    const getConfig = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user ? user.token : null;
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };

    useEffect(() => {
        if (isUserAdmin) {
            fetchSections();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUserAdmin]);

    const fetchSections = async () => {
        try {
            const response = await axios.get('/api/footer', getConfig());
            setSections(response.data);
        } catch (error) {
            console.error('Failed to fetch footer sections:', error);
        }
    };

    const handleAddLink = () => {
        if (!newLink.text.trim()) return;
        setFormData({
            ...formData,
            links: [...formData.links, { ...newLink }],
        });
        setNewLink({ text: '', url: '#', icon: '' });
    };

    const handleRemoveLink = (index) => {
        setFormData({
            ...formData,
            links: formData.links.filter((_, i) => i !== index),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingSection) {
                await axios.put(`/api/footer/${editingSection._id}`, formData, getConfig());
            } else {
                await axios.post('/api/footer', formData, getConfig());
            }
            fetchSections();
            resetForm();
        } catch (error) {
            console.error('Failed to save footer section:', error);
            alert('Failed to save footer section.');
        }
    };

    const handleEdit = (section) => {
        setEditingSection(section);
        setFormData({
            section: section.section,
            title: section.title,
            links: section.links || [],
            isActive: section.isActive,
            order: section.order,
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this footer section?')) {
            return;
        }
        try {
            await axios.delete(`/api/footer/${id}`, getConfig());
            fetchSections();
        } catch (error) {
            console.error('Failed to delete footer section:', error);
            alert('Failed to delete footer section.');
        }
    };

    const resetForm = () => {
        setFormData({
            section: '',
            title: '',
            links: [],
            isActive: true,
            order: 0,
        });
        setNewLink({ text: '', url: '#', icon: '' });
        setEditingSection(null);
        setShowForm(false);
    };

    if (!isUserAdmin) {
        return <h2 className='text-center mt-5 text-danger'>Access Denied. Admin privileges required.</h2>;
    }

    return (
        <div className='p-4'>
            <div className='d-flex justify-content-between align-items-center mb-4'>
                <h1>Footer Management</h1>
                <button className='btn btn-success' onClick={() => { resetForm(); setShowForm(true); }}>
                    <i className='fas fa-plus me-1'></i> Add Section
                </button>
            </div>

            {adminError && <div className='alert alert-danger'>{adminError}</div>}

            {/* Form */}
            {showForm && (
                <div className='card mb-4'>
                    <div className='card-header'>
                        <h5>{editingSection ? 'Edit Footer Section' : 'Add Footer Section'}</h5>
                    </div>
                    <div className='card-body'>
                        <form onSubmit={handleSubmit}>
                            <div className='row mb-3'>
                                <div className='col-md-6'>
                                    <label className='form-label'>Section Key *</label>
                                    <input
                                        type='text'
                                        className='form-control'
                                        value={formData.section}
                                        onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                                        placeholder='e.g., quick-links, social-media'
                                        required
                                        disabled={!!editingSection}
                                    />
                                    <small className='text-muted'>Unique identifier (lowercase, no spaces)</small>
                                </div>
                                <div className='col-md-6'>
                                    <label className='form-label'>Title *</label>
                                    <input
                                        type='text'
                                        className='form-control'
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder='e.g., Quick Links'
                                        required
                                    />
                                </div>
                            </div>

                            <div className='row mb-3'>
                                <div className='col-md-4'>
                                    <label className='form-label'>Order</label>
                                    <input
                                        type='number'
                                        className='form-control'
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                        min='0'
                                    />
                                </div>
                                <div className='col-md-4 d-flex align-items-end'>
                                    <div className='form-check form-switch'>
                                        <input
                                            className='form-check-input'
                                            type='checkbox'
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        />
                                        <label className='form-check-label'>Active</label>
                                    </div>
                                </div>
                            </div>

                            <div className='mb-3'>
                                <label className='form-label'>Links</label>
                                <div className='input-group mb-2'>
                                    <input
                                        type='text'
                                        className='form-control'
                                        placeholder='Link Text'
                                        value={newLink.text}
                                        onChange={(e) => setNewLink({ ...newLink, text: e.target.value })}
                                    />
                                    <input
                                        type='text'
                                        className='form-control'
                                        placeholder='URL'
                                        value={newLink.url}
                                        onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                                    />
                                    <input
                                        type='text'
                                        className='form-control'
                                        placeholder='Icon (Font Awesome class)'
                                        value={newLink.icon}
                                        onChange={(e) => setNewLink({ ...newLink, icon: e.target.value })}
                                    />
                                    <button type='button' className='btn btn-outline-secondary' onClick={handleAddLink}>
                                        Add Link
                                    </button>
                                </div>
                                {formData.links.length > 0 && (
                                    <div className='d-flex flex-wrap gap-2'>
                                        {formData.links.map((link, idx) => (
                                            <span key={idx} className='badge bg-primary p-2'>
                                                {link.icon && <i className={`${link.icon} me-1`}></i>}
                                                {link.text} ({link.url})
                                                <button
                                                    type='button'
                                                    className='btn-close btn-close-white ms-2'
                                                    onClick={() => handleRemoveLink(idx)}
                                                ></button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className='d-flex gap-2'>
                                <button type='submit' className='btn btn-primary' disabled={adminLoading}>
                                    {adminLoading ? 'Saving...' : (editingSection ? 'Update' : 'Create')}
                                </button>
                                <button type='button' className='btn btn-secondary' onClick={resetForm}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Sections List */}
            <div className='table-responsive'>
                <table className='table table-striped table-hover'>
                    <thead>
                        <tr>
                            <th>Order</th>
                            <th>Section</th>
                            <th>Title</th>
                            <th>Links Count</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sections.map((section) => (
                            <tr key={section._id}>
                                <td>{section.order}</td>
                                <td><code>{section.section}</code></td>
                                <td>{section.title}</td>
                                <td>{section.links?.length || 0}</td>
                                <td>
                                    <span className={`badge ${section.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                        {section.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className='btn btn-sm btn-warning me-2'
                                        onClick={() => handleEdit(section)}
                                    >
                                        <i className='fas fa-edit'></i> Edit
                                    </button>
                                    <button
                                        className='btn btn-sm btn-danger'
                                        onClick={() => handleDelete(section._id)}
                                    >
                                        <i className='fas fa-trash'></i> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {sections.length === 0 && (
                    <p className='text-center text-muted mt-4'>No footer sections found. Create your first section!</p>
                )}
            </div>
        </div>
    );
}

export default AdminFooterScreen;


