"use client";
import "./RecentArticlesSection.scss";
import ArticleCard from "../ArticleCard/ArticleCard";
import { useEffect, useState } from "react";
import { ArticleCardSkeleton } from "../ArticleCardSkeleton/ArticleCardSkeleton";
import { Unplug } from "lucide-react";

const RecentArticlesSection = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false); // Added error state

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
        <section className="recent-articles padding">
            <div className="boxed">
                <h2 className="heading-tertiary">Recent Articles</h2>
                {loading ? (
                    <div className="recent-articles__list">
                        {/* Render 3 skeletons while loading */}
                        {[...Array(3)].map((_, index) => (
                            <ArticleCardSkeleton key={index} />
                        ))}
                    </div>
                ) : error ? (
                    <div className="recent-articles__error">
                        <Unplug className="recent-articles__error__icon" />
                        <p className="body-large">
                            Something went wrong. Please try again later.
                        </p>
                    </div>
                ) : (
                    <div className="recent-articles__list">
                        {console.log(articles[0])}{" "}
                        {articles.map((article) => (
                            <ArticleCard
                                id={article.id}
                                key={article.title}
                                imageUrl={article.image_url}
                                date={article.date}
                                title={article.title}
                                summary={article.summary}
                                authorImageUrl={article.authorImageUrl}
                                authorName={article.publisher}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default RecentArticlesSection;
