"use client";
import React, { useState } from "react";
import "./LoginForm.scss";
import Navbar from "@/components/Navbar/Navbar";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log("Login submitted", { email, password });
    };

    return (
        <main className="login-page">
            <Navbar />
            <div className="login-page__body">
                <div className="login-form">
                    <h1 className="login-form__title">Login to your account</h1>
                    <form className="login-form__form" onSubmit={handleSubmit}>
                        <div className="login-form__input-group">
                            <label
                                htmlFor="email"
                                className="login-form__label"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="login-form__input"
                                placeholder="Enter Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="login-form__input-group">
                            <label
                                htmlFor="password"
                                className="login-form__label"
                            >
                                Password
                            </label>
                            <div className="login-form__password-input">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    className="login-form__input"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />
                                <button
                                    type="button"
                                    className="login-form__password-toggle"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? <Eye /> : <EyeOff />}
                                </button>
                            </div>
                        </div>
                        <a
                            href="#forgot-password"
                            className="login-form__forgot-password"
                        >
                            Forgot password?
                        </a>
                        <button type="submit" className="login-form__submit">
                            Login
                        </button>
                    </form>
                    <p className="login-form__signup">
                        Don't have an account?{" "}
                        <a href="#signup" className="login-form__signup-link">
                            Signup here
                        </a>
                    </p>
                </div>
            </div>
        </main>
    );
}
