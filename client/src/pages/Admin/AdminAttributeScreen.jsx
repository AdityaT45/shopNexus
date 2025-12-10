// client/src/pages/Admin/AdminAttributeScreen.jsx
import React, { useEffect, useState, useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import axios from 'axios';

function AdminAttributeScreen() {
    const {
        categories,
        fetchCategories,
        adminLoading,
        adminError,
        isUserAdmin,
    } = useContext(AdminContext);

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [fields, setFields] = useState([]);
    const [newField, setNewField] = useState({ name: '', type: 'string' });
    const [statusMessage, setStatusMessage] = useState('');

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
            fetchCategories();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUserAdmin]);

    useEffect(() => {
        const loadAttributes = async () => {
            if (!selectedCategory || !selectedSubcategory) {
                setFields([]);
                return;
            }
            try {
                const response = await axios.get(
                    `/api/attributes/${selectedCategory}/${selectedSubcategory}`,
                    getConfig()
                );
                setFields(response.data.fields || []);
            } catch (error) {
                setFields([]);
            }
        };
        loadAttributes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategory, selectedSubcategory]);

    const handleAddField = () => {
        const trimmed = newField.name.trim();
        if (!trimmed) return;
        if (fields.some((f) => f.name === trimmed)) {
            setNewField({ name: '', type: 'string' });
            return;
        }
        setFields([...fields, { name: trimmed, type: newField.type }]);
        setNewField({ name: '', type: 'string' });
    };

    const handleRemoveField = (index) => {
        setFields(fields.filter((_, i) => i !== index));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setStatusMessage('');
        if (!selectedCategory || !selectedSubcategory) {
            setStatusMessage('Please select both category and subcategory.');
            return;
        }
        try {
            await axios.post(
                '/api/attributes',
                {
                    category: selectedCategory,
                    subcategory: selectedSubcategory,
                    fields: fields,
                },
                getConfig()
            );
            setStatusMessage('Attributes saved successfully!');
        } catch (error) {
            setStatusMessage('Failed to save attributes.');
        }
    };

    const selectedCategoryData = categories.find((cat) => cat.name === selectedCategory);
    const subcategories = selectedCategoryData?.subcategories || [];

    if (!isUserAdmin) {
        return <h2 className='text-center mt-5 text-danger'>Access Denied. Admin privileges required.</h2>;
    }

    return (
        <div className='p-4'>
            <div className='d-flex justify-content-between align-items-center mb-4'>
                <h1>Manage Attributes</h1>
            </div>

            {adminError && <div className='alert alert-danger'>{adminError}</div>}
            {statusMessage && (
                <div className={`alert ${statusMessage.includes('success') ? 'alert-success' : 'alert-info'} py-2`}>
                    {statusMessage}
                </div>
            )}

            <div className='card'>
                <div className='card-body'>
                    <form onSubmit={handleSave}>
                        <div className='row mb-3'>
                            <div className='col-md-6'>
                                <label className='form-label'>Category *</label>
                                <select
                                    className='form-select'
                                    value={selectedCategory}
                                    onChange={(e) => {
                                        setSelectedCategory(e.target.value);
                                        setSelectedSubcategory('');
                                        setFields([]);
                                    }}
                                    required
                                >
                                    <option value=''>Select category</option>
                                    {categories
                                        .filter((cat) => cat.isActive)
                                        .map((cat) => (
                                            <option key={cat._id} value={cat.name}>
                                                {cat.name}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <div className='col-md-6'>
                                <label className='form-label'>Subcategory *</label>
                                <select
                                    className='form-select'
                                    value={selectedSubcategory}
                                    onChange={(e) => {
                                        setSelectedSubcategory(e.target.value);
                                    }}
                                    required
                                    disabled={!selectedCategory}
                                >
                                    <option value=''>Select subcategory</option>
                                    {subcategories.map((sub, idx) => (
                                        <option key={idx} value={sub.name}>
                                            {sub.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className='mb-3'>
                            <label className='form-label'>Attribute Fields</label>
                            <div className='input-group mb-2'>
                                <input
                                    type='text'
                                    className='form-control'
                                    placeholder='Enter field name (e.g., Color, Size)'
                                    value={newField.name}
                                    onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddField();
                                        }
                                    }}
                                />
                                <select
                                    className='form-select'
                                    style={{ maxWidth: '150px' }}
                                    value={newField.type}
                                    onChange={(e) => setNewField({ ...newField, type: e.target.value })}
                                >
                                    <option value='string'>String</option>
                                    <option value='number'>Number</option>
                                </select>
                                <button type='button' className='btn btn-outline-secondary' onClick={handleAddField}>
                                    Add
                                </button>
                            </div>
                            {fields.length > 0 ? (
                                <div className='d-flex flex-wrap gap-2'>
                                    {fields.map((field, idx) => (
                                        <span key={idx} className='badge bg-primary p-2 d-flex align-items-center'>
                                            {field.name} ({field.type})
                                            <button
                                                type='button'
                                                className='btn-close btn-close-white ms-2'
                                                onClick={() => handleRemoveField(idx)}
                                            ></button>
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className='text-muted mb-0'>No fields added yet.</p>
                            )}
                        </div>

                        <button type='submit' className='btn btn-primary' disabled={adminLoading}>
                            {adminLoading ? 'Saving...' : 'Save Attributes'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminAttributeScreen;
