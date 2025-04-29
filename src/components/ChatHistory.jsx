import { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import botLogo from "../assets/bot.png"; // Adjust this path to your bot logo

// ChatHistory Component with improved overflow handling and light theme
const ChatHistory = ({ messages }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
      {messages.map((msg) => (
        <Box
          key={msg.id}
          sx={{
            maxWidth: "800px",
            width: "100%",
            color: "text.primary",
            borderRadius: 1,
            p: 2,
            border: "1px solid #e5e7eb",
            mx: "auto",
            backgroundColor: "#ffffff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
            {/* Avatar section */}
            <Box sx={{ flexShrink: 0, mt: 0.5 }}>
              {msg.isUser ? (
                <Box
                  sx={{
                    borderRadius: "50%",
                    bgcolor: "#7e22ce",
                    height: 28,
                    width: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "0.875rem",
                  }}
                >
                  U
                </Box>
              ) : (
                <Box
                  component="img"
                  src={botLogo}
                  alt="Bot"
                  sx={{ width: 28, height: 28 }}
                />
              )}
            </Box>

            {/* Message content with improved overflow handling */}
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  "& pre": {
                    backgroundColor: "#f8f9fa", // Light background for code blocks
                    padding: 2,
                    borderRadius: 1,
                    overflowX: "auto", // Horizontal scrolling for code
                    color: "#333333", // Dark text for better contrast in light theme
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
                  "& ul, & ol": {
                    paddingLeft: isMobile ? "20px" : "24px",
                  },
                }}
              >
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={materialLight}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                    h1: ({ node, ...props }) => (
                      <Typography
                        variant="h5"
                        {...props}
                        sx={{ color: "#1e293b", mb: 1, fontWeight: 600 }}
                      />
                    ),
                    h2: ({ node, ...props }) => (
                      <Typography
                        variant="h6"
                        {...props}
                        sx={{ color: "#1e293b", mb: 1, fontWeight: 600 }}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <Typography
                        variant="subtitle1"
                        {...props}
                        sx={{ color: "#1e293b", mb: 1, fontWeight: 600 }}
                      />
                    ),
                    p: ({ node, ...props }) => (
                      <Typography
                        variant="body1"
                        {...props}
                        sx={{ color: "#475569", lineHeight: 1.6 }}
                      />
                    ),
                    ul: ({ node, ...props }) => (
                      <Box
                        component="ul"
                        sx={{
                          pl: 3,
                          my: 1,
                          listStyleType: "disc",
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
                          color: "#7c3aed",
                          textDecoration: "underline",
                          wordBreak: "break-all",
                        }}
                      />
                    ),
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </Box>

              {/* Timestamp */}
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mt: 1,
                  color: msg.isUser ? "text.secondary" : "#7c3aed",
                  fontSize: "0.75rem",
                }}
              >
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

// Improved code block component with scrolling and light theme
export const CodeBlock = ({ children, language }) => {
  return (
    <Box
      sx={{
        maxWidth: "100%",
        overflowX: "auto",
        borderRadius: 1,
        mb: 2,
        border: "1px solid #e2e8f0",
      }}
    >
      <SyntaxHighlighter
        language={language || "javascript"}
        style={materialLight}
        customStyle={{
          margin: 0,
          padding: "16px",
          backgroundColor: "#f8f9fa",
          color: "#333333",
        }}
      >
        {children}
      </SyntaxHighlighter>
    </Box>
  );
};

// Main message area with proper scrolling container
export const MessageContainer = ({ children }) => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        overflowY: "auto",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        py: 3,
        maxHeight: "calc(100vh - 128px)", // Adjust based on your header and footer height
      }}
    >
      <Container maxWidth="md">{children}</Container>
    </Box>
  );
};

export { ChatHistory };
