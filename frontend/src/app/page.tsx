"use client";

import FileUpload from "./components/FileUpload";

export default function Home() {
  return (
    <main
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#1e293b] to-[#0f172a]
"
    >
      <h1 className="text-3xl font-extrabold text-white mb-10">
        Résumé Automatique de Fichiers
      </h1>
      <FileUpload />
    </main>
  );
}
