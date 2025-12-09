// client/src/pages/SuperAdmin/SuperAdminProductListScreen.jsx
import React, { useEffect, useContext } from 'react';
import { SuperAdminContext } from '../../context/SuperAdminContext';
import { AppContext } from '../../context/AppContext';

function SuperAdminProductListScreen() {
    const { user } = useContext(AppContext);
    const { 
        products, 
        fetchProducts, 
        superAdminLoading, 
        superAdminError 
    } = useContext(SuperAdminContext);

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!user || user.role !== 'Super Admin') {
        return <h2 className='text-center mt-5 text-danger'>Access Denied. Super Admin privileges required.</h2>;
    }

    if (superAdminLoading && products.length === 0) {
        return <h2 className='text-center mt-5'>Loading Products...</h2>;
    }

    return (
        <div className='p-4'>
            <h1 className='mb-4'>All Products</h1>
            {superAdminError && <div className="alert alert-danger">{superAdminError}</div>}
            
            <div className='table-responsive'>
                <table className='table table-striped table-hover'>
                    <thead>
                        <tr>
                            <th>Product ID</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Stock</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td>{product.productId || product._id}</td>
                                <td>
                                    <img 
                                        src={(product.images && product.images.length > 0) ? product.images[0] : 'https://via.placeholder.com/50x50?text=No+Img'} 
                                        alt={product.name} 
                                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/50x50?text=Error';
                                        }}
                                    />
                                </td>
                                <td>{product.name}</td>
                                <td>₹ {product.price?.toFixed(2) || '0.00'}</td>
                                <td>{product.category}</td>
                                <td>
                                    <span className={`badge ${product.countInStock > 0 ? 'bg-success' : 'bg-danger'}`}>
                                        {product.countInStock || 0}
                                    </span>
                                </td>
                                <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && (
                    <p className='text-center text-muted mt-4'>No products found.</p>
                )}
            </div>
        </div>
    );
}

export default SuperAdminProductListScreen;






