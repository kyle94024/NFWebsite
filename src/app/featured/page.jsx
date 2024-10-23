"use client";
import "./FeaturedArticlesPage.scss";
import ArticlesListPaginated from "@/components/ArticlesListPaginated/ArticlesListPaginated";
import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { withAuth } from "@/components/withAuth/withAuth";
import Footer from "@/components/Footer/Footer";
import { useState, useEffect } from "react";

const FeaturedArticles = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Fetching featured articles from API
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch("/api/articles/featured");
                if (!response.ok)
                    throw new Error("Failed to fetch featured articles");
                const data = await response.json();
                setArticles(data);
            } catch (error) {
                console.error("Error fetching featured articles:", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    return (
        <div className="featured-articles">
            <Navbar />
            <div className="featured-articles__content padding">
                <div className="boxed">
                    <Link
                        href="/"
                        className="flex items-center gap-2 font-bold"
                    >
                        <ArrowLeft />
                        <span> Back</span>
                    </Link>

                    {/* Pass loading and error to ArticlesListPaginated */}
                    <ArticlesListPaginated
                        articles={articles}
                        articlesPerPage={6}
                        loading={loading}
                        error={error}
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default withAuth(FeaturedArticles);
