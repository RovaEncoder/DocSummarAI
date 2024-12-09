import { NextResponse } from "next/server";
import { IncomingForm } from "formidable";
import type { IncomingMessage } from "http";
import { Readable } from "stream";

export const config = {
  api: {
    bodyParser: false, // Désactiver le bodyParser intégré
  },
};

// Fonction pour convertir ReadableStream en Node.js Readable
function readableStreamToNodeReadable(stream: ReadableStream): Readable {
  const reader = stream.getReader();
  return new Readable({
    async read() {
      const { done, value } = await reader.read();
      if (done) {
        this.push(null); // Fin du flux
      } else {
        this.push(Buffer.from(value)); // Pousse les données dans le flux
      }
    },
  });
}

// Fonction pour transformer Request en IncomingMessage
async function parseRequest(req: Request): Promise<IncomingMessage> {
  const body = req.body ? readableStreamToNodeReadable(req.body) : null;

  // Ajout des métadonnées pour IncomingMessage
  const incomingMessage = Object.assign(body || new Readable(), {
    method: req.method,
    headers: Object.fromEntries(req.headers.entries()),
  });

  return incomingMessage as IncomingMessage;
}

// Route POST pour gérer l'upload
export async function POST(req: Request) {
  const form = new IncomingForm();

  try {
    const incomingMessage = await parseRequest(req);

    const data = await new Promise((resolve, reject) => {
      form.parse(incomingMessage, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    return NextResponse.json({ message: "Fichier uploadé avec succès", data });
  } catch (error) {
    console.error("Erreur lors de l'upload :", error);
    return NextResponse.json(
      { message: "Erreur lors de l'upload" },
      { status: 500 }
    );
  }
}
