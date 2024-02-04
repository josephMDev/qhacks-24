import ffmpeg

class VideoAudioProcessesor():
    #make sure u install ffmpeg executable before running this!!!

    def __init__(self, vidFile:str):
        #assume correct path is given
        self._inVid = ffmpeg.input(vidFile)

    def mp4ToWav(self, audOutPath:str):
        try:
            
            self._inVid.output(audOutPath, format='wav').run()
            
            print(f"Audio successfully extracted and saved as {audOutPath}")
        except ffmpeg.Error as e:
            print(f"Error: {e.stderr}")

    def recodeMp4(self, muteVidPath:str, audPath:str, outPath:str):
        video = ffmpeg.input(muteVidPath)
        audio = ffmpeg.input(audPath)
        out = ffmpeg.output(video, audio, outPath, vcodec='copy', acodec='aac', strict='experimental')
        out.run()
    

vpe = VideoAudioProcessesor('./src/data/input/curry_interview.mp4')
vpe.mp4ToWav('./src/data/input/curry.wav')

    # maybe do something like below (async):
"""
    self._video = ffmpeg.run_async(
            stream, quiet=True, overwrite_output=overwrite
        )
"""