// client/src/pages/Admin/AdminProductListScreen.jsx
import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';

function AdminProductListScreen() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const {
        adminProducts,
        fetchAdminProducts,
        deleteProduct,
        adminLoading,
        adminError,
        isUserAdmin,
    } = useContext(AdminContext);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [stockFilter, setStockFilter] = useState('all'); // all, in-stock, out-of-stock
    const [discountFilter, setDiscountFilter] = useState('all'); // all, with-discount, without-discount
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        if (isUserAdmin) {
            fetchAdminProducts();
        }
        if (adminError) {
            console.error(adminError);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUserAdmin]);

    // Apply filters
    useEffect(() => {
        let filtered = [...adminProducts];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter((p) =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p.productId && p.productId.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Category filter
        if (categoryFilter) {
            filtered = filtered.filter((p) => p.category === categoryFilter);
        }

        // Stock filter
        if (stockFilter === 'in-stock') {
            filtered = filtered.filter((p) => p.countInStock > 0);
        } else if (stockFilter === 'out-of-stock') {
            filtered = filtered.filter((p) => p.countInStock === 0);
        }

        // Discount filter
        if (discountFilter === 'with-discount') {
            filtered = filtered.filter((p) => p.discountPercentage > 0);
        } else if (discountFilter === 'without-discount') {
            filtered = filtered.filter((p) => !p.discountPercentage || p.discountPercentage === 0);
        }

        setFilteredProducts(filtered);
        setPage(1); // Reset to first page when filters change
    }, [adminProducts, searchTerm, categoryFilter, stockFilter, discountFilter]);

    const handleCreate = () => {
        navigate('/admin/product/new');
    };

    const categories = [...new Set(adminProducts.map((p) => p.category))];
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
    const pagedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

    if (adminLoading && adminProducts.length === 0) {
        return <h2 className='text-center mt-5'>Loading Products...</h2>;
    }

    if (!isUserAdmin) {
        return <h2 className='text-center mt-5 text-danger'>Access Denied. Admin privileges required.</h2>;
    }

    return (
        <div className='p-4'>
            <div className='d-flex justify-content-between align-items-center mb-4'>
                <h1>Product Management</h1>
                <button className='btn btn-success' onClick={handleCreate}>
                    <i className='fas fa-plus me-1'></i> Create Product
                </button>
            </div>

            {adminError && <div className='alert alert-danger'>{adminError}</div>}

            {/* Filters */}
            <div className='mb-3 p-3 bg-light rounded border'>
                <div className='row g-2 align-items-end'>
                    <div className='col-md-3'>
                        <label className='form-label small text-muted mb-1'>Search</label>
                        <input
                            type='text'
                            className='form-control form-control-sm'
                            placeholder='Search by name or ID...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className='col-md-2'>
                        <label className='form-label small text-muted mb-1'>Category</label>
                        <select
                            className='form-select form-select-sm'
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
                    <div className='col-md-2'>
                        <label className='form-label small text-muted mb-1'>Stock</label>
                        <select
                            className='form-select form-select-sm'
                            value={stockFilter}
                            onChange={(e) => setStockFilter(e.target.value)}
                        >
                            <option value='all'>All</option>
                            <option value='in-stock'>In Stock</option>
                            <option value='out-of-stock'>Out of Stock</option>
                        </select>
                    </div>
                    <div className='col-md-2'>
                        <label className='form-label small text-muted mb-1'>Discount</label>
                        <select
                            className='form-select form-select-sm'
                            value={discountFilter}
                            onChange={(e) => setDiscountFilter(e.target.value)}
                        >
                            <option value='all'>All</option>
                            <option value='with-discount'>With Discount</option>
                            <option value='without-discount'>No Discount</option>
                        </select>
                    </div>
                    <div className='col-md-3'>
                        <div className='d-flex gap-2'>
                            <button
                                className='btn btn-outline-secondary btn-sm flex-fill'
                                onClick={() => {
                                    setSearchTerm('');
                                    setCategoryFilter('');
                                    setStockFilter('all');
                                    setDiscountFilter('all');
                                }}
                            >
                                <i className='fas fa-times me-1'></i> Clear
                            </button>
                            <span className='badge bg-secondary align-self-center'>
                                {filteredProducts.length}/{adminProducts.length}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className='table-responsive'>
                <table className='table table-striped table-hover'>
                    <thead className='table-dark'>
                        <tr>
                            <th>Image</th>
                            <th>Product ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Original Price</th>
                            <th>Discount</th>
                            <th>Category</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pagedProducts.map((product) => (
                            <tr key={product._id}>
                                <td>
                                    <img
                                        src={
                                            product.images && product.images.length > 0
                                                ? product.images[0]
                                                : 'https://via.placeholder.com/50x50?text=No+Img'
                                        }
                                        alt={product.name}
                                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/50x50?text=Error';
                                        }}
                                    />
                                </td>
                                <td>
                                    <code style={{ fontSize: '12px' }}>{product.productId || product._id}</code>
                                </td>
                                <td>
                                    <strong>{product.name}</strong>
                                    {product.subcategory && (
                                        <div>
                                            <small className='text-muted'>{product.subcategory}</small>
                                        </div>
                                    )}
                                </td>
                                <td>
                                    <strong className='text-success'>₹{product.price.toFixed(2)}</strong>
                                </td>
                                <td>
                                    {product.originalPrice && product.originalPrice > product.price ? (
                                        <span style={{ textDecoration: 'line-through', color: '#999' }}>
                                            ₹{product.originalPrice.toFixed(2)}
                                        </span>
                                    ) : (
                                        <span className='text-muted'>-</span>
                                    )}
                                </td>
                                <td>
                                    {product.discountPercentage > 0 ? (
                                        <span className='badge bg-success'>{product.discountPercentage}% OFF</span>
                                    ) : (
                                        <span className='text-muted'>-</span>
                                    )}
                                </td>
                                <td>{product.category}</td>
                                <td>
                                    <span
                                        className={`badge ${
                                            product.countInStock > 0 ? 'bg-success' : 'bg-danger'
                                        }`}
                                    >
                                        {product.countInStock}
                                    </span>
                                </td>
                                <td>
                                    <div className='btn-group' role='group'>
                                        <button
                                            className='btn btn-sm btn-outline-info'
                                            onClick={() => navigate(`/admin/product/${product._id}/edit`)}
                                            title='Edit'
                                        >
                                            <i className='fas fa-edit'></i>
                                        </button>
                                        <button
                                            className='btn btn-sm btn-outline-danger'
                                            onClick={() => deleteProduct(product._id)}
                                            disabled={adminLoading}
                                            title='Delete'
                                        >
                                            <i className='fas fa-trash'></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {pagedProducts.length === 0 && (
                    <p className='text-center text-muted mt-4'>No products found matching the filters.</p>
                )}
            </div>

            {/* Pagination */}
            <div className='d-flex justify-content-between align-items-center mt-3'>
                <small className='text-muted'>
                    Page {page} of {totalPages} ({filteredProducts.length} products)
                </small>
                <div>
                    <button
                        className='btn btn-sm btn-outline-secondary me-2'
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                        <i className='fas fa-chevron-left'></i> Prev
                    </button>
                    <button
                        className='btn btn-sm btn-outline-secondary'
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                        Next <i className='fas fa-chevron-right'></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminProductListScreen;
