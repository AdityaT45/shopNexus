// client/src/pages/AdminProductEditScreen.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext'; // Need AppContext for getProductById

function AdminProductEditScreen() {
    const { productId } = useParams();
    const navigate = useNavigate();
    
    // AdminContext for creation and updating
    const { createProduct, updateProduct, adminLoading, adminError, isUserAdmin } = useContext(AdminContext);
    
    // AppContext for fetching product details to pre-populate the form
    const { getProductById } = useContext(AppContext);

    const isEditMode = !!productId;
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        description: '',
        image: '',
        brand: '',
        category: '',
        countInStock: 0,
    });
    
    const [fetchError, setFetchError] = useState(null);

    // --- Fetch Product Data for Edit Mode ---
    useEffect(() => {
        if (!isUserAdmin) {
             // Redirect if not admin
             return navigate('/'); 
        }

        if (isEditMode) {
            const fetchProduct = async () => {
                const product = await getProductById(productId);
                if (product) {
                    setFormData({
                        name: product.name,
                        price: product.price,
                        description: product.description,
                        image: product.image,
                        brand: product.brand,
                        category: product.category,
                        countInStock: product.countInStock,
                    });
                } else {
                    setFetchError('Product not found or failed to load.');
                }
            };
            fetchProduct();
        }
    }, [isEditMode, productId, getProductById, isUserAdmin]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation check (basic)
        if (!formData.name || formData.price <= 0 || !formData.category) {
            alert('Please fill out required fields correctly.');
            return;
        }

        let success = false;

        if (isEditMode) {
            success = await updateProduct(productId, formData);
        } else {
            success = await createProduct(formData);
        }

        if (success) {
            navigate('/admin/products'); // Redirect back to list on success
        }
    };
    
    const title = isEditMode ? `Edit Product: ${formData.name || 'Loading...'}` : 'Create New Product';

    if (fetchError) {
        return <h2 className='text-center mt-5 text-danger'>{fetchError}</h2>;
    }
    
    return (
        <div className='container my-5'>
            <div className='row justify-content-center'>
                <div className='col-md-8'>
                    <h1 className='mb-4'>{title}</h1>
                    {(adminError || fetchError) && <div className="alert alert-danger">{adminError || fetchError}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        {/* Basic Info */}
                        <div className='mb-3'>
                            <label className='form-label'>Name</label>
                            <input type='text' className='form-control' name='name' value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className='row'>
                            <div className='col-md-6 mb-3'>
                                <label className='form-label'>Price ($)</label>
                                <input type='number' className='form-control' name='price' value={formData.price} onChange={handleChange} required min="0.01" step="0.01" />
                            </div>
                            <div className='col-md-6 mb-3'>
                                <label className='form-label'>Count In Stock</label>
                                <input type='number' className='form-control' name='countInStock' value={formData.countInStock} onChange={handleChange} required min="0" />
                            </div>
                        </div>
                        
                        {/* Categorization */}
                        <div className='row'>
                            <div className='col-md-6 mb-3'>
                                <label className='form-label'>Brand</label>
                                <input type='text' className='form-control' name='brand' value={formData.brand} onChange={handleChange} />
                            </div>
                            <div className='col-md-6 mb-3'>
                                <label className='form-label'>Category</label>
                                <input type='text' className='form-control' name='category' value={formData.category} onChange={handleChange} required />
                            </div>
                        </div>

                        {/* Details */}
                        <div className='mb-3'>
                            <label className='form-label'>Image URL</label>
                            <input type='text' className='form-control' name='image' value={formData.image} onChange={handleChange} required />
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>Description</label>
                            <textarea className='form-control' name='description' value={formData.description} onChange={handleChange} rows='5' required></textarea>
                        </div>
                        
                        <div className='d-grid gap-2'>
                            <button type='submit' className='btn btn-primary' disabled={adminLoading}>
                                {adminLoading ? 'Processing...' : (isEditMode ? 'Update Product' : 'Create Product')}
                            </button>
                            <button type='button' className='btn btn-secondary' onClick={() => navigate('/admin/products')} disabled={adminLoading}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminProductEditScreen;