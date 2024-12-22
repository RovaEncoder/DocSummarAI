from PyPDF2 import PdfReader

def extract_text_from_file(file):
    """
    Extrait le texte d'un fichier texte ou PDF et le formate en un seul bloc.
    """
    try:
        content = ""
        if file.filename.endswith('.txt'):
            # Lecture du fichier texte
            content = file.file.read().decode("utf-8")
        elif file.filename.endswith('.pdf'):
            # Lecture du fichier PDF
            reader = PdfReader(file.file)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    # Ajout du texte extrait de chaque page
                    content += page_text + " "
            if not content.strip():
                raise ValueError("Le fichier PDF ne contient pas de texte lisible.")
        else:
            raise ValueError("Format de fichier non supporté.")

        # Nettoyer le texte pour fusionner les lignes
        cleaned_content = clean_text(content)
        return cleaned_content
    except Exception as e:
        raise RuntimeError(f"Erreur lors de l'extraction du texte : {e}")


def clean_text(text):
    """
    Nettoie le texte en supprimant les retours à la ligne inutiles.
    """
    # Remplacer les retours à la ligne par des espaces
    lines = text.splitlines()  # Divise en lignes
    cleaned_lines = [line.strip() for line in lines if line.strip()]
    return " ".join(cleaned_lines) 