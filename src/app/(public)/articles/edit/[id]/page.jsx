"use client";

import "./EditArticlePage.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import EditArticleForm from "@/components/EditArticleForm/EditArticleForm";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SectionLoader from "@/components/SectionLoader/SectionLoader";
import { withAuth } from "@/components/withAuth/withAuth";

const EditArticle = ({ params }) => {
    const { id } = params;
    const [article, setArticle] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [loadingStates, setLoadingStates] = useState({
        saving: false,
        publishing: false,
        deleting: false,
    });
    const router = useRouter();

    const fetchArticle = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/articles/${id}`);
            if (!response.ok) throw new Error("Failed to fetch article");
            const data = await response.json();
            setArticle(data);
        } catch (error) {
            console.error("Error fetching article:", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchArticle();
    }, [id]);

    const handleSaveEdits = async (updatedArticle) => {
        setLoadingStates((prev) => ({ ...prev, saving: true }));
        try {
            const response = await fetch(`/api/articles/actions/update`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, ...updatedArticle }),
            });
            if (!response.ok) throw new Error("Failed to save changes");

            toast.success("Changes saved!");
            router.push(`/articles/${id}`);
        } catch (error) {
            console.error("Error saving edits:", error);
            toast.error("Error saving changes");
        } finally {
            setLoadingStates((prev) => ({ ...prev, saving: false }));
        }
    };

    const handleRetract = async () => {
        setLoadingStates((prev) => ({ ...prev, publishing: true }));
        try {
            const response = await fetch(`/api/articles/actions/retract`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (!response.ok) throw new Error("Failed to retract article");

            toast.success("Article retracted!");
            router.push("/articles");
        } catch (error) {
            console.error("Error retracting article:", error);
            toast.error("Error retracting article");
        } finally {
            setLoadingStates((prev) => ({ ...prev, publishing: false }));
        }
    };

    const handleDelete = async () => {
        setLoadingStates((prev) => ({ ...prev, deleting: true }));
        try {
            const response = await fetch(`/api/articles/actions/delete`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (!response.ok) throw new Error("Failed to delete article");

            toast.success("Article deleted!");
            router.push("/articles");
        } catch (error) {
            console.error("Error deleting article:", error);
            toast.error("Error deleting article");
        } finally {
            setLoadingStates((prev) => ({ ...prev, deleting: false }));
        }
    };

    return (
        <div className="edit-article">
            <Navbar />
            <div className="edit-article__content padding">
                <div className="boxed">
                    {error ? (
                        <p>Error: {error}</p>
                    ) : isLoading ? (
                        <div className="edit-article__loading">
                            <SectionLoader />
                        </div>
                    ) : article ? (
                        <EditArticleForm
                            articleData={article}
                            onSaveEdits={handleSaveEdits}
                            onPublishOrRetract={handleRetract}
                            onDelete={handleDelete}
                            formType="edit"
                            loadingStates={loadingStates}
                        />
                    ) : (
                        <div className="edit-article__loading">
                            <SectionLoader />
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default withAuth(EditArticle);
