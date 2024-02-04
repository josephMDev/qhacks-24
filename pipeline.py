import ffmpeg
import src.voiceIsoModel as iso
from os import listdir

class VideoAudioProcessesor():
    #TODO make sure u install ffmpeg executable AND set to sys env variables before running this!!!

    def __init__(self, vidFile:str, modelName:str = "mpariente/DPRNNTasNet-ks2_WHAM_sepclean"):
        #assume correct path is given
        self._inVid = ffmpeg.input(vidFile)
        self.model = iso.PreTrainedModel(modelName)

    def mp4ToWav(self, muteVidPath:str, audOutPath:str):
        try:

            self._inVid.output(muteVidPath, acodec='copy', vcodec='copy', an=None).run()
            self._inVid.output(audOutPath, format='wav', acodec='pcm_s16le', ar='16000').run()
            
            print(f"Audio extracted and saved as {audOutPath}, video with muted audio saved as {muteVidPath}")
        except ffmpeg.Error as e:
            print(f"Error: {e.stderr}")

    def processWav(self, noisyWavPath:str):
        #use AI model here
        #hard-coded to export both iso files to /src/data/output/
        self.model.sepAudio(noisyWavPath)

    def loadIsoWav(self, noisyWavPath:str, isoChannel:int=1):
        try:
            baseName = noisyWavPath[17:-4] + "_est" + str(isoChannel) + ".wav"
        # Get the list of items in the directory
            files = listdir('./src/data/output/')

            for file in files:
                if file == baseName:
                    return './src/data/output/' + file
            return "Error"
        except FileNotFoundError:
            print(f"Directory not found: {baseName}")

    def recodeMp4(self, muteVidPath:str, audPath:str, outPath:str):
        video = ffmpeg.input(muteVidPath)
        audio = ffmpeg.input(audPath)
        ffmpeg.output(video, audio, outPath, vcodec='copy', acodec='aac', strict='experimental').run()
    

vpe = VideoAudioProcessesor('./src/data/input/curry_interview.mp4')
vpe.mp4ToWav('./src/data/input/mutedCurryVid.mp4', './src/data/input/curry.wav')
#process - aud
vpe.processWav('./src/data/input/curry.wav')
iso_wav_1 = vpe.loadIsoWav('./src/data/input/curry.wav', 1)
#iso_wav_2 = vpe.loadIsoWav('./src/data/input/curry.wav', 2)

vpe.recodeMp4('./src/data/input/mutedCurryVid.mp4', iso_wav_1, './src/data/output/curry_merged.mp4')

    # maybe do something like below (async):
"""
    self._video = ffmpeg.run_async(
            stream, quiet=True, overwrite_output=overwrite
        )
"""