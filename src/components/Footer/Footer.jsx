import React from "react";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import "./Footer.scss";
import Image from "next/image";

import brandlogo from "../../assets/navbrand.png";

const Footer = () => {
    return (
        <footer className="footer padding">
            <div className=" boxed">
                <div className="footer__content">
                    <div className="footer__branding">
                        <Image
                            src={brandlogo}
                            alt="logo"
                            className="footer__logo"
                        />
                        <p className="footer__description">
                            Provide accessible, up-to-date, and comprehensive
                            information about Neurofibromatosis (NF) to
                            patients, families, and caregivers. We aim to
                            empower those affected by NF with the knowledge and
                            resources they need to navigate their journey.
                        </p>
                        <div className="footer__social">
                            <a href="#" className="footer__social-link">
                                <Facebook className="footer__social-icon" />
                            </a>
                            <a href="#" className="footer__social-link">
                                <Instagram className="footer__social-icon" />
                            </a>
                            <a href="#" className="footer__social-link">
                                <Twitter className="footer__social-icon" />
                            </a>
                            <a href="#" className="footer__social-link">
                                <Linkedin className="footer__social-icon" />
                            </a>
                        </div>
                    </div>

                    <div className="footer__links">
                        <div className="footer__links-column">
                            <h3 className="footer__links-title">Main Links</h3>
                            <ul className="footer__links-list">
                                <li className="footer__links-item">
                                    <a href="#" className="footer__link">
                                        Home
                                    </a>
                                </li>
                                <li className="footer__links-item">
                                    <a href="#" className="footer__link">
                                        Articles
                                    </a>
                                </li>
                                <li className="footer__links-item">
                                    <a href="#" className="footer__link">
                                        Contact Us
                                    </a>
                                </li>
                                <li className="footer__links-item">
                                    <a href="#" className="footer__link">
                                        About Us
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="footer__links-column">
                            <h3 className="footer__links-title">Support</h3>
                            <ul className="footer__links-list">
                                <li className="footer__links-item">
                                    <a href="#" className="footer__link">
                                        Privacy Policy
                                    </a>
                                </li>
                                <li className="footer__links-item">
                                    <a href="#" className="footer__link">
                                        FAQ
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
