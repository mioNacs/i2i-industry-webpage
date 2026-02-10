import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer';
import { Document, BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';
import Link from 'next/link';
import { ReactNode } from 'react';


const options: Options = {
    renderMark: {
        [MARKS.BOLD]: (text: ReactNode) => <span className="font-bold text-gray-900">{text}</span>,
        [MARKS.ITALIC]: (text: ReactNode) => <span className="italic">{text}</span>,
        [MARKS.CODE]: (text: ReactNode) => <code className="bg-gray-100 rounded px-1 py-0.5 text-sm font-mono text-primary">{text}</code>,
    },
    renderNode: {
        [BLOCKS.HEADING_1]: (node: any, children: ReactNode) => (
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mt-8 mb-4">{children}</h1>
        ),
        [BLOCKS.HEADING_2]: (node: any, children: ReactNode) => (
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4 border-b border-gray-100 pb-2">{children}</h2>
        ),
        [BLOCKS.HEADING_3]: (node: any, children: ReactNode) => (
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-6 mb-3">{children}</h3>
        ),
        [BLOCKS.HEADING_4]: (node: any, children: ReactNode) => (
            <h4 className="text-lg md:text-xl font-bold text-gray-900 mt-6 mb-3">{children}</h4>
        ),
        [BLOCKS.PARAGRAPH]: (node: any, children: ReactNode) => (
            <p className="text-gray-600 leading-relaxed mb-4 text-base md:text-lg">{children}</p>
        ),
        [BLOCKS.UL_LIST]: (node: any, children: ReactNode) => (
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600 marker:text-primary">{children}</ul>
        ),
        [BLOCKS.OL_LIST]: (node: any, children: ReactNode) => (
            <ol className="list-decimal pl-6 mb-6 space-y-2 text-gray-600 marker:text-primary font-medium">{children}</ol>
        ),
        [BLOCKS.LIST_ITEM]: (node: any, children: ReactNode) => (
            <li className="pl-2">{children}</li>
        ),
        [BLOCKS.QUOTE]: (node: any, children: ReactNode) => (
            <blockquote className="border-l-4 border-primary/30 pl-4 py-2 my-6 italic text-gray-700 bg-gray-50 rounded-r-lg">
                {children}
            </blockquote>
        ),
        [BLOCKS.HR]: () => <hr className="my-8 border-gray-200" />,
        [INLINES.HYPERLINK]: (node: any, children: ReactNode) => {
            const url = node.data.uri;
            return (
                <Link 
                    href={url} 
                    className="text-primary hover:text-accent font-medium underline underline-offset-2 transition-colors"
                    target={url.startsWith('http') ? '_blank' : '_self'}
                    rel={url.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                    {children}
                </Link>
            );
        },
    },
    // Optional: Add a text renderer to catch emails if they are plain text
    renderText: (text: string) => {
        return text.split('\n').flatMap((text, i) => [i > 0 && <br key={i} />, text]);
    }
};

export default function RichTextRenderer({ content }: { content: Document }) {
    if (!content) return null;
    return <div className="rich-text font-sans">{documentToReactComponents(content, options)}</div>;
}
