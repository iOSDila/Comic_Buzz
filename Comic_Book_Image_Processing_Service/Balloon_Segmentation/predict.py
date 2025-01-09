from os.path import splitext

import cv2
import os
import numpy as np
from PIL import Image
from skimage.io import imsave
from skimage.transform import resize
from tensorflow.python.keras.models import load_model as load_model
# import tensorflow.python.keras as keras


def predict(job_id, image):
    # with keras.backend.get_session().graph.as_default():

        cwd_path = os.getcwd()
        model_path = os.path.join(cwd_path, 'Balloon_Segmentation', '0207_e500_std_model_4.h5')

        model = load_model(model_path)

        # save path for ratio fixing is based on the path of the image amd will be saved in the same directory
        ratio_save_path = './resources/' + job_id + '/images/processed/' + splitext(image)[0] + '_ratio' + splitext(image)[1]
        prediction_save_path = './resources/' + job_id + '/images/processed/' + splitext(image)[0] + '_black_&_white' + \
                               splitext(image)[1]
        output_save_path = './resources/' + job_id + '/images/processed/' + splitext(image)[0] + '_org_content' + \
                           splitext(image)[1]
        returned_output_org = splitext(image)[0] + '_org_content' + splitext(image)[1]
        returned_output_binary = splitext(image)[0] + '_black_&_white' + splitext(image)[1]

        image = './resources/' + job_id + '/images/original/' + image

        # fixing the image to a ratio
        old_im = Image.open(image)
        old_size = old_im.size

        x = old_size[0]
        y = int((x * 3) / 2)

        new_size = (x, y)

        # calculate difference
        xdiff = abs(new_size[0] - old_size[0])
        ydiff = abs(new_size[1] - old_size[1])

        new_im = Image.new("RGB", new_size, color=16777215)
        new_im.paste(old_im, (int((new_size[0] - old_size[0]) / 2),
                              int((new_size[1] - old_size[1]) / 2)))
        new_im.save(ratio_save_path)

        image = ratio_save_path

        # prediction
        ori_img = cv2.imread(image)
        ori_img = resize(ori_img, (768, 512), anti_aliasing=True, preserve_range=True)
        ori_img = np.expand_dims(ori_img, axis=0)
        ori_img = ori_img / 255

        p = model.predict(ori_img)

        # save original image as mask.jpg
        imsave(fname=prediction_save_path, arr=p[0, :, :, 0])

        # get original content of segmented balloons
        mask = cv2.imread(image)
        mask = resize(mask, (768, 512))
        mask = mask * 255
        mask = mask.astype(np.uint8)

        ori_img = cv2.imread(prediction_save_path)
        ori_img = resize(ori_img, (768, 512))
        ori_img = ori_img * 255
        ori_img = ori_img.astype(np.uint8)

        output = cv2.bitwise_and(mask, ori_img, mask=None)
        cv2.imwrite(output_save_path, output)

        function_outputs = {
            "output_org_content": returned_output_org,
            "output_binary_content": returned_output_binary,
            "xdiff": xdiff,
            "ydiff": ydiff
        }

        return function_outputs
