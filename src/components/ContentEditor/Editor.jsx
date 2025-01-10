import { useRef } from "react";

import { EditorContent, useEditor, BubbleMenu, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";

import { Bold, ImageIcon, Italic, LinkIcon, List, ListOrdered, RemoveFormatting, Strikethrough, UnderlineIcon } from "lucide-react";

import { HeadingSelector } from "./HeadingSelector"; 
import { LinkEditor } from "./LinkEditor";
import { ImageInputButton } from "./ImageInputButton";

import "./utils.scss";
import "./Editor.scss";


const ToggleButton = ({ active, children, ...buttonProps }) => {
	return (
		<button
			type="button"
			aria-selected={active}
			className="editor-button"
			{...buttonProps}
		>
			{children}
		</button>
	);
};

/**
* Rich text Editor Component
* @typedef {object} EditorProps
*  @property {string} content
*  @property {function} onChange
*
* @param {EditorProps} props
*/
export const Editor = ({ content, onChange }) => {
	const editor = useEditor({
		enableContentCheck: true,
		extensions: [
			StarterKit, 
			Image,
			Link,
			Underline,
		],
		content: content,
		onContentError: ({ error }) => console.error(error),
		onUpdate: ({ editor }) => {
			if (onChange) onChange(editor.getHTML());
		},

		onTransaction: ({ editor, transaction }) => {
			let tr = transaction;
			const removingEmptyLink = tr.getMeta("removeEmptyLink");

			// if (!removingEmptyLink && !tr.selection.eq(oldSelection.current)) {
            if (oldSelection.current && !removingEmptyLink && !tr.selection.eq(oldSelection.current)) {
				const marks = oldSelection.current.$to.marks();

				const emptyLink = marks && marks.find(mark => 
					mark.type.name === "link" &&
					mark.attrs.href === null
				);

				if (emptyLink) {
					const { to } = oldSelection.current;
					tr = editor.state.tr.removeMark(0, to, emptyLink);
					tr = tr.setMeta("removeEmptyLink", true);
					editor.view.dispatch(tr);
				}
			}

			oldSelection.current = editor.state.selection;
		},
	});


	const editorState = useEditorState({
		editor,
		selector: ({ editor }) => {
            if (!editor) {
                return {
                  isBold: false,
                  isItalic: false,
                  isUnderline: false,
                  isStrikethrough: false,
                  isLink: false,
                  isList: false,
                  isOrderedList: false
                  
                };
              }
            return {
                isBold: editor.isActive("bold"),
                isItalic: editor.isActive("italic"),
                isUnderline: editor.isActive("underline"),
                isStrikethrough: editor.isActive("strike"),
                isLink: editor.isActive("link"),
                isList: editor.isActive("bulletList"),
                isOrderedList: editor.isActive("orderedList")
            };
		}
	})
    
	// const oldSelection = useRef(editor.state.selection);
    const oldSelection = useRef(null);

    if (!editor) {
        return <p>Loading editor...</p>;
      }

	return (
		<div className="editor">
			<div className="editor__toolbar">
				<div>
					<HeadingSelector 
						isActive={(type, props) => editor.isActive(type, props)}
						setNode={(type, props) => editor.chain().focus().setNode(type, props).run()}
					/>
				</div>
				<div>
					<ToggleButton
						title="Bold"
						onClick={() => editor.chain().focus().toggleBold().run()}
						active={editorState.isBold}
					>
						<Bold size={16} />
					</ToggleButton>
					<ToggleButton
						title="Italic"
						onClick={() => editor.chain().focus().toggleItalic().run()}
						active={editorState.isItalic}
					>
						<Italic size={16} />
					</ToggleButton>
					<ToggleButton
						title="Strikethrough"
						onClick={() => editor.chain().focus().toggleStrike().run()}
						active={editorState.isStrikethrough}
					>
						<Strikethrough size={16} />
					</ToggleButton>
					<ToggleButton
						title="Underline"
						onClick={() => editor.chain().focus().toggleUnderline().run()}
						active={editorState.isUnderline}
					>
						<UnderlineIcon size={16} />
					</ToggleButton>
				</div>
				<div>
					<ToggleButton
						title="Ordered List"
						onClick={() => editor.chain().focus().toggleOrderedList().run()}
						active={editorState.isOrderedList}
					>
						<ListOrdered size={16} />
					</ToggleButton>
					<ToggleButton
						title="List"
						onClick={() => editor.chain().focus().toggleBulletList().run()}
						active={editorState.isList}
					>
						<List size={16} />
					</ToggleButton>
				</div>
				<div>
					<ImageInputButton 
						onChange={(url) => editor.chain().focus().setImage({ src: url }).run()}
					>
						<ImageIcon size={16} />
					</ImageInputButton>
				</div>
				<div>
					<ToggleButton
						title="Link"
						onClick={() => {
							if (editorState.isLink) {
								editor.chain().focus().unsetMark('link').run();
							} else {
								editor.chain().focus().toggleLink({ href: null }).run()
							}
						}}
						active={editorState.isLink}
					>
						<LinkIcon size={16} />
					</ToggleButton>
					<button className="editor-button" onClick={() => editor.chain().unsetAllMarks().run()}>
						<RemoveFormatting size={16} />
					</button>
				</div>
			</div>
			{ editor &&
				<BubbleMenu
					editor={editor}
					tippyOptions={{ placement: 'bottom' }}
					shouldShow={({ editor }) => editor.isActive("link")}
				>
					
					<LinkEditor 
						href={editor.getAttributes("link").href} 
						onChange={(href) => editor.chain().extendMarkRange("link").setLink({ href }).run()}
						onDelete={() => editor.chain().extendMarkRange("link").unsetLink().run()}
					/>
				</BubbleMenu>
			}
			<EditorContent className="editor__container" editor={editor} />
		</div>
	);
};