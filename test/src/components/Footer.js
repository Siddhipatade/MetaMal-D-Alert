import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
export default function Footer() {
    return (
        <div>
            <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
                <div className="col-md-4 d-flex align-items-center">
                    <Link to="/" className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
                        {/* Add your logo or icon here */ }
                    </Link>
                    <span className="text-muted">© 2024 METAMAL-D-ALERT, Inc</span>
                </div>
                <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
                    <li className="ms-3">
                        <Link to="/privacy-policy" className="text-muted">Privacy Policy</Link>
                    </li>
                    <li className="ms-3">
                        <Link to="/terms-of-service" className="text-muted">Terms of Service</Link>
                    </li>
                    <li className="ms-3">
                        <Link to="/contact" className="text-muted">Contact</Link>
                    </li>
                </ul>
            </footer>
        </div>
    );
}