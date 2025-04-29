import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const documentAPI = {
  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return await api.post("/api/documents", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  askQuestion: async (docId, question) => {
    return await api.post(
      `/api/documents/${docId}/ask`,
      { question },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
  },

  listDocuments: async () => {
    return await api.get("/api/documents");
  },

  deleteDocument: async (docId) => {
    return await api.delete(`/api/documents/${docId}`);
  },
};
