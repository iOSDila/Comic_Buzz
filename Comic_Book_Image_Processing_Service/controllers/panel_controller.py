from flask_restplus import Namespace, Resource, fields
from flask import jsonify, request
from PanelSegmentation import panel

api = Namespace('panels', description='panels related operations')

@api.route('/start', methods=['POST'])
class Panel(Resource):
    def post(self):

        # Retrieving data from request body
        request_body = request.get_json()
        segmented_image_file_names = request_body["image_file_name"]
        job_id = request_body["job_id"]

        #invoke panel segmentation function with image_file_name arg
        #function should return the segmented file name in a JSON array

        return panel.create_panel(job_id, segmented_image_file_names)
