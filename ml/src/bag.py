import numpy as np
from zlib import crc32

class BagOfWords:
    def __init__(self, bits=10):
        self.bits = bits
        self._vector = np.zeros(1 << self.bits)

    def add(self, word):
        bits = self.bits
        hash = crc32(word)
        index = hash & ((1 << bits) - 1)
        sign = (((hash & (1 << bits)) >> bits) << 1) - 1
        self._vector[index] += sign

    @property
    def vector(self):
        return self._vector

