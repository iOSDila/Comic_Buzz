from flask import Flask
from controllers import api

app = Flask(__name__)

#Health Route
@app.route('/health')
def checkHealth():
    return "Image Processing Service is Active"

api.init_app(app)

app.run(debug=True, host='localhost', port=3001)