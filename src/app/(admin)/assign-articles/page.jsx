"use client";
import "./AssignArticlesPage.scss";

import { withAuth } from "@/components/withAuth/withAuth";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "@/components/Navbar/Navbar";
import Image from "next/image";
import { Loader2, Edit } from "lucide-react";

const FallbackAuthorImage = ({ authorName }) => {
    const firstLetter = authorName ? authorName.charAt(0).toUpperCase() : "A";
    return (
        <div className="assign-articles__author-image-fallback">
            <p className="assign-articles__author-image-initial">
                {firstLetter}
            </p>
        </div>
    );
};

const EditorTag = ({ editor, articleId, onUnassign }) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className="assign-articles__editor-tag">
                    <Edit size={14} />
                    <span>{editor.name}</span>
                </div>
            </PopoverTrigger>
            <PopoverContent className="assign-articles__editor-popover">
                <div className="assign-articles__editor-details">
                    <div className="assign-articles__editor-header">
                        <FallbackAuthorImage authorName={editor.name} />
                        <div>
                            <h3 className="assign-articles__editor-name">
                                {editor.name}
                            </h3>
                            <p className="assign-articles__editor-email">
                                {editor.email}
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={() => onUnassign(editor.id, articleId)}
                        variant="destructive"
                        className="assign-articles__unassign-button"
                    >
                        Unassign
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
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
                const data = await response.json();
                throw new Error(data.message || "Failed to assign articles");
            }
        } catch (err) {
            setAssigningArticles(false);
            toast.error(err.message);
        }
    };

    const handleUnassign = async (editorId, articleId) => {
        try {
            const response = await fetch("/api/articles/unassign", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ editorId, articleId }),
            });

            if (response.ok) {
                toast.success("Editor unassigned successfully!");
                fetchPendingArticles();
            } else {
                throw new Error("Failed to unassign editor");
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
                            <CardTitle className="assign-articles__selected-count">
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
                                        <div className="assign-articles__item-content">
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
                                                <div className="assign-articles__article-header">
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
                                                    </div>
                                                </div>
                                                <div className="assign-articles__editors-container">
                                                    <h4 className="assign-articles__editors-title">
                                                        Assigned Editors:
                                                    </h4>
                                                    <div className="assign-articles__editors-list">
                                                        {article
                                                            .assigned_editors
                                                            .length > 0 ? (
                                                            article.assigned_editors.map(
                                                                (editor) => (
                                                                    <EditorTag
                                                                        key={
                                                                            editor.id
                                                                        }
                                                                        editor={
                                                                            editor
                                                                        }
                                                                        articleId={
                                                                            article.id
                                                                        }
                                                                        onUnassign={
                                                                            handleUnassign
                                                                        }
                                                                    />
                                                                )
                                                            )
                                                        ) : (
                                                            <p className="assign-articles__no-editors">
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
                            <CardTitle className="assign-articles__selected-count">
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
                                                src={
                                                    editor.image ||
                                                    "/placeholder.svg"
                                                }
                                                alt={`Editor image for ${editor.name}`}
                                                className="assign-articles__editor-image"
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
                            <Loader2 className="assign-articles__loader" />
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
