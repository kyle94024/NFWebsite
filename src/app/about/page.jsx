import "./AboutPage.scss";

import Link from "next/link";
import { Mail } from "lucide-react";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";

export default function AboutPage() {
    return (
        <div className="about-page">
            <Navbar />
            <main className="about-page__content padding">
                <div className="boxed">
                    <section className="about-page__hero">
                        <h1 className="about-page__title">About Us</h1>
                        <p className="about-page__subtitle">
                            Empowering the Neurofibromatosis Community
                        </p>
                    </section>

                    <section className="about-page__mission">
                        <h2 className="about-page__section-title">
                            Our Mission
                        </h2>
                        <p className="about-page__text">
                            Welcome to Neurofibromatosis Simplified. Our mission
                            is to provide accessible, up-to-date, and
                            comprehensive information about Neurofibromatosis
                            (NF) to patients, families, and caregivers. We aim
                            to empower those affected by NF with the knowledge
                            and resources they need to navigate their journey.
                        </p>
                    </section>

                    <section className="about-page__offerings">
                        <h2 className="about-page__section-title">
                            What We Offer
                        </h2>
                        <p className="about-page__text">
                            Our website offers simplified articles on NF, added
                            and reviewed by NF experts from REiNS. We believe in
                            the power of education and community support to make
                            a positive impact on the lives of those living with
                            Neurofibromatosis.
                        </p>
                    </section>

                    <section className="about-page__contact">
                        <h2 className="about-page__section-title">
                            Get in Touch
                        </h2>
                        <p className="about-page__text">
                            For more information, questions, or to get involved,
                            please don&apos;t hesitate to contact us.
                        </p>
                        <Link href="/contact" className="btn btn-primary-green">
                            <Mail className="about-page__contact-icon" />
                            <span>Contact Us</span>
                        </Link>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
