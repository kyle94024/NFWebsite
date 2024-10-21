import "./ArticleSearchPage.scss";
import React from "react";
import Navbar from "@/components/Navbar/Navbar";
import SearchArticles from "@/components/SearchArticles/SearchArticles";
import ArticlesListPaginated from "@/components/ArticlesListPaginated/ArticlesListPaginated";

import img from "../../assets/article-thumbnail.jpeg";

const articles = [
    {
        imageUrl: img,
        date: "30 Jan 2024",
        title: "Testing Cabozantinib for Nerve Tumor Treatment",
        summary:
            "The study concluded that cabozantinib could potentially treat NF1-related nerve tumors....",
        authorImageUrl: img,
        authorName: "Dr. Norman Fox",
    },
    {
        imageUrl: img,
        date: "30 Jan 2024",
        title: "Testing Cabozantinib for Nerve Tumor Treatment",
        summary:
            "The study concluded that cabozantinib could potentially treat NF1-related nerve tumors....",
        authorImageUrl: img,
        authorName: "Dr. Norman Fox",
    },
    {
        imageUrl: img,
        date: "30 Jan 2024",
        title: "Testing Cabozantinib for Nerve Tumor Treatment",
        summary:
            "The study concluded that cabozantinib could potentially treat NF1-related nerve tumors....",
        authorImageUrl: img,
        authorName: "Dr. Norman Fox",
    },
    {
        imageUrl: img,
        date: "30 Jan 2024",
        title: "Testing Cabozantinib for Nerve Tumor Treatment",
        summary:
            "The study concluded that cabozantinib could potentially treat NF1-related nerve tumors....",
        authorImageUrl: img,
        authorName: "Dr. Norman Fox",
    },
    {
        imageUrl: img,
        date: "30 Jan 2024",
        title: "Testing Cabozantinib for Nerve Tumor Treatment",
        summary:
            "The study concluded that cabozantinib could potentially treat NF1-related nerve tumors....",
        authorImageUrl: img,
        authorName: "Dr. Norman Fox",
    },
    {
        imageUrl: img,
        date: "30 Jan 2024",
        title: "Testing Cabozantinib for Nerve Tumor Treatment",
        summary:
            "The study concluded that cabozantinib could potentially treat NF1-related nerve tumors....",
        authorImageUrl: img,
        authorName: "Dr. Norman Fox",
    },
    {
        imageUrl: img,
        date: "30 Jan 2024",
        title: "Testing Cabozantinib for Nerve Tumor Treatment",
        summary:
            "The study concluded that cabozantinib could potentially treat NF1-related nerve tumors....",
        authorImageUrl: img,
        authorName: "Dr. Norman Fox",
    },
    {
        imageUrl: img,
        date: "30 Jan 2024",
        title: "Testing Cabozantinib for Nerve Tumor Treatment",
        summary:
            "The study concluded that cabozantinib could potentially treat NF1-related nerve tumors....",
        authorImageUrl: img,
        authorName: "Dr. Norman Fox",
    },
    {
        imageUrl: img,
        date: "30 Jan 2024",
        title: "Testing Cabozantinib for Nerve Tumor Treatment",
        summary:
            "The study concluded that cabozantinib could potentially treat NF1-related nerve tumors....",
        authorImageUrl: img,
        authorName: "Dr. Norman Fox",
    },
    {
        imageUrl: img,
        date: "30 Jan 2024",
        title: "Testing Cabozantinib for Nerve Tumor Treatment",
        summary:
            "The study concluded that cabozantinib could potentially treat NF1-related nerve tumors....",
        authorImageUrl: img,
        authorName: "Dr. Norman Fox",
    },
    {
        imageUrl: img,
        date: "30 Jan 2024",
        title: "Testing Cabozantinib for Nerve Tumor Treatment",
        summary:
            "The study concluded that cabozantinib could potentially treat NF1-related nerve tumors....",
        authorImageUrl: img,
        authorName: "Dr. Norman Fox",
    },
    {
        imageUrl: img,
        date: "30 Jan 2024",
        title: "Testing Cabozantinib for Nerve Tumor Treatment",
        summary:
            "The study concluded that cabozantinib could potentially treat NF1-related nerve tumors....",
        authorImageUrl: img,
        authorName: "Dr. Norman Fox",
    },
    {
        imageUrl: img,
        date: "30 Jan 2024",
        title: "Testing Cabozantinib for Nerve Tumor Treatment",
        summary:
            "The study concluded that cabozantinib could potentially treat NF1-related nerve tumors....",
        authorImageUrl: img,
        authorName: "Dr. Norman Fox",
    },
];

const ArticleSearchPage = () => {
    return (
        <div className="article-search-page">
            <Navbar />

            <div className="article-search-page__content padding">
                <div className="max-w-[800px] mx-auto mt-10 mb-24">
                    <SearchArticles />
                </div>

                <ArticlesListPaginated
                    articles={articles}
                    articlesPerPage={6}
                />
            </div>
        </div>
    );
};

export default ArticleSearchPage;
