import time
import functools


def retry_on_error(retries=3, delay=60, error_types=(Exception,)):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            attempts = 0
            while attempts < retries:
                try:
                    return func(*args, **kwargs)
                except error_types as e:
                    attempts += 1
                    print(
                        f"⚠️ Қате: {e}. \n{delay} секунд күтеміз...",
                        f"(Талпыныс {attempts}/{retries})",
                    )
                    time.sleep(delay)
            print("❌ Барлық талпыныстар таусылды.")
            return None

        return wrapper

    return decorator
