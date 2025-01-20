"use client";
import "./ArticlesListPaginated.scss";
import React, { useState, useEffect } from "react";
import ArticleCard from "@/components/ArticleCard/ArticleCard";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import { ArticleCardSkeleton } from "@/components/ArticleCardSkeleton/ArticleCardSkeleton";
import { SearchX, Unplug, ChevronLeft, ChevronRight } from "lucide-react";

export default function ArticlesListPaginated({
    articles = [],
    articlesPerPage = 6,
    loading = false,
    error = false,
    pageType = "",
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [isMobile, setIsMobile] = useState(false);

    // Check screen size to set isMobile state
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Calculate total pages based on the total number of articles
    const totalPages = Math.max(
        1,
        Math.ceil(articles.length / articlesPerPage)
    );

    // Ensure current page is within valid bounds
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [articles.length, totalPages, currentPage]);

    // Get the current page's articles
    const getCurrentPageArticles = () => {
        const startIndex = (currentPage - 1) * articlesPerPage;
        const endIndex = Math.min(
            startIndex + articlesPerPage,
            articles.length
        );
        return articles.slice(startIndex, endIndex);
    };

    const selectedArticles = getCurrentPageArticles();

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo(0, 0); // Optional: scroll to top on page change
        }
    };

    // Generate pagination items based on the screen size and current page
    const getPaginationItems = () => {
        const pages = [];

        if (isMobile) {
            // Mobile: Show a simplified pagination
            if (currentPage > 2) pages.push(1, "...");
            if (currentPage > 1) pages.push(currentPage - 1);
            pages.push(currentPage);
            if (currentPage < totalPages) pages.push(currentPage + 1);
            if (currentPage < totalPages - 1) pages.push("...", totalPages);
        } else {
            // Desktop: Show a full pagination
            if (totalPages <= 7) {
                for (let i = 1; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                if (currentPage <= 4) {
                    pages.push(1, 2, 3, 4, 5, "...", totalPages);
                } else if (currentPage > totalPages - 4) {
                    pages.push(
                        1,
                        "...",
                        totalPages - 4,
                        totalPages - 3,
                        totalPages - 2,
                        totalPages - 1,
                        totalPages
                    );
                } else {
                    pages.push(
                        1,
                        "...",
                        currentPage - 1,
                        currentPage,
                        currentPage + 1,
                        "...",
                        totalPages
                    );
                }
            }
        }

        return pages;
    };

    if (loading) {
        return (
            <div className="article-list__loading">
                {[...Array(articlesPerPage)].map((_, index) => (
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

    if (articles.length === 0) {
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
                    // Default to "Anonymous" if no name is found
                    let authorName = "Anonymous";

                    // Check if `certifiedby` is available and has a name
                    if (article.certifiedby) {
                        try {
                            // Use the name from `certifiedby` if available
                            authorName = article.name || "Anonymous";
                        } catch (err) {
                            console.error("Error parsing certifiedby:", err);
                        }
                    } else if (article.publisher_name) {
                        // Use `publisher_name` if available
                        authorName = article.publisher_name;
                    }

                    return (
                        <ArticleCard
                            pageType={pageType}
                            key={article.id || article.title}
                            id={article.id}
                            imageUrl={article.image_url}
                            date={article.date}
                            title={article.title}
                            summary={article.summary}
                            authorImageUrl={article.photo}
                            authorName={authorName}
                        />
                    );
                })}
            </div>

            {totalPages > 1 && (
                <Pagination className="pagination">
                    <PaginationContent className="pagination__content">
                        <PaginationItem className="pagination__item">
                            {isMobile ? (
                                <ChevronLeft
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handlePageChange(currentPage - 1);
                                    }}
                                    className="pagination__icon"
                                />
                            ) : (
                                <PaginationPrevious
                                    href="#"
                                    className="pagination__previous"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handlePageChange(currentPage - 1);
                                    }}
                                />
                            )}
                        </PaginationItem>

                        {getPaginationItems().map((item, index) =>
                            item === "..." ? (
                                <PaginationItem
                                    key={index}
                                    className="pagination__item"
                                >
                                    <PaginationEllipsis />
                                </PaginationItem>
                            ) : (
                                <PaginationItem
                                    key={index}
                                    className="pagination__item"
                                >
                                    <PaginationLink
                                        href="#"
                                        isActive={currentPage === item}
                                        className={`pagination__link ${
                                            currentPage === item
                                                ? "pagination__link--active"
                                                : ""
                                        }`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handlePageChange(item);
                                        }}
                                    >
                                        {item}
                                    </PaginationLink>
                                </PaginationItem>
                            )
                        )}

                        <PaginationItem className="pagination__item">
                            {isMobile ? (
                                <ChevronRight
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handlePageChange(currentPage + 1);
                                    }}
                                    className="pagination__icon"
                                />
                            ) : (
                                <PaginationNext
                                    href="#"
                                    className="pagination__next"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handlePageChange(currentPage + 1);
                                    }}
                                />
                            )}
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}