from flask_restplus import Namespace, Resource, fields
from flask import request
from TTS import audio_converter

api = Namespace('audio', description='audio related operations')

@api.route('/start', methods=['POST'])
class Audio(Resource):
    def post(self):

        # Retrieving data from request body
        request_body = request.get_json()
        text_filename = request_body["text_filename"]
        job_id = request_body["job_id"]

        return audio_converter.create_audio(job_id, text_filename)
