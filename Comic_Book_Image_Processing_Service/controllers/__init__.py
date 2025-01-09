from flask_restplus import Api

from .balloon_controller import api as bc
from .character_controller import api as cc
from .object_controller import api as oc
from .text_controller import api as tc
from .panel_controller import api as pc
from .audio_controller import api as ac

api = Api(
    title='My Title',
    version='1.0',
    description='A description'
    # All API metadatas
)

api.add_namespace(pc, path='/image_processing_service/recognize/panels')
api.add_namespace(bc, path='/image_processing_service/recognize/ballons')
api.add_namespace(cc, path='/image_processing_service/recognize/character')
api.add_namespace(oc, path='/image_processing_service/recognize/object')
api.add_namespace(tc, path='/image_processing_service/recognize/text')
api.add_namespace(ac, path='/image_processing_service/recognize/audio')
