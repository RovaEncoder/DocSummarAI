"use client";

import React, { useState } from "react";

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setResponse(null); // Réinitialiser la réponse à chaque nouvelle sélection
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Veuillez sélectionner un fichier !");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/summarize/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Erreur backend : ", errorText);
        throw new Error(`Erreur backend : ${errorText}`);
      }

      const data = await res.json();
      setResponse(data.summary || "Aucune réponse reçue.");
    } catch (error) {
      console.error("Erreur lors de l'upload :", error);
      setResponse("Erreur lors de l'upload.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">Upload de fichier</h2>
      <input type="file" onChange={handleFileChange} className="mb-4" />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
        disabled={!file || isUploading}
      >
        {isUploading ? "In progress..." : "Résumer le fichier"}
      </button>
      {response && (
        <div className="mt-4 p-2 border border-gray-400 rounded">
          <p className="font-bold">Résumé :</p>
          <pre>{response}</pre>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
