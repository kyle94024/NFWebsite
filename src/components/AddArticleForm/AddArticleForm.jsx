"use client";

import dynamic from "next/dynamic";
import React, { useState, useRef } from "react";
// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { X } from "lucide-react";
import "./AddArticleForm.scss";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useAuthStore from "@/store/useAuthStore";

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
import ImageUpload from "../ImageUpload/ImageUpload";
import Image from "next/image";

import Editor from "../ContentEditor";

// import pdfToText from "react-pdftotext";
// import * as pdfjsLib from 'pdfjs-dist';
// pdfjsLib.GlobalWorkerOptions.workerSrc = '/path/to/node_modules/pdfjs-dist/build/pdf.worker.min.js';
// Predefined list of tags
const predefinedTags = ["Clinical Trial", "Meta-Analysis", "Review", "REiNS","Clinical Research","Basic Science","Artificial Intelligence","Original Research","Case Studies", "Methodologies","Other"];

const AddArticleForm = () => {
    const [title, setTitle] = useState("");
    const [sourceLink, setSourceLink] = useState("");
    const [tags, setTags] = useState([]);
    const [currentTag, setCurrentTag] = useState("");
    const [content, setContent] = useState("");
    const [simplifyLength, setSimplifyLength] = useState(7);
    const [simplifyUnit, setSimplifyUnit] = useState("paragraphs");
    const [isLoading, setIsLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [pdfLoader, setPdfLoader] = useState(false);

    const quillRef = useRef(null);

    const { user } = useAuthStore();

    const handleImageUpload = (url) => {
        console.log("Image uploaded: ", url);
        setImageUrl(url);
        // You can save the URL to your database or state here
    };

    const handleAddTag = (tag) => {
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag]);
        }
        setCurrentTag(""); // Clear current tag after adding
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const handlePDFUpload = async (event) => {
        const file = event.target.files[0];
        if (file && file.type === "application/pdf") {
          setPdfLoader(true);
          try {
            const formData = new FormData();
            formData.append("file", file);
            const response = await fetch("/api/pdfToText", {
              method: "POST",
              body: formData,
            });
    
            const data = await response?.json();
            if (response.ok) {
              setPdfLoader(false);
              setContent(data.text);
              
              
              console.log(data.text)
              toast.success("PDF content extracted successfully!");
            } else {
              setPdfLoader(false);
              console.log(data.error);
              toast.error("Error: " + data.error);
            }
          } catch (error) {
            setPdfLoader(false);
            toast.error("Failed to extract PDF content: " + error.message);
          } finally {
            setPdfLoader(false);
          }
        } else {
          toast.error("Please upload a valid PDF file.");
        }
      };
    // const extractTextFromPDF = async (file) => {
    //     const arrayBuffer = await file.arrayBuffer();
    //     const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    //     let extractedText = '';
    //     for (let i = 1; i <= pdf.numPages; i++) {
    //         const page = await pdf.getPage(i);
    //         const textContent = await page.getTextContent();
    //         const pageText = textContent.items.map((item) => item.str).join(' ');
    //         extractedText += pageText + '\n';
    //     }
    //     return extractedText;
    // };
    // const handlePDFUpload = async (event) => {
    //     const file = event.target.files[0];
    //     if (file && file.type === 'application/pdf') {
    //         try {
    //             const text = await extractTextFromPDF(file);
    //             setContent(text); // Assuming you have setContent to update the content state
    //             toast.success('PDF content extracted successfully!');
    //         } catch (error) {
    //             toast.error('Failed to extract PDF content: ' + error.message);
    //         }
    //     } else {
    //         toast.error('Please upload a valid PDF file.');
    //     }
    // };
    // const handlePDFUpload = async (event) => { //this is pdf to text one
    //     const file = event.target.files[0];
    //     if (file && file.type === "application/pdf") {
    //         try {
    //             const text = await pdfToText(file);
    //             setContent(text);
    //             toast.success("PDF content extracted successfully!");
    //         } catch (error) {
    //             toast.error("Failed to extract PDF content: " + error.message);
    //         }
    //     } else {
    //         toast.error("Please upload a valid PDF file.");
    //     }
    // };
    // const handlePDFUpload = async (event) => {
    //     const file = event.target.files[0];
    //     if (file && file.type === "application/pdf") {
    //         try {
    //             const arrayBuffer = await file.arrayBuffer();
    //             const data = await pdfParse(Buffer.from(arrayBuffer));
    //             setContent(data.text);
    //             toast.success("PDF content extracted successfully!");
    //         } catch (error) {
    //             toast.error("Failed to extract PDF content: " + error.message);
    //         }
    //     } else {
    //         toast.error("Please upload a valid PDF file.");
    //     }
    // };
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
                    publisher: user,
                    image_url: imageUrl,
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

    // const modules = {
    //     toolbar: [
    //         [{ header: [1, 2, 3, 4, 5, 6, false] }],
    //         ["bold", "italic", "underline", "strike"],
    //         [{ list: "ordered" }, { list: "bullet" }],
    //         ["link", "image"],
    //         ["clean"],
    //     ],
    // };

    // const formats = [
    //     "header",
    //     "bold",
    //     "italic",
    //     "underline",
    //     "strike",
    //     "list",
    //     "bullet",
    //     "link",
    //     "image",
    // ];

    return (
        <form className="add-article-form">
            {/* <div className="add-article-form__row">
                <div className="add-article-form__field">
                    <Label htmlFor="title" className="add-article-form__label">
                        Upload PDF (Optional)
                    </Label>
                    <Input
                    id="pdfUpload"
                    type="file"
                    accept="application/pdf"
                    className="add-article-form__input"
                        onChange={handlePDFUpload}
                    />
                </div>
            </div> */}
            <div className="add-article-form__row">
                <div className="add-article-form__field">
                    <Label htmlFor="title" className="add-article-form__label">
                        Upload PDF (Optional)
                    </Label>
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                        <Input
                        id="pdfUpload"
                        type="file"
                        accept="application/pdf"
                        className="add-article-form__input"
                        onChange={handlePDFUpload}
                        />
                        {pdfLoader && <Loader2 className="mr-2 h-8 w-8 animate-spin" />}
                    </div>
                </div>
            </div>
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
                <Select
                    value={currentTag}
                    onValueChange={(value) => handleAddTag(value)}
                >
                    <SelectTrigger
                        id="tags"
                        className="add-article-form__input add-article-form__select"
                    >
                        <SelectValue placeholder="Select tags" />
                    </SelectTrigger>
                    <SelectContent className="add-article-form__select-content">
                        {predefinedTags
                            .filter((tag) => !tags.includes(tag)) // Filter out already added tags
                            .map((tag) => (
                                <SelectItem
                                    key={tag}
                                    className="add-article-form__select-item"
                                    value={tag}
                                >
                                    {tag}
                                </SelectItem>
                            ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="add-article-form__field">
                <Label className="add-article-form__label">
                    Article Content
                </Label>
                {/* <ReactQuill
                    ref={quillRef}
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    formats={formats}
                    theme="snow"
                    className="add-article-form__editor"
                /> */}
                <Editor
                    content={content}
                    onChange={setContent}
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
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="add-article-form__field">
                <Label className="add-article-form__label">
                    Add a cover image
                </Label>
                <div className="add-article-form__input !h-auto">
                    <div className="flex flex-col-reverse md:flex-row items-center gap-16">
                        <ImageUpload onImageUpload={handleImageUpload} />
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

            <div className="add-article-form__actions">
                <Button
                    type="button"
                    className="btn btn-primary-green"
                    onClick={handleRunSimplification}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                            Please wait
                        </>
                    ) : (
                        "Run Simplification"
                    )}
                </Button>
            </div>
        </form>
    );
};

export default AddArticleForm;