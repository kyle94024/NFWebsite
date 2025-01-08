"use client";

import "./Home.scss";
import Navbar from "@/components/Navbar/Navbar";

import HomeServiceBanner from "@/components/HomeServiceBanner/HomeServiceBanner";

import { useRouter } from "next/navigation";

import useAuthStore from "@/store/useAuthStore";

// custom components
import SubscriptionBanner from "@/components/SubscriptionBanner/SubscriptionBanner";
import SearchArticles from "@/components/SearchArticles/SearchArticles";
import RecentArticlesSection from "@/components/RecentArticlesSection/RecentArticlesSection";
import FeaturedArticlesSection from "@/components/FeaturedArticlesSection/FeaturedArticlesSection";
import Footer from "@/components/Footer/Footer";

export default function Home() {
    const router = useRouter();

    const { role } = useAuthStore();
    console.log("User: ", role);

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
                                    Powered by Innovation.
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

            <section className="home__subscription-cta padding">
                <div className="boxed">
                    <SubscriptionBanner />
                </div>
            </section>

            <Footer />
        </main>
    );
}
