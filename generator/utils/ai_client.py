from google import genai
from config.config import GENERATIVE_AI_API_KEY, MODEL_NAME
import json


class AIGenerator:
    def __init__(self):
        self.client = genai.Client(api_key=GENERATIVE_AI_API_KEY)

    def ask_ai(self, system_instruction, user_data, response_schema=None):
        """
        AI-ға кез келген тапсырманы жіберуге арналған негізгі функция.
        :param system_instruction: AI-ға берілетін басты рөл мен ережелер (Prompt).
        :param user_data: Өңделуі тиіс деректер (Сөйлемдер, файлдар, т.б.).
        :param response_schema: AI-дан күтілетін JSON құрылымы (міндетті емес).
        """
        full_content = f"{system_instruction}\n\nINPUT DATA:\n{json.dumps(user_data, ensure_ascii=False)}"

        config = {"response_mime_type": "application/json"}
        if response_schema:
            config["response_schema"] = response_schema

        try:
            response = self.client.models.generate_content(
                model=MODEL_NAME,
                contents=full_content,
                config=config,
            )
            return json.loads(response.text)
        except Exception as e:
            print(f"AI Generation Error: {e}")
            return None
