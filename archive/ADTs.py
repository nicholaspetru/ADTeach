from Exception import *

class VStack:
    top = None
    storeType = None
    
    def __init__(self, t):
        self.top = []
        if t == "String":
            self.storeType = type("")
        elif t == "int":
            self.storeType = type(0)

    def pop(self):
        return self.top.pop()

    def push(self, value):
        print type(value)
        print self.storeType
        if type(value) != self.storeType:
            raise IncompatibleTypes("Incorrect type being pushed into Stack")
        else:
            self.top.append(value)

    def isEmpty(self):
        return len(self.top) == 0
    
    def getValue(self):
        return self.top
    
    def getType(self):
        return "Stack"
    
    def listMethods(self):
        return ['getValue', 'isEmpty', 'push', 'pop']
    
    def checkParameters(self, method, parameters):
        if method in ["pop", "getValue", "isEmpty"]:
            if len(parameters) != 0:
                raise IncorrectParameters("pop does not take any parameters")
        if method == "push":
            if len(parameters) != 1:
                raise IncorrectParameters("push only takes one parameter")
        return True
    
    def performMethod(self, method, listOfParameters):
        if method == "pop":
            self.pop()
        if method == "push":
            self.push(listOfParameters[0])
        if method == "isEmpty":
            self.isEmpty()
        if method == "getValue":
            self.getValue()
        if method == "getType":
            self.getType()

class VQueue:
    front = None
    storeType = None

    def __init__(self, t):
        self.front = []
        self.storeType = t

    def dequeue(self):
        return self.front.pop(0)
    
    def push(self, value):
        return self.front.append(value)
    
    def isEmpty(self):
        return len(self.front) == 0

    def getValue(self):
        return self.front
    
    def getType(self):
        return "Queue"

class VList:
	def __init__(self, t):
		self.vals = []
		self.storeType = t
	        
	def add(self, e):
		self.vals.append(e)
	        
	def contains(self, e):
		return (e in self.vals)
	    
	def get(self, i):
		if i > len(self.vals) - 1:
			raise IndexOutOfBoundException("get index out of bounds at " + i)
		return self.vals[i]
	    
	def indexOf(self, i):
		for j in self.vals:
			if j == i:
				return self.vals.index(j)
	    
	def isEmpty(self):
		return len(self.vals) == 0
	    
	def remove(self, i):
		newList = []
		for j in range(len(self.vals)):
			if j != i:
				newList.append(self.vals[j])
		self.vals = newList
	        
	def set(self, i, e):
		if i > len(self.vals):
			raise IndexOutOfBoundException("set index out of bounds at " + i) 
	            
		for j in self.vals:
			index = self.vals.index(j)
			if index == i:
				self.vals[index] = e
	                
	def size():
		return len(self.vals)

