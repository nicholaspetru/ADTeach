class Environment:
    def __init__(self):
        self.numVariables = 0
        self.variables = None
        self.parent = None
        self.child = None
        
    def getNumVariables(self):
        return self.numVariables
    def getVariables(self):
        return self.variables
    def getParetn(self):
        return self.parent
    def getChild(self):
        return self.child