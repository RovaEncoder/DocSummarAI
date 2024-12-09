from PyPDF2 import PdfReader

def extract_text_from_file(file):
    """
    Extrait le texte d'un fichier texte ou PDF.
    """
    try:
        if file.filename.endswith('.txt'):
            # Lire le fichier texte
            content = file.file.read().decode("utf-8")
        elif file.filename.endswith('.pdf'):
            # Lire le fichier PDF
            reader = PdfReader(file.file)
            content = ""
            for page in reader.pages:
                content += page.extract_text()
        else:
            raise ValueError("Format de fichier non supporté")
        return content
    except Exception as e:
        raise RuntimeError(f"Erreur lors de l'extraction : {e}")
