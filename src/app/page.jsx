"use client";

import "./Home.scss";
import Navbar from "@/components/Navbar/Navbar";
import ArticleCard from "@/components/ArticleCard/ArticleCard";

import img from "../assets/article-thumbnail.jpeg";
import HomeServiceBanner from "@/components/HomeServiceBanner/HomeServiceBanner";
import Image from "next/image";
import { useRouter } from "next/navigation";

// participate in reserach articles
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
    // Add more articles here if needed
];

// affiliate partners
import partnerLogos from "../assets/affiliates-logos.webp";

// custom components
import SubscriptionBanner from "@/components/SubscriptionBanner/SubscriptionBanner";
import SearchArticles from "@/components/SearchArticles/SearchArticles";
import RecentArticlesSection from "@/components/RecentArticlesSection/RecentArticlesSection";
import FeaturedArticlesSection from "@/components/FeaturedArticlesSection/FeaturedArticlesSection";
import Footer from "@/components/Footer/Footer";

export default function Home() {
    const router = useRouter();

    const handleSearchSubmit = (query) => {
        // Navigate to the article search page with the query
        router.push(`/articles}`);
    };

    return (
        <main className="home">
            <section className="home__header">
                <Navbar />

                <section className="home__hero padding">
                    <div className="boxed">
                        <div className="home__hero__content">
                            <div className="flex flex-col gap-1">
                                <h1 className="heading-primary">
                                    Neurofibromatosis
                                </h1>
                                <h2 className="heading-tertiary w-400 color-green">
                                    Information Made Simple
                                </h2>
                            </div>
                            <p className="body-large">
                                Collection of simplified NF articles certified
                                by experts.{" "}
                                <span className="w-700 color-green-dark">
                                    Powered by REiNS.
                                </span>
                            </p>
                            <SearchArticles
                                setSearchQuery={handleSearchSubmit}
                            />
                        </div>
                    </div>
                </section>
            </section>

            {/* Featured articles section */}
            <FeaturedArticlesSection />

            <section className="home__cta-1 padding">
                <div className="boxed">
                    <HomeServiceBanner />
                </div>
            </section>

            {/* Recent articles section */}
            <RecentArticlesSection />

            <section className="home__affiliates padding">
                <div className="boxed">
                    <Image
                        src={partnerLogos}
                        alt="Affiliates"
                        className="home__affiliates__img"
                    />
                </div>
            </section>

            <section className="home__participate-articles padding">
                <div className="boxed">
                    <h2 className="heading-tertiary">
                        Participate in Research
                    </h2>
                    <div className="home__participate-articles__list">
                        {articles.map((article) => (
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
                </div>
            </section>

            <section className="home__subscription-cta padding">
                <div className="boxed">
                    <SubscriptionBanner />
                </div>
            </section>

            <Footer />
        </main>
    );
}
