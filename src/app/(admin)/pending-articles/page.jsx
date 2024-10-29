"use client";
import "./PendingArticlesPage.scss";
import ArticlesListPaginated from "@/components/ArticlesListPaginated/ArticlesListPaginated";
import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { withAuth } from "@/components/withAuth/withAuth";
import Footer from "@/components/Footer/Footer";
import { useState, useEffect } from "react";

const PendingArticles = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Fetching articles from API
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch("/api/articles/pending");
                if (!response.ok) throw new Error("Failed to fetch articles");
                const data = await response.json();
                setArticles(data);
            } catch (error) {
                console.error("Error fetching pending articles:", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    return (
        <div className="pending-articles">
            <Navbar />
            <div className="pending-articles__content padding">
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
                        pageType="pending"
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default withAuth(PendingArticles);
