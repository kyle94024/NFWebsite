import React from "react";
import "./HomeServiceBanner.scss";
import Link from "next/link";

function HomeServiceBanner() {
    return (
        <div className="service-banner">
            <div className="service-banner__content">
                <h2 className="heading-quaternary">
                    We give knowledge to (NF)patients, families, and caregivers{" "}
                </h2>
                <p className="body-large color-light-grey w-300">
                    Collection of simplified NF articles certified by experts.{" "}
                    <span className="w-600 ">Powered by REiNS.</span>
                </p>
            </div>
            <Link href="/articles" className="btn btn-primary-white">
                Explore All
            </Link>
        </div>
    );
}

export default HomeServiceBanner;
