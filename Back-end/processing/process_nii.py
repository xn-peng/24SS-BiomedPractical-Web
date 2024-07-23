import nibabel as nib
import numpy as np
import matplotlib.pyplot as plt
import os

def process_nii_file(file_path, output_dir):
    img = nib.load(file_path)
    data = img.get_fdata()

    slices = {
        'axial': data[:, :, data.shape[2] // 2],
        'coronal': data[:, data.shape[1] // 2, :],
        'sagittal': data[data.shape[0] // 2, :, :]
    }

    # Create output folder (if not exist)
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Save slices
    output_files = {}
    for slice_name, slice_data in slices.items():
        plt.imshow(slice_data.T, cmap="gray", origin="lower")
        output_file = os.path.join(output_dir, f"{slice_name}.png")
        plt.savefig(output_file)
        output_files[slice_name] = output_file
        plt.close()

    return output_files
