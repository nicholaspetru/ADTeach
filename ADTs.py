class VStack:
	top = None
	storeType = None
	def __intit__(self, t):
		top = []
		storeType = t

	def pop(self):
		return self.top.pop()

	def push(self, value):
		#check the type first?
		return self.top.append(value)

	def isEmpty(self):
		return len(self.top) == 0

class VQueue:
	front = None
	storeType = None
	def __intit__(self, t):
		front = []
		storeType = t

	def dequeue(self):
		return self.front.pop(0)

	def push(self, value):
		#check the type first?
		return self.front.append(value)

	def isEmpty(self):
		return len(self.front) == 0

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

