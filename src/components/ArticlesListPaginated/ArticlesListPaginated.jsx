"use client";
import "./ArticlesListPaginated.scss";

import React, { useState } from "react";
import ArticleCard from "@/components/ArticleCard/ArticleCard";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export default function ArticlesListPaginated({
    articles = [],
    articlesPerPage = 10,
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

    return (
        <div className="article-list">
            <div className="article-list__items">
                {selectedArticles.map((article) => (
                    <ArticleCard
                        key={article.title}
                        imageUrl={article.imageUrl}
                        date={article.date}
                        title={article.title}
                        summary={article.summary}
                        authorImageUrl={article.authorImageUrl}
                        authorName={article.authorName}
                    />
                ))}
            </div>

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
