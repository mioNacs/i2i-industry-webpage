import ReactMarkdown from "react-markdown";

export default function JobDescriptionSections({
  jobOverview,
}: {
  jobOverview: string;
}) {
  return (
    <div className="text-gray-700 leading-relaxed">
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-6 mb-4 text-gray-900" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-6 mb-3 text-gray-900" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-4 mb-2 text-gray-900" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-2 mb-4" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-5 space-y-2 mb-4" {...props} />,
          li: ({ node, ...props }) => <li className="pl-1" {...props} />,
          p: ({ node, ...props }) => <p className="mb-4 whitespace-pre-wrap" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
        }}
      >
        {jobOverview}
      </ReactMarkdown>
    </div>
  );
}
