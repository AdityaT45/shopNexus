import React, { useEffect, useState, useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';

function AdminAttributeScreen() {
    const {
        categories,
        fetchCategories,
        fetchAttributesForCategory,
        saveAttributesForCategory,
        adminLoading,
        adminError,
        isUserAdmin
    } = useContext(AdminContext);

    const [selectedCategory, setSelectedCategory] = useState('');
    const [fields, setFields] = useState([]);
    const [newField, setNewField] = useState('');
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        if (isUserAdmin) {
            fetchCategories();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUserAdmin]);

    useEffect(() => {
        const loadAttributes = async () => {
            if (!selectedCategory) {
                setFields([]);
                return;
            }
            const result = await fetchAttributesForCategory(selectedCategory);
            setFields(result.fields || []);
        };
        loadAttributes();
    }, [selectedCategory, fetchAttributesForCategory]);

    const handleAddField = () => {
        const trimmed = newField.trim();
        if (!trimmed) return;
        if (fields.includes(trimmed)) {
            setNewField('');
            return;
        }
        setFields([...fields, trimmed]);
        setNewField('');
    };

    const handleRemoveField = (index) => {
        setFields(fields.filter((_, i) => i !== index));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setStatusMessage('');
        if (!selectedCategory) {
            setStatusMessage('Please select a category first.');
            return;
        }
        const success = await saveAttributesForCategory(selectedCategory, fields);
        setStatusMessage(success ? 'Attributes saved.' : 'Failed to save attributes.');
    };

    if (!isUserAdmin) {
        return <h2 className='text-center mt-5 text-danger'>Access Denied. Admin privileges required.</h2>;
    }

    return (
        <div className='p-4'>
            <div className='d-flex justify-content-between align-items-center mb-4'>
                <h1>Manage Attributes</h1>
            </div>

            {adminError && <div className='alert alert-danger'>{adminError}</div>}
            {statusMessage && <div className='alert alert-info py-2'>{statusMessage}</div>}

            <div className='card'>
                <div className='card-body'>
                    <form onSubmit={handleSave}>
                        <div className='mb-3'>
                            <label className='form-label'>Category</label>
                            <select
                                className='form-select'
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
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

                        <div className='mb-3'>
                            <label className='form-label'>Fields</label>
                            <div className='input-group mb-2'>
                                <input
                                    type='text'
                                    className='form-control'
                                    placeholder='Enter field name (e.g., Color)'
                                    value={newField}
                                    onChange={(e) => setNewField(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddField();
                                        }
                                    }}
                                />
                                <button type='button' className='btn btn-outline-secondary' onClick={handleAddField}>
                                    Add
                                </button>
                            </div>
                            {fields.length > 0 ? (
                                <div className='d-flex flex-wrap gap-2'>
                                    {fields.map((field, idx) => (
                                        <span key={idx} className='badge bg-primary p-2'>
                                            {field}
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

