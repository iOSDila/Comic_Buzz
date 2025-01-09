import os
import pyttsx3


def create_audio(job_id, text_filename):
    engine = pyttsx3.init()

    text = ''
    result = {}

    CWD_PATH = os.getcwd()

    # Path to text file
    PATH_TO_TEXT_FILE = os.path.join(CWD_PATH, 'resources/' + job_id + '/text', text_filename)
    PATH_TO_OUTPUT_FILE = os.path.join(CWD_PATH, 'resources/' + job_id + '/audio', text_filename + '.mp3')

    print(PATH_TO_TEXT_FILE)

    try:
        with open(PATH_TO_TEXT_FILE, "r") as file:
            for line in file:
                text = text + line
        # Saving the output as mp3 file
        print(text.strip())

        engine.save_to_file(text, PATH_TO_OUTPUT_FILE)
        engine.runAndWait()
        engine.stop()

        # Preparing the result object
        result['status'] = 'success'
        result['output_filename'] = text_filename + '.mp3'
    except Exception as e:
        result['status'] = 'failed'
        result['error'] = str(e)
        print(e)

    return result

#create_audio('8eb443b0-fcda-11ea-aa12-697c7af5d69b', 'Text.txt')
#create_audio('ee75eae0-04ad-11ea-b3a2-59adc12f09a3', '/home/mactavish/Desktop/chuka proj/Comic_Book_Image_Processing_Service/resources/ee75eae0-04ad-11ea-b3a2-59adc12f09a3/text/OCR_2019-11-11T18-06-06.008Zpage2.jpg1_org_content.jpg.txt')


