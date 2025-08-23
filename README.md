# Image Mosaic Removal App

This project is a web application that allows users to upload images with mosaic censorship. The application processes the uploaded images to remove the mosaic and applies smoothing techniques to enhance the image quality.

## Features

- Upload images with mosaic censorship.
- Remove mosaic from images.
- Apply smoothing filters to enhance image quality.
- User-friendly web interface.

## Project Structure

```
image-mosaic-removal-app
├── src
│   ├── app.py                # Entry point of the application
│   ├── routes
│   │   └── upload.py         # Handles image upload
│   ├── services
│   │   └── mosaic_removal.py  # Logic for mosaic removal
│   ├── utils
│   │   └── image_processing.py # Utility functions for image processing
│   └── templates
│       └── index.html        # HTML template for the main page
├── requirements.txt          # Project dependencies
└── README.md                 # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd image-mosaic-removal-app
   ```

2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

## Usage

1. Run the application:
   ```
   python src/app.py
   ```

2. Open your web browser and navigate to `http://127.0.0.1:5000`.

3. Use the upload form to select and upload an image with mosaic censorship.

4. The application will process the image and return a smoother version without the mosaic.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.