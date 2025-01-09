import json

def build(script, objects):
    sentences = ""
    objs = objects['objects']

    for obj in objs:
        item = obj["object"]
        count = obj["count"]

        if count > 1:
            s1 = "there are " + item + "s and "
        else:
            s1 = "there is a " + item + " and "

        sentences = sentences + s1

    story_script = script['story']
    speaker = story_script["character"]
    speech = story_script["speech"]
    speech = speech.strip()

    if speech:
        s2 = speaker + " says " + speech + "."
        sentences = sentences + s2

    sentences = sentences.replace("\n", " ")
    sentences = sentences.replace("\f", "")

    if sentences:
        success_response = {
            "status": "success",
            "text_story": str(sentences)
        }
        return success_response
    else:
        failed_response = {
            "status": "done with errors",
            "error": "No Text Story created"
        }
        return failed_response
