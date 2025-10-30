from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image
import io

app = FastAPI()

# Habilita CORS para desenvolvimento (ajuste em produção)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dicionário de cores (rgb)
COLOR_DICTIONARY = {
    'vermelho': [230, 25, 25],
    'amarelo': [245, 220, 50],
    'azul': [40, 100, 230],
    'laranja': [250, 140, 30],
    'verde': [60, 180, 75],
    'roxo': [150, 60, 180],
}


def rgb_to_hex(rgb):
    return '#{:02x}{:02x}{:02x}'.format(*rgb)


# Carrega o modelo treinado (path relativo ao diretório onde o uvicorn é iniciado)
try:
    model = load_model("./color_model.h5")
except Exception as e:
    # Expor erro ao iniciar a API é útil em dev; em produção, logar adequadamente
    raise RuntimeError(f"Failed to load model: {e}")

labels = list(COLOR_DICTIONARY.keys())


@app.post("/predict-color/")
async def predict_color(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        img = Image.open(io.BytesIO(contents)).convert("RGB")
        img = img.resize((50, 50))

        # Converte para numpy e normaliza
        pixels = np.array(img).reshape(-1, 3) / 255.0
        mean_color = np.mean(pixels, axis=0).reshape(1, -1)

        # Predição
        prediction = model.predict(mean_color)
        color_idx = int(np.argmax(prediction))
        color_name = labels[color_idx]
        rgb = COLOR_DICTIONARY.get(color_name, [0, 0, 0])
        hex_color = rgb_to_hex(rgb)

        return {"color": color_name, "rgb": rgb, "hex": hex_color}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
