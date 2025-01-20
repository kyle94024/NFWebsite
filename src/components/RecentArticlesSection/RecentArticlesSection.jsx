"use client";
import { useEffect, useState } from "react";
import ArticlesSection from "../ArticlesSection/ArticlesSection";

const RecentArticlesSection = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch("/api/articles/recent");
                if (!response.ok) throw new Error("Failed to fetch articles");
                const data = await response.json();
                setArticles(data.slice(0, 3)); // Show only the first 3 articles
                setError(false); // Reset error if the fetch is successful
            } catch (error) {
                console.error("Error fetching articles:", error);
                setError(true); // Set error state if fetch fails
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    return (
        <ArticlesSection
            articles={articles}
            loading={loading}
            error={error}
            sectionTitle={"Recent Articles"}
        />
    );
};

export default RecentArticlesSection;
