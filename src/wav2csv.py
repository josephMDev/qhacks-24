# -*- coding: utf-8 -*-
"""
BMCL BAEKSUWHAN
@author: lukious
@edited by : josephMDev
"""
from scipy.io import wavfile
import pandas as pd


def toCSV(inFile : str) :
    if inFile[-3:] != 'wav':
        print('WARNING!! Input File format should be *.wav')
        return False

    samrate, data = wavfile.read(str('./src/data/' + inFile))
    print('Load is Done! \n')

    wavData = pd.DataFrame(data)

    if len(wavData.columns) == 2:
        print('Stereo .wav file\n')
        wavData.columns = ['R', 'L']
        #stereo_R = pd.DataFrame(wavData['R'])
        #stereo_L = pd.DataFrame(wavData['L'])
        print('Saving...\n')
        #stereo_R.to_csv(str(inFile[:-4] + "./src/data/_Output_stereo_R.csv"), mode='w')
        #stereo_L.to_csv(str(inFile[:-4] + "./src/data/_Output_stereo_L.csv"), mode='w')
        wavData.to_csv("./src/data/Output_stereo_RLTEST.csv", mode='w')
        #print('Save is done ' + str(inFile[:-4]) + './src/data/_Output_stereo_R.csv , '
                            #+ str(inFile[:-4]) + './src/data/_Output_stereo_L.csv')

    elif len(wavData.columns) == 1:
        print('Mono .wav file\n')
        wavData.columns = ['M']

        wavData.to_csv(str("./src/data/" + inFile[:-4] + "_Output_mono.csv"), mode='w')

        print('Save is done ' + str("./src/data/" + inFile[:-4] + '_Output_mono.csv'))

    else:
        print('Multi channel .wav file\n')
        print('number of channel : ' + len(wavData.columns) + '\n')
        wavData.to_csv(str("./src/data/" + inFile[:-4] + "Output_multi_channel.csv"), mode='w')

        print('Save is done ' + str("./src/data/" + inFile[:-4] + 'Output_multi_channel.csv'))
    return True

if __name__ == '__main__':
    toCSV('stereo_44100.wav')
