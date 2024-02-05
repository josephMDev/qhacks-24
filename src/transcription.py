import speech_recognition as sr
from pydub import AudioSegment

def find_start_time(audio):
    energy_threshold = audio.dBFS # Adjustable threshold
    for i, chunk in enumerate(audio[::200]):  # Analyze the audio in chunks of 200 ms
        if chunk.dBFS > energy_threshold:
            return i * 200

    return 0  # If no suitable start time is found, default to 0

def transcribe(audio_file_path, lang="English"):
    languages = {"English": "en-US",
                "French": "fr-FR",
                "Spanish": "es-ES",
                "Chinese": "zh-CN",
                "German": "de-DE",
                "Romanian": "ro-RO"}

    audio = AudioSegment.from_file(audio_file_path)
    recognizer = sr.Recognizer()

    # Convert the audio to text
    with sr.AudioFile(audio_file_path) as source:
        audio_data = recognizer.record(source)

    try:
        text = recognizer.recognize_google(audio_data, language=languages[lang])

        # Get the timestamp for each word
        word_durations = []
        total_duration = find_start_time(audio) # Measured in ms
        for word in text.split():
            word_durations.append((word, round(total_duration / 1000, 1)))
            word_duration = (len(word) + 1) / len(text) * len(audio)  # Estimate the duration based on the length of the word
            total_duration += word_duration

        # store strings of words said in intervals of 5 seconds
        word_lines = [] 
        cur_interval = 5
        word_line = ""

        for word, timestamp in word_durations:
            if timestamp > cur_interval:
                word_lines.append((word_line, cur_interval-5))
                cur_interval += 5
                word_line = ""

            word_line += " " + word if word_line else word

        word_lines.append((word_line, cur_interval-5))
        
        return word_lines
    
    except sr.UnknownValueError:
        print("Speech Recognition could not understand the audio")
        return []
    except sr.RequestError as e:
        print(f"Could not request results from Google Speech Recognition service; {e}")
        return []


# """ USAGE
# for word, timestamp in transcribe("data.wav", "English"):
#     print(f"{word : <10}{timestamp : 10}s")
# """
