// client/src/pages/CategoriesScreen.jsx
import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import ProductItem from '../component/ProductItem';

function CategoriesScreen() {
    const navigate = useNavigate();
    const { categories, fetchCategories, products, fetchProducts, isLoading } = useContext(AppContext);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        let queryString = '';
        if (selectedCategory) {
            queryString = `?category=${selectedCategory}`;
            if (selectedSubcategory) {
                queryString += `&subcategory=${selectedSubcategory}`;
            }
        }
        fetchProducts(queryString);
    }, [selectedCategory, selectedSubcategory, fetchProducts]);

    const handleCategoryClick = (categoryName) => {
        setSelectedCategory(categoryName);
        setSelectedSubcategory('');
    };

    const handleSubcategoryClick = (subcategoryName) => {
        setSelectedSubcategory(subcategoryName);
    };

    return (
        <div className='container mt-5'>
            <h1 className='mb-4'>All Categories</h1>

            {/* Category Filter */}
            {selectedCategory && (
                <div className='mb-4 bg-light p-3 rounded'>
                    <div className='row align-items-center'>
                        <div className='col-md-4'>
                            <label className='form-label'>Category</label>
                            <select
                                className='form-select'
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    setSelectedSubcategory('');
                                }}
                            >
                                <option value=''>Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='col-md-4'>
                            <label className='form-label'>Subcategory</label>
                            <select
                                className='form-select'
                                value={selectedSubcategory}
                                onChange={(e) => setSelectedSubcategory(e.target.value)}
                                disabled={!selectedCategory}
                            >
                                <option value=''>All Subcategories</option>
                                {selectedCategory && categories
                                    .find(cat => cat.name === selectedCategory)
                                    ?.subcategories?.map((sub, index) => (
                                        <option key={index} value={sub.name}>
                                            {sub.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div className='col-md-4'>
                            <button
                                className='btn btn-secondary mt-4'
                                onClick={() => {
                                    setSelectedCategory('');
                                    setSelectedSubcategory('');
                                }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Categories Grid */}
            {!selectedCategory && (
                <div className='row mb-5'>
                    {categories.map((category) => (
                        <div key={category._id} className='col-md-3 col-6 mb-4'>
                            <div
                                className='card h-100 shadow-sm'
                                style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                                onClick={() => handleCategoryClick(category.name)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className='card-img-top'
                                    style={{ height: '200px', objectFit: 'cover' }}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/300x200?text=Category';
                                    }}
                                />
                                <div className='card-body text-center'>
                                    <h5 className='card-title'>{category.name}</h5>
                                    {category.subcategories && category.subcategories.length > 0 && (
                                        <div className='mt-2'>
                                            <small className='text-muted d-block mb-2'>
                                                {category.subcategories.length} Subcategories
                                            </small>
                                            <div className='d-flex flex-wrap gap-1 justify-content-center'>
                                                {category.subcategories.slice(0, 3).map((sub, idx) => (
                                                    <span key={idx} className='badge bg-secondary'>
                                                        {sub.name}
                                                    </span>
                                                ))}
                                                {category.subcategories.length > 3 && (
                                                    <span className='badge bg-secondary'>
                                                        +{category.subcategories.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Products for Selected Category */}
            {selectedCategory && (
                <div>
                    <h3 className='mb-3'>
                        Products in {selectedCategory}
                        {selectedSubcategory && ` > ${selectedSubcategory}`}
                    </h3>
                    {isLoading ? (
                        <p>Loading products...</p>
                    ) : products.length === 0 ? (
                        <p>No products found in this category.</p>
                    ) : (
                        <div className='row'>
                            {products.map((product) => (
                                <ProductItem key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default CategoriesScreen;

