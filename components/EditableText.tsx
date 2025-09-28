
import React, { useState, useRef, useEffect } from 'react';

interface EditableTextProps {
    initialValue: string;
    onSave: (newValue: string) => void;
    as: 'h1' | 'h2' | 'div';
    className?: string;
}

const EditableText: React.FC<EditableTextProps> = ({ initialValue, onSave, as, className }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialValue);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);
    
    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);

    const handleBlur = () => {
        setIsEditing(false);
        if (value.trim() !== initialValue.trim()) {
            onSave(value);
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && as !== 'div') {
           handleBlur();
        } else if (e.key === 'Escape') {
            setValue(initialValue);
            setIsEditing(false);
        }
    };
    
    // Simple markdown to HTML renderer
    const renderMarkdown = (text: string) => {
        return text
            .split('\n')
            .map((line, i) => {
                if (line.startsWith('### ')) {
                    return <h3 key={i} className="text-xl font-semibold mt-4 mb-2">{line.substring(4)}</h3>;
                }
                if (line.match(/^\s*$/)) {
                    return <br key={i}/>;
                }
                const parts = line.split(/(\*.*?\*)/g);
                return <p key={i} className="my-2">{parts.map((part, j) => 
                    part.startsWith('*') && part.endsWith('*') ? 
                    <em key={j}>{part.slice(1, -1)}</em> : 
                    part
                )}</p>;
            });
    };

    if (isEditing) {
        if (as === 'div') {
            return (
                <textarea
                    ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className={`${className} w-full h-full p-12 bg-blue-50 dark:bg-gray-700 border-none outline-none resize-none`}
                />
            );
        }
        return (
            <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className={`${className} w-full bg-blue-50 dark:bg-gray-700 border-none outline-none`}
            />
        );
    }

    const Tag = as;
    return (
        <Tag className={`${className} cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition p-1`} onClick={() => setIsEditing(true)}>
            {as === 'div' ? renderMarkdown(value) : value}
        </Tag>
    );
};

export default EditableText;
