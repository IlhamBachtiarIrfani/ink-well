"use client"

import React, { useRef, useState } from 'react';
import { Editor, EditorState, convertFromHTML, ContentState, ContentBlock, RichUtils, Modifier, SelectionState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { stateToHTML } from 'draft-js-export-html';

interface RichTextInputComponentProps {
    defaultValue?: string
    onStartTyping?: () => void
    onStopTyping?: () => void
    onInputChange?: (html: string) => void
}



const blockRenderers = {
    'header-one': (block: ContentBlock) => {
        return `<h1>${block.getText()}</h1>`;
    },
    'header-two': (block: ContentBlock) => {
        return `<h2>${block.getText()}</h2>`;
    },
    'header-three': (block: ContentBlock) => {
        return `<h3>${block.getText()}</h3>`;
    },
    'header-four': (block: ContentBlock) => {
        return `<h4>${block.getText()}</h4>`;
    },
    'header-five': (block: ContentBlock) => {
        return `<h5>${block.getText()}</h5>`;
    },
    'header-six': (block: ContentBlock) => {
        return `<h6>${block.getText()}</h6>`;
    }
};

export default function RichTextInputComponent(props: RichTextInputComponentProps) {
    const blocks = convertFromHTML(props.defaultValue ?? "");
    const [editorState, setEditorState] = React.useState(
        EditorState.createWithContent(ContentState.createFromBlockArray(blocks.contentBlocks, blocks.entityMap))
    );

    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    const editorRef = useRef<Editor | null>(null)

    function onInputChange(state: EditorState) {
        getHtmlOutput()

        if (!timer && props.onStartTyping) {
            props.onStartTyping()
        }

        clearTimeout(timer!);
        setEditorState(state);

        setTimer(setTimeout(() => {
            setTimer(null);

            if (props.onStopTyping) {
                props.onStopTyping()
            }
        }, 500));
    }

    function getHtmlOutput() {
        const contentState = editorState.getCurrentContent();
        const html = stateToHTML(contentState, { blockRenderers });

        if (props.onInputChange) {
            props.onInputChange(html)
        }
    }

    function getWordCount() {
        const plainText = editorState.getCurrentContent().getPlainText('');
        const regex = /(?:\r\n|\r|\n)/g;
        const cleanString = plainText.replace(regex, ' ').trim();
        const wordArray = cleanString.match(/\S+/g);
        return wordArray ? wordArray.length : 0;
    }

    function getCharCount() {
        const plainText = editorState.getCurrentContent().getPlainText('');
        const cleanString = plainText.replace(/\s/g, '');
        return cleanString.length;
    }

    function handleKeyCommand(command: string, editorState: EditorState) {
        const newState = RichUtils.handleKeyCommand(editorState, command);

        if (newState) {
            setEditorState(newState);
            return 'handled';
        }

        return 'not-handled';
    }

    function handleInlineStyle(style: string) {
        // Get the current selection
        let selection = editorState.getSelection();

        // Check if the selection is collapsed
        const isCollapsed = selection.isCollapsed();

        let newContentState;
        if (isCollapsed) {
            // If the selection is collapsed, insert an empty text and apply the style
            const contentState = Modifier.insertText(
                editorState.getCurrentContent(),
                selection,
                ' ',
                editorState.getCurrentInlineStyle()
            );

            // Create a new selection state that targets the inserted text
            const targetSelection = new SelectionState({
                anchorKey: selection.getAnchorKey(),
                anchorOffset: selection.getAnchorOffset(),
                focusKey: selection.getAnchorKey(),
                focusOffset: selection.getAnchorOffset() + 1,
            });

            // Apply the inline style to the new content state
            newContentState = Modifier.applyInlineStyle(
                contentState,
                targetSelection,
                style
            );
        } else {
            // If there's a text selection, toggle the style
            const hasStyle = editorState.getCurrentInlineStyle().has(style);
            newContentState = hasStyle
                ? Modifier.removeInlineStyle(editorState.getCurrentContent(), selection, style)
                : Modifier.applyInlineStyle(editorState.getCurrentContent(), selection, style);
        }

        // Create a new editor state with the new content state
        const newEditorState = EditorState.push(
            editorState,
            newContentState,
            'insert-characters'
        );

        // Force selection to the new editor state
        setEditorState(EditorState.forceSelection(newEditorState, newEditorState.getSelection()));
    };

    function hasStyle(style: string) {
        const currentStyle = editorState.getCurrentInlineStyle();
        return currentStyle.has(style);
    };

    function handleBlockType(blockType: string) {
        const newEditorState = RichUtils.toggleBlockType(editorState, blockType);
        const focusedEditor = EditorState.forceSelection(newEditorState, newEditorState.getSelection());
        setEditorState(focusedEditor);
    };

    function hasBlockType(blockType: string) {
        const contentState = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const block = contentState.getBlockForKey(selection.getStartKey());
        return block.getType() === blockType;
    };

    function focusEditor() {
        editorRef?.current?.focus()
    }

    return (
        <div className='relative bg-white' onClick={focusEditor}>
            <div className='sticky top-20 bg-white py-4 flex gap-4 items-center flex-wrap z-10'>
                <div className='flex gap-1'>
                    <FormatButton
                        onClick={() => handleBlockType('header-one')}
                        isActive={hasBlockType('header-one')}
                        icon={<span className='material-symbols-rounded'>
                            format_h1
                        </span>}
                    />
                    <FormatButton
                        onClick={() => handleBlockType('header-two')}
                        isActive={hasBlockType('header-two')}
                        icon={<span className='material-symbols-rounded'>
                            format_h2
                        </span>}
                    />
                    <FormatButton
                        onClick={() => handleBlockType('header-three')}
                        isActive={hasBlockType('header-three')}
                        icon={<span className='material-symbols-rounded'>
                            format_h3
                        </span>}
                    />
                    <FormatButton
                        onClick={() => handleBlockType('header-four')}
                        isActive={hasBlockType('header-four')}
                        icon={<span className='material-symbols-rounded'>
                            format_h4
                        </span>}
                    />
                </div>

                <div className='flex gap-1'>
                    <FormatButton
                        onClick={() => handleInlineStyle('BOLD')}
                        isActive={hasStyle('BOLD')}
                        icon={<span className='material-symbols-rounded'>
                            format_bold
                        </span>}
                    />
                    <FormatButton
                        onClick={() => handleInlineStyle('ITALIC')}
                        isActive={hasStyle('ITALIC')}
                        icon={<span className='material-symbols-rounded'>
                            format_italic
                        </span>}
                    />
                    <FormatButton
                        onClick={() => handleInlineStyle('UNDERLINE')}
                        isActive={hasStyle('UNDERLINE')}
                        icon={<span className='material-symbols-rounded'>
                            format_underlined
                        </span>}
                    />
                    <FormatButton
                        onClick={() => handleInlineStyle('STRIKETHROUGH')}
                        isActive={hasStyle('STRIKETHROUGH')}
                        icon={<span className='material-symbols-rounded'>
                            strikethrough_s
                        </span>}
                    />
                </div>

                <div className='flex gap-1'>
                    <FormatButton
                        onClick={() => handleBlockType('unordered-list-item')}
                        isActive={hasBlockType('unordered-list-item')}
                        icon={<span className='material-symbols-rounded'>
                            format_list_bulleted
                        </span>}
                    />
                    <FormatButton
                        onClick={() => handleBlockType('ordered-list-item')}
                        isActive={hasBlockType('ordered-list-item')}
                        icon={<span className='material-symbols-rounded'>
                            format_list_numbered
                        </span>}
                    />
                </div>

            </div>

            <div className='rich-text-container min-h-[10rem]'>
                <Editor
                    ref={editorRef}
                    handleKeyCommand={handleKeyCommand}
                    editorState={editorState}
                    onChange={onInputChange}
                    placeholder='Type your text here...'
                />
            </div>

            <div className='mt-5'>
                <p className='font-black grow text-right whitespace-nowrap'>{getCharCount()} Chars / {getWordCount()} Words</p>
            </div>
        </div>
    )
}


interface FormatButtonProps {
    isActive: boolean,
    icon: JSX.Element,
    onClick: () => void
}

function FormatButton(props: FormatButtonProps) {
    const activeStyle = "bg-red-400 text-white"
    const defaultStyle = " border border-black text-black"
    const style = props.isActive ? activeStyle : defaultStyle

    function onButtonClick(e: React.MouseEvent) {
        e.preventDefault();
        props.onClick();
        e.stopPropagation()
    }

    return (
        <button
            onClick={onButtonClick}
            className={`w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-all ${style}`}
        >
            {props.icon}
        </button>
    )
}