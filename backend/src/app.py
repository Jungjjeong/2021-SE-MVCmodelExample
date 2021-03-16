from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask_cors import CORS

app = Flask(__name__)

cluster = MongoClient(
    "mongodb+srv://YeHyunSuh:Tjdmdgka55!@cluster0.qbm6b.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
database = cluster["software_engineering"]
taskDB = database["tasks"]
userDB = database["user"]

CORS(app)

#Routes
@app.route('/login', methods=['POST'])
def login():
    userid = request.json['userid']
    password = request.json['password']

    user = userDB.find_one(
        { 'userid': userid },
        { 'password': password }
    )

    if user is None:
        return jsonify({'login': False})
    else:
        return jsonify({'login': True})

@app.route('/register', methods=['POST'])
def createUser():
  id = userDB.insert({
    'userid': request.json['userid'],
    'password': request.json['password']
  })
  return jsonify(str(ObjectId(id)))

@app.route('/tasks', methods=['POST'])
def createTask():
  id = taskDB.insert({
    'title': request.json['title'],
    'content': request.json['content'],
    'picture_url': request.json['picture_url']
  })
  return jsonify(str(ObjectId(id)))

@app.route('/tasks', methods=['GET'])
def getTasks():
  tasks = []
  for doc in taskDB.find():
    tasks.append({
      '_id': str(ObjectId(doc['_id'])),
      'title': doc['title'],
      'content': doc['content'],
      'picture_url': doc['picture_url']
    })
  return jsonify(tasks)

@app.route('/task/<id>', methods=['GET'])
def getTask(id):
  task = taskDB.find_one({'_id': ObjectId(id)})
  return jsonify({
    '_id': str(ObjectId(task['_id'])),
    'title': task['title'],
    'content': task['content'],
    'picture_url': task['picture_url']
  })

@app.route('/tasks/<id>', methods=['DELETE'])
def deleteTask(id):
  taskDB.delete_one({'_id': ObjectId(id)})
  return jsonify({'msg': 'task deleted'})

@app.route('/tasks/<id>', methods=['PUT'])
def editTask(id):
  taskDB.update_one({'_id': ObjectId(id)}, {'$set': {
    'title': request.json['title'],
    'content': request.json['content'],
    'picture_url': request.json['picture_url']
  }})
  return jsonify({'msg': 'task updated'})

if __name__ == "__main__":
    app.run(debug=True)