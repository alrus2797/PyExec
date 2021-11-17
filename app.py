from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from io import StringIO
from contextlib import redirect_stdout


app = Flask(__name__)
CORS(app)


# mipagina.com/
@app.route('/')
def hello():
    return jsonify(message = 'Hello World 2.0')


# mipagina.com/exec
@app.route('/exec', methods=['POST'])
def lel():
    content = request.json
    code = content['code']
    res = StringIO()
    with redirect_stdout(res):
        try:
            exec(code)
        except Exception as e:
            print(e)
    res = res.getvalue()
    return jsonify(result = res)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)