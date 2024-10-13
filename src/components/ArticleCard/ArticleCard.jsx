import Image from "next/image";
import "./ArticleCard.scss"; // Regular SCSS import

function ArticleCard({
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
                    src={imageUrl}
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
                <h2 className="article-card__title">{title}</h2>
                <p className="article-card__summary">
                    {summary}
                    <a href="#" className="article-card__read-more">
                        {" "}
                        read more
                    </a>
                </p>
                <div className="article-card__author">
                    <Image
                        src={authorImageUrl}
                        alt={`${authorName}'s profile picture`}
                        className="article-card__author-image"
                        width={42}
                        height={42}
                        objectFit="contain"
                        objectPosition="center"
                        loading="lazy"
                    />
                    <span className="article-card__author-name">
                        {authorName}
                    </span>
                </div>
            </div>
        </article>
    );
}

export default ArticleCard;
