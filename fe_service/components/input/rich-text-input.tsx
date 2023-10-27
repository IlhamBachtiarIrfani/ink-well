"use client"

import React from 'react';
import { Editor, EditorState, convertFromHTML, ContentState, ContentBlock, RichUtils } from 'draft-js';

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
    }

    return (
        <button
            onClick={onButtonClick}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${style}`}
        >
            {props.icon}
        </button>
    )
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

export default function RichTextInputComponent() {
    const blocks = convertFromHTML("");
    const [editorState, setEditorState] = React.useState(
        EditorState.createWithContent(ContentState.createFromBlockArray(blocks.contentBlocks, blocks.entityMap))
    );

    const editor = React.useRef<Editor>(null);

    function focusEditor() {
        editor.current?.focus();
    }

    React.useEffect(() => {
        focusEditor()
    }, []);

    function getWordCount() {
        const plainText = editorState.getCurrentContent().getPlainText('');
        const regex = /(?:\r\n|\r|\n)/g;
        const cleanString = plainText.replace(regex, ' ').trim();
        const wordArray = cleanString.match(/\S+/g);
        return wordArray ? wordArray.length : 0;
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
        const newEditorState = RichUtils.toggleInlineStyle(editorState, style);
        setEditorState(EditorState.forceSelection(newEditorState, newEditorState.getSelection()));
    };

    function hasStyle(style: string) {
        const currentStyle = editorState.getCurrentInlineStyle();
        return currentStyle.has(style);
    };

    function handleBlockType(blockType: string) {
        setEditorState(RichUtils.toggleBlockType(editorState, blockType));
    };

    function hasBlockType(blockType: string) {
        const contentState = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const block = contentState.getBlockForKey(selection.getStartKey());
        return block.getType() === blockType;
    };

    return (
        <div className='relative top-0 bg-white px-10 py-6 rounded-2xl border-b-4 border-black'>
            <div className='sticky top-20 bg-white py-4 flex gap-4 items-center'>
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

                <p className='font-black grow text-right whitespace-nowrap'>{getWordCount()} Words</p>
            </div>

            <div className='mt-5 editor-container'>
                <Editor
                    ref={editor}
                    handleKeyCommand={handleKeyCommand}
                    editorState={editorState}
                    onChange={editorState => setEditorState(editorState)}
                />
            </div>
        </div>
    )
}
