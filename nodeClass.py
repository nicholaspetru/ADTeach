class Node:
    Token = None
    Type = None
    Next = None
    def __init__(self, token):
        self.Token = token
        period = 0
        index = 0
        if(token[0] == '\"' and token[len(token)-1] == '\"'):
            self.Type = 4
        elif (token[0] == '('):
            self.Type = 5
        elif (token[0]  == ')'):
            self.Type = 6
        elif (token[0] == '#'):
            if (token[1] == 't'):
                self.Type = 7
            elif (token[1]  == 'f'):
                self.Type = 8
            else:
                self.Type = 0
        elif (token[0]  == '\''):
            self.Type = 1
        if (token[0]  == '-'):
            if (len(token) == 1):
                self.Type = 1
            else:
                index = 1
        for i in range(index, len(token)):
            # If it is a digit, using ASCII values
            if( ord(token[i]) >= 48 and ord(token[i]) <= 57):
                continue
            # if it is a period
            elif(token[i] == '.'):
                if (period == 1):
                    self.Type = 0
                else:
                    period = 1
            # if it is a character or any other symbol
            else:
                # invalid input
                if(i == 0):
                    self.Type = 1
                else:
                    self.Type = 0
        if (period == 0):
            self.Type = 2 #Its an integer
        else:
            self.Type = 3 # Its a double
    def setNext(self, Node):
        self.Next = Node
    def getToken(self):
        return self.Token
    def getType(self):
        return self.Type
    def getNext(self):
        return self.Next
    
if __name__ == '__main__':
    node1 = Node("'hello'")
    print node1.getToken()
    print node1.getType()
    node2 = Node("'goodbye'")
    node1.setNext(node2)
    print node1.getNext()