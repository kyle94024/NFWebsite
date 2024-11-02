"use client";

import "./ReviewArticlePage.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import EditArticleForm from "@/components/EditArticleForm/EditArticleForm";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SectionLoader from "@/components/SectionLoader/SectionLoader";
import useAuthStore from "@/store/useAuthStore";

const ReviewArticle = ({ params }) => {
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

    const { user } = useAuthStore();

    const fetchArticle = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/articles/pending/${id}`);
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
            const response = await fetch(
                `/api/articles/pending/actions/update`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id, ...updatedArticle }),
                }
            );
            if (!response.ok) throw new Error("Failed to save changes");

            // Notify success and refetch article
            toast.success("Changes saved!");
            await fetchArticle(); // Fetch updated article data
        } catch (error) {
            console.error("Error saving edits:", error);
            toast.error("Error saving changes");
        } finally {
            setLoadingStates((prev) => ({ ...prev, saving: false }));
        }
    };

    const handlePublish = async () => {
        setLoadingStates((prev) => ({ ...prev, publishing: true }));
        try {
            const response = await fetch(
                `/api/articles/pending/actions/publish`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id, certifiedby: user }), // Use certifiedby field
                }
            );
            if (!response.ok) throw new Error("Failed to publish article");
            toast.success("Article published!");
            router.push("/pending-articles");
        } catch (error) {
            console.error("Error publishing article:", error);
            toast.error("Error publishing article");
        } finally {
            setLoadingStates((prev) => ({ ...prev, publishing: false }));
        }
    };

    const handleDelete = async () => {
        setLoadingStates((prev) => ({ ...prev, deleting: true }));
        try {
            const response = await fetch(
                `/api/articles/pending/actions/delete`,
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id }),
                }
            );
            if (!response.ok) throw new Error("Failed to delete article");
            toast.success("Article deleted!");
            router.push("/pending-articles");
        } catch (error) {
            console.error("Error deleting article:", error);
            toast.error("Error deleting article");
        } finally {
            setLoadingStates((prev) => ({ ...prev, deleting: false }));
        }
    };

    return (
        <div className="review-article">
            <Navbar />
            <div className="review-article__content padding">
                <div className="boxed">
                    {error ? (
                        <p>Error: {error}</p>
                    ) : isLoading ? (
                        <div className="review-article__loading">
                            <SectionLoader />
                        </div>
                    ) : article ? (
                        <EditArticleForm
                            articleData={article}
                            onSaveEdits={handleSaveEdits}
                            onPublishOrRetract={handlePublish}
                            onDelete={handleDelete}
                            loadingStates={loadingStates}
                            formType="review"
                        />
                    ) : (
                        <div className="review-article__loading">
                            <SectionLoader />
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ReviewArticle;
