"use client";

import { useState } from "react";
import "./Navbar.scss";
import Link from "next/link";
import navbrand from "../../assets/navbrand.png";
import Image from "next/image";
import { Menu, X, ArrowRight } from "lucide-react"; // Importing Lucide React icons

function Navbar() {
    const [navbar, setNavbar] = useState(false);

    const toggleNavbar = () => {
        setNavbar(!navbar);
    };

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Articles", path: "/articles" },
        { name: "About", path: "/about" },
        { name: "Contact Us", path: "/contact" },
    ];

    return (
        <div className="navbar">
            <header className="padding">
                <div className="boxed">
                    <div className="header-content">
                        <Link className="navbrand" href="/">
                            <Image
                                src={navbrand}
                                alt="Logo"
                                className="navbrand-img"
                            />
                        </Link>
                        <div className="header-left">
                            {navLinks.map((link) => (
                                <a
                                    href={link.path}
                                    className="nav-link"
                                    key={link.name}
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                        <div className="header-right">
                            <a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn"
                            >
                                Login
                            </a>
                            <a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                            >
                                Sign Up
                            </a>
                        </div>
                        <div className="header-right-mob">
                            <div className="open-header" onClick={toggleNavbar}>
                                <Menu className="icon-menu" size={25} />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div
                className="header-mob padding"
                style={{ display: navbar ? "block" : "none" }}
            >
                <div className="box">
                    <div className="header-mob-head padding">
                        <Link className="navbrand" href="/">
                            <Image
                                src={navbrand}
                                alt="Logo"
                                className="navbrand-img"
                            />
                            <p className="navbrand-text">Luuped</p>
                        </Link>
                        <div className="header-mob-head-right">
                            <div
                                className="close-header"
                                onClick={toggleNavbar}
                            >
                                <X className="close-icon" size={25} />
                            </div>
                        </div>
                    </div>
                    <div className="header-mob-body">
                        {navLinks.map((link) => (
                            <a
                                href="/"
                                className="nav-link"
                                key={link.name}
                                onClick={toggleNavbar}
                            >
                                {link.name}
                            </a>
                        ))}
                        <a
                            href="https://portal.v.ink/account/login"
                            className="btn btn-primary"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={toggleNavbar}
                        >
                            <span className="text">Login</span>
                            <ArrowRight className="icon" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
