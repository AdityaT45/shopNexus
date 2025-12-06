// client/src/component/CategoryNavigation.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

function CategoryNavigation() {
    const navigate = useNavigate();
    const { categories } = useContext(AppContext);

    // Filter only active categories
    const activeCategories = categories?.filter(cat => cat.isActive) || [];

    const handleCategoryClick = (categoryName) => {
        navigate(`/dashboard?category=${encodeURIComponent(categoryName)}`);
        window.location.reload();
    };

    if (activeCategories.length === 0) {
        return null;
    }

    return (
        <nav className='navbar navbar-expand-lg navbar-light bg-white border-bottom'>
            <div className='container'>
                <div className='navbar-nav flex-row flex-wrap'>
                    {activeCategories.map((category) => (
                        <button
                            key={category._id}
                            className='nav-link text-dark me-3 py-2'
                            onClick={() => handleCategoryClick(category.name)}
                            style={{ 
                                border: 'none', 
                                background: 'none',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {category.name}
                            {category.subcategories && category.subcategories.length > 0 && (
                                <i className='fas fa-chevron-down ms-1 small'></i>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
}

export default CategoryNavigation;

