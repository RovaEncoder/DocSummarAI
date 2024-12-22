"use client";

import React, { useState } from "react";

const categories = [
  "general",
  "science",
  "finance",
  "medical",
  "legal",
  "news",
  "technical",
  // "academic",
  // "marketing",
  // "literature",
  // "sports",
  // "technology",
  // "social_media",
  // "environment",
  // "education",
  // "politics",
  // "entertainment",
];

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [category, setCategory] = useState<string>("general");
  const [minLength, setMinLength] = useState<number>(40);
  const [maxLength, setMaxLength] = useState<number>(100);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

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
    formData.append("category", category);
    formData.append("min_length", String(minLength));
    formData.append("max_length", String(maxLength));

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

  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(response).then(() => {
        setCopySuccess("Résumé copié dans le presse-papiers !");
        setTimeout(() => setCopySuccess(null), 2000); // Réinitialise le message après 2 secondes
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900 p-8">
      <div className="flex gap-8 max-w-7xl w-full">
        {/* Section gauche */}
        <div
          className="bg-white shadow-lg rounded-lg p-6"
          style={{ width: "400px" }}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Résumé Automatique de Fichiers
          </h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Upload de fichier
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Sélectionnez un fichier pour générer un résumé automatique.
          </p>

          {/* Sélection de la catégorie */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie :
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1 text-gray-700"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Longueur min/max */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Longueur minimale :
            </label>
            <input
              type="number"
              value={minLength}
              onChange={(e) => setMinLength(Number(e.target.value))}
              className="w-full border border-gray-300 rounded px-2 py-1 text-gray-700"
              min={10}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Longueur maximale :
            </label>
            <input
              type="number"
              value={maxLength}
              onChange={(e) => setMaxLength(Number(e.target.value))}
              className="w-full border border-gray-300 rounded px-2 py-1 text-gray-700"
              min={20}
            />
          </div>

          {/* Upload de fichier */}
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
        </div>

        {/* Section droite */}
        <div
          className="bg-gray-50 shadow-lg rounded-lg p-6"
          style={{ width: "600px" }}
        >
          {isUploading ? (
            <div className="flex justify-center items-center h-full">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/3a/Gray_circles_rotate.gif"
                alt="Chargement..."
                className="h-16"
              />
            </div>
          ) : response ? (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Résumé
              </h2>
              <div className="p-4 bg-white border border-gray-200 rounded-lg h-64 overflow-auto">
                <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                  {response}
                </pre>
              </div>
              <button
                onClick={handleCopy}
                className="mt-4 px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600"
              >
                Copier le résumé
              </button>
              {copySuccess && (
                <p className="text-sm text-green-600 mt-2">{copySuccess}</p>
              )}
            </div>
          ) : (
            <div className="flex justify-center items-center h-full text-gray-400">
              <p>Aucun résumé disponible.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
