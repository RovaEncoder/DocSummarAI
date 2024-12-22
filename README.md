# Automatic Document Summarization

This project enables automatic summarization of uploaded documents. It uses FastAPI for the backend and a frontend developed with Next.js and Tailwind CSS. The summarization and rephrasing models are powered by Hugging Face.

---

## Key Features

- Upload files in `.txt` or `.pdf` format.
- Select a category to adapt the summarization model.
- Define the minimum and maximum length of the summary.
- Generated summaries are rephrased for better clarity.
- Real-time download and visualization.

---

## Prerequisites

- **Python 3.8+**
- **Node.js 16+** and **npm**
- **Hugging Face model weights** (automatically downloaded during execution)

---

## Project Installation

### Backend

1. Navigate to the backend folder:

   ```bash
   cd backend
   ```

2. Install Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Start the backend:
   ```bash
   uvicorn app.main:app --reload
   ```
   The backend will now be available at `http://127.0.0.1:8000`.

### Frontend

1. Navigate to the frontend folder:

   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will now be available at `http://localhost:3000`.

---

## Usage

### 1. Accessing the User Interface

- Open a browser and go to `http://localhost:3000`.

### 2. Steps to Generate a Summary

1. Upload a file in `.txt` or `.pdf` format.
2. Choose an appropriate category (e.g., `general`, `science`, `finance`).
3. Specify the minimum and maximum lengths for the summary.
4. Click the **"Summarize File"** button.
5. The summary will appear in the right section of the screen.
6. You can copy the summary by clicking **"Copy Summary"**.

---

## Summarization Models

The models used are adapted based on the selected category:

| Category  | Model                           |
| --------- | ------------------------------- |
| General   | `facebook/bart-large-cnn`       |
| Science   | `facebook/bart-large-cnn`       |
| Finance   | `google/pegasus-xsum`           |
| Medical   | `google/pegasus-large`          |
| Legal     | `facebook/bart-large-cnn`       |
| News      | `sshleifer/distilbart-cnn-12-6` |
| Technical | `t5-small`                      |

---

## Contributions

Project available on GitHub: https://github.com/RovaEncoder/DocSummarAI

```bash
    git clone git@github.com:RovaEncoder/DocSummarAI.git
```

---

## Authors

- **Christ Rova ABESSOLO**
- **Ronan Kernen**
