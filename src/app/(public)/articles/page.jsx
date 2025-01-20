"use client";
import "./ArticleSearchPage.scss";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import SearchArticles from "@/components/SearchArticles/SearchArticles";
import ArticlesListPaginated from "@/components/ArticlesListPaginated/ArticlesListPaginated";
import Footer from "@/components/Footer/Footer";
import { Unplug } from "lucide-react";
import { ArticleCardSkeleton } from "@/components/ArticleCardSkeleton/ArticleCardSkeleton";
import useSearchStore from "@/store/useSearchStore"; // Import the Zustand store

const ArticleSearchPage = () => {
    const { searchQuery } = useSearchStore(); // Access the search query from Zustand
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch("/api/articles");
                if (!response.ok) throw new Error("Failed to fetch articles");
                const data = await response.json();
                setArticles(data);
            } catch (error) {
                console.error("Error fetching articles:", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    // Filter articles based on search query from Zustand
    const filteredArticles = articles.filter((article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="article-search-page">
            <Navbar />

            <div className="article-search-page__content padding">
                <div className="boxed">
                    <div className="max-w-[800px] mx-auto mt-10 mb-24">
                        <SearchArticles /> {/* No need to pass props now */}
                    </div>

                    {loading ? (
                        <div className="article-search-page__loading">
                            {[...Array(6)].map((_, index) => (
                                <ArticleCardSkeleton key={index} />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="article-search-page__error">
                            <Unplug className="article-search-page__error__icon" />
                            <p className="body-large">
                                Something went wrong. Please try again later.
                            </p>
                        </div>
                    ) : (
                        <ArticlesListPaginated
                            articles={filteredArticles}
                            articlesPerPage={6}
                        />
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ArticleSearchPage;
