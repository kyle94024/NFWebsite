"use client";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/useAuthStore"; // Adjust the import path as necessary
import { useAuth } from "@/hooks/useAuth"; // Adjust the import path as necessary
import "./Navbar.scss";
import Link from "next/link";
import navbrand from "../../assets/navbrand.png";
import Image from "next/image";
import { Menu, X, ArrowRight } from "lucide-react";

function Navbar() {
    const [navbar, setNavbar] = useState(false);
    const { user, isAdmin } = useAuthStore(); // Access user and admin state from Zustand
    const { logout } = useAuth();
    const toggleNavbar = () => setNavbar(!navbar);

    // Define the navigation links based on authentication and admin status
    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Articles", path: "/articles" },
        { name: "About", path: "/about" },
        { name: "Contact Us", path: "/contact" },
        ...(isAdmin
            ? [
                  { name: "Add Articles", path: "/add-article" },
                  { name: "Pending Articles", path: "/pending-articles" },
                  { name: "Featured", path: "/featured" },
              ]
            : []), // Show Add Articles, Pending Articles, and Featured links only if the user is an admin
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
                                <Link
                                    href={link.path}
                                    className="nav-link"
                                    key={link.name}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                        <div className="header-right">
                            {!user ? ( // Show login/signup if not authenticated
                                <>
                                    <Link
                                        href="/login"
                                        rel="noopener noreferrer"
                                        className="btn"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/signup"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            ) : (
                                <button
                                    className="btn btn-outlined"
                                    onClick={() => logout()}
                                >
                                    Logout
                                </button> // Add logout functionality
                            )}
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
                            <Link
                                href={link.path}
                                className="nav-link"
                                key={link.name}
                                onClick={toggleNavbar}
                            >
                                {link.name}
                            </Link>
                        ))}
                        {!user ? ( // Show login/signup if not authenticated
                            <>
                                <Link
                                    href="/login"
                                    className="btn btn-primary"
                                    rel="noopener noreferrer"
                                    onClick={toggleNavbar}
                                >
                                    <span className="text">Login</span>
                                    <ArrowRight className="icon" />
                                </Link>
                                <Link
                                    href="/signup"
                                    className="btn btn-primary"
                                    rel="noopener noreferrer"
                                    onClick={toggleNavbar}
                                >
                                    Sign Up
                                </Link>
                            </>
                        ) : (
                            <Link
                                href="/logout"
                                className="btn btn-primary"
                                onClick={() => clearUser()}
                            >
                                Logout
                            </Link> // Add logout functionality
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
