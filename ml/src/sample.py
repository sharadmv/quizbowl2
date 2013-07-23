from bag import BagOfWords

class TossupSample:

    BITS = 10
    FEATURES = pow(2, BITS)

    def __init__(self, words):
        self.bag = BagOfWords(self.BITS)
        for word in words:
            self.bag.add(word)

    @property
    def vector(self):
        return self.bag.vector

    @property
    def features(self):
        return len(self.bag.vector)
