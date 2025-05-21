import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react"; // Using default icons as filled versions may not exist
import "./Footer.scss";
import Image from "next/image";
import brandlogo from "../../assets/navbrand.png";

const Footer = () => {
    return (
        <footer className="footer padding">
            <div className="boxed">
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
                            <Link href="#" className="footer__social-link">
                                <Facebook className="footer__social-icon" />
                            </Link>
                            <Link href="#" className="footer__social-link">
                                <Instagram className="footer__social-icon" />
                            </Link>
                            <Link href="#" className="footer__social-link">
                                <Twitter className="footer__social-icon" />
                            </Link>
                            <Link href="#" className="footer__social-link">
                                <Linkedin className="footer__social-icon" />
                            </Link>
                        </div>
                    </div>

                    <div className="footer__links">
                        <div className="footer__links-column">
                            <h3 className="footer__links-title">Main Links</h3>
                            <ul className="footer__links-list">
                                <li className="footer__links-item">
                                    <Link href="/" className="footer__link">
                                        Home
                                    </Link>
                                </li>
                                <li className="footer__links-item">
                                    <Link
                                        href="/articles"
                                        className="footer__link"
                                    >
                                        Articles
                                    </Link>
                                </li>
                                <li className="footer__links-item">
                                    <Link
                                        href="/contact"
                                        className="footer__link"
                                    >
                                        Contact Us
                                    </Link>
                                </li>
                                <li className="footer__links-item">
                                    <Link
                                        href="/about"
                                        className="footer__link"
                                    >
                                        About Us
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="footer__links-column">
                            <h3 className="footer__links-title">Support</h3>
                            <ul className="footer__links-list">
                                <li className="footer__links-item">
                                    <Link
                                        href="https://www.scisimplified.org/scisimplified-terms-of-use"
                                        className="footer__link"
                                    >
                                        Terms of Service
                                    </Link>
                                </li>
                                <li className="footer__links-item">
                                    <Link
                                        href="/privacy-policy"
                                        className="footer__link"
                                    >
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li className="footer__links-item">
                                    <Link href="/faq" className="footer__link">
                                        FAQ
                                    </Link>
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
