// client/src/pages/AdminProductEditScreen.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext'; // Need AppContext for getProductById
import axios from 'axios';

function AdminProductEditScreen() {
    const { productId } = useParams();
    const navigate = useNavigate();
    
    // AdminContext for creation and updating
    const { createProduct, updateProduct, adminLoading, adminError, isUserAdmin, fetchCategories, categories: adminCategories, fetchAttributesForSubcategory } = useContext(AdminContext);
    
    // AppContext for fetching product details to pre-populate the form
    const { getProductById } = useContext(AppContext);

    const isEditMode = !!productId;
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        description: '',
        images: [], // Array of image URLs (after upload)
        category: '',
        subcategory: '',
        countInStock: 0,
        attributes: {},
        originalPrice: 0,
        discountPercentage: 0,
    });
    const [selectedFiles, setSelectedFiles] = useState([]); // Files selected from PC
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [attributeFields, setAttributeFields] = useState([]);
    const [attributeValues, setAttributeValues] = useState({});
    
    const [fetchError, setFetchError] = useState(null);

    // Custom style for smaller form floating labels to match form-control-sm
    const formFloatingSmStyle = {
        // These custom CSS variables help floating labels look right with smaller inputs
        '--bs-form-check-label-font-size': '0.875rem', 
        '--bs-form-floating-line-height': '1.25',
        '--bs-form-floating-padding-y': '0.75rem',
        '--bs-form-floating-padding-x': '0.75rem',
    };

    // Fetch categories on mount
    useEffect(() => {
        if (isUserAdmin) {
            fetchCategories();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUserAdmin]);

    // --- Fetch Product Data for Edit Mode ---
    useEffect(() => {
        if (!isUserAdmin) {
             // Redirect if not admin
             return navigate('/'); 
        }

        if (isEditMode) {
            const fetchProduct = async () => {
                try {
                    const product = await getProductById(productId);
                    if (product) {
                        // Handle both old format (single image) and new format (images array)
                        let productImages = product.images;
                        if (!productImages && product.image) {
                            // Backward compatibility: if images array doesn't exist, use single image
                            productImages = [product.image];
                        } else if (!Array.isArray(productImages)) {
                            productImages = [];
                        }

                        setFormData({
                            name: product.name,
                            price: product.price,
                            description: product.description,
                            images: productImages,
                            category: product.category || '',
                            subcategory: product.subcategory || '',
                            countInStock: product.countInStock,
                            attributes: product.attributes || {},
                            originalPrice: product.originalPrice || product.price,
                            discountPercentage: product.discountPercentage || 0,
                        });
                        
                        // Set selected category and subcategory
                        if (product.category) {
                            setSelectedCategory(product.category);
                        }
                        if (product.subcategory) {
                            setSelectedSubcategory(product.subcategory);
                        }
                        setAttributeValues(product.attributes || {});
                    } else {
                        setFetchError('Product not found or failed to load.');
                    }
                } catch (err) {
                    const message = err.response?.data?.message || 'Product not found or failed to load.';
                    setFetchError(message);
                }
            };
            fetchProduct();
        }
    }, [isEditMode, productId, getProductById, isUserAdmin, navigate]);

    // Load attributes when category and subcategory change
    useEffect(() => {
        const loadAttributes = async () => {
            if (!selectedCategory || !selectedSubcategory) {
                setAttributeFields([]);
                setAttributeValues({});
                return;
            }
            const result = await fetchAttributesForSubcategory(selectedCategory, selectedSubcategory);
            const fields = result.fields || [];
            setAttributeFields(fields);
            setAttributeValues((prev) => {
                const next = {};
                fields.forEach((f) => {
                    const fieldName = typeof f === 'string' ? f : f.name;
                    next[fieldName] = prev[fieldName] || '';
                });
                return next;
            });
        };
        loadAttributes();
    }, [selectedCategory, selectedSubcategory, fetchAttributesForSubcategory]);

    const getConfig = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user ? user.token : null;
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const numValue = name === 'price' || name === 'originalPrice' || name === 'discountPercentage' || name === 'countInStock'
            ? parseFloat(value) || 0
            : value;
        
        setFormData({ ...formData, [name]: numValue });
        
        // Auto-update price when originalPrice changes (if no discount)
        if (name === 'originalPrice' && numValue > 0 && (!formData.discountPercentage || formData.discountPercentage === 0)) {
            setFormData(prev => ({ ...prev, price: numValue }));
        }
    };

    const handleAttributeChange = (field, value) => {
        setAttributeValues((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Handle file selection from PC
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        // Filter only image files
        const imageFiles = files.filter(file => {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            return validTypes.includes(file.type);
        });

        if (imageFiles.length !== files.length) {
            alert('Some files were not images and were skipped. Only JPEG, PNG, GIF, and WEBP are allowed.');
        }

        // Add to selected files with preview URLs
        const filesWithPreview = imageFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            isNew: true // Mark as new file to upload
        }));

        setSelectedFiles([...selectedFiles, ...filesWithPreview]);
        
        // Reset input so same file can be selected again
        e.target.value = '';
    };

    // Handle removing a selected file (before upload)
    const handleRemoveSelectedFile = (indexToRemove) => {
        // Revoke object URL to prevent memory leaks
        if (selectedFiles[indexToRemove].preview) {
            URL.revokeObjectURL(selectedFiles[indexToRemove].preview);
        }
        setSelectedFiles(selectedFiles.filter((_, index) => index !== indexToRemove));
    };

    // Handle removing an already uploaded image
    const handleRemoveImage = (indexToRemove) => {
        setFormData({
            ...formData,
            images: formData.images.filter((_, index) => index !== indexToRemove)
        });
    };

    // Upload files to server
    const uploadFiles = async (files) => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('images', file);
        });

        try {
            const response = await axios.post('/api/upload/multiple', formData, {
                ...getConfig(),
                headers: {
                    ...getConfig().headers,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.imageUrls || [];
        } catch (error) {
            console.error('File upload error:', error);
            throw error;
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Calculate final price for validation
        let finalPrice = formData.price;
        if (formData.originalPrice && formData.originalPrice > 0) {
            if (formData.discountPercentage > 0) {
                finalPrice = formData.originalPrice * (1 - formData.discountPercentage / 100);
            } else {
                finalPrice = formData.originalPrice;
            }
        }
        
        // Validation check (basic)
        if (!formData.name || finalPrice <= 0 || !selectedCategory) {
            alert('Please fill out all required fields correctly (Name, Price/Original Price, and Category are required).');
            return;
        }

        // Check if we have images (either uploaded or new files to upload)
        const newFilesToUpload = selectedFiles.filter(f => f.isNew).map(f => f.file);
        const totalImages = formData.images.length + newFilesToUpload.length;

        if (totalImages === 0) {
            alert('Please upload at least one image.');
            return;
        }

        setUploading(true);
        setUploadProgress('Uploading images...');

        try {
            let finalImageUrls = [...formData.images];

            // Upload new files if any
            if (newFilesToUpload.length > 0) {
                setUploadProgress(`Uploading ${newFilesToUpload.length} image(s)...`);
                const uploadedUrls = await uploadFiles(newFilesToUpload);
                finalImageUrls = [...finalImageUrls, ...uploadedUrls];
            }

            setUploadProgress('Saving product...');

            // Calculate final price - use originalPrice if provided, otherwise use price field
            let finalPrice = formData.price || 0;
            if (formData.originalPrice && formData.originalPrice > 0) {
                if (formData.discountPercentage > 0) {
                    finalPrice = formData.originalPrice * (1 - formData.discountPercentage / 100);
                } else {
                    finalPrice = formData.originalPrice;
                }
            }

            // Prepare product data with uploaded image URLs
            const productData = {
                ...formData,
                price: finalPrice,
                images: finalImageUrls,
                category: selectedCategory || formData.category,
                subcategory: selectedSubcategory || formData.subcategory || '',
                attributes: attributeValues,
            };

            let success = false;

            if (isEditMode) {
                success = await updateProduct(productId, productData);
            } else {
                success = await createProduct(productData);
            }

            if (success) {
                // Clean up object URLs
                selectedFiles.forEach(file => {
                    if (file.preview) {
                        URL.revokeObjectURL(file.preview);
                    }
                });
                navigate('/admin/products'); // Redirect back to list on success
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product. Please try again.');
        } finally {
            setUploading(false);
            setUploadProgress('');
        }
    };

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            selectedFiles.forEach(file => {
                if (file && file.preview) {
                    URL.revokeObjectURL(file.preview);
                }
            });
        };
    }, [selectedFiles]);
    
    const title = isEditMode ? `Edit Product: ${formData.name || 'Loading...'}` : 'Create New Product';

    if (fetchError) {
        return <h2 className='text-center mt-5 text-danger'>{fetchError}</h2>;
    }
    
    return (
        <div className='p-4'>
            <div className='row justify-content-center'>
                <div className='col-md-10'>
                    <h1 className='mb-4'>{title}</h1>
                    {(adminError || fetchError) && <div className="alert alert-danger">{adminError || fetchError}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        {/* Basic Info */}
                        
                        {/* Name (Floating Label) */}
                        <div className='form-floating mb-3' style={formFloatingSmStyle}>
                            <input 
                                type='text' 
                                className='form-control form-control-sm' 
                                id='name' 
                                name='name' 
                                value={formData.name} 
                                onChange={handleChange} 
                                placeholder='Product Name'
                                required 
                            />
                            <label htmlFor='name'>Product Name</label>
                        </div>

                        <div className='row'>
                            {/* Original Price (Floating Label) */}
                            <div className='col-md-4 mb-3'>
                                <div className='form-floating' style={formFloatingSmStyle}>
                                    <input 
                                        type='number' 
                                        className='form-control form-control-sm' 
                                        id='originalPrice' 
                                        name='originalPrice' 
                                        value={formData.originalPrice} 
                                        onChange={handleChange} 
                                        placeholder='Original Price (₹)'
                                        min="0.01" 
                                        step="0.01" 
                                    />
                                    <label htmlFor='originalPrice'>Original Price (₹)</label>
                                </div>
                            </div>
                            
                            {/* Discount Percentage (Floating Label) */}
                            <div className='col-md-4 mb-3'>
                                <div className='form-floating' style={formFloatingSmStyle}>
                                    <input 
                                        type='number' 
                                        className='form-control form-control-sm' 
                                        id='discountPercentage' 
                                        name='discountPercentage' 
                                        value={formData.discountPercentage} 
                                        onChange={handleChange} 
                                        placeholder='Discount (%)'
                                        min="0" 
                                        max="100"
                                        step="0.01" 
                                    />
                                    <label htmlFor='discountPercentage'>Discount (%)</label>
                                </div>
                            </div>
                            
                            {/* Final Price (Calculated, Read-only) */}
                            <div className='col-md-4 mb-3'>
                                <div className='form-floating' style={formFloatingSmStyle}>
                                    <input 
                                        type='number' 
                                        className='form-control form-control-sm' 
                                        id='price' 
                                        name='price' 
                                        value={
                                            formData.originalPrice && formData.originalPrice > 0
                                                ? (formData.discountPercentage > 0 
                                                    ? (formData.originalPrice * (1 - formData.discountPercentage / 100)).toFixed(2)
                                                    : formData.originalPrice.toFixed(2))
                                                : (formData.price || '')
                                        } 
                                        onChange={(e) => {
                                            // If no original price set, allow manual price entry
                                            if (!formData.originalPrice || formData.originalPrice === 0) {
                                                handleChange(e);
                                            }
                                        }}
                                        placeholder='Final Price (₹)'
                                        required 
                                        min="0.01" 
                                        step="0.01"
                                        readOnly={formData.originalPrice && formData.originalPrice > 0}
                                        style={formData.originalPrice && formData.originalPrice > 0 ? { backgroundColor: '#e9ecef' } : {}}
                                    />
                                    <label htmlFor='price'>Final Price (₹) {formData.originalPrice && formData.originalPrice > 0 ? '(Auto-calculated)' : '*Required'}</label>
                                </div>
                            </div>
                        </div>
                        
                        <div className='row'>
                            {/* Count In Stock (Floating Label) */}
                            <div className='col-md-6 mb-3'>
                                <div className='form-floating' style={formFloatingSmStyle}>
                                    <input 
                                        type='number' 
                                        className='form-control form-control-sm' 
                                        id='countInStock' 
                                        name='countInStock' 
                                        value={formData.countInStock} 
                                        onChange={handleChange} 
                                        placeholder='Count In Stock'
                                        required 
                                        min="0" 
                                    />
                                    <label htmlFor='countInStock'>Count In Stock</label>
                                </div>
                            </div>
                        </div>
                        
                        {/* Categorization */}
                        <div className='row'>
                            {/* Category (Floating Label Select) */}
                            <div className='col-md-6 mb-3'>
                                <div className='form-floating' style={formFloatingSmStyle}>
                                    <select
                                        className='form-control form-control-sm form-select'
                                        id='category'
                                        value={selectedCategory}
                                        onChange={(e) => {
                                            setSelectedCategory(e.target.value);
                                            setFormData({ ...formData, category: e.target.value });
                                            setSelectedSubcategory(''); // Reset subcategory when category changes
                                            setFormData(prev => ({ ...prev, subcategory: '' }));
                                        }}
                                        required
                                    >
                                        <option value=''>Select Category</option>
                                        {adminCategories.filter(cat => cat.isActive).map((category) => (
                                            <option key={category._id} value={category.name}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    <label htmlFor='category'>Category *</label>
                                </div>
                            </div>
                            
                            {/* Subcategory (Floating Label Select) */}
                            <div className='col-md-6 mb-3'>
                                <div className='form-floating' style={formFloatingSmStyle}>
                                    <select
                                        className='form-control form-control-sm form-select'
                                        id='subcategory'
                                        value={selectedSubcategory}
                                        onChange={(e) => {
                                            setSelectedSubcategory(e.target.value);
                                            setFormData({ ...formData, subcategory: e.target.value });
                                        }}
                                        disabled={!selectedCategory}
                                    >
                                        <option value=''>Select Subcategory (Optional)</option>
                                        {selectedCategory && adminCategories
                                            .find(cat => cat.name === selectedCategory)
                                            ?.subcategories?.map((sub, index) => (
                                                <option key={index} value={sub.name}>
                                                    {sub.name}
                                                </option>
                                            ))}
                                    </select>
                                    <label htmlFor='subcategory'>Subcategory</label>
                                </div>
                            </div>
                        </div>

                        {/* Dynamic Attributes */}
                        {selectedCategory && selectedSubcategory && (
                            <div className='mb-3'>
                                <label className='form-label fw-semibold'>
                                    Attributes for {selectedCategory} - {selectedSubcategory}
                                </label>
                                {attributeFields.length === 0 && (
                                    <p className='text-muted mb-1 small'>
                                        No attributes defined for this subcategory. Go to Manage Attributes to add fields.
                                    </p>
                                )}
                                <div className='row g-2'>
                                    {attributeFields.map((field, idx) => {
                                        const fieldName = typeof field === 'string' ? field : field.name;
                                        const fieldType = typeof field === 'object' ? field.type : 'string';
                                        return (
                                            <div className='col-md-4' key={idx}>
                                                <label className='form-label small'>
                                                    {fieldName} ({fieldType})
                                                </label>
                                                <input
                                                    type={fieldType === 'number' ? 'number' : 'text'}
                                                    className='form-control form-control-sm'
                                                    placeholder={`Enter ${fieldName}`}
                                                    value={attributeValues[fieldName] || ''}
                                                    onChange={(e) =>
                                                        handleAttributeChange(
                                                            fieldName,
                                                            fieldType === 'number' ? parseFloat(e.target.value) || 0 : e.target.value
                                                        )
                                                    }
                                                    step={fieldType === 'number' ? '0.01' : undefined}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Images Section (Kept standard labels as file input isn't great with floating label) */}
                        <div className='mb-3'>
                            <label className='form-label'>Product Images</label>
                            <p className='text-muted small mb-2'>
                                Choose images from your computer. You can select multiple images at once (JPEG, PNG, GIF, WEBP). Max 5MB per file.
                            </p>
                            
                            {/* File Input */}
                            <div className='mb-3'>
                                <input 
                                    type='file' 
                                    className='form-control form-control-sm' // Smaller file input
                                    accept='image/jpeg,image/jpg,image/png,image/gif,image/webp'
                                    multiple
                                    onChange={handleFileSelect}
                                    disabled={uploading}
                                />
                                <small className='text-muted'>
                                    Selected: {selectedFiles.length} file(s) | Uploaded: {formData.images.length} image(s)
                                </small>
                            </div>

                            {/* Upload Progress */}
                            {uploadProgress && (
                                <div className='alert alert-info p-2 small'>
                                    <i className='fas fa-spinner fa-spin me-2'></i>
                                    {uploadProgress}
                                </div>
                            )}
                            
                            {/* Preview Selected Files (Before Upload) */}
                            {selectedFiles.length > 0 && (
                                <div className='mb-3'>
                                    <label className='form-label small fw-bold'>
                                        New Images to Upload ({selectedFiles.length}):
                                    </label>
                                    <div className='row g-2'>
                                        {selectedFiles.map((fileObj, index) => (
                                            <div key={index} className='col-md-3 col-6'>
                                                <div className='card position-relative border-primary'>
                                                    <img 
                                                        src={fileObj.preview} 
                                                        alt={`Preview ${index + 1}`}
                                                        className='card-img-top' 
                                                        style={{ height: '100px', objectFit: 'cover' }}
                                                    />
                                                    <button
                                                        type='button'
                                                        className='btn btn-sm btn-danger position-absolute top-0 end-0 m-1'
                                                        onClick={() => handleRemoveSelectedFile(index)}
                                                        style={{ zIndex: 10 }}
                                                        disabled={uploading}
                                                    >
                                                        <i className='fas fa-times'></i>
                                                    </button>
                                                    <div className='card-body p-2'>
                                                        <small className='text-truncate d-block' style={{ fontSize: '0.7rem' }}>
                                                            {fileObj.file.name}
                                                        </small>
                                                        <small className='text-muted' style={{ fontSize: '0.65rem' }}>
                                                            {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                                                        </small>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {/* Display Already Uploaded Images (Edit Mode) */}
                            {formData.images.length > 0 && (
                                <div className='mt-3'>
                                    <label className='form-label small fw-bold'>
                                        Current Product Images ({formData.images.length}):
                                    </label>
                                    <div className='row g-2'>
                                        {formData.images.map((imgUrl, index) => (
                                            <div key={index} className='col-md-3 col-6'>
                                                <div className='card position-relative border-success'>
                                                    <img 
                                                        src={imgUrl} 
                                                        alt={`Current image ${index + 1}`}
                                                        className='card-img-top' 
                                                        style={{ height: '100px', objectFit: 'cover' }}
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/200x200?text=Image+Error';
                                                        }}
                                                    />
                                                    <button
                                                        type='button'
                                                        className='btn btn-sm btn-danger position-absolute top-0 end-0 m-1'
                                                        onClick={() => handleRemoveImage(index)}
                                                        style={{ zIndex: 10 }}
                                                        disabled={uploading}
                                                    >
                                                        <i className='fas fa-times'></i>
                                                    </button>
                                                    <div className='card-body p-2'>
                                                        <small className='text-truncate d-block' style={{ fontSize: '0.7rem' }}>
                                                            Image {index + 1}
                                                        </small>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {/* No Images Warning */}
                            {formData.images.length === 0 && selectedFiles.length === 0 && (
                                <div className='alert alert-warning mt-2 p-2'>
                                    <small><i className='fas fa-exclamation-triangle me-1'></i>No images selected. Please upload at least one image.</small>
                                </div>
                            )}
                        </div>
                        
                        {/* Description (Floating Label) */}
                        <div className='form-floating mb-3' style={formFloatingSmStyle}>
                            <textarea 
                                className='form-control' 
                                id='description' 
                                name='description' 
                                value={formData.description} 
                                onChange={handleChange} 
                                placeholder='Product Description'
                                rows='5' 
                                style={{ height: '100px' }} // Set height for textarea floating label
                                required
                            ></textarea>
                            <label htmlFor='description'>Description</label>
                        </div>
                        
                        <div className='d-grid gap-2'>
                            <button type='submit' className='btn btn-primary' disabled={adminLoading || uploading}>
                                {uploading ? uploadProgress : (adminLoading ? 'Processing...' : (isEditMode ? 'Update Product' : 'Create Product'))}
                            </button>
                            <button type='button' className='btn btn-secondary' onClick={() => navigate('/admin/products')} disabled={adminLoading || uploading}>
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