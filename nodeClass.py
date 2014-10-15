class Node:
    Token = None
    Type = None
    Prev = None
    Next = None
    Parent = None
    Child = None
    def __init__(self, token):
        self.Token = token
        self.Type = self.setType()
    def setPrev(self, Node):
        self.Prev = Node
    def setNext(self, Node):
        self.Next = Node
    def setParent(self, Node):
        self.Parent = Node
    def setChild(self, Node):
        self.Child = Node
    def setToken(self, Node):
        self.Token = Node
        
    def setType(self):
        '''       
        Vava
        0 = error
        1 = symbol
        2 = integer
        3 = float
        4 = string
        5 = open paren
        6 = close paren
        7 = open brace
        8 = close brace
        9 = boolean
        10 = semicolon
        11 = newLevel
        '''
        period = 0
        index = 0
        if self.Token == "NewLevel":
            return 11
        if(self.Token[0] == '\"' and self.Token[len(self.Token)-1] == '\"'):
            return 4
        elif (self.Token[0] == '('):
            return 5
        elif (self.Token[0]  == ')'):
            return 6
        elif (self.Token[0] == '{'):
            return 7
        elif (self.Token[0]  == '}'):
            return 8
        elif ((self.Token == 'true') or (self.Token == 'false')):
            return 9
        elif (self.Token[0] == ';'):
            return 10
        elif (self.Token[0]  == '-'):
            if (len(self.Token) == 1):
                return 1
            else:
                index = 1
        for i in range(index, len(self.Token)):
            # If it is a digit, using ASCII values
            if(ord(self.Token[i]) >= 48 and ord(self.Token[i]) <= 57):
                continue
            # if it is a period
            elif(self.Token[i] == '.'):
                if (period == 1):
                    return 0
                else:
                    period = 1
            # if it is a character or any other symbol
            else:
                # invalid input
                if(i == 0):
                    return 1
                else:
                    return 0
        if (period == 0):
            self.Token = int(self.Token)
            return 2
        else:
            return 3
    def getToken(self):
        return self.Token
    def getType(self):
        return self.Type
    def getPrev(self):
        return self.Prev
    def getNext(self):
        return self.Next
    def getParent(self):
        return self.Parent
    def getChild(self):
        return self.Child
    
    
if __name__ == '__main__':
    node1 = Node('hello12')
    print node1.getToken()
    print node1.getType()
    node1 = Node('2453')
    print node1.getToken()
    print node1.getType()
    node1 = Node('124.39')
    print node1.getToken()
    print node1.getType()
    node1 = Node('"string"')
    print node1.getToken()
    print node1.getType()
    node1 = Node('(')
    print node1.getToken()
    print node1.getType()
    node1 = Node(')')
    print node1.getToken()
    print node1.getType()
    node1 = Node('{')
    print node1.getToken()
    print node1.getType()
    node1 = Node('}')
    print node1.getToken()
    print node1.getType()
    node1 = Node('true')
    print node1.getToken()
    print node1.getType()
    node1 = Node('false')
    print node1.getToken()
    print node1.getType()