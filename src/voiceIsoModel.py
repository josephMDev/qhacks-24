from asteroid.models import BaseModel
import soundfile as sf

# 'from_pretrained' automatically uses the right model class (asteroid.models.DPRNNTasNet).
#model = BaseModel.from_pretrained("mpariente/DPRNNTasNet-ks2_WHAM_sepclean")
'''
# You can pass a NumPy array:
mixture, _ = sf.read("female-female-mixture.wav", dtype="float32", always_2d=True)
# Soundfile returns the mixture as shape (time, channels), and Asteroid expects (batch, channels, time)
mixture = mixture.transpose()
mixture = mixture.reshape(1, mixture.shape[0], mixture.shape[1])
out_wavs = model.separate(mixture)
'''
# Or simply a file name:
class PreTrainedModel():
    def __init__(self, pretrained_m : str = "mpariente/DPRNNTasNet-ks2_WHAM_sepclean"):
        self.pretrained_m = pretrained_m
        self.model = BaseModel.from_pretrained(self.pretrained_m)
    
    def sepAudio(self, inFile : str, overwrite : bool = True, rs : bool = True):
        self.model.separate(inFile,force_overwrite=overwrite,resample=rs,output_dir="./data/output/")

#HOW TO CALL:
#ptModel = PreTrainedModel()
#ptModel.sepAudio('./src/data/input/mix4.wav')