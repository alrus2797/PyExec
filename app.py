from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from io import StringIO
from contextlib import redirect_stdout
import traceback

app = Flask(__name__, static_url_path='', static_folder='./static')
CORS(app)


# mipagina.com/
@app.route('/')
def hello():
    return render_template('index.html')
    return jsonify(message = 'Hello World 2.0')


# mipagina.com/exec
@app.route('/exec', methods=['POST'])
def lel():
    content = request.json
    code = content['code']
    res = StringIO()
    error_flag = False
    d={}
    with redirect_stdout(res):
        try:
            exec(code,d,d)
        except Exception as e:
            linea=traceback.format_exc()
            error_flag = True
            print("\nError en: ", linea[linea.find('string')+10:len(linea)])
    res = res.getvalue()
    return jsonify(result = res, error=error_flag)

if __name__ == '__main__':
    import sys
    if len(sys.argv) == 2 and sys.argv[1] == 'local':
        app.run(host='localhost', port=8080, debug=True)
    print(sys.argv)
    app.run(host='0.0.0.0', port=8080)
