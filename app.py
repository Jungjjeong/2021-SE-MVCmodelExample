from flask import Flask, request, jsonify, session
from pymongo import MongoClient
from bson.objectid import ObjectId
from werkzeug.utils import secure_filename
import datetime
app = Flask(__name__)

app.secret_key = 'software_engineering'

cluster = MongoClient(
    "mongodb+srv://YeHyunSuh:Tjdmdgka55!@cluster0.qbm6b.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
db = cluster["software_engineering"]
userDB = db['user']
boardDB = db['board']
pictureDB = db['picture']

@app.route('/')
def hello_world():
    return "hello world!"

@app.route('/login', methods=['POST']) 
def login():
    userid = request.json['userid']
    password = request.json['password']
    print(userid)
    print(password)

    user = userDB.find_one(
        { 'userid': userid },
        { 'password': password }
    )

    if user is None:
        return jsonify({'login': False})
    else:
        session['userid'] = request.form.get('userid')
        return jsonify({'login': True})

@app.route('/logout', methods=['GET'])
def logout():
    session.pop('userid',None)
    return "로그아웃이 되었습니다"

@app.route('/register', methods=['POST'])
def register():
    userid = request.json['userid']
    username = request.json['username']
    password = request.json['password']
    print(str(userid))

    document_id = userDB.insert({
        'userid': userid,
        'username': username,
        'password': password
    })

    new_document = userDB.find_one({'_id':document_id})
    output = {
        'userid': new_document['userid'],
        'username': new_document['username']
    }
    return jsonify({'result': output})

@app.route('/board', methods=['POST','GET','PUT','DELETE'])
def board():
    if request.method == 'POST':
        title = request.json['title']
        content = request.json['content']
        picture_url = request.json['picture_url']

        document_id = boardDB.insert({
            'title': title,
            'content': content,
            'picture_url': picture_url,
            'time': datetime.datetime.now()
        })

        new_document = boardDB.find_one({'_id':document_id})
        output = {
            'title': new_document['title'],
            'content': new_document['content'],
            'picture_url': new_document['picture_url'],
            'time': new_document['time']
        }
        return "게시물 업로드 완료"

    elif request.method == 'GET':
        boards = []
        for doc in boardDB.find():
            boards.append({
                '_id':str(ObjectId(doc['_id'])),
                'title': doc['title'],
                'content': doc['content'],
                'picture_url': doc['picture_url'],
                'time': doc['time']
            })
        return jsonify(boards)

    elif request.method == 'PUT':
        boardDB.update_one({'_id': ObjectId(id)}, {
            '$set':{
                'title': request.json['title'],
                'content': request.json['content'],
                'picture_url': request.json['picture_url']
            }})
        return jsonify({'msg':'게시물이 업데이트 되었습니다.'})

    else:
        boardDB.delete_one({'_id':ObjectId(id)})
        return jsonify({'msg':'게시물이 삭제되었습니다.'})

if __name__ == "__main__":
    app.run(debug=True)