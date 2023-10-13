import numpy as np

def calc_threshold(value, bottom_value=0, top_value=1):
    if value < bottom_value:
        mapped_value = (value - bottom_value) / bottom_value
    else:
        mapped_value = (value - bottom_value) / (top_value - bottom_value)
    clipped_value = np.clip(mapped_value, 0, 1)
    return clipped_value
