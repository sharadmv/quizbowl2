from collections import Counter
from sample import *
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize

class FeatureExtractor:
    def __init__(self):
        self.sw = stopwords.words('english')

    def extract(self, tossup):
        text = tossup.question.lower()
        tokens = [word for sent in sent_tokenize(text) for word in word_tokenize(sent)]
        tokens = filter(lambda word : word not in ',-.\\/[]()', tokens)
        words = Counter()
        for word in tokens:
            if word not in self.sw:
                words[word] += 1
        return TossupSample(words)
