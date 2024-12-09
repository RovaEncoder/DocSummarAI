from transformers import pipeline

# Charger le pipeline de résumé avec DistilBART
summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")

# Texte d'exemple
document = """
Elon Musk announced that Tesla is opening a new Gigafactory in Berlin, Germany, which will produce electric cars and batteries for the European market, creating over 10,000 jobs by 2025. This investment of $4 billion is expected to significantly boost the European electric vehicle industry.
"""

# Générer le résumé
summary = summarizer(document, max_length=15, min_length=5, do_sample=False)
print("Résumé généré :\n", summary[0]['summary_text'])
