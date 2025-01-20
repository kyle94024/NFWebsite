"use client";
import "./AssignArticlesPage.scss";

import { withAuth } from "@/components/withAuth/withAuth";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "@/components/Navbar/Navbar";
import Image from "next/image";
import { Loader2 } from "lucide-react";

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

    const [assigningArticles, setAssigningArticles] = useState(false);

    useEffect(() => {
        fetchPendingArticles();
        fetchEditors();
    }, []);

    const fetchPendingArticles = async () => {
        setLoadingArticles(true);
        try {
            const response = await fetch(
                "/api/articles/pending-with-assignments"
            );
            if (!response.ok) throw new Error("Failed to fetch articles");
            const data = await response.json();
            setPendingArticles(data);
        } catch (err) {
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
        const conflict = selectedArticles.some((articleId) => {
            const article = pendingArticles.find((a) => a.id === articleId);
            return article?.assigned_editor?.id === editorId;
        });

        if (conflict) {
            const conflictingArticle = pendingArticles.find((article) =>
                selectedArticles.includes(article.id)
            );
            toast.error(
                `Article "${conflictingArticle.title}" is already assigned to the selected editor`
            );
            return;
        }

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
            setAssigningArticles(true);
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
                setAssigningArticles(false);
                setSelectedArticles([]);
                setSelectedEditors([]);
                fetchPendingArticles();
            } else {
                setAssigningArticles(false);
                throw new Error("Failed to assign articles");
            }
        } catch (err) {
            setAssigningArticles(false);
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
                                <p>Loading articles...</p>
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
                                        <div className="assign-articles__details">
                                            <div className="assign-articles__header">
                                                <img
                                                    src={
                                                        article.image_url ||
                                                        "/default-article-image.png"
                                                    }
                                                    alt={article.title}
                                                    className="assign-articles__image"
                                                />
                                                <div>
                                                    <label
                                                        htmlFor={`article-${article.id}`}
                                                        className="assign-articles__label"
                                                    >
                                                        {article.title}
                                                    </label>
                                                    <div className="assign-articles__editors">
                                                        {article.assigned_editor ? (
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-[12px]">
                                                                                Editor
                                                                                :
                                                                            </span>
                                                                            <div className="editor-avatar">
                                                                                <div className="author-image__fallback article-card">
                                                                                    <p className="author-image__initial article-card">
                                                                                        {
                                                                                            article
                                                                                                .assigned_editor
                                                                                                .name[0]
                                                                                        }
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p className="text-lg">
                                                                            {
                                                                                article
                                                                                    .assigned_editor
                                                                                    .name
                                                                            }{" "}
                                                                            (
                                                                            {
                                                                                article
                                                                                    .assigned_editor
                                                                                    .email
                                                                            }
                                                                            )
                                                                        </p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        ) : (
                                                            <p>
                                                                Not assigned to
                                                                any editor
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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
                            {loadingEditors ? (
                                <p>Loading editors...</p>
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
                                                alt={`Editor image for ${editor.name}`}
                                                className="editor-image"
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
                                            {editor.name} ({editor.email})
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
                    disabled={
                        selectedArticles.length === 0 ||
                        selectedEditors.length === 0 ||
                        assigningArticles
                    }
                >
                    {assigningArticles ? (
                        <>
                            <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                            <span>Assigning ...</span>
                        </>
                    ) : (
                        "Assign Articles"
                    )}
                </Button>
            </div>
        </>
    );
};

export default withAuth(AssignArticles);
