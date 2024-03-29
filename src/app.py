import json
from flask import Flask, request, current_app
from sqlalchemy import create_engine
import uuid
import os
from flask_sqlalchemy import SQLAlchemy
from utils import summarize_prompt, get_category, get_image

from transcription import transcribe
from pipeline import VideoAudioProcessesor

from openai import OpenAI
client = OpenAI(api_key="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")

import requests
from PIL import Image
from io import BytesIO

user = 'root'
password = 'test'
host = '127.0.0.1'
port = 5001
database = 'Testtest'

# ================================= DB =================================

def get_connection():
    return create_engine(url='mysql+pymysql://{0}:{1}@{2}:{3}/{4}'.format(
            user, password, host, port, database
        )
    )

if __name__ == '__main__':
    try:
        # GET THE CONNECTION OBJECT (ENGINE) FOR THE DATABASE
        engine = get_connection()
        print(
            f"Connection to the {host} for user {user} created successfully.")
    except Exception as ex:
        print("Connection could not be made due to the following error: \n", ex)

basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] =\
        'sqlite:///' + os.path.join(basedir, 'database.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class users(db.Model):
    user_id = db.Column(db.String, primary_key=True, nullable=False)
    email = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f'<{self.username}>'

class videos(db.Model):
    video_id = db.Column(db.String, primary_key=True, nullable=False)
    user_id = db.Column(db.ForeignKey('users.user_id', ondelete='cascade'), nullable=False)
    url = db.Column(db.String, nullable=False)
    caption = db.Column(db.String, nullable=False)
    lip_reading = db.Column(db.String, nullable=False)
    thumbnail_url = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)

class stars(db.Model):
    video_id = db.Column(db.ForeignKey('videos.video_id', ondelete='cascade'), primary_key=True, nullable=False)
    user_id = db.Column(db.ForeignKey('users.user_id', ondelete='cascade'), primary_key=True, nullable=False)

class categories(db.Model):
    video_id = db.Column(db.ForeignKey('videos.video_id', ondelete='cascade'), primary_key=True, nullable=False)
    user_id = db.Column(db.ForeignKey('users.user_id', ondelete='cascade'), primary_key=True, nullable=False)
    category = db.Column(db.String(100), primary_key=True, nullable=False)

    def __repr__(self):
        return f'<{self.category}>'
    
with app.app_context():
    db.create_all()


# ================================= API =================================


@app.route('/create_user', methods=['POST'])
def create_user():
    # get user data from post request
    # create a user in the user table with this data
    data = request.get_json()
    user_id = str(uuid.uuid4())
    email, username, password = list(data.values())
    with app.app_context():
        db.session.add(users(user_id=user_id, email=email, username=username, password=password))
        db.session.commit()
    return user_id, 200

@app.route('/upload_video', methods=['POST'])
def upload_video():
    video_id = str(uuid.uuid4())
    bytesOfVideo = request.get_data()
    video_url = f"./data/input/{video_id}.mp4"
    with open(video_url, 'wb') as out:
        out.write(bytesOfVideo)

    user_id = request.args.get('user_id')

    # HERE WE WILL RUN THE PIPELINE TO PROCESS THE VIDEO
    # process video
    vpe = VideoAudioProcessesor(f'./data/input/{video_id}.mp4')
    vpe.mp4ToWav(f'./data/input/{video_id}_muted.mp4', f'./data/input/{video_id}_noisy.wav')
    
    # process audio
    vpe.processWav(f'./data/input/{video_id}_noisy.wav')
    iso_wav_1 = vpe.loadIsoWav(f'./data/input/{video_id}_noisy.wav', 1)
    #iso_wav_2 = vpe.loadIsoWav(f'./data/input/{video_id}_noisy.wav', 2)


    # MULTITHREAD THESE
    final_url = f'output/{video_id}_merged.mp4'
    vpe.recodeMp4(f'./data/input/{video_id}_muted.mp4', iso_wav_1, f'./static/{final_url}')
    word_lines = transcribe(iso_wav_1)[:]

    print(user_id, video_url)

    testprompt = "".join([i[0] + ' ' for i in word_lines])[:-1]
    print("testprompt: " + testprompt)
    description = summarize_prompt(testprompt, client)
    lip_reading = testprompt
    thumbnail_url = get_image(description, client)
    
    response = requests.get(thumbnail_url)
    
    if response.status_code == 200:
        img = Image.open(BytesIO(response.content))
        final_thumbnail_url = f'thumbnails/{video_id}.png'
        img.save(f'./static/{final_thumbnail_url}')
    else:
        print(f"!!!\nFailed to download image. Status code: {response.status_code}\n!!!")

    category = get_category(description, client)
    with app.app_context():
        db.session.add(categories(video_id=video_id, user_id=user_id, category=category))
        db.session.add(videos(video_id=video_id, user_id=user_id, url=final_url, caption=json.dumps(word_lines), lip_reading=lip_reading, thumbnail_url=final_thumbnail_url, description=description))
        db.session.commit()
    
    return json.dumps({video_id:video_id}), 200
    # return json.dumps({"description": description, "thumbnail_url": thumbnail_url}), 200

@app.route('/delete_video', methods=['DELETE'])
def delete_video():
    data = request.get_json()
    video_id = list(data.values())[0]
    # get video id from json
    # delete video from video table
    # return 200
    try:
        videos.query.filter(videos.video_id == video_id).delete()
    except:
        pass

    try: 
        stars.query.filter(stars.video_id == video_id).delete()
    except:
        pass

    try: 
        categories.query.filter(categories.video_id == video_id).delete()
    except:
        pass
    with app.app_context():
        db.session.commit()
    return 200

"""
{
    user_id: string
    starred: list of video ids
    videos: list of {category: list of video objects}
}

"""
@app.route('/get_info', methods=['GET'])
def get_info():
    user_id = request.args.get('user_id')
    print(user_id)
    starred = [star.video_id for star in stars.query.filter_by(user_id=user_id).all()]
    print("!!!!")
    print(starred)
    # Join videos and categories tables
    query = db.session.query(categories, videos).join(videos, categories.video_id == videos.video_id)

    # Execute the query and fetch results
    results = query.all()

    # Initialize a dictionary to store the result in the desired format
    category_video_dict = {}

    # Iterate through the results and organize by category
    for category, video in results:
        category_name = category.category

        # Check if category_name is already a key in the dictionary
        if category_name not in category_video_dict:
            category_video_dict[category_name] = []

        # Append the video object to the list under the corresponding category
        category_video_dict[category_name].append({
            'video_id': video.video_id,
            'user_id': video.user_id,
            'url': video.url,
            'caption': video.caption,
            'lip_reading': video.lip_reading,
            'thumbnail_url': video.thumbnail_url,
            'description': video.description
        })
    return json.dumps({"user_id": user_id, "starred": starred, "videos": category_video_dict}), 200


@app.route('/star', methods=['PUT'])
def star():
    user_id = request.args.get('user_id')
    video_id = request.args.get('video_id')
    exists = bool(stars.query.filter(stars.video_id == video_id, stars.user_id == user_id).first())
    if not exists:
        with app.app_context():
            db.session.add(stars(user_id=user_id, video_id=video_id))
            db.session.commit()
    else:
        with app.app_context():
            stars.query.filter(stars.video_id == video_id, stars.user_id == user_id).delete()
            db.session.commit()
    return json.dumps({"status": "success"}), 200

@app.route('/get_media', methods=['GET'])
def get_media():
    url = request.args.get('url')
    return current_app.send_static_file(url)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
    
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