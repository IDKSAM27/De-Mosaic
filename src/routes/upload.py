from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from src.services.mosaic_removal import remove_mosaic

upload_bp = Blueprint('upload', __name__)

@upload_bp.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file:
        filename = secure_filename(file.filename)
        image = file.read()
        processed_image = remove_mosaic(image)
        
        return jsonify({'message': 'Image processed successfully', 'image': processed_image}), 200

    return jsonify({'error': 'File upload failed'}), 500