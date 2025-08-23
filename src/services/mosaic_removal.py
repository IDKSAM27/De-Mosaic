def remove_mosaic(image):
    import cv2
    import numpy as np

    # Load the image
    img = cv2.imread(image)

    # Apply a Gaussian blur to smooth the image
    smooth_img = cv2.GaussianBlur(img, (15, 15), 0)

    # Return the processed image
    return smooth_img