import json
from os.path import splitext

import cv2
import imutils
import numpy as np
from scipy.spatial import distance


def link_extract(job_id, image, ratio_diff, positions, text_file):
    angled_save_path = './resources/' + job_id + '/images/processed/' + splitext(image)[0] + '_association' + splitext(image)[1]

    # load the image, convert it to grayscale, blur it slightly, and threshold it
    image = cv2.imread('./resources/' + job_id + '/images/processed/' + image)

    # image pre-processing
    gray_img = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray_img, (5, 5), 0)
    thresh = cv2.threshold(blurred, 60, 255, cv2.THRESH_BINARY)[1]

    # find contours in the threshold image
    cnts = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = imutils.grab_contours(cnts)

    # Conversion to float is a prerequisite for the algorithm
    gray_img = np.float32(gray_img)

    # 3 is the size of the neighborhood considered, aperture parameter = 3
    # k = 0.04 used to calculate the window score (R)
    corners_img = cv2.cornerHarris(gray_img, 3, 3, 0.04)

    corners_img = cv2.dilate(corners_img, None)
    ret, corners_img = cv2.threshold(corners_img, 0.01 * corners_img.max(), 255, 0)
    corners_img = np.uint8(corners_img)

    # find centroids
    ret, labels, stats, centroids = cv2.connectedComponentsWithStats(corners_img)

    # define the criteria to stop and refine the corners
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 100, 0.001)
    corners = cv2.cornerSubPix(gray_img, np.float32(centroids), (5, 5), (-1, -1), criteria)

    try:
        # loop over the contours
        for c in cnts:
            M = cv2.moments(c)

        # compute the center of the contour
        cX = int(M["m10"] / M["m00"])
        cY = int(M["m01"] / M["m00"])
    except Exception as ex:
        response = {
            "status": "done with errors",
            "error": str(ex)
        }
        return response

    # draw the center
    cv2.circle(image, (cX, cY), 3, (0, 0, 255), -1)

    # find shortest distance from center to other contour points
    center = np.array([(cX, cY)])

    xdiff = ratio_diff['xdiff']
    ydiff = ratio_diff['ydiff']

    if positions:
        if xdiff == 0:
            posx = int(positions[0]['position'][0]['x'])
            posy = int(positions[0]['position'][0]['y']) + int(ydiff / 2)
        elif ydiff == 0:
            posx = int(positions[0]['position'][0]['x']) + int(xdiff / 2)
            posy = int(positions[0]['position'][0]['y'])
        else:
            posx = int(positions[0]['position'][0]['x']) + int(xdiff / 2)
            posy = int(positions[0]['position'][0]['y']) + int(ydiff / 2)

        # initializing variables with first value set
        initial_pnt = np.array([(posx, posy)])
        minimum = distance.cdist(center, initial_pnt, 'euclidean')
        coord = (posx, posy)
        speaker = positions[0]['character']

        for character in positions:
            if xdiff == 0:
                position_x = int(character['position'][0]['x'])
                position_y = int(character['position'][0]['y']) + int(ydiff / 2)
            elif ydiff == 0:
                position_x = int(character['position'][0]['x']) + int(xdiff / 2)
                position_y = int(character['position'][0]['y'])
            else:
                position_x = int(character['position'][0]['x']) + int(xdiff / 2)
                position_y = int(character['position'][0]['y']) + int(ydiff / 2)

            cv2.circle(image, (position_x, position_y), 3, (0, 255, 0), -1)
            point = np.array([(position_x, position_y)])
            result = distance.cdist(center, point, 'euclidean')
            if minimum[0][0] > result[0][0]:
                minimum = result[0][0]
                coord = (position_x, position_y)
                speaker = character['character']

        # mark nearest point
        cv2.circle(image, coord, 3, (0, 255, 0), -1)

        # draw the line between center point and nearest point
        cv2.line(image, (cX, cY), coord, [0, 0, 255], 1)

        # save image
        cv2.imwrite(angled_save_path, image)

        text_file_path = './resources/' + job_id + '/text/' + text_file
        text = ""
        with open(text_file_path, "r") as file:
            for line in file:
                text = text + line

        story = {
            "character": speaker,
            "speech": text
        }

        success_response = {
            "status": "success",
            "story": story
        }

        return success_response
    else:
        failed_response = {
            "status": "done with errors",
            "error": "No characters detected"
        }

        return failed_response
