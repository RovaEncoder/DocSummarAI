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

# Limite de longueur pour le modèle (en tokens)
MAX_INPUT_LENGTH = 1024

@app.get("/")
def root():
    return {"message": "API de résumé de documents est opérationnelle."}

# Ajouter le middleware CORS pour autoriser les requêtes depuis le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

def segment_text(text, max_length):
    """
    Divise le texte en segments d'une longueur maximale spécifiée.
    Garde les segments cohérents en se basant sur des phrases.
    """
    segments = []
    current_segment = ""

    for sentence in text.split(". "):  # Découpe en phrases
        if len(current_segment) + len(sentence) + 1 <= max_length:
            current_segment += sentence + ". "
        else:
            segments.append(current_segment.strip())
            current_segment = sentence + ". "

    if current_segment:  # Ajouter le dernier segment s'il existe
        segments.append(current_segment.strip())

    return segments

def calculate_summary_lengths(text_length, default_max=50, default_min=40):
    """
    Calcule dynamiquement les longueurs max et min pour le résumé
    en fonction de la taille du texte d'entrée.
    """
    max_length = min(default_max, text_length // 4)
    min_length = min(default_min, text_length // 10)

    # S'assurer que min_length < max_length
    if min_length >= max_length:
        min_length = max_length - 50  

    return max_length, min_length

@app.post("/summarize/")
async def summarize(file: UploadFile):
    # Vérifier le type de fichier
    if not file.filename.endswith(('.txt', '.pdf')):
        raise HTTPException(status_code=400, detail="Seuls les fichiers .txt ou .pdf sont acceptés.")

    # Extraire le texte du fichier
    try:
        text = extract_text_from_file(file)

        if not text.strip():
            raise HTTPException(status_code=400, detail="Le fichier est vide ou illisible.")

    except Exception as e:
        logger.error(f"Erreur lors de l'extraction du fichier : {e}")
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'extraction du fichier : {e}")

    # Diviser le texte en segments
    try:
        segments = segment_text(text, MAX_INPUT_LENGTH)
        logger.info(f"Le texte a été divisé en {len(segments)} segments.")

        summaries = []
        for segment in segments:
            # Calculer les longueurs dynamiquement pour chaque segment
            text_length = len(segment)
            max_length, min_length = calculate_summary_lengths(text_length)

            logger.info(f"Résumé segment : max_length={max_length}, min_length={min_length}")

            # Résumer le segment avec les longueurs dynamiques
            summary = summarizer(segment, max_length=max_length, min_length=min_length, do_sample=False)
            summaries.append(summary[0]["summary_text"])

        # Combiner les résumés de segments
        combined_summary = " ".join(summaries)
        return {"summary": combined_summary}

    except Exception as e:
        logger.error(f"Erreur lors du résumé : {e}")
        raise HTTPException(status_code=500, detail=f"Erreur lors du résumé : {e}")

