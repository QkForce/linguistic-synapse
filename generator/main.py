from google import genai
from config.config import GENERATIVE_AI_API_KEY, MODEL_NAME
from prompts import PROMPT_LESSON_GENERATOR
import json


client = genai.Client(api_key=GENERATIVE_AI_API_KEY)


def generate_lesson():
    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=PROMPT_LESSON_GENERATOR,
            config={"response_mime_type": "application/json"},
        )
        data = json.loads(response.text)
        return data
    except Exception as e:
        print(f"Қате орын алды: {e}")


if __name__ == "__main__":
    data = generate_lesson()
    print(json.dumps(data, ensure_ascii=False, indent=2))
    # for model in client.models.list():
    #     print(model.name)
