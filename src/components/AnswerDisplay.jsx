import { Card, CardContent, Typography, Box } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const AnswerDisplay = ({ answer }) => (
  <Card sx={{ 
    mb: 3, 
    maxWidth: "800px", 
    width: "100%", 
    mx: "auto", 
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)", 
    border: "1px solid #e5e7eb",
    borderRadius: 1
  }}>
    <CardContent>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Answer
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Box 
          sx={{
            "& pre": {
              backgroundColor: "#f8f9fa", // Light theme
              padding: 2,
              borderRadius: 1,
              overflowX: "auto", // Scrollable for wide content
              color: "#333333", // Dark text for light theme
              fontSize: "0.875rem",
              width: "100%",
              border: "1px solid #e2e8f0",
            },
            "& code": {
              fontFamily: "monospace",
              backgroundColor: "#f1f5f9",
              padding: "0.1em 0.2em",
              borderRadius: "0.2em",
              fontSize: "0.875rem",
              color: "#333333", // Dark text for better contrast
            },
          }}
        >
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={materialLight} // Using light theme
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code 
                    className={className} 
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              h1: ({ node, ...props }) => (
                <Typography
                  variant="h5"
                  {...props}
                  sx={{ color: '#1e293b', mb: 1, mt: 2, fontWeight: 600 }}
                />
              ),
              h2: ({ node, ...props }) => (
                <Typography
                  variant="h6"
                  {...props}
                  sx={{ color: '#1e293b', mb: 1, mt: 2, fontWeight: 600 }}
                />
              ),
              h3: ({ node, ...props }) => (
                <Typography
                  variant="subtitle1"
                  {...props}
                  sx={{ color: '#1e293b', mb: 1, mt: 2, fontWeight: 600 }}
                />
              ),
              p: ({ node, ...props }) => (
                <Typography
                  variant="body1"
                  {...props}
                  sx={{ color: '#475569', lineHeight: 1.6, mb: 2 }}
                />
              ),
              ul: ({ node, ...props }) => (
                <Box
                  component="ul"
                  sx={{
                    pl: 3,
                    my: 1,
                    listStyleType: 'disc',
                  }}
                  {...props}
                />
              ),
              ol: ({ node, ...props }) => (
                <Box
                  component="ol"
                  sx={{
                    pl: 3,
                    my: 1,
                    listStyleType: 'decimal',
                  }}
                  {...props}
                />
              ),
              li: ({ node, ...props }) => (
                <Box
                  component="li"
                  sx={{
                    mb: 0.5,
                    lineHeight: 1.6,
                  }}
                  {...props}
                />
              ),
              a: ({ node, ...props }) => (
                <Box
                  component="a"
                  {...props}
                  sx={{
                    color: '#7c3aed',
                    textDecoration: 'underline',
                    wordBreak: 'break-all',
                  }}
                />
              ),
              blockquote: ({ node, ...props }) => (
                <Box
                  component="blockquote"
                  sx={{
                    borderLeft: '4px solid #e2e8f0',
                    pl: 2,
                    py: 1,
                    my: 2,
                    color: '#64748b',
                    fontStyle: 'italic',
                  }}
                  {...props}
                />
              ),
              table: ({ node, ...props }) => (
                <Box
                  sx={{
                    overflowX: "auto", // Makes tables scrollable horizontally
                    mb: 2,
                    width: "100%",
                  }}
                >
                  <Box
                    component="table"
                    sx={{
                      width: "100%",
                      borderCollapse: "collapse",
                      minWidth: "400px", // Ensures table doesn't get too small
                    }}
                    {...props}
                  />
                </Box>
              ),
              th: ({ node, ...props }) => (
                <Box
                  component="th"
                  sx={{
                    borderBottom: '2px solid #e2e8f0',
                    p: 1,
                    textAlign: 'left',
                    fontWeight: 600,
                  }}
                  {...props}
                />
              ),
              td: ({ node, ...props }) => (
                <Box
                  component="td"
                  sx={{
                    borderBottom: '1px solid #e2e8f0',
                    p: 1,
                  }}
                  {...props}
                />
              ),
            }}
          >
            {answer}
          </ReactMarkdown>
        </Box>
      </Box>
    </CardContent>
  </Card>
);