// hooks/useAuth.js
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";

export function useAuth() {
    const router = useRouter();
    const { setUser, clearUser } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true); // Start loading at the beginning of the function
            try {
                const response = await fetch("/api/auth/session");
                if (response.ok) {
                    const user = await response.json();
                    if (user.isLoggedIn) {
                        setUser({
                            email: user.email,
                            userId: user.userId,
                            name: user.name,
                            isAdmin: user.isAdmin,
                            role: user.role,
                        }); // Pass complete user data
                    } else {
                        clearUser();
                    }
                } else {
                    clearUser();
                }
            } catch (error) {
                console.error("Error checking session:", error);
                clearUser();
            } finally {
                setLoading(false); // End loading
            }
        };

        checkAuth();
    }, [setUser, clearUser]);

    const login = async (data) => {
        setLoading(true); // Start loading during login
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message);
            }

            const result = await response.json();
            setUser(result.user); // Store user data in Zustand
            return result;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false); // End loading
        }
    };

    const logout = async () => {
        setLoading(true); // Start loading during logout
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Logout failed");
            }

            clearUser();
            router.push("/"); // Redirect after logout
        } catch (error) {
            console.error("Error during logout:", error);
        } finally {
            setLoading(false); // End loading
        }
    };

    return { loading, login, logout, error };
}
