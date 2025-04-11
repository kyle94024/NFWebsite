import "./AboutPage.scss";
import Link from "next/link";
import { Mail, ExternalLink } from "lucide-react";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import Image from "next/image";
import Marquee from "react-fast-marquee";

// images
import kyle from "../../../assets/about/kyle.png";
import vanessa from "../../../assets/about/vanessa.png";
import roxana from "../../../assets/about/roxana.png";
import nfNetwork from "../../../assets/about/nf-network.png";
import reins from "../../../assets/about/reins.png";
import expertPlaceholder from "../../../assets/about/expert-placeholder.png";
import joinUsIllustration from "../../../assets/about/our-mission.jpg";
import getInvolvedIllustration from "../../../assets/about/get-involved.jpg";

// Fetch editors from the API
async function fetchEditors() {
    const res = await fetch("http://localhost:3000/api/editors", {
        cache: "no-store", // Ensure fresh data is fetched
    });
    if (!res.ok) {
        throw new Error("Failed to fetch editors: " + (await res.text()));
    }
    return res.json();
}

// Function to get the first initial from a name
function getInitial(name) {
    return name && name.length > 0 ? name[0].toUpperCase() : "N/A";
}

export default async function AboutPage() {
    const aboutPageClass = "about-page";
    const sectionClass = `${aboutPageClass}__section`;
    const sectionTitleClass = `${aboutPageClass}__section-title`;
    const textClass = `${aboutPageClass}__text`;

    // Fetch editors data
    let experts = [];
    try {
        const editorsData = await fetchEditors();
        experts = editorsData
            .map((editor) => ({
                id: editor.id,
                name: editor.name || "N/A",
                title: editor.title || "N/A",
                image: editor.photo || expertPlaceholder,
                degree: editor.degree || "N/A",
                university: editor.university || "N/A",
            }))
            .filter((expert) => expert.name !== "N/A" && expert.name); // Skip experts with no name
    } catch (error) {
        console.error("Error fetching editors:", error);
        experts = [];
    }

    return (
        <div className={aboutPageClass}>
            <Navbar />
            <main className={`${aboutPageClass}__content padding`}>
                <div className="boxed">
                    {/* Hero Section */}
                    <section
                        className={`${sectionClass} ${sectionClass}--hero`}
                    >
                        <h1 className="heading-secondary text-center">
                            About NF Simplified
                        </h1>
                        <div className={`${aboutPageClass}__mission-container`}>
                            <div
                                className={`${aboutPageClass}__mission-content`}
                            >
                                <h2 className="heading-quinary color-green">
                                    Our Mission
                                </h2>
                                <p className="body-large">
                                    NF Simplified is dedicated to making
                                    scientific research more accessible and
                                    understandable for individuals and families
                                    affected by neurofibromatosis (NF1, NF2) and
                                    schwannomatosis.
                                </p>
                                <p className="body-regular">
                                    We believe everyone deserves access to
                                    clear, reliable information about the latest
                                    advances in NF research. By sharing
                                    simplified and accurate summaries of
                                    scientific findings, we aim to empower the
                                    NF community to make informed decisions,
                                    stay updated on medical progress, and feel
                                    connected to the breakthroughs shaping their
                                    care.
                                </p>
                            </div>
                            <div
                                className={`${aboutPageClass}__mission-illustration`}
                            >
                                <Image
                                    src={joinUsIllustration}
                                    alt="Mission illustration"
                                    width={400}
                                    height={400}
                                    className={`${aboutPageClass}__illustration`}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Team Section */}
                    <section
                        className={`${sectionClass} ${sectionClass}--team`}
                    >
                        <h2 className={sectionTitleClass}>Our Team</h2>
                        <p className={textClass}>
                            We are a passionate, volunteer-led team of
                            scientists, clinicians, developers, and advocates
                            working together to bridge the gap between research
                            and the NF community.
                        </p>

                        <h3 className={`${aboutPageClass}__team-subtitle`}>
                            Core Team
                        </h3>
                        <div className={`${aboutPageClass}__team-grid`}>
                            {/* Team Member 1 */}
                            <div className={`${aboutPageClass}__team-member`}>
                                <div
                                    className={`${aboutPageClass}__team-member-photo`}
                                >
                                    <Image
                                        src={kyle}
                                        alt="Kyle Wan"
                                        width={200}
                                        height={200}
                                        className={`${aboutPageClass}__team-image`}
                                    />
                                </div>
                                <div
                                    className={`${aboutPageClass}__team-member-info`}
                                >
                                    <h4
                                        className={`${aboutPageClass}__team-member-name`}
                                    >
                                        Kyle Wan
                                    </h4>
                                    <p
                                        className={`${aboutPageClass}__team-member-title`}
                                    >
                                        Founder & Lead
                                    </p>
                                    <p
                                        className={`${aboutPageClass}__team-member-bio`}
                                    >
                                        Committed to building a user-friendly
                                        platform to help researchers share
                                        clear, accurate summaries with the NF
                                        community.
                                    </p>
                                </div>
                            </div>

                            {/* Team Member 2 */}
                            <div className={`${aboutPageClass}__team-member`}>
                                <div
                                    className={`${aboutPageClass}__team-member-photo`}
                                >
                                    <Image
                                        src={vanessa}
                                        alt="Vanessa Merker"
                                        width={200}
                                        height={200}
                                        className={`${aboutPageClass}__team-image`}
                                    />
                                </div>
                                <div
                                    className={`${aboutPageClass}__team-member-info`}
                                >
                                    <h4
                                        className={`${aboutPageClass}__team-member-name`}
                                    >
                                        Vanessa Merker, Ph.D.
                                    </h4>
                                    <p
                                        className={`${aboutPageClass}__team-member-title`}
                                    >
                                        Faculty Advisor
                                    </p>
                                    <p
                                        className={`${aboutPageClass}__team-member-bio`}
                                    >
                                        Assistant Professor of Neurology at
                                        Harvard Medical School. Specializes in
                                        patient-centered research and improving
                                        care in Neurofibromatosis and related
                                        conditions.
                                    </p>
                                </div>
                            </div>

                            {/* Team Member 3 */}
                            <div className={`${aboutPageClass}__team-member`}>
                                <div
                                    className={`${aboutPageClass}__team-member-photo`}
                                >
                                    <Image
                                        src={roxana}
                                        alt="Roxana Daneshjou"
                                        width={200}
                                        height={200}
                                        className={`${aboutPageClass}__team-image`}
                                    />
                                </div>
                                <div
                                    className={`${aboutPageClass}__team-member-info`}
                                >
                                    <h4
                                        className={`${aboutPageClass}__team-member-name`}
                                    >
                                        Roxana Daneshjou, MD Ph.D.
                                    </h4>
                                    <p
                                        className={`${aboutPageClass}__team-member-title`}
                                    >
                                        Faculty Advisor
                                    </p>
                                    <p
                                        className={`${aboutPageClass}__team-member-bio`}
                                    >
                                        Assistant Professor of Biomedical Data
                                        Science, Stanford University.
                                        Specializes in building Fair and
                                        trustworthy AI for healthcare.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Scientific Experts Section */}
                    <section
                        className={`${sectionClass} ${sectionClass}--experts`}
                    >
                        <h3 className={sectionTitleClass}>
                            Scientific Contributors
                        </h3>
                        <p className={textClass}>
                            We&apos;re a growing network of scientists who volunteer
                            to edit article summaries and share the amazing
                            research being done in Neurofibromatosis and
                            Schwannomatosis with the community.
                        </p>
                        <div className={`${aboutPageClass}__experts-container`}>
                            <Marquee
                                pauseOnHover={true}
                                speed={40}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "flex-start",
                                }}
                                autoFill={true}
                                gradient={false}
                                className={`${aboutPageClass}__experts-marquee`}
                            >
                                {experts.length > 0 ? (
                                    experts.map((expert) => (
                                        <div
                                            key={expert.id}
                                            className={`${aboutPageClass}__expert`}
                                        >
                                            <div
                                                className={`${aboutPageClass}__expert-photo`}
                                            >
                                                {expert.image ===
                                                expertPlaceholder ? (
                                                    <div
                                                        className={`${aboutPageClass}__expert-initial`}
                                                        style={{
                                                            width: "120px",
                                                            height: "120px",
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                            backgroundColor:
                                                                "#e0e0e0",
                                                            borderRadius: "50%",
                                                            fontSize: "48px",
                                                            fontWeight: "bold",
                                                            color: "#333",
                                                        }}
                                                    >
                                                        {getInitial(
                                                            expert.name
                                                        )}
                                                    </div>
                                                ) : (
                                                    <Image
                                                        src={expert.image}
                                                        alt={expert.name}
                                                        width={120}
                                                        height={120}
                                                        className={`${aboutPageClass}__expert-image`}
                                                    />
                                                )}
                                            </div>
                                            <div
                                                className={`${aboutPageClass}__expert-info`}
                                            >
                                                <h4
                                                    className={`${aboutPageClass}__expert-name`}
                                                >
                                                    {expert.name}
                                                </h4>
                                                <p
                                                    className={`${aboutPageClass}__expert-title`}
                                                >
                                                    {expert.title}
                                                    {expert.degree !== "N/A"
                                                        ? `, ${expert.degree}`
                                                        : ""}
                                                    {expert.university !== "N/A"
                                                        ? `, ${expert.university}`
                                                        : ""}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No editors available at this time.</p>
                                )}
                            </Marquee>
                        </div>
                    </section>

                    {/* Get Involved Section */}
                    <section
                        className={`${sectionClass} ${sectionClass}--involved`}
                    >
                        <div
                            className={`${aboutPageClass}__involved-container`}
                        >
                            <div
                                className={`${aboutPageClass}__involved-content`}
                            >
                                <h3 className={sectionTitleClass}>
                                    Get Involved
                                </h3>
                                <p className={textClass}>
                                    NF Simplified is 100% volunteer-led, and
                                    we&apos;re always looking for passionate people
                                    to join us! Whether you&apos;re into web
                                    development, research, database management,
                                    design, or community outreach—there&apos;s a
                                    place for you on our team.
                                </p>
                                <Link
                                    href="/contact"
                                    className="btn btn-primary"
                                >
                                    <Mail size={20} />
                                    <span className="text">Contact Us</span>
                                </Link>
                            </div>
                            <div
                                className={`${aboutPageClass}__involved-illustration`}
                            >
                                <Image
                                    src={getInvolvedIllustration}
                                    alt="Get involved illustration"
                                    width={600}
                                    height={600}
                                    className={`${aboutPageClass}__illustration`}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Community Supporters Section */}
                    <section
                        className={`${sectionClass} ${aboutPageClass}__supporters`}
                    >
                        <div
                            className={`${aboutPageClass}__supporters-container`}
                        >
                            <h3 className={sectionTitleClass}>
                                Community Supporters
                            </h3>
                            <p className={textClass}>
                                We&apos;re proud to work alongside and be supported
                                by organizations dedicated to the NF community:
                            </p>
                        </div>
                        <div className={`${aboutPageClass}__supporters-logos`}>
                            <Link
                                href="https://nfnetwork.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${aboutPageClass}__supporter-logo nf-network`}
                            >
                                <Image
                                    src={nfNetwork}
                                    alt="NF-Network Logo"
                                    width={500}
                                    height={100}
                                    className={`${aboutPageClass}__logo-image`}
                                />
                                <div className={`${aboutPageClass}__logo-link`}>
                                    <p
                                        className={`${aboutPageClass}__logo-name`}
                                    >
                                        NF-Network
                                    </p>
                                    <ExternalLink
                                        size={16}
                                        className={`${aboutPageClass}__external-icon`}
                                    />
                                </div>
                            </Link>
                            <Link
                                href="https://ccrod.cancer.gov/confluence/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${aboutPageClass}__supporter-logo`}
                            >
                                <Image
                                    src={reins}
                                    alt="REiNS Logo"
                                    width={200}
                                    height={100}
                                    className={`${aboutPageClass}__logo-image`}
                                />
                                <div className={`${aboutPageClass}__logo-link`}>
                                    <p
                                        className={`${aboutPageClass}__logo-name`}
                                    >
                                        REiNS
                                    </p>
                                    <ExternalLink
                                        size={16}
                                        className={`${aboutPageClass}__external-icon`}
                                    />
                                </div>
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
