// hooks/useAuth.js
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore"; // Adjust the import path as necessary

export function useAuth() {
    const router = useRouter();
    const { setUser, clearUser } = useAuthStore(); // Access Zustand store functions
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("/api/auth/session"); // Update the API endpoint
                if (response.ok) {
                    const user = await response.json();
                    if (user.isLoggedIn) {
                        setUser(user); // Store user data in Zustand if authenticated
                    } else {
                        clearUser(); // Clear user if not authenticated
                    }
                } else {
                    clearUser(); // Clear user on error
                }
            } catch (error) {
                clearUser(); // Clear user on error
            } finally {
                setLoading(false); // Done loading
            }
        };

        checkAuth();
    }, [setUser, clearUser]);

    const login = async (data) => {
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            const result = await response.json();
            setUser(result.user); // Store user data in Zustand
            // router.push("/add-article"); // Redirect after login
            return result;
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };

    const logout = async () => {
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Logout failed");
            }

            clearUser(); // Clear user from Zustand
            router.push("/"); // Redirect after logout
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return { loading, login, logout, error };
}
