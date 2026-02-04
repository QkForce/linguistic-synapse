import numpy as np


def calculate_stats(observations: np.ndarray):
    """
    Кез келген сандық бақылаулар жиынтығына (observations) статистикалық талдау жасайды.
    """
    if observations.size == 0:
        return None

    mu = np.mean(observations)
    sigma = np.std(observations)

    return {
        "mu": mu,
        "sigma": sigma,
        "median": np.median(observations),
        "min": np.min(observations),
        "max": np.max(observations),
        "count": observations.shape[0],
    }


def detect_anomalies(observations: np.ndarray, labels: list, mu: float, sigma: float):
    """
    Z-score (Гаустық таралым) негізінде аномалияларды анықтайды.
    """
    if sigma == 0:
        return []

    anomalies = []
    # Z-score есептеу: (x - mu) / sigma
    z_scores = (observations - mu) / sigma

    for i, z in enumerate(z_scores):
        if abs(z) > 2:  # 2-sigma шегі
            anomalies.append(
                {
                    "label": labels[i],
                    "value": round(float(observations[i]), 4),
                    "deviation": round(float(z), 2),  # z-score мәні
                }
            )

    # Аномалияларды ауытқу дәрежесі бойынша сұрыптау
    return sorted(anomalies, key=lambda x: abs(x["deviation"]), reverse=True)
