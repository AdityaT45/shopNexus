// client/src/pages/Home.jsx
import React, { useEffect, useContext, useState } from 'react';
import { AppContext } from '../context/AppContext'; 
import ProductItem from '../component/ProductItem'; // Will create this component next

function Home() {
    // 🔑 CONTEXT: Consume state and actions
    const { products, fetchProducts, isLoading, error } = useContext(AppContext);

    // Local state for search/filter (same as previous implementation)
    const [searchParams, setSearchParams] = useState({
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

    }, [keyword, category]); // Dependencies include search state

    if (isLoading) {
        return <h2 className='text-center mt-5'>Loading Products...</h2>;
    }

    return (
        <div className='container mt-5'>
            <h1>Latest Products</h1>

            {/* === SEARCH AND FILTER FORM === */}
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
            
            {/* === Product Grid === */}
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
    );
}

export default Home;