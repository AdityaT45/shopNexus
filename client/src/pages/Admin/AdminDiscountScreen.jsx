// client/src/pages/Admin/AdminDiscountScreen.jsx
import React, { useEffect, useState, useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';

function AdminDiscountScreen() {
    const navigate = useNavigate();
    const {
        adminProducts,
        fetchAdminProducts,
        updateProduct,
        adminLoading,
        adminError,
        isUserAdmin,
    } = useContext(AdminContext);

    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [discountFilter, setDiscountFilter] = useState('all'); // all, with-discount, without-discount

    useEffect(() => {
        if (isUserAdmin) {
            fetchAdminProducts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUserAdmin]);

    useEffect(() => {
        let filtered = [...adminProducts];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter((p) =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Category filter
        if (categoryFilter) {
            filtered = filtered.filter((p) => p.category === categoryFilter);
        }

        // Discount filter
        if (discountFilter === 'with-discount') {
            filtered = filtered.filter((p) => p.discountPercentage > 0);
        } else if (discountFilter === 'without-discount') {
            filtered = filtered.filter((p) => !p.discountPercentage || p.discountPercentage === 0);
        }

        setFilteredProducts(filtered);
    }, [adminProducts, searchTerm, categoryFilter, discountFilter]);

    const handleBulkDiscount = async (discountPercentage) => {
        if (!window.confirm(`Apply ${discountPercentage}% discount to all filtered products?`)) {
            return;
        }

        for (const product of filteredProducts) {
            if (product.originalPrice && product.originalPrice > 0) {
                const newPrice = product.originalPrice * (1 - discountPercentage / 100);
                await updateProduct(product._id, {
                    ...product,
                    discountPercentage,
                    price: newPrice,
                });
            }
        }
        fetchAdminProducts();
    };

    const categories = [...new Set(adminProducts.map((p) => p.category))];

    if (!isUserAdmin) {
        return <h2 className='text-center mt-5 text-danger'>Access Denied. Admin privileges required.</h2>;
    }

    return (
        <div className='p-4'>
            <div className='d-flex justify-content-between align-items-center mb-4'>
                <h1>Manage Discounts</h1>
            </div>

            {adminError && <div className='alert alert-danger'>{adminError}</div>}

            {/* Filters */}
            <div className='card mb-4'>
                <div className='card-body'>
                    <div className='row g-3'>
                        <div className='col-md-4'>
                            <label className='form-label'>Search Products</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Search by name...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className='col-md-3'>
                            <label className='form-label'>Category</label>
                            <select
                                className='form-select'
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                <option value=''>All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='col-md-3'>
                            <label className='form-label'>Discount Status</label>
                            <select
                                className='form-select'
                                value={discountFilter}
                                onChange={(e) => setDiscountFilter(e.target.value)}
                            >
                                <option value='all'>All Products</option>
                                <option value='with-discount'>With Discount</option>
                                <option value='without-discount'>Without Discount</option>
                            </select>
                        </div>
                        <div className='col-md-2 d-flex align-items-end'>
                            <button
                                className='btn btn-primary w-100'
                                onClick={() => {
                                    setSearchTerm('');
                                    setCategoryFilter('');
                                    setDiscountFilter('all');
                                }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bulk Actions */}
            {filteredProducts.length > 0 && (
                <div className='card mb-4'>
                    <div className='card-body'>
                        <h5>Bulk Discount Actions</h5>
                        <p className='text-muted'>Apply discount to {filteredProducts.length} filtered product(s)</p>
                        <div className='btn-group' role='group'>
                            <button
                                className='btn btn-outline-primary'
                                onClick={() => handleBulkDiscount(10)}
                                disabled={adminLoading}
                            >
                                Apply 10%
                            </button>
                            <button
                                className='btn btn-outline-primary'
                                onClick={() => handleBulkDiscount(20)}
                                disabled={adminLoading}
                            >
                                Apply 20%
                            </button>
                            <button
                                className='btn btn-outline-primary'
                                onClick={() => handleBulkDiscount(30)}
                                disabled={adminLoading}
                            >
                                Apply 30%
                            </button>
                            <button
                                className='btn btn-outline-primary'
                                onClick={() => handleBulkDiscount(50)}
                                disabled={adminLoading}
                            >
                                Apply 50%
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Products Table */}
            <div className='table-responsive'>
                <table className='table table-striped table-hover'>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Original Price</th>
                            <th>Current Price</th>
                            <th>Discount %</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => (
                            <tr key={product._id}>
                                <td>
                                    <img
                                        src={
                                            product.images && product.images.length > 0
                                                ? product.images[0]
                                                : 'https://via.placeholder.com/50x50?text=No+Img'
                                        }
                                        alt={product.name}
                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                    />
                                </td>
                                <td>{product.name}</td>
                                <td>{product.category}</td>
                                <td>₹{product.originalPrice || product.price}</td>
                                <td>₹{product.price.toFixed(2)}</td>
                                <td>
                                    {product.discountPercentage > 0 ? (
                                        <span className='badge bg-success'>{product.discountPercentage}%</span>
                                    ) : (
                                        <span className='text-muted'>No discount</span>
                                    )}
                                </td>
                                <td>
                                    <button
                                        className='btn btn-sm btn-outline-primary'
                                        onClick={() => navigate(`/admin/product/${product._id}/edit`)}
                                    >
                                        <i className='fas fa-edit'></i> Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredProducts.length === 0 && (
                    <p className='text-center text-muted mt-4'>No products found.</p>
                )}
            </div>
        </div>
    );
}

export default AdminDiscountScreen;


