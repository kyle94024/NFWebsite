"use client";

import dynamic from "next/dynamic";
import React, { useState, useRef } from "react";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { X } from "lucide-react";
import "./AddArticleForm.scss";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const AddArticleForm = () => {
    const [title, setTitle] = useState("");
    const [sourceLink, setSourceLink] = useState("");
    const [tags, setTags] = useState([]);
    const [currentTag, setCurrentTag] = useState("");
    const [content, setContent] = useState("");
    const [simplifyLength, setSimplifyLength] = useState(100);
    const [simplifyUnit, setSimplifyUnit] = useState("words");
    const [isLoading, setIsLoading] = useState(false);
    const quillRef = useRef(null);

    const handleAddTag = () => {
        if (currentTag && !tags.includes(currentTag)) {
            setTags([...tags, currentTag]);
            setCurrentTag("");
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const handleRunSimplification = async () => {
        // Validate required fields
        if (!title.trim()) {
            toast.error("Please enter an article title");
            return;
        }

        if (!content.trim()) {
            toast.error("Please enter article content");
            return;
        }

        if (tags.length === 0) {
            toast.error("Please add at least one tag");
            return;
        }

        if (!simplifyLength || simplifyLength <= 0) {
            toast.error("Please enter a valid simplification length");
            return;
        }

        if (!simplifyUnit) {
            toast.error("Please select a simplification unit");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/articles/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    tags,
                    innertext: content,
                    article_link: sourceLink,
                    simplifyLength: `${simplifyLength} ${simplifyUnit}`,
                }),
            });

            if (!response.ok) {
                throw new Error("Error running simplification");
            }

            const result = await response.json();
            toast.success("Article added successfully!");
            window.location.href = "/pending-articles";
        } catch (error) {
            toast.error("Failed to add article: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePreview = () => {
        console.log(content);
    };

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
        ],
    };

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "bullet",
        "link",
        "image",
    ];

    return (
        <form className="add-article-form">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar
            />

            <div className="add-article-form__row">
                <div className="add-article-form__field">
                    <Label htmlFor="title" className="add-article-form__label">
                        Article Title
                    </Label>
                    <Input
                        id="title"
                        className="add-article-form__input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter article title"
                    />
                </div>
                <div className="add-article-form__field">
                    <Label
                        htmlFor="sourceLink"
                        className="add-article-form__label"
                    >
                        Source Link (optional)
                    </Label>
                    <Input
                        id="sourceLink"
                        className="add-article-form__input"
                        value={sourceLink}
                        onChange={(e) => setSourceLink(e.target.value)}
                        placeholder="Enter source link"
                    />
                </div>
            </div>

            <div className="add-article-form__field">
                <Label htmlFor="tags" className="add-article-form__label">
                    Tags
                </Label>
                <div className="add-article-form__tags">
                    {tags.map((tag) => (
                        <span key={tag} className="add-article-form__tag">
                            {tag}
                            <Button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="add-article-form__tag-remove"
                                variant="ghost"
                                size="icon"
                            >
                                <X size={14} />
                            </Button>
                        </span>
                    ))}
                </div>
                <div className="add-article-form__tag-input">
                    <Input
                        id="tags"
                        className="add-article-form__input"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        placeholder="Add a tag"
                        onKeyDown={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), handleAddTag())
                        }
                    />
                    <Button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleAddTag}
                    >
                        Add Tag
                    </Button>
                </div>
            </div>

            <div className="add-article-form__field">
                <Label className="add-article-form__label">
                    Article Content
                </Label>
                <ReactQuill
                    ref={quillRef}
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    formats={formats}
                    theme="snow"
                    className="add-article-form__editor"
                />
            </div>

            <div className="add-article-form__row">
                <div className="add-article-form__field">
                    <Label
                        htmlFor="simplifyLength"
                        className="add-article-form__label"
                    >
                        Simplify Length
                    </Label>
                    <Input
                        id="simplifyLength"
                        type="number"
                        className="add-article-form__input"
                        value={simplifyLength}
                        onChange={(e) => setSimplifyLength(e.target.value)}
                        placeholder="Enter quantity"
                        min="1"
                    />
                </div>
                <div className="add-article-form__field">
                    <Label
                        htmlFor="simplifyUnit"
                        className="add-article-form__label"
                    >
                        Unit
                    </Label>
                    <Select
                        value={simplifyUnit}
                        onValueChange={(value) => setSimplifyUnit(value)}
                    >
                        <SelectTrigger
                            id="simplifyUnit"
                            className="add-article-form__input add-article-form__select"
                        >
                            <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent className="add-article-form__select-content">
                            <SelectItem
                                className="add-article-form__select-item"
                                value="paragraphs"
                            >
                                Paragraphs
                            </SelectItem>
                            <SelectItem
                                className="add-article-form__select-item"
                                value="words"
                            >
                                Words
                            </SelectItem>
                            <SelectItem
                                className="add-article-form__select-item"
                                value="percent"
                            >
                                Percent
                            </SelectItem>
                            <SelectItem
                                className="add-article-form__select-item"
                                value="characters"
                            >
                                Characters
                            </SelectItem>
                            <SelectItem
                                className="add-article-form__select-item"
                                value="sentences"
                            >
                                Sentences
                            </SelectItem>
                            <SelectItem
                                className="add-article-form__select-item"
                                value="sections"
                            >
                                Sections
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="add-article-form__actions">
                <Button
                    type="button"
                    className="btn btn-primary-green"
                    onClick={handleRunSimplification}
                    disabled={isLoading} // Disable button while loading
                >
                    {isLoading ? ( // Show loader while loading
                        <>
                            <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                            Please wait
                        </>
                    ) : (
                        "Run Simplification"
                    )}
                </Button>
                <Button
                    type="button"
                    disabled={true}
                    className="btn btn-primary"
                    onClick={handlePreview}
                >
                    Preview
                </Button>
            </div>
        </form>
    );
};

export default AddArticleForm;
