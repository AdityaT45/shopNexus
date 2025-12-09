// client/src/pages/AdminProductListScreen.jsx
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
        isUserAdmin 
    } = useContext(AdminContext);

    useEffect(() => {
        if (isUserAdmin) {
            fetchAdminProducts();
        }
        if (adminError) {
            console.error(adminError);
        }
    }, [isUserAdmin, adminError]);

    const handleCreate = () => {
        // Navigate to the Product Edit screen without an ID (signals creation)
        navigate('/admin/product/new');
    };

    const totalPages = Math.max(1, Math.ceil(adminProducts.length / pageSize));
    const pagedProducts = adminProducts.slice((page - 1) * pageSize, page * pageSize);

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
                            <i className="fas fa-plus me-1"></i> Create Product
                        </button>
                    </div>
                    
                    {adminError && <div className="alert alert-danger">{adminError}</div>}
                    
                    <table className='table table-striped table-hover mt-3'>
                        <thead>
                            <tr>
                                <th>Product ID</th>
                                <th>Name</th>
                                <th>Image</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Count</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pagedProducts.map((product) => (
                                <tr key={product._id}>
                                    <td><code>{product.productId || product._id}</code></td>
                                    <td>{product.name}</td>
                                    <td>
                                        <img 
                                            src={(product.images && product.images.length > 0) ? product.images[0] : (product.image || 'https://via.placeholder.com/50x50?text=No+Img')} 
                                            alt={product.name} 
                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/50x50?text=Error';
                                            }}
                                        />
                                    </td>
                                    <td>₹ {product.price.toFixed(2)}</td>
                                    <td>{product.category}</td>
                                    <td>{product.countInStock}</td>
                                    <td>
                                        <button
                                            className='btn btn-sm btn-outline-info me-2'
                                            onClick={() => navigate(`/admin/product/${product._id}/edit`)}
                                        >
                                            <i className="fas fa-edit"></i> Edit
                                        </button>
                                        <button
                                            className='btn btn-sm btn-outline-danger'
                                            onClick={() => deleteProduct(product._id)}
                                            disabled={adminLoading}
                                        >
                                            <i className="fas fa-trash"></i> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Pagination */}
                    <div className='d-flex justify-content-between align-items-center'>
                        <small className='text-muted'>Page {page} of {totalPages}</small>
                        <div>
                            <button className='btn btn-sm btn-outline-secondary me-2' disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
                            <button className='btn btn-sm btn-outline-secondary' disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
                        </div>
                    </div>
        </div>
    );
}


export default AdminProductListScreen;