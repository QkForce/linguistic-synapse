# Linguistic Synapse - Parser

The core engine responsible for extracting educational content from video sources using OCR and automated processing.

## 🚀 Performance & Benchmarks

Initial processing metrics based on the first production run:

* **Video Duration:** 24 min 18 sec
* **Processing Time:** 672.02 seconds (~11.2 min)
* **Efficiency Ratio:** **2.1x** (Processes twice as fast as the video runtime)

### Current Optimization Settings:

- **`FRAME_INTERVAL=30`**: Captures one frame every 2 seconds (based on 15 fps source).
- **`VIDEO_QUALITY=360p`**: Balanced resolution for Tesseract OCR accuracy and speed.
- **`FX_FY=0.75`**: Resizes frames to 75% of original size to reduce CPU load during character recognition.

## 🛠 Tech Stack

- **Python 3.10+**
- **Tesseract OCR**: Optical Character Recognition engine.
- **OpenCV**: Image processing and frame manipulation.
- **yt-dlp**: YouTube content extraction.
- **SQLite**: Local data storage for processed sentences.