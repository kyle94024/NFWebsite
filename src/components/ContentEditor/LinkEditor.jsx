import { Fragment, useEffect, useState } from "react";
import { Input } from "../ui/input";
import "./LinkEditor.scss";

export const LinkEditor = ({ href, onChange, onDelete }) => {
	const [input, setInput] = useState("");
	const [editing, setEditing] = useState(false);

	const editState = editing || href === null;

	useEffect(() => {
		setEditing(false);
	}, [href]);

	if (href === undefined) {
		return null;
	}

	return (
		<div className="link-editor"
			onBlur={() => console.log("haha")}
		>
			{ editState ?
				<Fragment>
					<p>Enter Link:</p>
					<form onSubmit={(e) => { 
						e.preventDefault(); 
						setEditing(false); 
						onChange(input); 
					}}>
						<Input
							value={input}
							onChange={(e) => setInput(e.target.value)}
						/>
						<button 
							className="editor-button"
							type="submit"
						>Save</button>
					</form>
				</Fragment> :
				<Fragment>
					<p>
						<span>Visit URL: </span> 
						<a href={href}>{href}</a>
					</p>
					<div>|</div>
					<button className="editor-button" onClick={() => setEditing(true)}>Edit</button>
					<button className="editor-button" onClick={() => onDelete()}>Delete</button>
				</Fragment>
			}
		</div>
	);
}