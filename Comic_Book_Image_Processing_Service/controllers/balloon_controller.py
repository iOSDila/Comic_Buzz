import json

from flask import jsonify, request
from flask_restplus import Namespace, Resource

from Balloon_Segmentation import predict

api = Namespace('balloons', description='balloons related operations')


@api.route('/start', methods=['POST'])
class Ballon(Resource):
    def post(self):

        # Retrieving data from request body
        request_body = request.get_json()
        balloon_binary_image = request_body["input_binary_image"]
        job_id = request_body["job_id"]
        return jsonify({'status': 'success',
                        'output_filename': json.loads(
                            str(predict.predict(job_id, balloon_binary_image)).replace("\'", "\""))})
