"use client";
import "./FeaturedArticlesPage.scss";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ArticlesListPaginated from "@/components/ArticlesListPaginated/ArticlesListPaginated";
import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { withAuth } from "@/components/withAuth/withAuth";
import Footer from "@/components/Footer/Footer";

const FeaturedArticles = () => {
    const [featuredArticles, setFeaturedArticles] = useState([]);
    const [otherArticles, setOtherArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Fetching both featured and other articles
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const [featuredResp, allResp] = await Promise.all([
                    fetch("/api/articles/featured"),
                    fetch("/api/articles"),
                ]);

                if (!featuredResp.ok || !allResp.ok) {
                    throw new Error("Failed to fetch articles");
                }

                const featuredData = await featuredResp.json();
                const allData = await allResp.json();

                // Filter "Others" by excluding featured articles
                const featuredIds = new Set(
                    featuredData.map((article) => article.id)
                );
                const othersData = allData.filter(
                    (article) => !featuredIds.has(article.id)
                );

                setFeaturedArticles(featuredData);
                setOtherArticles(othersData);
            } catch (error) {
                console.error("Error fetching articles:", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    return (
        <div className="featured-articles">
            <Navbar />
            <div className="featured-articles__content padding">
                <div className="boxed">
                    <Link
                        href="/"
                        className="flex items-center gap-2 font-bold"
                    >
                        <ArrowLeft />
                        <span>Back</span>
                    </Link>

                    {/* Tabs for Featured and Others */}

                    <Tabs defaultValue="featured">
                        <div className="flex justify-center mt-2 mb-24">
                            <TabsList
                                className={
                                    "py-[26px] md:py-[32px] px-[4px] rounded-2xl w-full md:w-max md:max-w-none"
                                }
                            >
                                <TabsTrigger
                                    className="body-large py-4 px-4 md:py-6 md:px-32 w-full rounded-[8px]"
                                    value="featured"
                                >
                                    Featured
                                </TabsTrigger>
                                <TabsTrigger
                                    className="body-large py-6 px-4 md:py-6 md:px-32 w-full rounded-[8px]"
                                    value="others"
                                >
                                    Others
                                </TabsTrigger>
                            </TabsList>
                        </div>
                        {/* Featured Articles */}
                        <TabsContent value="featured">
                            <ArticlesListPaginated
                                articles={featuredArticles}
                                articlesPerPage={6}
                                loading={loading}
                                error={error}
                                pageType="featured"
                            />
                        </TabsContent>

                        {/* Other Articles */}
                        <TabsContent value="others">
                            <ArticlesListPaginated
                                articles={otherArticles}
                                articlesPerPage={6}
                                loading={loading}
                                error={error}
                                pageType="unfeatured"
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default withAuth(FeaturedArticles);
