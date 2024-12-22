from fastapi import FastAPI, UploadFile, HTTPException, Form
from transformers import pipeline
from app.utils import extract_text_from_file
from fastapi.middleware.cors import CORSMiddleware
import logging
import os
import torch

# Désactiver les warnings inutiles
os.environ["TOKENIZERS_PARALLELISM"] = "false"

# Initialiser l'application FastAPI
app = FastAPI()

# Logger pour faciliter le débogage
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Ajouter le middleware CORS pour autoriser les requêtes depuis le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Autoriser le frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modèles de résumé en fonction des catégories
CATEGORY_MODELS = {
    "general": "facebook/bart-large-cnn",
    "science": "facebook/bart-large-cnn",  
    "finance": "google/pegasus-xsum",
    "medical": "google/pegasus-large",
    "legal": "facebook/bart-large-cnn",
    "news": "sshleifer/distilbart-cnn-12-6",
    "technical": "t5-small",
    "academic": "allenai/led-base-16384",
    "marketing": "philschmid/bart-large-cnn-samsum",
    "literature": "facebook/bart-large-cnn",
    "sports": "sshleifer/distilbart-cnn-12-6",
    "technology": "t5-small",
    "social_media": "facebook/bart-large-xsum",
    "environment": "allenai/led-base-16384",
    "education": "google/pegasus-large",
    "politics": "mrm8488/distilroberta-finetuned-squad2",
    "entertainment": "google/pegasus-xsum",
}

# Longueur maximale en tokens pour le modèle
MAX_INPUT_LENGTH = 1024


def load_model(model_name, task="summarization"):
    """
    Charge un modèle compatible avec la tâche spécifiée en tenant compte du GPU.
    """
    device = 0 if torch.cuda.is_available() else -1  # Utilise le GPU si disponible
    try:
        return pipeline(task, model=model_name, device=device)
    except Exception as e:
        logger.error(f"Erreur de chargement du modèle {model_name} : {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Le modèle {model_name} n'est pas compatible avec la tâche {task}.",
        )


def segment_text(text, max_length):
    """
    Divise le texte en segments d'une longueur maximale spécifiée.
    """
    segments = []
    current_segment = ""

    for sentence in text.split(". "):  # Découpe en phrases
        if len(current_segment) + len(sentence) + 1 <= max_length:
            current_segment += sentence + ". "
        else:
            segments.append(current_segment.strip())
            current_segment = sentence + ". "

    if current_segment:
        segments.append(current_segment.strip())

    return segments


@app.get("/")
def root():
    return {"message": "API de résumé de documents est opérationnelle."}


@app.post("/summarize/")
async def summarize(
    file: UploadFile,
    category: str = Form("general"),
    min_length: int = Form(40),
    max_length: int = Form(100),
):
    """
    Endpoint pour résumer un fichier en fonction de la catégorie et des longueurs min/max.
    """
    # Vérification de la catégorie
    if category not in CATEGORY_MODELS:
        category = "general"
    model_name = CATEGORY_MODELS[category]
    logger.info(f"Utilisation du modèle {model_name} pour la catégorie {category}.")

    # Charger le modèle pour la catégorie
    summarizer = load_model(model_name, task="summarization")

    # Charger le modèle de reformulation
    reformulator = load_model("t5-base", task="text2text-generation")

    # Extraction du texte du fichier
    try:
        text = extract_text_from_file(file)
        if not text.strip():
            raise HTTPException(status_code=400, detail="Le fichier est vide ou illisible.")
    except Exception as e:
        logger.error(f"Erreur lors de l'extraction du fichier : {e}")
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'extraction du fichier : {e}")

    # Diviser le texte en segments et générer les résumés
    try:
        segments = segment_text(text, MAX_INPUT_LENGTH)
        logger.info(f"Le texte a été divisé en {len(segments)} segments.")

        summaries = []
        for segment in segments:
            segment_length = len(segment.split())  # Longueur en mots
            if segment_length < 10:  # Ignorer les segments trop courts
                logger.warning(f"Segment trop court pour être résumé : {segment}")
                summaries.append(segment)  # Ajouter le texte brut
                continue

            adjusted_max_length = min(max_length, segment_length - 1)
            if adjusted_max_length <= min_length:
                adjusted_max_length = min_length + 10

            try:
                summary = summarizer(
                    segment,
                    max_length=adjusted_max_length,
                    min_length=min_length,
                    do_sample=False,
                )
                summaries.append(summary[0]["summary_text"])
            except Exception as e:
                logger.error(f"Erreur lors du résumé pour le segment : {e}")
                summaries.append("Résumé non généré pour ce segment.")

        combined_summary = " ".join(summaries)
        return {"summary": combined_summary}

    except Exception as e:
        logger.error(f"Erreur lors du résumé : {e}")
        raise HTTPException(status_code=500, detail=f"Erreur lors du résumé : {e}")
