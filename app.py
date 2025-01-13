from flask import Flask, request, jsonify
import fitz  # PyMuPDF
import base64
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/pdf-img',methods=['POST'])

def get_img():
    images_data = []
    files = request.files.getlist('files')
    for file in files:
        pdf_document = fitz.open(stream=file.read(), filetype="pdf")

        for page_number in range(len(pdf_document)):
            page = pdf_document[page_number]
            images = page.get_images(full=True)

            for img_index, img in enumerate(images):
                xref = img[0]
                base_image = pdf_document.extract_image(xref)
                image_bytes = base_image["image"]
                image_ext = base_image["ext"]

                # Convert image to base64
                encoded_image = base64.b64encode(image_bytes).decode('utf-8')
                images_data.append({
                    "page": page_number + 1,
                    "index": img_index + 1,
                    "extension": image_ext,
                    "data": encoded_image
                })

        pdf_document.close()

    return jsonify(images_data)

if __name__ == '__main__':
    app.run(debug=True)