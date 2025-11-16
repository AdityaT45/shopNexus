// client/src/pages/UserDashboard.jsx
import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import ProductItem from '../component/ProductItem';

function UserDashboard() {
    const navigate = useNavigate();
    // 🔑 CONTEXT: Consume state and actions
    const { products, fetchProducts, isLoading, error, user, myOrders, fetchMyOrders, cart } = useContext(AppContext);

    // Local state for search/filter
    const [searchParams, setSearchParams] = React.useState({
        keyword: '',
        category: '',
    });

    const { keyword, category } = searchParams;

    // Handler to update the search state
    const handleSearchChange = (e) => {
        setSearchParams({
            ...searchParams,
            [e.target.name]: e.target.value,
        });
    };

    // Fetch products whenever the component mounts OR search/filter parameters change
    useEffect(() => {
        if (error) {
            console.error(error);
        }
        
        // 1. CONSTRUCT QUERY STRING
        let queryString = '';
        if (keyword) { queryString += `?keyword=${keyword}`; }
        if (category) { queryString += `${queryString ? '&' : '?'}category=${category}`; }
        
        // 2. 🔑 ACTION: Call context action with the query string
        fetchProducts(queryString);
    }, [keyword, category]);

    // Fetch user's orders
    useEffect(() => {
        if (user) {
            fetchMyOrders();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const cartItemCount = cart?.items?.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0;

    if (isLoading && products.length === 0) {
        return <h2 className='text-center mt-5'>Loading Dashboard...</h2>;
    }

    return (
        <div className='container mt-5'>
            <h1 className='mb-4'>Welcome back, {user?.name}!</h1>

            {/* User Statistics */}
            <div className='row mb-4'>
                <div className='col-md-4 mb-3'>
                    <div className='card bg-primary text-white'>
                        <div className='card-body'>
                            <h5 className='card-title'>Cart Items</h5>
                            <h2>{cartItemCount}</h2>
                            <button 
                                className='btn btn-light btn-sm mt-2'
                                onClick={() => navigate('/cart')}
                            >
                                View Cart
                            </button>
                        </div>
                    </div>
                </div>
                <div className='col-md-4 mb-3'>
                    <div className='card bg-success text-white'>
                        <div className='card-body'>
                            <h5 className='card-title'>My Orders</h5>
                            <h2>{myOrders?.length || 0}</h2>
                            <button 
                                className='btn btn-light btn-sm mt-2'
                                onClick={() => navigate('/myorders')}
                            >
                                View Orders
                            </button>
                        </div>
                    </div>
                </div>
                <div className='col-md-4 mb-3'>
                    <div className='card bg-info text-white'>
                        <div className='card-body'>
                            <h5 className='card-title'>Account</h5>
                            <p className='mb-0'>{user?.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Section */}
            <div className='mb-4'>
                <h2 className='mb-3'>Latest Products</h2>

                {/* SEARCH AND FILTER FORM */}
                <div className="row mb-4 bg-light p-3 rounded">
                    <div className="col-md-6 mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search products..."
                            name="keyword"
                            value={keyword}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="col-md-6 mb-2">
                        <select
                            className="form-select"
                            name="category"
                            value={category}
                            onChange={handleSearchChange}
                        >
                            <option value="">All Categories</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Apparel">Apparel</option>
                            <option value="Books">Books</option>
                        </select>
                    </div>
                </div>
                
                {/* Product Grid */}
                {products.length === 0 ? (
                    <p>No products found or currently in stock.</p>
                ) : (
                    <div className='row'>
                        {products.map((product) => (
                            <ProductItem key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserDashboard;

