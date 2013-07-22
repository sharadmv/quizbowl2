class Tossup:
    def __init__(self,
                 id=None,
                 weight=None,
                 question=None,
                 answer=None,
                 categoryId=None,
                 difficultyId=None,
                 tournamentId=None,
                 roundId=None,
                 number=None):
        self.id = id
        self.question = question
        self.answer = answer
        self.category = categoryId
        self.difficulty = difficultyId
        self.tournament = tournamentId
        self.round = roundId
        self.number = number
