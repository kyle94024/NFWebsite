"use client";
import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { X } from "lucide-react";
import "./AddArticleForm.scss";

const AddArticleForm = () => {
    const [title, setTitle] = useState("");
    const [sourceLink, setSourceLink] = useState("");
    const [tags, setTags] = useState([]);
    const [currentTag, setCurrentTag] = useState("");
    const [content, setContent] = useState("");
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

    const handleRunSimplification = () => {
        // Implement simplification logic here
        console.log("Running simplification...");
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
            <div className="add-article-form__row">
                <div className="add-article-form__field">
                    <label htmlFor="title" className="add-article-form__label">
                        Article Title
                    </label>
                    <input
                        id="title"
                        className="add-article-form__input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter article title"
                    />
                </div>
                <div className="add-article-form__field">
                    <label
                        htmlFor="sourceLink"
                        className="add-article-form__label"
                    >
                        Source Link (optional)
                    </label>
                    <input
                        id="sourceLink"
                        className="add-article-form__input"
                        value={sourceLink}
                        onChange={(e) => setSourceLink(e.target.value)}
                        placeholder="Enter source link"
                    />
                </div>
            </div>

            <div className="add-article-form__field">
                <label htmlFor="tags" className="add-article-form__label">
                    Tags
                </label>
                <div className="add-article-form__tags">
                    {tags.map((tag) => (
                        <span key={tag} className="add-article-form__tag">
                            {tag}
                            <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="add-article-form__tag-remove"
                            >
                                <X size={14} />
                            </button>
                        </span>
                    ))}
                </div>
                <div className="add-article-form__tag-input">
                    <input
                        id="tags"
                        className="add-article-form__input"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        placeholder="Add a tag"
                        onKeyPress={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), handleAddTag())
                        }
                    />
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleAddTag}
                    >
                        Add Tag
                    </button>
                </div>
            </div>

            <div className="add-article-form__field">
                <label className="add-article-form__label">
                    Article Content
                </label>
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

            <div className="add-article-form__actions">
                <button
                    type="button"
                    className="btn btn-primary-green"
                    onClick={handleRunSimplification}
                >
                    Run Simplification
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handlePreview}
                >
                    Preview
                </button>
            </div>
        </form>
    );
};

export default AddArticleForm;
