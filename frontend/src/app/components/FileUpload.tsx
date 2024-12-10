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
    <div className="p-6 border border-gray-200 shadow-lg rounded-lg max-w-lg mx-auto bg-white">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Upload de fichier
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Sélectionnez un fichier pour générer un résumé automatique.
      </p>
      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
      />
      <button
        onClick={handleUpload}
        className={`px-6 py-2 w-full text-white font-medium rounded ${
          isUploading
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
        disabled={!file || isUploading}
      >
        {isUploading ? "Génération en cours..." : "Résumer le fichier"}
      </button>

      {response && (
        <div className="mt-6">
          <p className="font-bold text-gray-700 mb-2">Résumé :</p>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg h-48 overflow-auto">
            <pre className="text-sm text-gray-600 whitespace-pre-wrap">
              {response}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
