"use client";

import dynamic from "next/dynamic";
import React, { useState, useRef } from "react";
import { Loader2, X } from "lucide-react";
import "react-quill/dist/quill.snow.css";
import "./EditArticleForm.scss";
import Image from "next/image";
import sanitizeHtml from "sanitize-html";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import ImageUpload from "../ImageUpload/ImageUpload";
import Editor from "../ContentEditor";

const predefinedTags = [
    "Clinical Trial",
    "Meta-Analysis",
    "Review",
    "REiNS",
    "Clinical Research",
    "Basic Science",
    "Artificial Intelligence",
    "Original Research",
    "Case Studies",
    "Methodologies",
    "Other",
];

const EditArticleForm = ({
    articleData,
    onSaveEdits,
    onPublishOrRetract,
    onDelete,
    loadingStates,
    formType,
}) => {
    const [title, setTitle] = useState(articleData?.title || "");
    const [sourceLink, setSourceLink] = useState(
        articleData?.article_link || ""
    );
    const [tags, setTags] = useState(articleData?.tags || []);
    const [currentTag, setCurrentTag] = useState("");
    const [content, setContent] = useState(
        sanitizeHtml(articleData?.innertext || "", {
            allowedTags: [
                "p",
                "br",
                "strong",
                "em",
                "u",
                "h1",
                "h2",
                "h3",
                "h4",
                "h5",
                "h6",
                "ul",
                "ol",
                "li",
                "a",
            ],
            allowedAttributes: {
                a: ["href", "target"],
            },
        })
    );
    const [summary, setSummary] = useState(
        sanitizeHtml(articleData?.summary || "", {
            allowedTags: [
                "p",
                "br",
                "strong",
                "em",
                "u",
                "h1",
                "h2",
                "h3",
                "h4",
                "h5",
                "h6",
                "ul",
                "ol",
                "li",
                "a",
            ],
            allowedAttributes: {
                a: ["href", "target"],
            },
        })
    );
    const [imageUrl, setImageUrl] = useState(articleData?.image_url || null);

    const handleAddTag = (tag) => {
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag]);
        }
        setCurrentTag(""); // Clear current tag after adding
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const handleImageUpload = (url) => {
        console.log("Image uploaded: ", url);
        setImageUrl(url);
    };

    const handleSave = () => {
        onSaveEdits({
            title,
            tags,
            innertext: sanitizeHtml(content, {
                allowedTags: [
                    "p",
                    "br",
                    "strong",
                    "em",
                    "u",
                    "h1",
                    "h2",
                    "h3",
                    "h4",
                    "h5",
                    "h6",
                    "ul",
                    "ol",
                    "li",
                    "a",
                ],
                allowedAttributes: {
                    a: ["href", "target"],
                },
            }),
            summary: sanitizeHtml(summary, {
                allowedTags: [
                    "p",
                    "br",
                    "strong",
                    "em",
                    "u",
                    "h1",
                    "h2",
                    "h3",
                    "h4",
                    "h5",
                    "h6",
                    "ul",
                    "ol",
                    "li",
                    "a",
                ],
                allowedAttributes: {
                    a: ["href", "target"],
                },
            }),
            article_link: sourceLink,
            image_url: imageUrl,
        });
    };

    return (
        <form className="edit-article-form">
            <div className="edit-article-form__row">
                <div className="edit-article-form__field">
                    <Label htmlFor="title" className="edit-article-form__label">
                        Article Title
                    </Label>
                    <Input
                        id="title"
                        className="edit-article-form__input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter article title"
                    />
                </div>
                <div className="edit-article-form__field">
                    <Label
                        htmlFor="sourceLink"
                        className="edit-article-form__label"
                    >
                        Source Link (optional)
                    </Label>
                    <Input
                        id="sourceLink"
                        className="edit-article-form__input"
                        value={sourceLink}
                        onChange={(e) => setSourceLink(e.target.value)}
                        placeholder="Enter source link"
                    />
                </div>
            </div>

            <div className="edit-article-form__field">
                <Label htmlFor="tags" className="edit-article-form__label">
                    Tags
                </Label>
                <div className="edit-article-form__tags">
                    {tags.map((tag) => (
                        <span key={tag} className="edit-article-form__tag">
                            {tag}
                            <Button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="edit-article-form__tag-remove"
                                variant="ghost"
                                size="icon"
                            >
                                <X size={14} />
                            </Button>
                        </span>
                    ))}
                </div>
                <Select
                    value={currentTag}
                    onValueChange={(value) => handleAddTag(value)}
                >
                    <SelectTrigger
                        id="tags"
                        className="edit-article-form__input edit-article-form__select"
                    >
                        <SelectValue placeholder="Select tags" />
                    </SelectTrigger>
                    <SelectContent className="edit-article-form__select-content">
                        {predefinedTags
                            .filter((tag) => !tags.includes(tag))
                            .map((tag) => (
                                <SelectItem
                                    key={tag}
                                    className="edit-article-form__select-item"
                                    value={tag}
                                >
                                    {tag}
                                </SelectItem>
                            ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="edit-article-form__field">
                <Label className="edit-article-form__label">Summary</Label>
                <Editor
                    content={summary}
                    onChange={setSummary}
                    className="edit-article-form__editor"
                />
            </div>

            <div className="edit-article-form__field">
                <Label className="edit-article-form__label">
                    Article Content
                </Label>
                <Editor
                    content={content}
                    onChange={setContent}
                    className="edit-article-form__editor"
                />
            </div>

            <div className="edit-article-form__field">
                <Label className="edit-article-form__label">Cover image</Label>
                <div className="edit-article-form__input !h-auto">
                    <div className="flex flex-col-reverse md:flex-row items-center gap-16">
                        <ImageUpload
                            onImageUpload={handleImageUpload}
                            initialImageUrl={articleData?.image_url}
                        />
                        {imageUrl && (
                            <Image
                                src={imageUrl}
                                alt={title}
                                width={320}
                                height={200}
                                objectFit="contain"
                                objectPosition="center"
                                loading="lazy"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Button actions */}
            
            <div className="edit-article-form__actions">
                <Button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={loadingStates.saving}
                >
                    {loadingStates.saving ? (
                        <>
                            <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        "Save Edits"
                    )}
                </Button>
                <Button
                    type="button"
                    className="btn btn-primary-green"
                    onClick={onPublishOrRetract}
                    disabled={loadingStates.publishing}
                >
                    {loadingStates.publishing ? (
                        <>
                            <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                            {formType === "edit"
                                ? "Retracting..."
                                : "Publishing..."}
                        </>
                    ) : formType === "edit" ? (
                        "Retract"
                    ) : (
                        "Publish"
                    )}
                </Button>

                <Button
                    type="button"
                    className="btn btn-primary-red"
                    onClick={onDelete}
                    disabled={loadingStates.deleting}
                >
                    {loadingStates.deleting ? (
                        <>
                            <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                            Deleting...
                        </>
                    ) : (
                        "Delete"
                    )}
                </Button>
            </div>
        </form>
    );
};

export default EditArticleForm;
