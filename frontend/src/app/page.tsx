"use client";

import FileUpload from "./components/FileUpload";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-8">Testez l'Upload de fichier</h1>
      <FileUpload />
    </main>
  );
}
