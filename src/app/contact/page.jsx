"use client";

import "./ContactPage.scss";
import { useState, Suspense } from "react";
import Link from "next/link";
import { Bug, Mail, Send, Upload } from "lucide-react";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Loader from "../loading";
export default function ContactPage() {
    const [articleLink, setArticleLink] = useState("");
    const [bugName, setBugName] = useState("");
    const [bugEmail, setBugEmail] = useState("");
    const [bugDescription, setBugDescription] = useState("");
    const [bugImage, setBugImage] = useState(null);

    const handleArticleSubmit = (e) => {
        e.preventDefault();
        console.log("Article request submitted:", articleLink);
        setArticleLink("");
    };

    const handleBugSubmit = (e) => {
        e.preventDefault();
        console.log("Bug report submitted:", {
            bugName,
            bugEmail,
            bugDescription,
            bugImage,
        });
        setBugName("");
        setBugEmail("");
        setBugDescription("");
        setBugImage(null);
    };

    return (
        <Suspense fallback={<Loader />}>
            <div className="contact-page">
                <Navbar />
                <main className="contact-page__content padding">
                    <div className="contact-page__container boxed">
                        <section className="contact-page__hero">
                            <h1 className="contact-page__title">Contact Us</h1>
                            <p className="contact-page__subtitle">
                                We&apos;re here to help and listen to your
                                feedback
                            </p>
                        </section>

                        <div className="contact-page__forms">
                            <div className="contact-page__forms__set">
                                <div className="contact-page__email-section contact-page__section">
                                    <h2 className="contact-page__section-title">
                                        Email Us
                                    </h2>
                                    <p className="contact-page__section-description">
                                        Get in touch via email
                                    </p>
                                    <p className="contact-page__section-description">
                                        Please leave a message with your
                                        inquiry, and we&apos;ll get back to you
                                        as soon as possible. Our team is here to
                                        assist you with any questions or project
                                        needs.
                                    </p>
                                    <Link
                                        href="mailto:moazzam@devtrox.com"
                                        className="btn btn-primary"
                                    >
                                        <Mail className="contact-page__email-icon" />
                                        <span>Send us an Email</span>
                                    </Link>
                                </div>

                                <div className="contact-page__article-section contact-page__section">
                                    <h2 className="contact-page__section-title">
                                        Request an Article
                                    </h2>
                                    <p className="contact-page__section-description">
                                        Please submit an article link
                                    </p>
                                    <form
                                        onSubmit={handleArticleSubmit}
                                        className="contact-page__form"
                                    >
                                        <div className="contact-page__field">
                                            <Label
                                                htmlFor="articleLink"
                                                className="contact-page__label"
                                            >
                                                Article Link
                                            </Label>
                                            <Input
                                                id="articleLink"
                                                type="url"
                                                className="contact-page__input"
                                                placeholder="Enter article link"
                                                value={articleLink}
                                                onChange={(e) =>
                                                    setArticleLink(
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            className="btn btn-primary-green"
                                        >
                                            <Send className="contact-page__button-icon" />
                                            Submit Request
                                        </Button>
                                    </form>
                                </div>
                            </div>

                            <div className="contact-page__bug-section contact-page__section">
                                <h2 className="contact-page__section-title">
                                    Report a Bug
                                </h2>
                                <p className="contact-page__section-description">
                                    Help us improve by reporting issues
                                </p>
                                <form
                                    onSubmit={handleBugSubmit}
                                    className="contact-page__form"
                                >
                                    <div className="contact-page__field">
                                        <Label
                                            htmlFor="bugName"
                                            className="contact-page__label"
                                        >
                                            Your Name
                                        </Label>
                                        <Input
                                            id="bugName"
                                            type="text"
                                            className="contact-page__input"
                                            placeholder="Your Name"
                                            value={bugName}
                                            onChange={(e) =>
                                                setBugName(e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="contact-page__field">
                                        <Label
                                            htmlFor="bugEmail"
                                            className="contact-page__label"
                                        >
                                            Your Email
                                        </Label>
                                        <Input
                                            id="bugEmail"
                                            type="email"
                                            className="contact-page__input"
                                            placeholder="Your Email"
                                            value={bugEmail}
                                            onChange={(e) =>
                                                setBugEmail(e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="contact-page__field">
                                        <Label
                                            htmlFor="bugDescription"
                                            className="contact-page__label"
                                        >
                                            Bug Description
                                        </Label>
                                        <Textarea
                                            id="bugDescription"
                                            className="contact-page__input contact-page__textarea"
                                            placeholder="Describe the bug"
                                            value={bugDescription}
                                            onChange={(e) =>
                                                setBugDescription(
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="contact-page__field self-start">
                                        <Input
                                            type="file"
                                            id="bugImage"
                                            accept="image/*"
                                            onChange={(e) =>
                                                setBugImage(e.target.files[0])
                                            }
                                            className="hidden"
                                        />
                                        <Label
                                            htmlFor="bugImage"
                                            className="contact-page__file-label"
                                        >
                                            <Upload className="contact-page__file-icon" />
                                            Upload Image
                                        </Label>
                                    </div>
                                    <Button
                                        type="submit"
                                        className="btn btn-primary-green"
                                    >
                                        <Bug className="contact-page__button-icon" />
                                        Report Bug
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </Suspense>
    );
}
