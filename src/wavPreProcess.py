import librosa
import os.path
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

    def to16k(self):
        pass

res = Resampler('./src/data/stereo_4410.wav')