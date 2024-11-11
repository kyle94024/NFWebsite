"use client";
import "./ArticlesListPaginated.scss";
import React, { useState } from "react";
import ArticleCard from "@/components/ArticleCard/ArticleCard";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { ArticleCardSkeleton } from "@/components/ArticleCardSkeleton/ArticleCardSkeleton";
import { SearchX, Unplug } from "lucide-react";

export default function ArticlesListPaginated({
    articles = [],
    articlesPerPage = 10,
    loading = false,
    error = false,
    pageType = "",
}) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(articles.length / articlesPerPage);

    const startIndex = (currentPage - 1) * articlesPerPage;
    const selectedArticles = articles.slice(
        startIndex,
        startIndex + articlesPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Conditional rendering based on loading, error state, and empty articles
    if (loading) {
        return (
            <div className="article-list__loading">
                {[...Array(6)].map((_, index) => (
                    <ArticleCardSkeleton key={index} />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="article-list__error">
                <Unplug className="article-list__error__icon" />
                <p className="body-large">
                    Something went wrong. Please try again later.
                </p>
            </div>
        );
    }

    if (selectedArticles.length === 0) {
        return (
            <div className="article-list__empty-state">
                <SearchX className="article-list__empty-icon" />
                <p className="body-large">
                    No articles found. Try a different search!
                </p>
            </div>
        );
    }

    return (
        <div className="article-list">
            <div className="article-list__items">
                {selectedArticles.map((article) => {
                    // Parse publisher if it exists and is a JSON string
                    let authorName = article.authorName;
                    if (article.publisher) {
                        try {
                            const publisherData =
                                typeof article.publisher === "string"
                                    ? JSON.parse(article.publisher)
                                    : article.publisher;
                            authorName = publisherData.name || authorName;
                        } catch (err) {
                            console.error("Error parsing publisher:", err);
                        }
                    }

                    return (
                        <ArticleCard
                            pageType={pageType}
                            key={article.title}
                            id={article.id}
                            imageUrl={article.image_url}
                            date={article.date}
                            title={article.title}
                            summary={article.summary}
                            authorImageUrl={article.authorImageUrl}
                            authorName={authorName}
                        />
                    );
                })}
            </div>

            {/* Pagination */}
            <Pagination className="pagination">
                <PaginationContent className="pagination__content">
                    <PaginationItem className="pagination__item">
                        <PaginationPrevious
                            href="#"
                            className="pagination__previous"
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage > 1)
                                    handlePageChange(currentPage - 1);
                            }}
                        />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, i) => (
                        <PaginationItem key={i} className="pagination__item">
                            <PaginationLink
                                href="#"
                                isActive={currentPage === i + 1}
                                className={`pagination__link ${
                                    currentPage === i + 1
                                        ? "pagination__link--active"
                                        : ""
                                }`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(i + 1);
                                }}
                            >
                                {i + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem className="pagination__item">
                        <PaginationNext
                            href="#"
                            className="pagination__next"
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage < totalPages)
                                    handlePageChange(currentPage + 1);
                            }}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
