"use client";
import "./SearchArticles.scss";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import useSearchStore from "@/store/useSearchStore"; // Import the Zustand store

const SearchArticles = () => {
    const router = useRouter();
    const { searchQuery, setSearchQuery } = useSearchStore(); // Use Zustand state

    const handleChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (searchQuery) {
            router.push(`/articles`);
        }
    };

    return (
        <form onSubmit={handleSearchSubmit} className="search-articles">
            <div className="search-articles__bar">
                <Search className="search-articles__icon" />
                <Input
                    type="text"
                    placeholder="Search for articles"
                    className="search-articles__input"
                    value={searchQuery}
                    onChange={handleChange}
                />
            </div>
            <Button className="search-articles__button" type="submit">
                <ArrowRight className="search-articles__button-icon" />
            </Button>
        </form>
    );
};

export default SearchArticles;
