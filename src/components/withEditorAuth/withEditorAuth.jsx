import Loader from "@/app/loading";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const withEditorAuth = (WrappedComponent) => {
    return function WithEditorAuth(props) {
        const router = useRouter();
        const [authenticated, setAuthenticated] = useState(false);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const checkAuth = async () => {
                try {
                    const response = await fetch("/api/auth/session");
                    const user = await response.json();
                    if (user.isLoggedIn && user.role === "editor") {
                        setAuthenticated(true);
                    } else {
                        router.push("/login");
                    }
                } catch {
                    router.push("/login");
                } finally {
                    setLoading(false);
                }
            };
            checkAuth();
        }, []);

        if (loading) return <Loader />;
        if (!authenticated) return null;

        return <WrappedComponent {...props} />;
    };
};
