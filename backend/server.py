from flask import Flask, request, jsonify, redirect, send_from_directory
from flask_cors import CORS
from generator import add_url, url_collection

app = Flask(__name__)
CORS(app)

@app.route('/lengthen', methods=['POST'])
def lengthen_url():
    original_url = request.get_json()['url']
    print(original_url, "s")
    if not original_url:
        return jsonify({"error": "URL is required"}), 400
    
    long_url = add_url(original_url)
    return jsonify({"lengthened_url": long_url})

@app.route('/<short_code>', methods=['GET'])
def redirect_to_url(short_code):
    doc = url_collection.find_one({})
    urls = doc.get("urls", [])
    original_url = None
    for url in urls:
        if short_code == list(url.keys())[0]:
            original_url = url[short_code]

    if not original_url:
        return jsonify({"error": "lengthened URL not found"}), 404
    
    return redirect(original_url)

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')
if __name__ == '__main__':
    app.run(host="0.0.0.0",debug=True)
