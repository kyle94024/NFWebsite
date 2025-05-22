"use client";
import React, { useEffect, useState } from "react";
import "./ArticlePage.scss";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import SectionLoader from "@/components/SectionLoader/SectionLoader";
import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import { HeartFilledIcon } from "@radix-ui/react-icons";

import { format } from "date-fns";

const ArticlePage = ({ params }) => {
    const router = useRouter();
    const { id } = params;
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Like state
    const [isLiked, setIsLiked] = useState(false);
    const [liking, setLiking] = useState(false);

    const { isAdmin, user } = useAuthStore(); // Access user and admin state from Zustand
    const { email, userId, name } = user || {};

    // Fetch the like status for the article
    const fetchLikeStatus = async () => {
        if (!userId) return;
        try {
            const res = await fetch(
                `/api/articles/${id}/like?userId=${userId}`,
                {
                    method: "GET",
                }
            );
            const { success, data, message } = await res.json();
            if (!success) throw new Error(message);
            setIsLiked(data.isLiked || false);
        } catch (e) {
            console.error("Error fetching like status:", e);
        }
    };

    // Toggle like/unlike with optimistic update
    const toggleLikeArticle = async () => {
        if (!userId) {
            toast.info("Please log in to like articles.");
            return;
        }

        // Store previous state for rollback
        const prevIsLiked = isLiked;
        const prevLikeCount = Number(article?.like_count || 0); // Ensure number

        // Optimistic update
        setLiking(true);
        setIsLiked(!isLiked);
        setArticle((prev) => ({
            ...prev,
            like_count: prevIsLiked
                ? Number(prev.like_count) - 1
                : Number(prev.like_count) + 1, // Ensure numeric operation
        }));

        try {
            const method = prevIsLiked ? "DELETE" : "POST";
            const res = await fetch(`/api/articles/${id}/like`, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });

            const { success, message } = await res.json();
            if (!success) throw new Error(message);

            // Optionally refetch article to sync with server
            const response = await fetch(`/api/articles/${id}`);
            const updatedArticle = await response.json();
            setArticle(updatedArticle);

            toast.success(prevIsLiked ? "Article unliked!" : "Article liked!");
        } catch (e) {
            // Revert optimistic update on error
            setIsLiked(prevIsLiked);
            setArticle((prev) => ({
                ...prev,
                like_count: prevLikeCount,
            }));
            toast.error(e.message || "Action failed");
        } finally {
            setLiking(false);
        }
    };

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await fetch(`/api/articles/${id}`);
                if (!response.ok) throw new Error("Error fetching article");

                const data = await response.json();
                // Ensure like_count is a number
                setArticle({ ...data, like_count: Number(data.like_count) });
            } catch (err) {
                setError(err.message);
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
        if (userId) fetchLikeStatus(); // Fetch like status when user is logged in
    }, [id, userId]);

    const handleDelete = async () => {
        setDeleting(true);
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
            toast.error("Error deleting article");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="article-page">
            <Navbar />
            <ToastContainer />
            <div className="article-page__content padding">
                <div className="boxed">
                    {loading ? (
                        <div className="article-page__loader">
                            <SectionLoader />
                        </div>
                    ) : error ? (
                        <div className="article-page__error">{error}</div>
                    ) : (
                        <article className="article-page__article">
                            <div className="flex flex-col gap-16">
                                <div className="article-page__article-details">
                                    <h1 className="article-page__title heading-tertiary">
                                        {article.title}
                                    </h1>
                                    <div className="flex items-center justify-start w-full gap-2 mb-8">
                                        <h3 className="text-xl font-semibold text-gray-500 w-700">
                                            Published On:
                                        </h3>
                                        <p className="text-2xl font-bold text-gray-600">
                                            {article.publication_date
                                                ? format(
                                                      new Date(
                                                          article.publication_date
                                                      ),
                                                      "MMMM d, yyyy"
                                                  )
                                                : "N/A"}
                                        </p>
                                    </div>
                                    <div className="flex">
                                        <div className="article-page__meta hidden">
                                            <h3 className="body-lg w-700">
                                                Edited By:
                                            </h3>
                                            {article.photo && (
                                                <div className="article-page__photo">
                                                    <Image
                                                        src={article.photo}
                                                        alt={article.name}
                                                        width={50}
                                                        height={50}
                                                        objectFit="cover"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div className="article-page__meta__description">
                                                <div className="flex items-center gap-[10px]">
                                                    {article.name && (
                                                        <p className="article-page__name">
                                                            {article.name},
                                                        </p>
                                                    )}
                                                    {article.degree && (
                                                        <p className="article-page__degree">
                                                            {article.degree}
                                                        </p>
                                                    )}
                                                </div>
                                                {article.university && (
                                                    <p className="article-page__university">
                                                        {article.university}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="md:ml-auto flex items-center space-x-2">
                                            {user &&
                                                (liking ? (
                                                    <Loader2 className="h-10 w-10 animate-spin" />
                                                ) : isLiked ? (
                                                    <HeartFilledIcon
                                                        className="article-page__heart-filled cursor-pointer w-10 h-10"
                                                        color="red"
                                                        onClick={
                                                            toggleLikeArticle
                                                        }
                                                        aria-label="Unlike article"
                                                    />
                                                ) : (
                                                    <Heart
                                                        className="article-page__heart cursor-pointer w-10 h-10"
                                                        onClick={
                                                            toggleLikeArticle
                                                        }
                                                        aria-label="Like article"
                                                    />
                                                ))}
                                            {/* <span className="text-gray-600 text-2xl">
                                                {Number(article?.like_count) ||
                                                    0}
                                            </span> */}
                                        </div>
                                    </div>
                                    {article.image_url && (
                                        <Image
                                            className="article-page__image"
                                            src={article.image_url}
                                            alt={article.title}
                                            width={420}
                                            height={290}
                                            objectFit="contain"
                                            objectPosition="center"
                                            loading="lazy"
                                        />
                                    )}
                                    <div className="article-page__tags">
                                        {article.tags &&
                                        article.tags.length > 0 ? (
                                            article.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="article-page__tag"
                                                >
                                                    {tag}
                                                </span>
                                            ))
                                        ) : (
                                            <div></div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="article-page__summary">
                                <h2 className="article-page__summary-title w-700">
                                    Summary
                                </h2>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: article.summary,
                                    }}
                                ></div>
                            </div>
                            <div
                                className="article-page__content-text"
                                dangerouslySetInnerHTML={{
                                    __html: article.innertext,
                                }}
                            ></div>
                            <div className="article-page__actions">
                                {article.article_link && (
                                    <Link
                                        href={article.article_link}
                                        className="btn btn-primary-green"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Read original article
                                    </Link>
                                )}
                                {isAdmin && (
                                    <>
                                        <Link
                                            href={`/articles/edit/${article.id}`}
                                            className="btn btn-primary"
                                            rel="noopener noreferrer"
                                        >
                                            Edit Article
                                        </Link>
                                        <Button
                                            type="button"
                                            className="btn btn-primary-red"
                                            onClick={handleDelete}
                                            disabled={deleting}
                                        >
                                            {deleting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                                                    Deleting...
                                                </>
                                            ) : (
                                                "Delete"
                                            )}
                                        </Button>
                                    </>
                                )}
                            </div>
                        </article>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ArticlePage;
