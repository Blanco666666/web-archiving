import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'; // Import social media icons
import '../main.css';

const Footer = () => {
    return (
        <footer className="footer bg-dark text-white py-5">
            <div className="container">
                <div className="row">
                    {/* Footer Links */}
                    <div className="col-md-6">
                        <h5>About Thesis Archiving System</h5>
                        <p>
                            Providing seamless thesis management and archiving for academic institutions, empowering students and educators with efficient and secure data management.
                        </p>
                    </div>

                    {/* Social Media Links */}
                    <div className="col-md-6 text-md-end text-center">
                        <h5>Follow Us</h5>
                        <div className="social-icons">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                <FaFacebook size={32} className="mx-2" />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                <FaTwitter size={32} className="mx-2" />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                <FaInstagram size={32} className="mx-2" />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                                <FaLinkedin size={32} className="mx-2" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom Text */}
                <div className="text-center mt-4">
                    <p>© 2024 Thesis Archiving System. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
