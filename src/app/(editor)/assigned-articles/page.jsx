"use client";

import "./AssignedArticlesPage.scss";
import ArticlesListPaginated from "@/components/ArticlesListPaginated/ArticlesListPaginated";
import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { withEditorAuth } from "@/components/withEditorAuth/withEditorAuth";
import Footer from "@/components/Footer/Footer";
import useAuthStore from "@/store/useAuthStore";
import { useState, useEffect } from "react";

const EditorAssignedArticles = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const { user } = useAuthStore();

    // Fetching assigned articles based on the editor's ID
    useEffect(() => {
        if (user?.userId) {
            const fetchArticles = async () => {
                setLoading(true);
                setError(false);
                try {
                    const response = await fetch(
                        `/api/editors/assigned-articles?editorId=${user.userId}`
                    );
                    if (!response.ok)
                        throw new Error("Failed to fetch articles");
                    const data = await response.json();
                    setArticles(data);
                } catch (error) {
                    console.error("Error fetching assigned articles:", error);
                    setError(true);
                } finally {
                    setLoading(false);
                }
            };

            fetchArticles();
        }
    }, [user?.userId]);

    return (
        <div className="assigned-articles">
            <Navbar />
            <div className="assigned-articles__content padding">
                <div className="boxed">
                    <Link
                        href="/"
                        className="flex items-center gap-2 font-bold mb-4"
                    >
                        <ArrowLeft />
                        <span> Back</span>
                    </Link>

                    {/* Pass loading, error, and articles to ArticlesListPaginated */}
                    <ArticlesListPaginated
                        articles={articles}
                        articlesPerPage={6}
                        loading={loading}
                        error={error}
                        pageType="assigned"
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default withEditorAuth(EditorAssignedArticles);
