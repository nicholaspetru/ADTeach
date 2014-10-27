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
	vals = []

