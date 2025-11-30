from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Legal Assistant Backend is running"}

@app.get("/api")
def read_api_root():
    return {"message": "Welcome to the Legal Assistant API"}
