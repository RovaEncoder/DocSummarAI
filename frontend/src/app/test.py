from transformers import pipeline
from fastapi import FastAPI, UploadFile
from transformers import pipeline

summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def summarize_text(text):
    return summarizer(text, max_length=130, min_length=30, do_sample=False)


app = FastAPI()
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

@app.post("/summarize")
async def summarize(file: UploadFile):
    content = await file.read()
    summary = summarizer(content.decode("utf-8"), max_length=130, min_length=30, do_sample=False)
    return {"summary": summary[0]["summary_text"]}
