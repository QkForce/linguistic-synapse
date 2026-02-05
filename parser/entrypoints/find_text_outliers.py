import numpy as np
from utils import db, analytics


def run():
    with db.db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT 
                l.id,  
                COUNT(s.id) as sentence_count
            FROM lessons l
            JOIN sentences s ON l.id = s.lesson_id
            GROUP BY l.id
            ORDER BY sentence_count DESC;
            """
        )
        data = cursor.fetchall()

        # Әр кадрдағы сөйлем санын есептеу
        ids = [row[0] for row in data]
        counts = np.array([row[1] for row in data])

        # Статистика (сөйлем саны бойынша)
        stats = analytics.calculate_stats(counts)
        mu, sigma, count, median = (
            stats["mu"],
            stats["sigma"],
            stats["count"],
            stats["median"],
        )
        if not stats:
            return

        # Аномалияларды (тым ұзын мәтіндерді) табу
        anomalies = analytics.detect_anomalies(counts, ids, stats["mu"], stats["sigma"])

        print(f"=== ТЕКСЕРУ КЕРЕК КАДРЛАР (Барлығы: {len(anomalies)}) ===")
        print(f"Орташа мән (mu): {mu:.4f} сек/сек")
        print(f"Стандартты ауытқу (sigma): {sigma:.4f}")
        print(f"Медиана: {median:.4f}")
        print(f"Қалыпты диапазон: [{max(0, mu-2*sigma):.4f} - {mu+2*sigma:.4f}]")
        print("-" * 45)
        for a in anomalies:
            # if a["value"] > stats["median"]:
            print(
                "ID: {} | Сөйлем саны: {} | Deviation: {}".format(
                    a["label"], int(a["value"]), a["deviation"]
                )
            )


if __name__ == "__main__":
    run()
