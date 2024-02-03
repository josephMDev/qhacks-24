from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/process_input', methods=['POST'])
def process_input():
    # Get request input
    data = request.get_json()

    # Perform some processing on the received input
    data = data.upper()

    # Return the processed result
    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

# TEST THIS OUT ON QUEENS WIFI TOMORROW
    
""" USAGE (do in a different python file):
import requests

def send_request(input_string):
    url = 'http://192.168.2.11:5000/process_input'
    response = requests.post(url, json=input_string)

    if response.status_code == 200:
        result = response.json()
        print(f'Received result: {result}')
    else:
        print(f'Request failed with status code {response.status_code}')

if __name__ == '__main__':
    user_input = input('Enter input string: ')
    send_request(user_input)
"""