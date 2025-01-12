"use client";
import "./AssignArticlesPage.scss";

import { withAuth } from "@/components/withAuth/withAuth";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar/Navbar";
import Image from "next/image";

const FallbackAuthorImage = ({ authorName }) => {
    const firstLetter = authorName ? authorName.charAt(0).toUpperCase() : "A";
    return (
        <div className="author-image__fallback">
            <p className="author-image__initial">{firstLetter}</p>
        </div>
    );
};

const AssignArticles = () => {
    const [pendingArticles, setPendingArticles] = useState([]);
    const [editors, setEditors] = useState([]);
    const [selectedArticles, setSelectedArticles] = useState([]);
    const [selectedEditors, setSelectedEditors] = useState([]);
    const [loadingArticles, setLoadingArticles] = useState(true);
    const [loadingEditors, setLoadingEditors] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPendingArticles();
        fetchEditors();
    }, []);

    const fetchPendingArticles = async () => {
        setLoadingArticles(true);
        try {
            const response = await fetch("/api/articles/pending");
            if (!response.ok) throw new Error("Failed to fetch articles");
            const data = await response.json();
            setPendingArticles(data);
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoadingArticles(false);
        }
    };

    const fetchEditors = async () => {
        setLoadingEditors(true);
        try {
            const response = await fetch("/api/editors");
            if (!response.ok) throw new Error("Failed to fetch editors");
            const data = await response.json();
            setEditors(data);
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoadingEditors(false);
        }
    };

    const handleArticleSelection = (articleId) => {
        setSelectedArticles((prev) =>
            prev.includes(articleId)
                ? prev.filter((id) => id !== articleId)
                : [...prev, articleId]
        );
    };

    const handleEditorSelection = (editorId) => {
        setSelectedEditors((prev) =>
            prev.includes(editorId)
                ? prev.filter((id) => id !== editorId)
                : [...prev, editorId]
        );
    };

    const handleAssignment = async () => {
        if (selectedArticles.length === 0 || selectedEditors.length === 0) {
            toast.error("Please select at least one article and one editor");
            return;
        }

        try {
            const response = await fetch("/api/articles/assign", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    editorIds: selectedEditors,
                    articleIds: selectedArticles,
                }),
            });

            if (response.ok) {
                toast.success("Articles assigned successfully!");
                setSelectedArticles([]);
                setSelectedEditors([]);
                fetchPendingArticles();
            } else {
                throw new Error("Failed to assign articles");
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <>
            <Navbar />
            <div className="assign-articles">
                <h1 className="assign-articles__title">Assign Articles</h1>

                <div className="assign-articles__grid">
                    {/* Pending Articles */}
                    <Card>
                        <CardHeader className="assign-articles__header">
                            <CardTitle>Pending Articles</CardTitle>
                            <CardTitle className="w-400 text-md">
                                Selected ({selectedArticles.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="assign-articles__content">
                            {loadingArticles ? (
                                Array(5)
                                    .fill(null)
                                    .map((_, index) => (
                                        <Skeleton
                                            key={index}
                                            className="assign-articles__skeleton"
                                        />
                                    ))
                            ) : pendingArticles.length > 0 ? (
                                pendingArticles.map((article) => (
                                    <div
                                        key={article.id}
                                        className="assign-articles__item"
                                    >
                                        <Checkbox
                                            className="assign-articles__checkbox"
                                            id={`article-${article.id}`}
                                            checked={selectedArticles.includes(
                                                article.id
                                            )}
                                            onCheckedChange={() =>
                                                handleArticleSelection(
                                                    article.id
                                                )
                                            }
                                        />
                                        <img
                                            src={article.image_url}
                                            alt={article.title}
                                            className="assign-articles__image"
                                        />
                                        <label
                                            htmlFor={`article-${article.id}`}
                                            className="assign-articles__label"
                                        >
                                            {article.title}
                                        </label>
                                    </div>
                                ))
                            ) : (
                                <p className="assign-articles__empty">
                                    No pending articles available.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Editors */}
                    <Card>
                        <CardHeader className="assign-articles__header">
                            <CardTitle>Editors</CardTitle>
                            <CardTitle className="w-400 text-md">
                                Selected ({selectedEditors.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="assign-articles__content">
                            {" "}
                            {loadingEditors ? (
                                Array(5)
                                    .fill(null)
                                    .map((_, index) => (
                                        <Skeleton
                                            key={index}
                                            className="assign-articles__skeleton"
                                        />
                                    ))
                            ) : editors.length > 0 ? (
                                editors.map((editor) => (
                                    <div
                                        key={editor.id}
                                        className="assign-articles__item"
                                    >
                                        <Checkbox
                                            className="assign-articles__checkbox"
                                            id={`editor-${editor.id}`}
                                            checked={selectedEditors.includes(
                                                editor.id
                                            )}
                                            onCheckedChange={() =>
                                                handleEditorSelection(editor.id)
                                            }
                                        />
                                        {editor.image ? (
                                            <Image
                                                src={editor.image}
                                                alt={`Author image for ${editor.name}`}
                                                className="author-image"
                                                width={50}
                                                height={50}
                                            />
                                        ) : (
                                            <FallbackAuthorImage
                                                authorName={editor.name}
                                            />
                                        )}
                                        <label
                                            htmlFor={`editor-${editor.id}`}
                                            className="assign-articles__label"
                                        >
                                            <span className="editor-name">
                                                {" "}
                                                {editor.name}
                                            </span>
                                            <span className="editor-email">
                                                {" "}
                                                {editor.email}
                                            </span>
                                        </label>
                                    </div>
                                ))
                            ) : (
                                <p className="assign-articles__empty">
                                    No editors available.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Button
                    onClick={handleAssignment}
                    className="btn btn-primary ml-auto"
                >
                    Assign Selected Articles to Editors
                </Button>
            </div>
        </>
    );
};

export default withAuth(AssignArticles);
