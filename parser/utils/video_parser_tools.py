import cv2
import pytesseract
import re
import os
import numpy as np
from utils.tools import log_time
import config.config as config


# === Установка пути к Tesseract ===
pytesseract.pytesseract.tesseract_cmd = config.TESSERACT_PATH


# === Извлечение кадров ===
def extract_frames(video_path, output_dir, interval=20):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_interval = int(fps * interval)

    frame_count = 0
    saved = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        if frame_count % frame_interval == 0:
            filename = os.path.join(output_dir, f"frame_{saved:04}.png")
            cv2.imwrite(filename, frame)
            saved += 1
        frame_count += 1

    cap.release()


def crop_roi(frame):
    H, W = frame.shape[:2]
    y_start = int(0.675 * H)
    y_end = H
    x_start = int(0.755 * W)
    x_end = W

    # Создаем маску - белый прямоугольник на черном фоне
    mask = np.ones((H, W), dtype=np.uint8) * 255  # 255 — белый (область оставить)

    # Черным замаскируем область автора (область, которую нужно исключить)
    mask[y_start:y_end, x_start:x_end] = 0

    # Применяем маску к кадру (черная область станет черной, остальное — без изменений)
    masked_frame = cv2.bitwise_and(frame, frame, mask=mask)

    return masked_frame


def parse_frame(frame, on_sentence):
    text = pytesseract.image_to_string(frame, lang="eng")
    text = text.replace("\n", " ")
    text = text.replace(".1", ".I")
    matches = re.findall(r"(\d+)\.\s*([A-Za-z][^0-9]*?)(?=\s+\d+\.\s*|$)", text)
    # print(matches)
    for number_str, sentence in matches:
        number = int(number_str)
        sentence = sentence.strip()
        if len(sentence) < 4:
            continue
        on_sentence(number, sentence)


# === Распознавание текста ===
@log_time
def parse_frames(folder):
    lines = {}

    def handle_sentence(number, sentence):
        lines[number] = f"{number}. {sentence}"

    for fname in sorted(os.listdir(folder)):
        if fname.endswith(".png"):
            path = os.path.join(folder, fname)
            img = cv2.imread(path)
            parse_frame(img, handle_sentence)

    return lines


@log_time
def parse_video_frames(cap, frame_interval):
    # cap = cv2.VideoCapture(video_path)
    frame_count = 0
    lines = {}

    def handle_sentence(number, sentence):
        lines[number] = sentence

    prev_frame = None
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frame_count += 1

        if frame_count % frame_interval != 0:
            continue
        frame = crop_roi(frame)
        frame = cv2.resize(frame, (0, 0), fx=config.FX_FY, fy=config.FX_FY)
        # cv2.imshow("ROI", frame)
        # cv2.waitKey(0)
        # cv2.destroyAllWindows()
        if prev_frame is not None and np.array_equal(frame, prev_frame):
            continue
        prev_frame = frame.copy()

        parse_frame(frame, handle_sentence)

    cap.release()
    return lines
