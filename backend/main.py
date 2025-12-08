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
    Asegúrate de que el JSON sea sintácticamente correcto y si el usuario hace una consulta que no está
    relacionada con temas legales laborales de Nicaragua, responde en titulo dentro del JSON que no puede procesar la consulta y los demas dejalos vacíos.
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

class ChatRequest(BaseModel):
    question: str
    context: dict

@app.post("/api/chat")
async def chat_with_assistant(request: ChatRequest):
    if not API_KEY:
        raise HTTPException(status_code=500, detail={"message": "Error del servidor: La API Key de Gemini no está configurada.", "error_type": "ConfigurationError"})

    user_question = request.question
    conversation_context = request.context

    # Construye un prompt detallado para el asistente
    system_prompt = f"""
    Eres un asistente legal experto en la legislación y jurisprudencia de Nicaragua.
    El usuario tiene una pregunta sobre un análisis legal que recibiste previamente.
    El contexto del análisis es el siguiente:
    --- INICIO DEL CONTEXTO ---
    {json.dumps(conversation_context, indent=2)}
    --- FIN DEL CONTEXTO ---

    La pregunta del usuario es: "{user_question}"

    Basado en el contexto proporcionado y tu conocimiento, responde a la pregunta del usuario de manera clara, concisa y útil.
    Si la pregunta no está relacionada con el contexto legal, indica amablemente que solo puedes responder a preguntas sobre el caso.
    """

    try:
        model = genai.GenerativeModel('models/gemini-pro-latest')
        response = await model.generate_content_async(system_prompt)
        
        logging.info(f"Raw response from Gemini for chat: {response.text}")

        if not response.text:
             raise HTTPException(status_code=500, detail="La API de Gemini devolvió una respuesta vacía.")

        return {"answer": response.text}

    except Exception as e:
        logging.error(f"Error durante la llamada a Gemini API en el chat: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail={"message": "Error al procesar el chat con Gemini.", "error_type": type(e).__name__, "details": str(e)})

from fastapi.responses import StreamingResponse
from docxtpl import DocxTemplate
import datetime
import io

class DemandaRequest(BaseModel):
    hechos: str
    fundamentos_de_derecho: str
    demandante_nombre: str = "Nombre del Demandante (Sustituir)"
    demandante_cedula: str = "000-000000-0000A (Sustituir)"
    monto_total: str = "XX,XXX.XX C$ (Sustituir)"

@app.post("/api/generar-demanda")
async def generar_demanda(request: DemandaRequest):
    try:
        # Path to the template
        template_path = os.path.join(BASE_DIR, "templates", "demanda_template.docx")
        doc = DocxTemplate(template_path)

        # Create context for rendering the template
        context = {
            'fecha': datetime.datetime.now().strftime("%d de %B de %Y"),
            'demandante_nombre': request.demandante_nombre,
            'demandante_cedula': request.demandante_cedula,
            'hechos': request.hechos,
            'fundamentos_de_derecho': request.fundamentos_de_derecho,
            'monto_total': request.monto_total,
        }

        # Render the document
        doc.render(context)
        
        # Save the rendered document to an in-memory buffer
        file_stream = io.BytesIO()
        doc.save(file_stream)
        file_stream.seek(0)

        # Define headers to suggest a filename for the download
        headers = {
            'Content-Disposition': 'attachment; filename="demanda_generada.docx"'
        }

        return StreamingResponse(
            content=file_stream,
            media_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            headers=headers
        )

    except Exception as e:
        logging.error(f"Error al generar la demanda: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Error interno al generar el documento.")

