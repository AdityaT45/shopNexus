// client/src/pages/Admin/AdminCategoryListScreen.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';
import AdminSidebar from '../../component/Admin/AdminSidebar';
import axios from 'axios';

function AdminCategoryListScreen() {
    const navigate = useNavigate();
    const {
        categories,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        adminLoading,
        adminError,
        isUserAdmin
    } = useContext(AdminContext);

    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        image: '',
        subcategories: [],
        isActive: true
    });
    const [subcategoryInput, setSubcategoryInput] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        if (isUserAdmin) {
            fetchCategories();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUserAdmin]);

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

    const handleAddSubcategory = () => {
        const trimmed = subcategoryInput.trim();
        if (trimmed && !formData.subcategories.some(sub => sub.name === trimmed)) {
            setFormData({
                ...formData,
                subcategories: [...formData.subcategories, { name: trimmed }]
            });
            setSubcategoryInput('');
        }
    };

    const handleRemoveSubcategory = (index) => {
        setFormData({
            ...formData,
            subcategories: formData.subcategories.filter((_, i) => i !== index)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            alert('Category name is required');
            return;
        }

        // For new category, image is required
        if (!editingCategory && !selectedFile && !formData.image) {
            alert('Please upload a category image');
            return;
        }

        let imageUrl = formData.image;

        // Upload new image if selected
        if (selectedFile) {
            try {
                imageUrl = await uploadImage(selectedFile);
            } catch (error) {
                alert('Failed to upload image');
                return;
            }
        }

        // For edit mode, if no new file and no existing image, keep the old one
        if (editingCategory && !selectedFile && !imageUrl) {
            imageUrl = editingCategory.image;
        }

        if (!imageUrl) {
            alert('Category image is required');
            return;
        }

        const categoryData = {
            ...formData,
            image: imageUrl,
            name: formData.name.trim()
        };

        let success = false;
        if (editingCategory) {
            success = await updateCategory(editingCategory._id, categoryData);
        } else {
            success = await createCategory(categoryData);
        }

        if (success) {
            resetForm();
        }
    };

    const resetForm = () => {
        // Clean up object URLs
        if (imagePreview && !formData.image) {
            URL.revokeObjectURL(imagePreview);
        }
        setFormData({
            name: '',
            image: '',
            subcategories: [],
            isActive: true
        });
        setSubcategoryInput('');
        setSelectedFile(null);
        setImagePreview('');
        setEditingCategory(null);
        setShowForm(false);
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            image: category.image || '',
            subcategories: category.subcategories || [],
            isActive: category.isActive !== undefined ? category.isActive : true
        });
        setImagePreview(category.image || '');
        setSelectedFile(null); // Reset file selection when editing
        setShowForm(true);
    };

    const handleDelete = (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            deleteCategory(categoryId);
        }
    };

    const toggleActive = async (category) => {
        await updateCategory(category._id, {
            ...category,
            isActive: !category.isActive
        });
    };

    if (!isUserAdmin) {
        return <h2 className='text-center mt-5 text-danger'>Access Denied. Admin privileges required.</h2>;
    }

    return (
        <div style={{ minHeight: '100vh', paddingTop: '56px' }}>
            <AdminSidebar />
            <div className='p-4 admin-content' style={{ marginLeft: '280px' }}>
                    <div className='d-flex justify-content-between align-items-center mb-4'>
                        <h1>Category Management</h1>
                        <button
                            className='btn btn-success'
                            onClick={() => {
                                resetForm();
                                setShowForm(true);
                            }}
                        >
                            <i className="fas fa-plus me-1"></i> Add Category
                        </button>
                    </div>

                    {adminError && <div className="alert alert-danger">{adminError}</div>}

                    {/* Category Form */}
                    {showForm && (
                        <div className='card mb-4'>
                            <div className='card-header'>
                                <h5>{editingCategory ? 'Edit Category' : 'Add New Category'}</h5>
                            </div>
                            <div className='card-body'>
                                <form onSubmit={handleSubmit}>
                                    <div className='mb-3'>
                                        <label className='form-label'>Category Name *</label>
                                        <input
                                            type='text'
                                            className='form-control'
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className='mb-3'>
                                        <label className='form-label'>Category Image *</label>
                                        <input
                                            type='file'
                                            className='form-control'
                                            accept='image/*'
                                            onChange={handleFileSelect}
                                        />
                                        <small className='text-muted d-block mt-1'>
                                            {editingCategory ? 'Leave empty to keep current image' : 'Upload category image'}
                                        </small>
                                        {(imagePreview || formData.image) && (
                                            <img
                                                src={imagePreview || formData.image}
                                                alt='Preview'
                                                className='img-thumbnail mt-2'
                                                style={{ maxHeight: '150px', display: 'block' }}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/200x150?text=Image+Error';
                                                }}
                                            />
                                        )}
                                    </div>

                                    <div className='mb-3'>
                                        <label className='form-label'>Subcategories</label>
                                        <div className='input-group mb-2'>
                                            <input
                                                type='text'
                                                className='form-control'
                                                placeholder='Enter subcategory name'
                                                value={subcategoryInput}
                                                onChange={(e) => setSubcategoryInput(e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddSubcategory();
                                                    }
                                                }}
                                            />
                                            <button
                                                type='button'
                                                className='btn btn-outline-secondary'
                                                onClick={handleAddSubcategory}
                                            >
                                                Add
                                            </button>
                                        </div>
                                        {formData.subcategories.length > 0 && (
                                            <div className='d-flex flex-wrap gap-2'>
                                                {formData.subcategories.map((sub, index) => (
                                                    <span key={index} className='badge bg-primary p-2'>
                                                        {sub.name}
                                                        <button
                                                            type='button'
                                                            className='btn-close btn-close-white ms-2'
                                                            onClick={() => handleRemoveSubcategory(index)}
                                                        ></button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className='mb-3 form-check form-switch'>
                                        <input
                                            className='form-check-input'
                                            type='checkbox'
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        />
                                        <label className='form-check-label'>
                                            Show to Users (Active)
                                        </label>
                                    </div>

                                    <div className='d-flex gap-2'>
                                        <button type='submit' className='btn btn-primary' disabled={adminLoading}>
                                            {adminLoading ? 'Saving...' : (editingCategory ? 'Update' : 'Create')}
                                        </button>
                                        <button type='button' className='btn btn-secondary' onClick={resetForm}>
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Categories List */}
                    {adminLoading && categories.length === 0 ? (
                        <h4>Loading categories...</h4>
                    ) : (
                        <div className='table-responsive'>
                            <table className='table table-striped table-hover'>
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Subcategories</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((category) => (
                                        <tr key={category._id}>
                                            <td>
                                                <img
                                                    src={category.image}
                                                    alt={category.name}
                                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/50x50?text=Error';
                                                    }}
                                                />
                                            </td>
                                            <td>{category.name}</td>
                                            <td>
                                                {category.subcategories && category.subcategories.length > 0 ? (
                                                    <div className='d-flex flex-wrap gap-1'>
                                                        {category.subcategories.map((sub, idx) => (
                                                            <span key={idx} className='badge bg-secondary'>
                                                                {sub.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className='text-muted'>No subcategories</span>
                                                )}
                                            </td>
                                            <td>
                                                <button
                                                    className={`btn btn-sm ${category.isActive ? 'btn-success' : 'btn-secondary'}`}
                                                    onClick={() => toggleActive(category)}
                                                    disabled={adminLoading}
                                                >
                                                    {category.isActive ? 'Active' : 'Hidden'}
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    className='btn btn-sm btn-warning me-2'
                                                    onClick={() => handleEdit(category)}
                                                >
                                                    <i className='fas fa-edit'></i> Edit
                                                </button>
                                                <button
                                                    className='btn btn-sm btn-danger'
                                                    onClick={() => handleDelete(category._id)}
                                                    disabled={adminLoading}
                                                >
                                                    <i className='fas fa-trash'></i> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {categories.length === 0 && (
                                <p className='text-center text-muted mt-4'>No categories found. Create your first category!</p>
                            )}
                        </div>
                    )}
            </div>
        </div>
    );
}

export default AdminCategoryListScreen;

