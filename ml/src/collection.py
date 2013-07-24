import numpy as np
import scipy.io as sio
import collections as util
from math import log

class Collection:

    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.points = x.shape[0]
        self.votes = util.Counter()
        for i in range(self.points):
            self.votes[self.y[i][0]] += 1

    def entropy(self):
        priors = map(lambda x : x / (self.points + 0.0), self.votes.values())
        return -sum(map(lambda x : x * log(x, 2), priors))

    def vote(self):
        return max(self.priors.items(),key=lambda x : x[1])

    @staticmethod
    def load(filename):
        mat = sio.loadmat(filename)
        return Collection(mat['x'], mat['y'])
