from flask import Flask, request, jsonify
from transformers import pipeline, BlipProcessor, BlipForConditionalGeneration
import docx
from PIL import Image
import io
import fitz  # PyMuPDF

app = Flask(__name__)

# --- AI Model Loading (Self-Hosted) ---
# This will download models on the first run.
print("Loading summarization model...")
summarizer = pipeline("summarization", model="t5-small")
print("Summarization model loaded.")

print("Loading image captioning model...")
image_captioning_processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-large")
image_captioning_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-large")
print("Image captioning model loaded.")
# --- End of AI Model Loading ---


def extract_text_from_docx(file_stream):
    doc = docx.Document(file_stream)
    return "\n".join([para.text for para in doc.paragraphs])

def analyze_pdf(file_stream):
    pdf_document = fitz.open(stream=file_stream, filetype="pdf")
    full_text = ""
    images = []
    for page_num in range(len(pdf_document)):
        page = pdf_document.load_page(page_num)
        full_text += page.get_text()
        image_list = page.get_images(full=True)
        for img_index, img in enumerate(image_list):
            xref = img[0]
            base_image = pdf_document.extract_image(xref)
            image_bytes = base_image["image"]
            try:
                image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
                images.append(image)
            except Exception as e:
                print(f"Warning: Could not process an image on page {page_num + 1}: {e}")
    return full_text, images

@app.route('/analyze', methods=['POST'])
def analyze_route():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    file_stream = io.BytesIO(file.read())
    filename = file.filename.lower()
    
    summary_text = None
    image_descriptions = []

    try:
        if filename.endswith('.pdf'):
            text, images = analyze_pdf(file_stream)
            if text.strip():
                summary_result = summarizer(text, max_length=150, min_length=30, do_sample=False)
                summary_text = summary_result[0]['summary_text']
            if images:
                for img in images:
                    inputs = image_captioning_processor(img, return_tensors="pt")
                    out = image_captioning_model.generate(**inputs, max_new_tokens=50)
                    caption = image_captioning_processor.decode(out[0], skip_special_tokens=True)
                    image_descriptions.append(caption)
        
        elif filename.endswith(('.png', '.jpg', '.jpeg')):
             image = Image.open(file_stream).convert("RGB")
             inputs = image_captioning_processor(image, return_tensors="pt")
             out = image_captioning_model.generate(**inputs, max_new_tokens=50)
             caption = image_captioning_processor.decode(out[0], skip_special_tokens=True)
             image_descriptions.append(caption)

        elif filename.endswith('.docx') or filename.endswith('.txt'):
            if filename.endswith('.docx'):
                text = extract_text_from_docx(file_stream)
            else:
                text = file_stream.read().decode('utf-8')
            
            if text.strip():
                summary_result = summarizer(text, max_length=150, min_length=30, do_sample=False)
                summary_text = summary_result[0]['summary_text']
        else:
            return jsonify({'error': 'Unsupported file type.'}), 400

        if not summary_text and not image_descriptions:
            return jsonify({'error': 'Could not extract any content to analyze.'}), 400
        
        return jsonify({'summary': summary_text, 'image_analysis': image_descriptions})

    except Exception as e:
        error_message = f"An error occurred during analysis: {e}"
        print(error_message)
        return jsonify({'error': error_message}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)