
import numpy as np
import soundfile as sf
#from pesq import pesq

from fourier_transform.pns.noise_suppressor import NoiseSuppressor


def main():

    # Prepare Data 
    #clean_files = ["/denoise_model/data/sp02.wav", "/denoise_model/data/sp04.wav", "/denoise_model/data/sp06.wav", "/denoise_model/data/sp09.wav"]
    
    #input_files = ["/denoise_model/data/sp02_train_sn5.wav", 
    #               "/denoise_model/data/sp04_babble_sn10.wav", 
     #              "/denoise_model/data/sp06_babble_sn5.wav", 
     #              "/denoise_model/data/sp09_babble_sn10.wav"]
    input_files = ["./src/data/input/mix4.wav"]

    output_files = ["./src/data/output/test_DN_mix4.wav"]
    
    for i in range(len(input_files)) :
        #clean_file = clean_files[i]
        input_file = input_files[i]
        output_file = output_files[i]

        #clean_wav, _  = sf.read(clean_file)
        noisy_wav, fs = sf.read(input_file)

        # Initialize
        noise_suppressor = NoiseSuppressor(fs)

        x = noisy_wav
        frame_size = noise_suppressor.get_frame_size()
        xfinal = np.zeros(len(x))

        # Start Processing
        k = 0
        while k + frame_size < len(x):
            frame = x[k : k + frame_size]
            xfinal[k : k + frame_size] =  noise_suppressor.process_frame(frame)
            k += frame_size

        # Save Results
        xfinal = xfinal / max(np.abs(xfinal))
        sf.write(output_file, xfinal, fs)

        '''
        # Performance Metrics
        print("")
        print(input_file)
        pesq_nb = pesq(ref=clean_wav, deg=noisy_wav, fs=fs, mode='nb')
        print("input pesq nb: ", "%.4f" % pesq_nb)
        pesq_nb = pesq(ref=clean_wav, deg=xfinal, fs=fs, mode='nb')
        print("output pesq nb: ", "%.4f" % pesq_nb)

        if fs > 8000:
            pesq_wb = pesq(ref=clean_wav, deg=noisy_wav, fs=fs, mode='wb')
            print("input pesq wb: ", "%.4f" % pesq_wb)
            pesq_wb = pesq(ref=clean_wav, deg=xfinal, fs=fs, mode='wb')
            print("output pesq wb: ", "%.4f" % pesq_wb)
    '''
if __name__=="__main__":
    main()