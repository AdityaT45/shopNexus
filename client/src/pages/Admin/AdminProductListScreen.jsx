// client/src/pages/AdminProductListScreen.jsx
import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext'; 
import AdminSidebar from '../../component/Admin/AdminSidebar';
// import AdminSidebar from '../../components/AdminSidebar'; 

function AdminProductListScreen() {
    const navigate = useNavigate();
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

    if (adminLoading && adminProducts.length === 0) {
        return <h2 className='text-center mt-5'>Loading Products...</h2>;
    }

    if (!isUserAdmin) {
        return <h2 className='text-center mt-5 text-danger'>Access Denied. Admin privileges required.</h2>;
    }

    return (
        <div className='container mt-5'>
            <div className='row'>
                <div className='col-md-3'>
                    <AdminSidebar />
                </div>
                <div className='col-md-9'>
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
                                <th>ID (last 4)</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Count</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {adminProducts.map((product) => (
                                <tr key={product._id}>
                                    <td>{product._id.substring(product._id.length - 4)}</td>
                                    <td>{product.name}</td>
                                    <td>${product.price.toFixed(2)}</td>
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
                </div>
            </div>
        </div>
    );
}

export default AdminProductListScreen;