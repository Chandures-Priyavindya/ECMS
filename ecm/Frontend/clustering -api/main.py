from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import io
import numpy as np
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/clustering/variables")
async def get_variables(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))

        df = df.dropna()
        usable_columns = df.select_dtypes(include=['number', 'object']).columns.tolist()

        return {"variables": usable_columns}
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": str(e)})

@app.post("/api/clustering")
async def run_clustering(
    file: UploadFile = File(...),
    xVar: str = Form(...),
    yVar: str = Form(...),
    numClusters: int = Form(...)
):
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        df = df.dropna()

        if xVar not in df.columns or yVar not in df.columns:
            return JSONResponse(status_code=400, content={"error": "Selected columns not in file."})

        data = df[[xVar, yVar]].copy()

        # One-hot encode categorical columns
        for col in [xVar, yVar]:
            if data[col].dtype == 'object':
                encoded = pd.get_dummies(data[col], prefix=col)
                data = data.drop(columns=col).join(encoded)

        # Standardize data
        scaler = StandardScaler()
        scaled_data = scaler.fit_transform(data)

        # KMeans clustering
        kmeans = KMeans(n_clusters=numClusters, random_state=42, n_init='auto')
        cluster_ids = kmeans.fit_predict(scaled_data)

        # Prepare results
        plot_x = scaled_data[:, 0]
        plot_y = scaled_data[:, 1] if scaled_data.shape[1] > 1 else np.zeros_like(plot_x)

        clusters = []
        for i in range(len(cluster_ids)):
            clusters.append({
                "x": round(float(plot_x[i]), 2),
                "y": round(float(plot_y[i]), 2),
                "cluster": int(cluster_ids[i])
            })

        silhouette = silhouette_score(scaled_data, cluster_ids) if len(set(cluster_ids)) > 1 else 0.0

        return {
            "clusters": clusters,
            "silhouette_score": round(silhouette, 2)
        }

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
