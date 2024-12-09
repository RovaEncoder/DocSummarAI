import { NextResponse } from "next/server";
import { IncomingForm } from "formidable";
import fs from "fs/promises";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // Désactiver le bodyParser intégré
  },
};

export async function POST(req: Request) {
  const uploadDir = path.join(process.cwd(), "/public/uploads");

  // Créer le dossier s'il n'existe pas
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (error) {
    console.error("Erreur lors de la création du dossier :", error);
    return NextResponse.json(
      { message: "Erreur lors de la création du dossier" },
      { status: 500 }
    );
  }

  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err: any, fields, files) => {
      if (err) {
        console.error("Erreur lors de l'upload :", err);
        reject(
          NextResponse.json(
            { message: "Erreur lors de l'upload" },
            { status: 500 }
          )
        );
      }

      resolve(NextResponse.json({ message: "Fichier uploadé avec succès !" }));
    });
  });
}
