class Environment:
    def __init__(self):
        self.numVariables = 0
        self.variables = {}
        self.parent = None
        self.child = None
        
    def getNumVariables(self):
        return self.numVariables
    def getVariables(self):
        return self.variables
    def getParent(self):
        return self.parent
    def getChild(self):
        return self.child
    def addVariable(self, key, value):
        self.variables[key] = value
        self.numVariables += 1
        
    def printVariables(self):
        for i in self.variables:
            print i, "-", self.variables[i]