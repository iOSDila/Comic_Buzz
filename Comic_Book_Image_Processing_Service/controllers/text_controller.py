import subprocess

from flask import jsonify, request
from flask_restplus import Namespace, Resource
import json

from Balloon_Segmentation import center_of_shape
from Story_Building import build_story

api = Namespace('text', description='Text related operations')

@api.route('/ocr', methods=['POST'])
class Ballon(Resource):
    def post(self):

        processes = []

        # Retrieving data from request body
        request_body = request.get_json()
        input_filename = request_body["image_file_name"]
        job_id = request_body["job_id"]
        output_filename = 'OCR_' + input_filename
        cmd = 'cd Tesseract-OCR & tesseract.exe ../resources/' + job_id + '/images/processed/' + input_filename +' ../resources/' + job_id + '/text/' + output_filename +' -l eng'
        print(cmd)
        print("OCR started..")
        p1 = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True, universal_newlines=True)

        processes.append(p1)

        for p in processes:
            stdout, stderr = p.communicate()
            print(stdout)
            print(stderr)

            if p.wait() != 0:
                print('Error occurred while optical character recognition')
                return jsonify({'status': 'failed', 'error': str(stderr)})

        return jsonify({'status': 'success', 'output_filename': output_filename + '.txt'})

@api.route('/association',methods=['POST'])
class Ballon(Resource):
    def post(self):
        request_body = request.get_json()
        characters = request_body["characters"]
        image_ratio_difference = request_body["ratio_diff"]
        balloon_binary_image = request_body["balloon_binary_image"]
        speech_text = request_body["text"]
        job_id = request_body["job_id"]
        response = center_of_shape.link_extract(job_id, balloon_binary_image, image_ratio_difference, characters, speech_text)
        return jsonify(response)

@api.route('/story',methods=['POST'])
class Ballon(Resource):
    def post(self):
        request_body = request.get_json()
        story = request_body["story_script"]
        objects = request_body["objects"]
        response = build_story.build(story, objects)
        return jsonify(response)
