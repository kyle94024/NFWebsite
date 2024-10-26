"use client";

import "./ReviewArticlePage.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import EditArticleForm from "@/components/EditArticleForm/EditArticleForm";
import Loader from "@/app/loading";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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
            toast.success("Changes saved!");
            router.push(`/pending-articles/${id}`);
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
                    body: JSON.stringify({ id }),
                }
            );
            if (!response.ok) throw new Error("Failed to publish article");
            toast.success("Article published!");
            router.push(`/articles/${id}`);
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

    const isAnyActionLoading = Object.values(loadingStates).some(
        (state) => state
    );

    return (
        <div className="review-article">
            <Navbar />
            <div className="review-article__content padding">
                <div className="boxed">
                    {error ? (
                        <p>Error: {error}</p>
                    ) : isLoading ? (
                        <Loader />
                    ) : article ? (
                        <>
                            <EditArticleForm
                                articleData={article}
                                onSaveEdits={handleSaveEdits}
                                onPublish={handlePublish}
                                onDelete={handleDelete}
                            />
                            <div className="edit-article-form__actions">
                                <Button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() =>
                                        handleSaveEdits({
                                            title: article.title,
                                            tags: article.tags,
                                            innertext: article.innertext,
                                            summary: article.summary,
                                            article_link: article.article_link,
                                        })
                                    }
                                    disabled={isAnyActionLoading}
                                >
                                    {loadingStates.saving ? (
                                        <>
                                            <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Edits"
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    className="btn btn-primary-green"
                                    onClick={handlePublish}
                                    disabled={isAnyActionLoading}
                                >
                                    {loadingStates.publishing ? (
                                        <>
                                            <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                                            Publishing...
                                        </>
                                    ) : (
                                        "Publish"
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    className="btn btn-primary-red"
                                    onClick={handleDelete}
                                    disabled={isAnyActionLoading}
                                >
                                    {loadingStates.deleting ? (
                                        <>
                                            <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        "Delete"
                                    )}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <Loader />
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ReviewArticle;
