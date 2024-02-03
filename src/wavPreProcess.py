import librosa
import os.path
import soundfile as sf
from exceptions import *

'''
Python file for wav data pre-processing
@author josephMDev
Recommended usage: down-sampling .wav to 16000 hz or 8000 hz sample rate .wav1
'''

class Resampler():
    def __init__(self, wavFile : str):
        try:
            if wavFile[-3:] != 'wav':
                raise NotWavError("WARNING!! Input File format should be *.wav")
            if not os.path.exists(wavFile):
                raise FileNotFoundError
        except NotWavError:
            print("NotWavError Exception : invalid file type")
        except FileNotFoundError:
            print("FileNotFoundError : Specified file path does not exist")
        
        self.file = wavFile
        self.fun16k_counter = 0
        self.fun8k_counter = 0

    def to16k(self):
        self.fun16k_counter += 1
        new_name = "./src/data/DS_"+self.file[-5]+str(self.fun16k_counter)+".wav"
        try:
            audio_signal, sample_rate = librosa.load(self.file, sr=16000)
            sf.write(file=new_name, data=audio_signal, samplerate=sample_rate)
        except:
            print("Something went wrong, cannot downsample to 16k Hz")

    def to8k(self):
        self.fun8k_counter += 1
        new_name = "./src/data/DS_"+self.file[-5]+str(self.fun8k_counter)+".wav"
        try:
            audio_signal, sample_rate = librosa.load(self.file, sr=8000)
            sf.write(file=new_name, data=audio_signal, samplerate=sample_rate)
        except:
            print("Something went wrong, cannot downsample to 8k Hz")

res = Resampler('./src/data/stereo_44100.wav')
res.to16k()