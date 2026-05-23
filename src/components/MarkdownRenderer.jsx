import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';

export default function MarkdownRenderer({ content }) {
  return (
    <div className="prose-bumdes">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          img: ({ node, ...props }) => (
            <img
              {...props}
              loading="lazy"
              className="rounded-xl my-6 max-w-full h-auto"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ),
          a: ({ node, ...props }) => (
            <a
              {...props}
              target={props.href?.startsWith('http') ? '_blank' : undefined}
              rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-6">
              <table {...props} />
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
