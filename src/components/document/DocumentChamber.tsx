import React, { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import SignaturePad from "./SignaturePad";

import { pdfjs } from "react-pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker?url";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

const DocumentChamber: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null); // ✅ new state for object URL
  const [numPages, setNumPages] = useState<number>(0);
  const [status, setStatus] = useState<"Draft" | "In Review" | "Signed">("Draft");

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploadedFile = e.target.files[0];
      console.log("Uploaded file:", uploadedFile.name, "Type:", uploadedFile.type); // ✅ Debug log
      setFile(uploadedFile);
    }
  };
  

  // ✅ Create and clean up object URL
  useEffect(() => {
    if (file && file.type === "application/pdf") {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPdfUrl(null);
    }
  }, [file]);
  

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl space-y-6 border border-gray-200">
      {/* Upload Section */}
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition">
        <label className="cursor-pointer text-center">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={onFileChange}
          />
          <p className="text-gray-600">
            <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-400">PDF, DOC, DOCX (max 10MB)</p>
        </label>
      </div>

      

{file && file.type === "application/pdf" && pdfUrl && (
  <div className="border rounded-lg overflow-hidden max-h-[500px] overflow-y-auto">
    <Document
      file={pdfUrl}
      onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      onLoadError={(err) => console.error("PDF load error:", err)}
    >
      {Array.from(new Array(numPages), (_, index) => (
        <Page key={`page_${index + 1}`} pageNumber={index + 1} scale={1.2} />
      ))}
    </Document>
  </div>
)}

{file && file.type !== "application/pdf" && (
  <p className="text-gray-600 bg-gray-50 p-3 rounded-md">
    Preview not available. File uploaded: <strong>{file.name}</strong>
  </p>
)}

      {/* Signature Pad */}
      <div className="border rounded-lg p-4">
        <h2 className="font-semibold text-gray-700 mb-2">Signature</h2>
        <SignaturePad />
      </div>

      {/* Status */}
      <div className="flex items-center space-x-3">
        <span className="font-semibold text-gray-700">Status:</span>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          className="border px-3 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="Draft">Draft</option>
          <option value="In Review">In Review</option>
          <option value="Signed">Signed</option>
        </select>
        {/* Display status badge */}
        <span
          className={`px-2 py-1 rounded-semi text-white font-semibold ${
            status === "Draft"
              ? "bg-gray-500"
              : status === "In Review"
              ? "bg-yellow-500"
              : "bg-green-600"
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
};

export default DocumentChamber;
