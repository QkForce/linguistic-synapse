import time
from functools import wraps


def write_lines(output_file, lines):
    with open(output_file, "w", encoding="utf-8") as f:
        for k in lines:
            f.write(lines[k] + "\n")


def log_time(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print(f"[log_time] Начало: {func.__name__}")
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"[log_time] Завершено: {func.__name__} — {end - start:.2f} сек")
        return result

    return wrapper
