"use client"; // Ensure this is a client-side component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/app/loading";

export const withAuth = (WrappedComponent) => {
    return function WithAuth(props) {
        const router = useRouter();
        const [authenticated, setAuthenticated] = useState(false);
        const [loading, setLoading] = useState(true); // Loading state

        useEffect(() => {
            if (typeof window !== "undefined") {
                const checkAuth = async () => {
                    try {
                        const response = await fetch("/api/auth/session");
                        if (response.ok) {
                            const user = await response.json();
                            if (user.isLoggedIn) {
                                setAuthenticated(true); // User is authenticated
                            } else {
                                router.push("/login"); // Redirect if not logged in
                            }
                        } else {
                            router.push("/login"); // Redirect if API check fails
                        }
                    } catch (error) {
                        router.push("/login"); // Redirect on error
                    } finally {
                        setLoading(false); // Done loading
                    }
                };
                checkAuth();
            }
        }, [router]);

        if (loading) {
            return <Loader />;
        }

        if (!authenticated) {
            return null; // Avoid rendering the wrapped component until authentication is confirmed
        }

        return <WrappedComponent {...props} />;
    };
};
