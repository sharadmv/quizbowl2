import mysql
import feature as ft
import numpy as np
import scipy.io as sio
import scipy.sparse as sp
import progressbar
from sample import TossupSample

DATA_DIR = "data"
if __name__ == "__main__":
    print("Grabbing data...")
    data = mysql.Data().get_data()
    extractor = ft.FeatureExtractor()
    print("Extracting features...")

    counter = 0
    bar = progressbar.ProgressBar(maxval=len(data), widgets=[progressbar.Bar('=', '[', ']'), ' ', progressbar.Percentage()])
    samples = len(data)
    features = np.zeros((samples, TossupSample.FEATURES))
    classes = np.zeros(samples)
    for i in range(samples):
        sample = extractor.extract(data[i])
        vector = sample.vector
        features[i,:] = vector
        classes[i] = data[i].category
        counter += 1
        bar.update(counter)
    bar.finish()

    index = np.random.permutation(samples)
    train = index[:0.7*samples]
    test = index[0.7*samples:0.85*samples]
    held = index[0.85*samples:]

    sio.savemat('%s/all.mat' % DATA_DIR, {"x" : features, "y" : classes} , do_compression=True)
    sio.savemat('%s/train.mat' % DATA_DIR, {"x" : features[train], "y" : classes[train]} , do_compression=True)
    sio.savemat('%s/test.mat' % DATA_DIR, {"x" : features[test], "y" : classes[test]} , do_compression=True)
    sio.savemat('%s/held.mat' % DATA_DIR, {"x" : features[held], "y" : classes[held]} , do_compression=True)
