// client/src/component/Footer.jsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

function Footer() {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        fetchFooterSections();
    }, []);

    const fetchFooterSections = async () => {
        try {
            const response = await axios.get('/api/footer/public');
            setSections(response.data || []);
        } catch (error) {
            console.error('Failed to fetch footer sections:', error);
            setSections([]);
        } finally {
            setLoading(false);
        }
    };

    // Don't show footer on login/register pages or admin pages
    const hideFooter = location.pathname === '/login' || 
                      location.pathname === '/register' || 
                      location.pathname.startsWith('/admin') ||
                      location.pathname.startsWith('/superadmin');

    if (hideFooter || loading || sections.length === 0) {
        return null;
    }

    return (
        <footer className="bg-dark text-white mt-5 py-4">
            <div className="container-fluid">
                <div className="row">
                    {sections.map((section) => (
                        <div key={section._id} className="col-md-3 col-sm-6 mb-4 mb-md-0">
                            <h5 className="mb-3">{section.title}</h5>
                            <ul className="list-unstyled">
                                {section.links && section.links.length > 0 ? (
                                    section.links.map((link, index) => (
                                        <li key={index} className="mb-2">
                                            {link.url.startsWith('http') ? (
                                                <a 
                                                    href={link.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-white-50 text-decoration-none d-flex align-items-center"
                                                >
                                                    {link.icon && <i className={`${link.icon} me-2`}></i>}
                                                    {link.text}
                                                </a>
                                            ) : (
                                                <Link 
                                                    to={link.url} 
                                                    className="text-white-50 text-decoration-none d-flex align-items-center"
                                                >
                                                    {link.icon && <i className={`${link.icon} me-2`}></i>}
                                                    {link.text}
                                                </Link>
                                            )}
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-white-50">No links available</li>
                                )}
                            </ul>
                        </div>
                    ))}
                </div>
                <hr className="my-4 bg-white-50" />
                <div className="row">
                    <div className="col-12 text-center">
                        <p className="mb-0 text-white-50">
                            &copy; {new Date().getFullYear()} ShopNexus. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

