"use client";
import "./FAQs.scss";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Suspense } from "react";

import Loader from "../loading";

const faqsData = [
    {
        question: "What is Neurofibromatosis Simplified?",
        answer: "Neurofibromatosis Simplified is a platform dedicated to providing accessible, up-to-date, and comprehensive information about Neurofibromatosis (NF) for patients, families, and caregivers.",
    },
    {
        question: "Who is Neurofibromatosis Simplified for?",
        answer: "Our website is designed for individuals affected by NF, including patients, families, and caregivers, to help them access information and resources that aid in understanding and managing NF.",
    },
    {
        question:
            "What type of information does Neurofibromatosis Simplified provide?",
        answer: "We offer simplified articles and resources on Neurofibromatosis, all reviewed by NF experts from REiNS, to ensure accuracy and accessibility for all users.",
    },
    {
        question:
            "Who reviews the information on Neurofibromatosis Simplified?",
        answer: "All articles and resources on our website are reviewed by NF experts from REiNS, ensuring that the information provided is accurate, reliable, and up-to-date.",
    },
    {
        question:
            "How can Neurofibromatosis Simplified help those living with NF?",
        answer: "We empower those affected by NF with knowledge, offering educational articles and a supportive community to help navigate their journey with Neurofibromatosis.",
    },
];

const FAQs = () => {
    return (
        <Suspense fallback={<Loader />}>
            <div className="faq">
                <Navbar />
                <main className="faq__content padding">
                    <h2 className="faq__title">Frequently Asked Questions</h2>

                    <div className="faq__container boxed">
                        <Accordion
                            type="single"
                            collapsible
                            className="faq__accordion"
                        >
                            {faqsData.map((faq, index) => (
                                <AccordionItem
                                    key={index}
                                    value={`item-${index}`}
                                    className="faq__item"
                                >
                                    <AccordionTrigger className="faq__question">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="faq__answer">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </main>
                <Footer />
            </div>
        </Suspense>
    );
};

export default FAQs;
