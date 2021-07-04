from flask import render_template
import connexion
from flask_cors import CORS

# Create the application instance
app = connexion.App(__name__, specification_dir='./')
CORS(app.app)
app.add_api('swagger.yml')
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)