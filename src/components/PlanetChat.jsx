import { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Container,
  Paper,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { documentAPI } from "../api";
import { DocumentActions } from "./DocumentActions";
import { AnswerDisplay } from "./AnswerDisplay";
import { ChatHistory, MessageContainer } from "./ChatHistory";
import companyLogo from "../assets/company-logo.png";

export const PlanetChat = () => {
  const [message, setMessage] = useState("");
  const [currentDoc, setCurrentDoc] = useState(null);
  const [answer, setAnswer] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const [summaryGenerated, setSummaryGenerated] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("chatMessages");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to parse messages from localStorage:", error);
      return [];
    }
  });

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    } catch (error) {
      console.error("Failed to save messages to localStorage:", error);
    }
  }, [messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addMessage = (text, isUser = true) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text,
        isUser,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const handleAskQuestion = async (question, loadingSetter) => {
    if (!question.trim()) return;
    if (!currentDoc?.id) {
      showToast("Please upload a PDF first", "warning");
      return;
    }

    try {
      addMessage(question, true);
      loadingSetter(true);
      setMessage(""); // Clear input field after sending

      const response = await documentAPI.askQuestion(currentDoc.id, question);
      const answer = response.data.answer;

      // Add empty bot message first
      const botMessageId = Date.now();
      setMessages((prev) => [
        ...prev,
        {
          id: botMessageId,
          text: "",
          isUser: false,
          timestamp: new Date().toISOString(),
        },
      ]);

      // Typewriter effect
      let index = 0;
      const typeNextCharacter = () => {
        if (index < answer.length) {
          setMessages((prev) => {
            return prev.map((msg) => {
              if (msg.id === botMessageId) {
                return {
                  ...msg,
                  text: answer.substring(0, index + 1),
                };
              }
              return msg;
            });
          });
          index++;
          setTimeout(typeNextCharacter, 20);
        }
      };

      typeNextCharacter();
    } catch (error) {
      showToast(
        error.response?.data?.detail || "Failed to get response",
        "error"
      );
    } finally {
      loadingSetter(false);
    }
  };

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    try {
      setUploadLoading(true);
      const response = await documentAPI.uploadDocument(file);
      setCurrentDoc({
        id: response.data.id,
        name: file.name,
      });
      showToast(`PDF uploaded: ${file.name}`);
      setAnswer("");
      localStorage.clear();
      setMessages([]);
    } catch (error) {
      const message =
        error.response?.data?.detail || error.message || "Upload failed";
      showToast(message, "error");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentDoc?.id) return;

    try {
      setUploadLoading(true);
      await documentAPI.deleteDocument(currentDoc.id);
      setCurrentDoc(null);
      showToast("PDF removed successfully");
    } catch (error) {
      showToast("Failed to remove PDF", "error");
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#f8fafc", // Light background color
        overflow: "hidden", // Prevent double scrollbars
      }}
    >
      {/* Header */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 1200,
          borderRadius: 0,
          backgroundColor: "#ffffff",
        }}
      >
        <div>
          <img src={companyLogo} width={120} />
        </div>

        <DocumentActions
          fileName={currentDoc?.name}
          loading={uploadLoading}
          onUpload={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileUpload(e.target.files[0]);
            }
          }}
          onDelete={handleDelete}
        />
      </Paper>

      {/* Main Content with proper scrolling */}
      <Box
        ref={chatContainerRef}
        sx={{
          flexGrow: 1,
          overflowY: "auto", // Enable vertical scrolling
          py: 3,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Container maxWidth="md">
          <ChatHistory messages={messages} />
          <div ref={messagesEndRef} />


          {/* Answer Display */}
          {answer && <AnswerDisplay answer={answer} />}
        </Container>
      </Box>

      {/* Message Input */}
      <Paper
        elevation={2}
        sx={{
          py: 2,
          borderTop: 1,
          borderColor: "#e5e7eb",
          bgcolor: "#ffffff",
          position: "sticky",
          bottom: 0,
          zIndex: 10,
          borderRadius: 0,
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Ask a question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={!currentDoc || messageLoading}
              onKeyPress={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  !messageLoading &&
                  message.trim()
                ) {
                  e.preventDefault();
                  handleAskQuestion(message, setMessageLoading);
                }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "& fieldset": { borderColor: "#e2e8f0" },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={() => handleAskQuestion(message, setMessageLoading)}
              disabled={!currentDoc || messageLoading || !message.trim()}
              sx={{
                bgcolor: "#7c3aed",
                "&:hover": { bgcolor: "#6d28d9" },
                borderRadius: "50%",
                minWidth: "48px",
                width: "48px",
                height: "48px",
              }}
            >
              {messageLoading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                <SendIcon sx={{ color: "white" }} />
              )}
            </Button>
          </Box>
        </Container>
      </Paper>

      {/* Toast Notifications */}
      <Snackbar
        open={toast.open}
        autoHideDuration={2000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast.severity}
          sx={{ width: "100%" }}
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
