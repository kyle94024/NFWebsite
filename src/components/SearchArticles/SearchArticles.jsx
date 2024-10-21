import "./SearchArticles.scss";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const SearchArticles = () => {
    return (
        <div className="search-articles">
            <div className="search-articles__bar">
                <Search className="search-articles__icon" />
                <Input
                    type="text"
                    placeholder="Search for articles"
                    className="search-articles__input"
                />
            </div>
            <Button className="search-articles__button">
                <ArrowRight className="search-articles__button-icon" />
            </Button>
        </div>
    );
};

export default SearchArticles;
