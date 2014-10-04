class Node:
    Token = None
    Type = None
    Next = None
    def __init__(self, token):
        self.Token = token
        self.Type = self.setType()
    def setNext(self, Node):
        self.Next = Node
    def setType(self):
        '''
        0 = error
        1 = symbol
        2 = integer
        3 = double
        4 = string
        5 = open paren
        6 = close paren
        7 = true
        8 = false
        '''
        period = 0
        index = 0
        if(self.Token[0] == '\"' and self.Token[len(self.Token)-1] == '\"'):
            return 4
        elif (self.Token[0] == '('):
            return 5
        elif (self.Token[0]  == ')'):
            return 6
        elif (self.Token[0] == '#'):
            if (self.Token[1] == 't'):
                return 7
            elif (self.Token[1]  == 'f'):
                return 8
            else:
                return 0
        elif (self.Token[0]  == '\''):
            return 1
        if (self.Token[0]  == '-'):
            if (len(self.Token) == 1):
                return 1
            else:
                index = 1
        for i in range(index, len(self.Token)):
            # If it is a digit, using ASCII values
            if( ord(self.Token[i]) >= 48 and ord(self.Token[i]) <= 57):
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
            return 2
        else:
            return 3 
    def getToken(self):
        return self.Token
    def getType(self):
        return self.Type
    def getNext(self):
        return self.Next
    
    
if __name__ == '__main__':
    node1 = Node('"hello"')
    print node1.getToken()
    print node1.getType()
    node2 = Node('"goodbye"')
    node1.setNext(node2)
    print node1.getNext()