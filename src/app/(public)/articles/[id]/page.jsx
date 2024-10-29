"use client";
import "./ArticlePage.scss";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import SectionLoader from "@/components/SectionLoader/SectionLoader";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const ArticlePage = ({ params }) => {
    const router = useRouter();
    const { id } = params;
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await fetch(`/api/articles/${id}`);

                if (!response.ok) {
                    throw new Error("Error fetching article");
                }

                const data = await response.json();
                console.log(data);
                setArticle(data);
            } catch (err) {
                setError(err.message);
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

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
            console.error("Error deleting article:", error);
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
                            <h1 className="article-page__title heading-tertiary">
                                {article.title}
                            </h1>
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
                            <div className="article-page__meta">
                                <p className="article-page__id">
                                    Article ID: {article.id}
                                </p>
                                {article.publisher && (
                                    <p className="article-page__publisher">
                                        Publisher: {article.publisher}
                                    </p>
                                )}
                                {article.certifiedby && (
                                    <p className="article-page__certified">
                                        Certified by: {article.certifiedby}
                                    </p>
                                )}
                            </div>
                            <div className="article-page__tags">
                                {article.tags && article.tags.length > 0 ? (
                                    article.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="article-page__tag"
                                        >
                                            {tag}
                                        </span>
                                    ))
                                ) : (
                                    <span className="article-page__no-tags">
                                        No tags
                                    </span>
                                )}
                            </div>

                            <div className="article-page__summary">
                                <h2 className="article-page__summary-title">
                                    Summary
                                </h2>
                                <p>{article.summary}</p>
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
