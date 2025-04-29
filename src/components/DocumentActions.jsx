import { Button, Typography, CircularProgress } from "@mui/material";
import add from "../assets/add.png";
import pdf from "../assets/pdf.png";

export const DocumentActions = ({ fileName, loading, onUpload, onDelete }) => (
  <label htmlFor="pdf-upload">
    <input
      type="file"
      accept=".pdf"
      onChange={onUpload}
      style={{ display: "none" }}
      id="pdf-upload"
      disabled={loading}
    />
    <div className="flex items-center gap-4">
      {fileName && (
        <div className="flex items-center gap-x-2" onClick={onDelete}>
          <img src={pdf} width={30} />
          <p className="text-green-500">{fileName}</p>
        </div>
      )}

      <Button
        variant="outlined"
        component="span"
        color="black"
        disabled={loading}
        sx={{
          "&:hover": { bgcolor: "#0023" },
          textTransform: "none",
          minWidth: 10,
        }}
      >
        <div className="flex items-center justify-between gap-x-4">
          <img src={add} />
          <p className="md:block hidden">Upload PDF</p>
        </div>
      </Button>
    </div>
  </label>
);
