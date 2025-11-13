import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import { cn } from '@/lib/utils'

interface MarkdownMessageProps {
  content: string
  className?: string
  isUserMessage?: boolean
}

export function MarkdownMessage({ 
  content, 
  className, 
  isUserMessage = false 
}: MarkdownMessageProps) {
  return (
    <div className={cn("markdown-content", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          // Headings
          h1: ({ className, ...props }) => (
            <h1 
              className={cn(
                "text-lg font-bold mb-2 mt-4 first:mt-0",
                isUserMessage ? "text-primary-foreground" : "text-foreground",
                className
              )} 
              {...props} 
            />
          ),
          h2: ({ className, ...props }) => (
            <h2 
              className={cn(
                "text-base font-semibold mb-2 mt-3 first:mt-0",
                isUserMessage ? "text-primary-foreground" : "text-foreground",
                className
              )} 
              {...props} 
            />
          ),
          h3: ({ className, ...props }) => (
            <h3 
              className={cn(
                "text-sm font-medium mb-1 mt-2 first:mt-0",
                isUserMessage ? "text-primary-foreground" : "text-foreground",
                className
              )} 
              {...props} 
            />
          ),
          
          // Paragraphs
          p: ({ className, ...props }) => (
            <p 
              className={cn(
                "text-sm leading-relaxed mb-2 last:mb-0",
                isUserMessage ? "text-primary-foreground" : "text-foreground",
                className
              )} 
              {...props} 
            />
          ),
          
          // Lists
          ul: ({ className, ...props }) => (
            <ul 
              className={cn(
                "list-disc list-inside mb-2 text-sm space-y-1",
                isUserMessage ? "text-primary-foreground" : "text-foreground",
                className
              )} 
              {...props} 
            />
          ),
          ol: ({ className, ...props }) => (
            <ol 
              className={cn(
                "list-decimal list-inside mb-2 text-sm space-y-1",
                isUserMessage ? "text-primary-foreground" : "text-foreground",
                className
              )} 
              {...props} 
            />
          ),
          li: ({ className, ...props }) => (
            <li 
              className={cn(
                "text-sm",
                isUserMessage ? "text-primary-foreground" : "text-foreground",
                className
              )} 
              {...props} 
            />
          ),
          
          // Code blocks
          code: ({ className, ...props }: any) => {
            const isInline = !props.children?.toString().includes('\n')
            return (
              <code
                className={cn(
                  isInline
                    ? cn(
                        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-medium",
                        isUserMessage 
                          ? "bg-primary-foreground/20 text-primary-foreground" 
                          : "bg-muted text-muted-foreground"
                      )
                    : "relative rounded font-mono text-xs",
                  className
                )}
                {...props}
              />
            )
          },
          pre: ({ className, ...props }) => (
            <pre
              className={cn(
                "mb-4 mt-2 overflow-x-auto rounded-lg border bg-zinc-950 p-4",
                className
              )}
              {...props}
            />
          ),
          
          // Blockquotes
          blockquote: ({ className, ...props }) => (
            <blockquote 
              className={cn(
                "border-l-4 border-border pl-4 italic mb-2",
                isUserMessage 
                  ? "border-primary-foreground/30 text-primary-foreground/90" 
                  : "border-muted-foreground/30 text-muted-foreground",
                className
              )} 
              {...props} 
            />
          ),
          
          // Links
          a: ({ className, ...props }) => (
            <a 
              className={cn(
                "underline underline-offset-4 hover:no-underline transition-all",
                isUserMessage 
                  ? "text-primary-foreground hover:text-primary-foreground/80" 
                  : "text-primary hover:text-primary/80",
                className
              )}
              target="_blank"
              rel="noopener noreferrer"
              {...props} 
            />
          ),
          
          // Strong/Bold text
          strong: ({ className, ...props }) => (
            <strong 
              className={cn(
                "font-semibold",
                isUserMessage ? "text-primary-foreground" : "text-foreground",
                className
              )} 
              {...props} 
            />
          ),
          
          // Emphasis/Italic text
          em: ({ className, ...props }) => (
            <em 
              className={cn(
                "italic",
                isUserMessage ? "text-primary-foreground" : "text-foreground",
                className
              )} 
              {...props} 
            />
          ),
          
          // Horizontal rule
          hr: ({ className, ...props }) => (
            <hr 
              className={cn(
                "my-4 border-border",
                className
              )} 
              {...props} 
            />
          ),
          
          // Tables
          table: ({ className, ...props }) => (
            <div className="mb-4 overflow-x-auto">
              <table 
                className={cn(
                  "w-full border-collapse text-sm",
                  className
                )} 
                {...props} 
              />
            </div>
          ),
          thead: ({ className, ...props }) => (
            <thead 
              className={cn(
                "border-b border-border",
                className
              )} 
              {...props} 
            />
          ),
          tbody: ({ className, ...props }) => (
            <tbody 
              className={cn(
                className
              )} 
              {...props} 
            />
          ),
          tr: ({ className, ...props }) => (
            <tr 
              className={cn(
                "border-b border-border/50 last:border-0",
                className
              )} 
              {...props} 
            />
          ),
          td: ({ className, ...props }) => (
            <td 
              className={cn(
                "px-3 py-2 text-left",
                isUserMessage ? "text-primary-foreground" : "text-foreground",
                className
              )} 
              {...props} 
            />
          ),
          th: ({ className, ...props }) => (
            <th 
              className={cn(
                "px-3 py-2 text-left font-medium",
                isUserMessage ? "text-primary-foreground" : "text-foreground",
                className
              )} 
              {...props} 
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}