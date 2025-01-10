import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";

import { ChevronsUpDown } from "lucide-react";

import "./HeadingSelector.scss";

const HEADINGS = [
	"Normal",
	"Heading 1",
	"Heading 2",
	"Heading 3",
	"Heading 4",
	"Heading 5",
	"Heading 6",
];


export const HeadingSelector = ({ isActive, setNode }) => {
	function getActiveNode() {
		let pos = null;

		HEADINGS.forEach((_, idx) => {
			if (idx == 0 && isActive('paragraph')) {
				pos = 0;
			} 

			if (idx > 0 && isActive('heading', {level: idx })) {
				pos = idx;
			}
		})

		return pos;
	}

	function onValueChange(value) {
		if (value == 0) {
			setNode('paragraph');
		} else {
			setNode('heading', { level: value });
		}
	}


	const position = getActiveNode();


	return (
		<DropdownMenu className="dropdown">
			<DropdownMenuTrigger asChild>
				<button 
					className={`dropdown__trigger ${
						position > 0 ? 'dropdown__selected' : ''
					}`}>
					<span>{position !== null ? HEADINGS[position] : null}</span>
					<ChevronsUpDown size={16} />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="dropdown__content">
				<DropdownMenuRadioGroup 
					value={position} 
					className="dropdown__group"
					onValueChange={onValueChange}
				>
					<DropdownMenuRadioItem className="dropdown__item" value={0}>
						<span>Normal Text</span>
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem className="dropdown__item" value={1}>
						<h1>Heading 1</h1>
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem className="dropdown__item" value={2}>
						<h2>Heading 2</h2>
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem className="dropdown__item" value={3}>
						<h3>Heading 3</h3>
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem className="dropdown__item" value={4}>
						<h4>Heading 4</h4>
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem className="dropdown__item" value={5}>
						<h5>Heading 5</h5>
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem className="dropdown__item" value={6}>
						<h6>Heading 6</h6>
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}