import numpy as np
from utils import db, analytics


def run():
    with db.db_connection() as conn:
        # 1. ДҚ-дан тек шикі деректерді алу (Raw Data)
        cursor = conn.cursor()
        query = """
            SELECT 
                id,
                duration,
                (strftime('%s', parse_end) - strftime('%s', parse_start)) as parse_time
            FROM lessons 
            WHERE parse_end IS NOT NULL AND duration > 0
        """
        cursor.execute(query)
        data = cursor.fetchall()

        if not data:
            print("[!] Талдау үшін деректер жеткіліксіз.")
            return

        # 2. Деректерді математикалық пішімге дайындау
        ids = [row[0] for row in data]
        durations = np.array([row[1] for row in data], dtype=float)
        parse_times = np.array([row[2] for row in data], dtype=float)

        # Тиімділік коэффициентін есептеу (Бұл біздің observations болады)
        efficiency_array = parse_times / durations

        # 3. Статистикалық есептеулер (Analytics)
        stats = analytics.calculate_stats(efficiency_array)
        mu, sigma = stats["mu"], stats["sigma"]

        anomalies = analytics.detect_anomalies(efficiency_array, ids, mu, sigma)

        # 4. Нәтижені шығару
        print("\n" + "=" * 45)
        print(f"ЖҮЙЕ ӨНІМДІЛІГІН ТАЛДАУ (NumPy)")
        print("=" * 45)
        print(f"Видео саны: {stats['count']}")
        print(f"Орташа тиімділік (mu): {mu:.4f} сек/сек")
        print(f"Стандартты ауытқу (sigma): {sigma:.4f}")
        print(f"Медиана: {stats['median']:.4f}")
        print(f"Қалыпты диапазон: [{max(0, mu-2*sigma):.4f} - {mu+2*sigma:.4f}]")
        print("-" * 45)

        if anomalies:
            print(f"АНЫҚТАЛҒАН АНОМАЛИЯЛАР ({len(anomalies)}):")
            print(f"{'ID':<15} | {'Value':<10} | {'Z-Score':<8}")
            print("-" * 45)
            for a in anomalies:
                print(f"{a['label']:<15} | {a['value']:<10} | {a['deviation']:<8}")
        else:
            print("Барлық процесс қалыпты диапазонда.")
        print("=" * 45 + "\n")


if __name__ == "__main__":
    run()
