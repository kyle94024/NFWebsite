import "./Home.scss";
import Navbar from "@/components/Navbar/Navbar";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
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
                            <div className="home__hero__search">
                                <div className="home__hero__search__bar">
                                    <Search className="home__hero__search__icon" />
                                    <Input
                                        type="text"
                                        placeholder="Search for articles"
                                        className="home__hero__search__input"
                                    />
                                </div>
                                <Button className="home__hero__search__button">
                                    <ArrowRight className="home__hero__search__button-icon" />
                                </Button>
                            </div>
                            <div className="home__hero__filters">
                                <div className="home__hero__filters__buttons">
                                    {[
                                        "Treatment",
                                        "Symptoms",
                                        "Causes",
                                        "Findings",
                                    ].map((label) => (
                                        <Button
                                            key={label}
                                            variant="outline"
                                            className="home__hero__filters__button"
                                        >
                                            {label}
                                        </Button>
                                    ))}
                                </div>
                                <Button
                                    variant="link"
                                    className="home__hero__filters__explore"
                                >
                                    Explore All
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
        </main>
    );
}
