export class Payment {
    username: String;
    name: String;
    card_num: String;
    expiry: String;
    cvv: String;
}
export class Job {
    saveStory: boolean;
    job_id: String;
    username: String;
    storyName: String;
    status: String;
    output: {
        audio_path: String;
        text_path: String;
        ccr_image_path: String;
        cod_image_path: String;
        balloon_image_path: String;
        ocr_file_path: String;
    }
}