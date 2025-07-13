// src/components/PDFPreview.js
import React from "react";

export default function PDFPreview({ fileId }) {
  return (
    <iframe
      src={`https://drive.google.com/file/d/${fileId}/preview`}
      width="640"
      height="480"
      allow="autoplay"
      title="PDF Preview"
      style={{ border: "none" }}
    />
  );
}
