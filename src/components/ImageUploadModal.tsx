import { useState } from "react";
import {
  Modal,
  Box,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface ImageUploadModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (imageUrl: string) => void;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Convert file to base64 using Promise wrapper
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          try {
            if (!reader.result) {
              reject(new Error("Failed to read file"));
              return;
            }

            const base64String = reader.result.toString();
            const base64Match = base64String.match(
              /^data:image\/[a-z]+;base64,(.+)$/
            );

            if (!base64Match) {
              reject(new Error("Invalid image format"));
              return;
            }

            resolve(base64Match[1]);
          } catch (error) {
            reject(error);
          }
        };

        reader.onerror = () => {
          reject(new Error("Failed to read file"));
        };

        reader.readAsDataURL(selectedFile);
      });

      console.log("Image encoded successfully");

      const response = await fetch("/api/image/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file_name: selectedFile.name,
          image_data: base64Data,
          image_type: "categories",
          preserve_filename: true,
        }),
      });

      console.log("Upload response:", response);

      // Add response validation
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload failed:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      // Check for empty response

      const responseText = await response.text();
      console.log("Response text:", responseText);

      if (!responseText) {
        throw new Error("Empty response from server");
      }

      // Parse JSON response
      const data = JSON.parse(responseText);
      if (!data.image_url) {
        throw new Error("No image URL in response");
      }

      console.log("Image uploaded successfully", data);
      onSuccess(data.image_url);
      onClose();
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Upload Image
        </Typography>

        <Box sx={{ my: 3 }}>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="image-upload"
            type="file"
            onChange={handleFileSelect}
          />
          <label htmlFor="image-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
              fullWidth
            >
              Select Image
            </Button>
          </label>
          {selectedFile && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected: {selectedFile.name}
            </Typography>
          )}
        </Box>

        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? <CircularProgress size={24} /> : "Upload"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
