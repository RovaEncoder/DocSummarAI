from fastapi import FastAPI, UploadFile, HTTPException
from transformers import pipeline
from utils.file_processing import extract_text_from_file
from fastapi.middleware.cors import CORSMiddleware
import logging

# Initialiser l'application FastAPI
app = FastAPI()

# Logger pour faciliter le débogage
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Charger le pipeline de résumé Hugging Face
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# Charger le pipeline de résumé Hugging Face avec le modèle sshleifer/distilbart-cnn-12-6
# summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")


# Ajouter le middleware CORS pour autoriser les requêtes depuis le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Autorise uniquement votre frontend Next.js
    allow_credentials=True,
    allow_methods=["*"],  # Autorise toutes les méthodes HTTP (GET, POST, etc.)
    allow_headers=["*"],  # Autorise tous les headers (Content-Type, Authorization, etc.)
)

# Limite de longueur pour le modèle
MAX_INPUT_LENGTH = 1024  # Limite en tokens (ou caractères pour simplifier ici)

@app.get("/")
def root():
    return {"message": "API de résumé de documents est opérationnelle."}

@app.post("/summarize/")
async def summarize(file: UploadFile):
    # Vérifier le type de fichier
    if not file.filename.endswith(('.txt', '.pdf')):
        raise HTTPException(status_code=400, detail="Seuls les fichiers .txt ou .pdf sont acceptés.")

    # Extraire le texte du fichier
    try:
        text = extract_text_from_file(file)

        if len(text) > MAX_INPUT_LENGTH:
            logger.info(f"Texte trop long ({len(text)} caractères). Tronqué à {MAX_INPUT_LENGTH} caractères.")
            # Tronquer le texte proprement à la fin de la phrase
            text = text[:MAX_INPUT_LENGTH]
            last_period = text.rfind(".")
            if last_period != -1:
                text = text[:last_period + 1]

    except Exception as e:
        logger.error(f"Erreur lors de l'extraction du fichier : {e}")
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'extraction du fichier : {e}")

    # Résumer le texte
    try:
        summary = summarizer(text, max_length=130, min_length=30, do_sample=False)
        return {"summary": summary[0]["summary_text"]}
    except Exception as e:
        logger.error(f"Erreur lors du résumé : {e}")
        raise HTTPException(status_code=500, detail=f"Erreur lors du résumé : {e}")
