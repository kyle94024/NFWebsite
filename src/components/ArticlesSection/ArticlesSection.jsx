import "./ArticlesSection.scss";
import ArticleCard from "../ArticleCard/ArticleCard";
import { ArticleCardSkeleton } from "../ArticleCardSkeleton/ArticleCardSkeleton";
import { Unplug } from "lucide-react";

const ArticlesSection = ({ articles, loading, error, sectionTitle }) => {
    return (
        <section className="articles-section padding">
            <div className="boxed">
                <h2 className="heading-tertiary">{sectionTitle}</h2>
                {loading ? (
                    <div className="articles-section__list">
                        {/* Render 3 skeletons while loading */}
                        {[...Array(3)].map((_, index) => (
                            <ArticleCardSkeleton key={index} />
                        ))}
                    </div>
                ) : error ? (
                    <div className="articles-section__error">
                        <Unplug className="articles-section__error__icon" />
                        <p className="body-large">
                            Something went wrong. Please try again later.
                        </p>
                    </div>
                ) : (
                    <div className="articles-section__list">
                        {articles.map((article) => {
                            let authorName = "Anonymous"; // Default value
                            try {
                                const publisherData =
                                    typeof article.publisher === "string"
                                        ? JSON.parse(article.publisher)
                                        : article.publisher;

                                authorName = publisherData.name; // Get the name from the parsed object
                            } catch (err) {
                                console.error("Error parsing publisher:", err);
                            }

                            return (
                                <ArticleCard
                                    id={article.id}
                                    key={article.title}
                                    imageUrl={article.image_url}
                                    date={article.date}
                                    title={article.title}
                                    summary={article.summary}
                                    authorImageUrl={article.authorImageUrl}
                                    authorName={authorName} // Pass the author's name
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ArticlesSection;
