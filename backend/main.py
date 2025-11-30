import os
import json
import logging
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Setup basic logging
logging.basicConfig(level=logging.INFO)

# Determine the directory where main.py resides
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Construct the path to the .env file relative to main.py
dotenv_path = os.path.join(BASE_DIR, '.env')
# Load the environment variables from the specified path
load_dotenv(dotenv_path=dotenv_path)

# --- Configuración global de la API de Gemini ---
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    logging.error("FATAL: GEMINI_API_KEY no fue encontrada. Asegúrate de que 'backend/.env' existe y contiene la clave.")
else:
    try:
        genai.configure(api_key=API_KEY)
        logging.info("INFO: Gemini API Key configurada exitosamente.")
    except Exception as e:
        logging.error(f"FATAL: Error al configurar la API de Gemini: {e}", exc_info=True)
# -------------------------------------------------

app = FastAPI()

# Configuración de CORS
origins = [
    "http://localhost",
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo Pydantic para el cuerpo de la solicitud
class AnalysisRequest(BaseModel):
    prompt: str

@app.get("/")
def read_root():
    return {"message": "Legal Assistant Backend is running"}

@app.post("/api/analyze")
async def analyze_prompt(request: AnalysisRequest):
    # Chequeo crítico al inicio del endpoint
    if not API_KEY:
        raise HTTPException(status_code=500, detail={"message": "Error del servidor: La API Key de Gemini no está configurada.", "error_type": "ConfigurationError"})

    user_prompt = request.prompt
    system_prompt = """
    Eres un asistente legal experto en la legislación y jurisprudencia de Nicaragua.
    Analiza el caso que te proporcionará el usuario.
    Tu respuesta DEBE SER ÚNICAMENTE un objeto JSON válido, sin texto antes o después.
    El objeto JSON debe tener la siguiente estructura y tipos de datos:
    {
      "titulo": "string",
      "resumen": "string",
      "pasos": ["string", "string"],
      "categoria": "string",
      "riesgo": "'Bajo', 'Medio' o 'Alto'",
      "confianza": "number (entre 0 y 1)",
      "resolucion": {
        "decision": "string",
        "fundamento": "string",
        "probabilidad": "number (entre 0 y 1)"
      },
      "jurisprudencia": [
        {
          "id": "string (ej. CSJ-123-2021)",
          "nombre": "string (ej. CSJ – Sala Laboral, Sent. 123/2021)",
          "extracto": "string"
        }
      ]
    }
    Asegúrate de que el JSON sea sintácticamente correcto.
    Ahora, analiza el siguiente caso del usuario:
    """
    full_prompt = f"{system_prompt}\n\n--- CASO DEL USUARIO ---\n{user_prompt}"

    try:
        model = genai.GenerativeModel('models/gemini-pro-latest')
        generation_config = genai.types.GenerationConfig(response_mime_type="application/json")
        response = await model.generate_content_async(full_prompt, generation_config=generation_config)
        
        logging.info(f"Raw response from Gemini: {response.text}")

        if not response.text:
             raise HTTPException(status_code=500, detail="La API de Gemini devolvió una respuesta vacía.")

        parsed_json = json.loads(response.text)
        return parsed_json

    except Exception as e:
        logging.error(f"Error durante la llamada a Gemini API: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail={"message": "Error al procesar la solicitud con Gemini.", "error_type": type(e).__name__, "details": str(e)})
