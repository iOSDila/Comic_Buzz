from flask_restplus import Namespace, Resource, fields
from flask import jsonify, request
import subprocess
import json

api = Namespace('character', description='Character related operations')

@api.route('/start', methods=['POST'])
class Character(Resource):
    def post(self):

        processes = []

        # Retrieving data from request body
        request_body = request.get_json()
        fileName = request_body["image_file_name"]
        job_id = request_body["job_id"]

        cmd = "cd CCR/models/research/object_detection & python Object_detection_image.py " + fileName + " " + job_id
        print(cmd)
        print("CCR Started..")

        p1 = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True, universal_newlines=True)

        processes.append(p1)

        for p in processes:
            stdout, stderr = p.communicate()
            print("stdout — {}".format(stdout))
            print("stderr — {}".format(stderr)) 

            if p.wait() != 0:
                print('Error occurred while detecting characters')
                return jsonify({'status':'failed', 'error': str(stderr)})

        stdout = stdout.replace("\'", "\"")
        print("stdout — {}".format(stdout))
        return jsonify({'status':'success', 'result' : json.loads(stdout)})