import time
import math
import string
import random
import json
import requests as rq
from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

def gen_random_str(str_len=8):
    '''
    Generates a random string of a given length made up with letters and digits
    
    Args:
        str_len (int): The length of the string to be generated

    Returns:
        str: The generated string of length str_len

    Raises:
        ValueError: If str_len is not an integer
    '''
    if not isinstance(str_len, int):
        raise ValueError("str_len must be an integer.")

    alphabet = string.ascii_letters + string.digits
    return ''.join(random.choice(alphabet) for i in range(str_len))

@app.route('/')
@cross_origin()
def root():
    rand_str = gen_random_str()
    return jsonify({'message': 'Hello World!', 'random_string': rand_str}), 200

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
