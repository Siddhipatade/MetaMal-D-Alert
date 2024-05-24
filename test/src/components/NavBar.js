import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import logo from './blahh.png'; // Adjust the path based on where you placed your logo

export default function NavBar() {
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Color change functionality is removed since it's not being used
    }, 11000);
    return () => clearInterval(intervalId);
  }, []);

  const navbarStyle = {
    backgroundColor: '#089289', // Updated to match the border color of the scan button
    fontSize: '1.1rem', // Increase font size
    height: '90px', // Increase height
    padding: '0 20px', // Add padding for better spacing
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark" style={ navbarStyle }>
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src={ logo } alt="logo" className="logo-img" />

          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active fs-4" aria-current="page" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fs-4" to="/login">Login</Link>
              </li>
            </ul>
            <form className="d-flex">
              <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
              <button className="btn btn-outline-light search-button" type="submit">
                <i className="fas fa-search search-icon"></i>
              </button>
            </form>
          </div>
        </div>
      </nav>
    </div>
  );
}
