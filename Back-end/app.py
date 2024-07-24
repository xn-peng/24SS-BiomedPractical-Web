from flask import Flask, jsonify, request, abort, send_file
import pandas as pd
import os
import datetime
from flask_cors import CORS
from processing.process_nii import process_nii_file

from prediction.UNET.run import run
os.environ['KMP_DUPLICATE_LIB_OK'] = 'TRUE'

app = Flask(__name__)
CORS(app)  # 启用CORS




# Read model list
def read_model_list():
    model_file_path = os.path.join('model', 'model.csv')
    df = pd.read_csv(model_file_path)
    model_list = df.to_dict(orient='records')
    formatted_list = [
        {"id": item['id'], "name": item['name'], "time": item['time']}
        for item in model_list
    ]
    return formatted_list

# Red manufactuere list
def read_manufacturer_list():
    manufacturer_file_path = os.path.join('data', 'manufacturer.csv')
    df = pd.read_csv(manufacturer_file_path)
    manufacturer_list = df.to_dict(orient='records')
    formatted_list = [
        {"id": item['id'], "model": item['model'], "brand": item['brand']}
        for item in manufacturer_list
    ]
    return formatted_list

# Delete manufacturer by id
def delete_manufacturer_by_id(manufacturer_id):
    manufacturer_file_path = os.path.join('data', 'manufacturer.csv')
    df = pd.read_csv(manufacturer_file_path)
    if manufacturer_id not in df['id'].values:
        return False
    df = df[df['id'] != manufacturer_id]
    df.to_csv(manufacturer_file_path, index=False)
    return True

def add_manufacturer(brand, model):
    manufacturer_file_path = os.path.join('data', 'manufacturer.csv')
    try:
        df = pd.read_csv(manufacturer_file_path)
    except PermissionError:
        return False, "Permission denied while reading the file."

    # generate new id
    if df.empty:
        new_id = 1
    else:
        new_id = df['id'].max() + 1

    new_entry = pd.DataFrame([{'id': new_id, 'brand': brand, 'model': model}])
    df = pd.concat([df, new_entry], ignore_index=True)

    try:
        df.to_csv(manufacturer_file_path, index=False)
    except PermissionError:
        return False, "Permission denied while writing to the file."

    return True, "Manufacturer added.", new_id


def delete_model_by_id(model_id):
    model_file_path = os.path.join('model', 'model.csv')
    try:
        df = pd.read_csv(model_file_path)
    except PermissionError:
        return False, "Permission denied while reading the file."

    if model_id not in df['id'].values:
        return False, "ID not found."

    model_name = df.loc[df['id'] == model_id, 'name'].values[0]
    df = df[df['id'] != model_id]

    try:
        df.to_csv(model_file_path, index=False)
    except PermissionError:
        return False, "Permission denied while writing to the file."

    pth_file_path = os.path.join('model', f"{model_name}.pth")
    try:
        if os.path.exists(pth_file_path):
            os.remove(pth_file_path)
    except PermissionError:
        return False, "Permission denied while deleting the file."

    return True, "Model deleted."


def add_model(file_data, name):
    model_file_path = os.path.join('model', 'model.csv')
    try:
        df = pd.read_csv(model_file_path)
    except PermissionError:
        return False, "Permission denied while reading the file.", None, None

    if name in df['name'].values:
        return False, "Model name already exists.", None, None

    if df.empty:
        new_id = 1
    else:
        new_id = df['id'].max() + 1

    current_time = datetime.datetime.now().strftime("%d.%m.%Y")

    file_path = os.path.join('model', f"{name}.pth")
    with open(file_path, 'wb') as f:
        f.write(file_data)

    new_entry = pd.DataFrame([{'id': new_id, 'name': name, 'time': current_time}])
    df = pd.concat([df, new_entry], ignore_index=True)

    try:
        df.to_csv(model_file_path, index=False)
    except PermissionError:
        return False, "Permission denied while writing to the file.", None, None

    return True, "Model added.", current_time, new_id


