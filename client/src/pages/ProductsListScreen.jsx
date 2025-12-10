// client/src/pages/ProductsListScreen.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import ProductItem from '../component/ProductItem';
import axios from 'axios';

function ProductsListScreen() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { products, fetchProducts, isLoading, categories, fetchCategories } = useContext(AppContext);

    // Filter states
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [selectedSubcategory, setSelectedSubcategory] = useState(searchParams.get('subcategory') || '');
    const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
    const [minDiscount, setMinDiscount] = useState(searchParams.get('minDiscount') || '');
    const [inStock, setInStock] = useState(searchParams.get('inStock') !== 'false');
    const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');
    const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');
    
    // Attributes state
    const [availableAttributes, setAvailableAttributes] = useState({});
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [showFilters, setShowFilters] = useState(true);

    // Get subcategories for selected category
    const selectedCategoryData = categories?.find(cat => cat.name === selectedCategory);
    // Handle both array of strings and array of objects with name property
    const subcategories = selectedCategoryData?.subcategories?.map(sub => 
        typeof sub === 'string' ? sub : sub.name
    ) || [];

    // Sync URL params with state when URL changes (only on mount or when searchParams change)
    useEffect(() => {
        const categoryParam = searchParams.get('category') || '';
        const subcategoryParam = searchParams.get('subcategory') || '';
        const keywordParam = searchParams.get('keyword') || '';
        
        setSelectedCategory(categoryParam);
        setSelectedSubcategory(subcategoryParam);
        setKeyword(keywordParam);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams.toString()]);

    // Fetch categories on mount
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Fetch attributes when category/subcategory changes
    useEffect(() => {
        if (selectedCategory && selectedSubcategory) {
            fetchAttributes(selectedCategory, selectedSubcategory);
        } else {
            setAvailableAttributes({});
            setSelectedAttributes({});
        }
    }, [selectedCategory, selectedSubcategory]);

    // Fetch products when filters change
    useEffect(() => {
        const queryParams = new URLSearchParams();
        
        if (keyword) queryParams.set('keyword', keyword);
        if (selectedCategory) queryParams.set('category', selectedCategory);
        if (selectedSubcategory) queryParams.set('subcategory', selectedSubcategory);
        if (minPrice) queryParams.set('minPrice', minPrice);
        if (maxPrice) queryParams.set('maxPrice', maxPrice);
        if (minDiscount) queryParams.set('minDiscount', minDiscount);
        if (!inStock) queryParams.set('inStock', 'false');
        if (sortBy) queryParams.set('sortBy', sortBy);
        if (sortOrder) queryParams.set('sortOrder', sortOrder);
        
        // Add attribute filters
        Object.entries(selectedAttributes).forEach(([key, value]) => {
            if (value) queryParams.set(key, value);
        });

        const queryString = queryParams.toString();
        fetchProducts(queryString ? `?${queryString}` : '');
        
        // Update URL without reload
        setSearchParams(queryParams);
    }, [keyword, selectedCategory, selectedSubcategory, minPrice, maxPrice, minDiscount, inStock, sortBy, sortOrder, selectedAttributes]);

    const fetchAttributes = async (category, subcategory) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user ? user.token : null;
            const response = await axios.get(
                `/api/attributes/${encodeURIComponent(category)}/${encodeURIComponent(subcategory)}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            if (response.data && response.data.fields) {
                const attrs = {};
                response.data.fields.forEach(field => {
                    if (field.type === 'select' || field.type === 'radio') {
                        attrs[field.name] = field.options || [];
                    }
                });
                setAvailableAttributes(attrs);
            }
        } catch (error) {
            console.error('Failed to fetch attributes:', error);
        }
    };

    const handleAttributeChange = (attrName, value) => {
        setSelectedAttributes(prev => ({
            ...prev,
            [attrName]: value === prev[attrName] ? '' : value
        }));
    };

    const clearFilters = () => {
        setSelectedCategory('');
        setSelectedSubcategory('');
        setKeyword('');
        setMinPrice('');
        setMaxPrice('');
        setMinDiscount('');
        setInStock(true);
        setSelectedAttributes({});
        setSortBy('newest');
        setSortOrder('desc');
    };

    const hasActiveFilters = selectedCategory || selectedSubcategory || keyword || minPrice || maxPrice || minDiscount || !inStock || Object.keys(selectedAttributes).some(key => selectedAttributes[key]);

    return (
        <div className="container-fluid mt-4">
            <div className="row">
                {/* Filters Sidebar */}
                <div className={`col-lg-2 col-md-3 ${showFilters ? '' : 'd-none d-md-block'}`}>
                    <div className="card shadow-sm sticky-top" >
                        <div className="card-header bg-white d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">
                                <i className="fas fa-filter me-2"></i>Filters
                            </h5>
                            <button
                                className="btn btn-sm btn-outline-secondary d-md-none"
                                onClick={() => setShowFilters(false)}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="card-body">
                            {/* Search */}
                            <div className="mb-4">
                                <label className="form-label fw-bold">Search</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search products..."
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                />
                            </div>

                            {/* Category */}
                            <div className="mb-4">
                                <label className="form-label fw-bold">Category</label>
                                <select
                                    className="form-select"
                                    value={selectedCategory}
                                    onChange={(e) => {
                                        setSelectedCategory(e.target.value);
                                        setSelectedSubcategory('');
                                    }}
                                >
                                    <option value="">All Categories</option>
                                    {categories?.filter(cat => cat.isActive).map(cat => (
                                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Subcategory */}
                            {subcategories.length > 0 && (
                                <div className="mb-4">
                                    <label className="form-label fw-bold">Subcategory</label>
                                    <select
                                        className="form-select"
                                        value={selectedSubcategory}
                                        onChange={(e) => setSelectedSubcategory(e.target.value)}
                                    >
                                        <option value="">All Subcategories</option>
                                        {subcategories.map((sub, idx) => (
                                            <option key={idx} value={sub}>{sub}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Price Range */}
                            <div className="mb-4">
                                <label className="form-label fw-bold">Price Range</label>
                                <div className="row g-2">
                                    <div className="col-6">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Min"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Max"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Discount */}
                            <div className="mb-4">
                                <label className="form-label fw-bold">Minimum Discount</label>
                                <select
                                    className="form-select"
                                    value={minDiscount}
                                    onChange={(e) => setMinDiscount(e.target.value)}
                                >
                                    <option value="">No Filter</option>
                                    <option value="10">10% or more</option>
                                    <option value="20">20% or more</option>
                                    <option value="30">30% or more</option>
                                    <option value="40">40% or more</option>
                                    <option value="50">50% or more</option>
                                </select>
                            </div>

                            {/* Stock Status */}
                            <div className="mb-4">
                                <label className="form-label fw-bold">Stock Status</label>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={inStock}
                                        onChange={(e) => setInStock(e.target.checked)}
                                        id="inStock"
                                    />
                                    <label className="form-check-label" htmlFor="inStock">
                                        In Stock Only
                                    </label>
                                </div>
                            </div>

                            {/* Attributes */}
                            {Object.keys(availableAttributes).length > 0 && (
                                <div className="mb-4">
                                    <label className="form-label fw-bold">Attributes</label>
                                    {Object.entries(availableAttributes).map(([attrName, options]) => (
                                        <div key={attrName} className="mb-3">
                                            <label className="form-label small text-muted text-capitalize">
                                                {attrName.replace(/([A-Z])/g, ' $1').trim()}
                                            </label>
                                            <select
                                                className="form-select form-select-sm"
                                                value={selectedAttributes[attrName] || ''}
                                                onChange={(e) => handleAttributeChange(attrName, e.target.value)}
                                            >
                                                <option value="">All</option>
                                                {options.map((option, idx) => (
                                                    <option key={idx} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Clear Filters */}
                            {hasActiveFilters && (
                                <button
                                    className="btn btn-outline-danger w-100"
                                    onClick={clearFilters}
                                >
                                    <i className="fas fa-times me-1"></i>Clear All Filters
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Products Section */}
                <div className="col-lg-10 col-md-9">
                    {/* Header with Sort and Filter Toggle */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h2 className="mb-0">
                                {selectedCategory ? `Products in ${selectedCategory}` : 'All Products'}
                                {selectedSubcategory && ` > ${selectedSubcategory}`}
                            </h2>
                            <p className="text-muted mb-0">
                                {products.length} {products.length === 1 ? 'product' : 'products'} found
                            </p>
                        </div>
                        <div className="d-flex gap-2 align-items-center">
                            <button
                                className="btn btn-outline-secondary d-md-none"
                                onClick={() => setShowFilters(true)}
                            >
                                <i className="fas fa-filter me-1"></i>Filters
                            </button>
                            <div className="d-flex gap-2">
                                <select
                                    className="form-select"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    style={{ width: 'auto' }}
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="price">Price</option>
                                    <option value="name">Name</option>
                                    <option value="discount">Discount</option>
                                </select>
                                {sortBy === 'price' && (
                                    <select
                                        className="form-select"
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value)}
                                        style={{ width: 'auto' }}
                                    >
                                        <option value="asc">Low to High</option>
                                        <option value="desc">High to Low</option>
                                    </select>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Products Grid - 4 per line */}
                    {isLoading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
                            <h4>No products found</h4>
                            <p className="text-muted">Try adjusting your filters or search terms</p>
                            {hasActiveFilters && (
                                <button className="btn btn-primary mt-2" onClick={clearFilters}>
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="row g-3">
                            {products.map((product) => (
                                <div key={product._id} className="col-lg-3 col-md-4 col-sm-6 col-6 mb-3">
                                    <ProductItem product={product} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductsListScreen;

