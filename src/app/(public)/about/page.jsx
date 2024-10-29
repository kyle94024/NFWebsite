import "./AboutPage.scss";

import Link from "next/link";
import { Mail } from "lucide-react";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";

export default function AboutPage() {
    // Define class name prefixes for easier updates
    const aboutPageClass = "about-page";
    const sectionTitleClass = `${aboutPageClass}__section-title`;
    const textClass = `${aboutPageClass}__text`;

    return (
        <div className={aboutPageClass}>
            <Navbar />
            <main className={`${aboutPageClass}__content padding`}>
                <div className="boxed">
                    <section className={`${aboutPageClass}__hero`}>
                        <h1 className={`${aboutPageClass}__title`}>About Us</h1>
                        <p className={`${aboutPageClass}__subtitle`}>
                            Empowering the Neurofibromatosis Community
                        </p>
                    </section>

                    <section className={`${aboutPageClass}__mission`}>
                        <h2 className={sectionTitleClass}>Our Mission</h2>
                        <p className={textClass}>
                            Welcome to Neurofibromatosis Simplified. Our mission
                            is to provide accessible, up-to-date, and
                            comprehensive information about Neurofibromatosis
                            (NF) to patients, families, and caregivers. We aim
                            to empower those affected by NF with the knowledge
                            and resources they need to navigate their journey.
                        </p>
                    </section>

                    <section className={`${aboutPageClass}__offerings`}>
                        <h2 className={sectionTitleClass}>What We Offer</h2>
                        <p className={textClass}>
                            Our website offers simplified articles on NF, added
                            and reviewed by NF experts from REiNS. We believe in
                            the power of education and community support to make
                            a positive impact on the lives of those living with
                            Neurofibromatosis.
                        </p>
                    </section>

                    <section className={`${aboutPageClass}__contact`}>
                        <h2 className={sectionTitleClass}>Get in Touch</h2>
                        <p className={textClass}>
                            For more information, questions, or to get involved,
                            please don&apos;t hesitate to contact us.
                        </p>
                        <Link href="/contact" className="btn btn-primary-green">
                            <Mail
                                className={`${aboutPageClass}__contact-icon`}
                            />
                            <span>Contact Us</span>
                        </Link>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
