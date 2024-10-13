"use client";
import React, { useState } from "react";
import "./SignupForm.scss";
import Navbar from "@/components/Navbar/Navbar";
import { Eye, EyeOff } from "lucide-react";

export default function CreateAccountForm() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle account creation logic here
        console.log("Account creation submitted", formData);
    };

    const togglePasswordVisibility = (field) => {
        if (field === "password") {
            setShowPassword(!showPassword);
        } else {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    return (
        <main className="signup-page">
            <Navbar />
            <div className="signup-page__body">
                <div className="create-account">
                    <h1 className="create-account__title">Create Account</h1>
                    <form
                        className="create-account__form"
                        onSubmit={handleSubmit}
                    >
                        <div className="create-account__input-group create-account__input-group--half">
                            <div className="create-account__input-wrapper">
                                <label
                                    htmlFor="firstName"
                                    className="create-account__label"
                                >
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    className="create-account__input"
                                    placeholder="First Name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="create-account__input-wrapper">
                                <label
                                    htmlFor="lastName"
                                    className="create-account__label"
                                >
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    className="create-account__input"
                                    placeholder="Last Name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="create-account__input-group">
                            <label
                                htmlFor="email"
                                className="create-account__label"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="create-account__input"
                                placeholder="Enter Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="create-account__input-group">
                            <label
                                htmlFor="password"
                                className="create-account__label"
                            >
                                Password
                            </label>
                            <div className="create-account__password-input">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    className="create-account__input"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="create-account__password-toggle"
                                    onClick={() =>
                                        togglePasswordVisibility("password")
                                    }
                                >
                                    {showPassword ? <Eye /> : <EyeOff />}
                                </button>
                            </div>
                        </div>
                        <div className="create-account__input-group">
                            <label
                                htmlFor="confirmPassword"
                                className="create-account__label"
                            >
                                Confirm Password
                            </label>
                            <div className="create-account__password-input">
                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    className="create-account__input"
                                    placeholder="Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="create-account__password-toggle"
                                    onClick={() =>
                                        togglePasswordVisibility(
                                            "confirmPassword"
                                        )
                                    }
                                >
                                    {showConfirmPassword ? <Eye /> : <EyeOff />}
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="create-account__submit"
                        >
                            Create Account
                        </button>
                    </form>
                    <p className="create-account__login">
                        Already have an account?{" "}
                        <a href="#login" className="create-account__login-link">
                            Login Here
                        </a>
                    </p>
                </div>
            </div>
        </main>
    );
}
