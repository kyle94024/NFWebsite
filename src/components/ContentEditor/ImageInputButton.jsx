import { useRef } from "react";

import "./utils.scss";


export const ImageInputButton = ({ onChange, children }) => {
	const input = useRef(null);

	function onInputChange() {
		const file = input.current.files[0];
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = () => {
			onChange(reader.result);
			input.current.value = null;
		}
	}

	return (
		<div>
			<input 
				style={{ display: "none" }} 
				ref={input} 
				type="file" 
				id="image-input"
				onChange={onInputChange}
			/>
			<label 
				htmlFor="image-input"
				onClick={() => input.current.click()} 
			>
				<button className="editor-button">
					{ children }
				</button>
			</label>
		</div>
	);
};