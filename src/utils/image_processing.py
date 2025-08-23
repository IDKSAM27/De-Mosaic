def load_image(image_path):
    from PIL import Image
    return Image.open(image_path)

def save_image(image, output_path):
    image.save(output_path)

def apply_smoothing(image):
    from PIL import ImageFilter
    return image.filter(ImageFilter.SMOOTH)