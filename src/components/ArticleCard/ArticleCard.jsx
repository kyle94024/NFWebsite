import Image from "next/image";
import "./ArticleCard.scss"; // Regular SCSS import

import articleThumbnailPlaceholder from "../../assets/article-thumbnail-placeholder.webp"; // Importing the placeholder image
import { User } from "lucide-react";

// Helper function to truncate text
const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + "...";
    }
    return text;
};

function ArticleCard({
    id,
    imageUrl,
    date,
    title,
    summary,
    authorImageUrl,
    authorName,
}) {
    return (
        <article className="article-card">
            <div className="article-card__image-container">
                <Image
                    // Use the placeholder image if imageUrl is not available
                    src={imageUrl || articleThumbnailPlaceholder}
                    alt={`Article image for ${title}`}
                    className="article-card__image"
                    layout="responsive"
                    width={420}
                    height={290} // aspect-ratio 1.46
                    objectFit="contain"
                    objectPosition="center"
                    loading="lazy"
                />
            </div>
            <div className="article-card__content">
                <time className="article-card__date">{date}</time>
                <h2 className="article-card__title">
                    {truncateText(title, 80)}{" "}
                    {/* Truncate title to 100 characters */}
                </h2>
                <p className="article-card__summary">
                    {truncateText(summary, 180)}{" "}
                    {/* Truncate summary to 200 characters */}
                    <a
                        href={`/articles/${id}`}
                        className="article-card__read-more"
                    >
                        {" "}
                        read more
                    </a>
                </p>
                <div className="article-card__author">
                    {authorImageUrl ? (
                        <Image
                            src={authorImageUrl || articleThumbnailPlaceholder}
                            alt={`Author image for ${authorName}`}
                            className="article-card__author-image"
                            width={50}
                            height={50}
                            objectFit="cover"
                            objectPosition="center"
                            loading="lazy"
                        />
                    ) : (
                        <User className="article-card__author-image" />
                    )}
                    <span className="article-card__author-name">
                        {authorName || "Anonymous"}
                    </span>
                </div>
            </div>
        </article>
    );
}

export default ArticleCard;
