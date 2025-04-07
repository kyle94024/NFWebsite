"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ArticlesListPaginated from "@/components/ArticlesListPaginated/ArticlesListPaginated";
import { Unplug } from "lucide-react";
import { ArticleCardSkeleton } from "@/components/ArticleCardSkeleton/ArticleCardSkeleton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthStore from "@/store/useAuthStore";
import "./LikedArticles.scss";

const LikedArticles = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const { user } = useAuthStore();
    const { userId } = user || {};

    const fetchLikedArticles = async () => {
        try {
            const response = await fetch(
                `/api/articles/liked?userId=${userId}`
            );
            if (!response.ok) {
                const { message } = await response.json();
                throw new Error(message);
            }
            const data = await response.json();
            setArticles(data);
        } catch (error) {
            console.error("Error fetching liked articles:", error);
            setError(true);
            toast.error(error.message || "Failed to fetch liked articles");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (typeof userId === "undefined") {
            setLoading(true); // Wait for userId to resolve
        } else if (userId) {
            fetchLikedArticles();
        } else {
            setLoading(false);
            setError(true);
            toast.info("Please log in to view liked articles.");
        }
    }, [userId]);

    return (
        <div className="liked-articles">
            <Navbar />
            <ToastContainer />
            <div className="liked-articles__content padding">
                <div className="boxed">
                    <h1 className="liked-articles__title heading-tertiary">
                        Your Liked Articles
                    </h1>
                    {loading ? (
                        <div className="liked-articles__loading">
                            {[...Array(6)].map((_, index) => (
                                <ArticleCardSkeleton key={index} />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="liked-articles__error">
                            <Unplug className="liked-articles__error__icon" />
                            <p className="body-large">
                                {userId
                                    ? "Something went wrong. Please try again later."
                                    : "Please log in to view your liked articles."}
                            </p>
                        </div>
                    ) : articles.length === 0 ? (
                        <div className="liked-articles__error">
                            <Unplug className="liked-articles__error__icon" />
                            <p className="body-large">
                                You haven’t liked any articles yet.
                            </p>
                        </div>
                    ) : (
                        <ArticlesListPaginated
                            articles={articles}
                            articlesPerPage={6}
                        />
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default LikedArticles;
