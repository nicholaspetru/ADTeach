def checkType(temp):
	period = 0
	index = 0
	if(temp[0] == '\"' and temp[len(temp)-1] == '\"'):
		return 4
	
	elif (temp[0] == '('):
		return 5
	
	
	elif (temp[0]  == ')'):
		return 6
	
	
	elif (temp[0] == '#'):
		if (temp[1] == 't'):
			return 7
		
		elif (temp[1]  == 'f'):
			return 8
		
		else:
			return 0
		
		
	elif (temp[0]  == '\''):
		return 1
		
		
	if (temp[0]  == '-'):
		if (len(temp) == 1):
			return 1
		
		else:
			index = 1
			
	for i in range(index, len(temp)):
		# If it is a digit, using ASCII values
		if( ord(temp[i]) >= 48 and ord(temp[i]) <= 57):
			continue
		
		# if it is a period
		elif(temp[i] == '.'):
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
		return 2 #Its an integer
	else:
		return 3 # Its a double