@app.route('/manufacturers/<int:manufacturer_id>', methods=['DELETE'])
def delete_manufacturer(manufacturer_id):
    if not manufacturer_id:
        return jsonify({"error": "ID is required"}), 400
    success = delete_manufacturer_by_id(manufacturer_id)
    if not success:
        return jsonify({"error": "ID not found"}), 404
    return jsonify({"message": "Manufacturer deleted"}), 200

@app.route('/models', methods=['GET'])
def get_models():
    models = read_model_list()
    return jsonify(models)

@app.route('/manufacturers', methods=['GET'])
def get_manufacturers():
    manufacturers = read_manufacturer_list()
    return jsonify(manufacturers)


@app.route('/manufacturers', methods=['POST'])
def add_manufacturer_route():
    data = request.get_json()
    brand = data.get('brand')
    model = data.get('model')

    if not brand or not model:
        return jsonify({"error": "Brand and model are required"}), 400

    success, message, new_id = add_manufacturer(brand, model)
    if not success:
        return jsonify({"error": message}), 500

    return jsonify({"message": message, "id": new_id}), 201


@app.route('/models/<int:model_id>', methods=['DELETE'])
def delete_model(model_id):
    if not model_id:
        return jsonify({"error": "ID is required"}), 400

    success, message = delete_model_by_id(model_id)
    if not success:
        return jsonify({"error": message}), 404 if message == "ID not found." else 500

    return jsonify({"message": message}), 200


@app.route('/models', methods=['POST'])
def add_model_route():
    if 'file' not in request.files:
        return jsonify({"error": "File is required"}), 400

    file = request.files['file']
    file_data = file.read()
    name = file.filename.rsplit('.', 1)[0]

    success, message, current_time, new_id = add_model(file_data, name)
    if not success:
        return jsonify({"error": message}), 400 if message == "Model name already exists." else 500

    return jsonify({"message": message, "time": current_time, "id": new_id}), 201

def clear_directory(directory):
    for filename in os.listdir(directory):
        file_path = os.path.join(directory, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                for subfile in os.listdir(file_path):
                    os.unlink(os.path.join(file_path, subfile))
                os.rmdir(file_path)
        except Exception as e:
            print(f'Failed to delete {file_path}. Reason: {e}')

@app.route('/visualization', methods=['POST'])

def visualize_nii():
    upload_dir = 'uploads'
    output_dir = 'outputs'

    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
    else:
        clear_directory(upload_dir)

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    else:
        clear_directory(output_dir)

    if 'file' not in request.files:
        return jsonify({"error": "File is required"}), 400

    file = request.files['file']
    filename = file.filename

    file_path = os.path.join(upload_dir, filename)
    file.save(file_path)

    output_files = process_nii_file(file_path, output_dir)

    return jsonify({
        "axial": output_files['axial'],
        "coronal": output_files['coronal'],
        "sagittal": output_files['sagittal']
    }), 200


@app.route('/prediction', methods=['POST'])
def prediction():
    try:
        # Receive Formdata
        file = request.files.get('file')
        age = request.form.get('age')
        tsi = request.form.get('tsi')
        gender = request.form.get('gender')
        manufacturer = request.form.get('manufacturer')
        model = request.form.get('model')

        if not file or not age or not tsi or not gender or not manufacturer or not model:
            return jsonify({"error": "Missing data in form submission"}), 400

        upload_dir = 'uploads'
        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)
        file_path = os.path.join(upload_dir, file.filename)
        file.save(file_path)

        if (gender == 'male'):
            sex = 1
        else:
            sex = 2

        if model:
            print(gender)
            has_lesion = run(file_path, float(age), int(sex), float(tsi), manufacturer, model)
            return jsonify({"result": int(has_lesion)}), 200
        else:
            return jsonify({"error": "Unsupported model ID"}), 400

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500





@app.route('/outputs/<path:filename>')
def get_image(filename):
    return send_file(os.path.join('outputs', filename), mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=True)
