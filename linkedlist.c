/**
  * linkedlist.c
  *
  * Authors: Adan Nunez, Garo Anguiano-Sainz, Colby Seyferth
  * Date: February 12, 2014
  * CS 251: Programming Languages
  *
  * Implementation of linkedlist.h
  *
  **/

#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include "linkedlist.h"

int checkType(char* temp){
	int period = 0;
	int i;

	if(temp[0] == '\"' && temp[strlen(temp)-1] == '\"'){
		return 4;
	}

	else if (temp[0] == '('){
		return 5;
	}

	else if (temp[0] == ')'){
		return 6;
	}

	else if (temp[0] == '#'){
		if (temp[1] == 't'){
			return 7;
		}
		else if (temp[1] == 'f'){
			return 8;
		}
		else{
			return 0;
		}
	}
	else if (temp[0] == '\''){
		return 1;
	}

	int index;
	if (temp[0] == '-'){
		if (strlen(temp) == 1){
			return 1;
		}
		else{
			index=1;
		}
			
	} 
	else index=0;

	for (i=index; temp[i]; i++){
		// If it is a digit, using ASCII values
		if((int)(temp[i]) >= 48 && (int)(temp[i] <= 57)){
			continue;
		}
		// if it is a period
		else if(temp[i] == '.'){
			if (period == 1){
				return 0;
			}
			else{
				period = 1;
			}
		}
		// if it is a character or any other symbol
		else{
			// invalid input
			if(i == 0){ 
				return 1;
			}
			else{
				return 0;
			}
		}
	}
	if (period == 0) return 2; //Its an integer
	else return 3; // Its a double
}

Value* insertToken(char* token, Value *head){

	Value* newVal = malloc(sizeof(Value));
	ConsCell* cell = malloc(sizeof(ConsCell));
	Value* carVal = malloc(sizeof(Value));
	newVal = memset(newVal, 0, sizeof(Value));
	cell = memset(cell, 0, sizeof(ConsCell));
	carVal = memset(carVal, 0, sizeof(Value));


	int tokenLen = strlen(token);
	int type = checkType(token);

	if (tokenLen == 0){
		return head;
	}

	switch(type){
		case 0:
			return NULL;
		case 1:
			carVal->type = symbolType;
			carVal->symbolValue = strdup(token);

			break;
		case 2:
			carVal->type = integerType;
			carVal->integerValue = atoi(token);
			break;
		case 3:
			carVal->type = floatType;
			carVal->floatValue = atof(token);
			break;
		case 4:
			carVal->type = stringType;
			carVal->stringValue = strdup(token);
			break;
		case 5:
			carVal->type = openType;
			carVal->openValue = token[0];
			break;
		case 6:
			carVal->type = closeType;
			carVal->closeValue = token[0];	
			break;
		case 7:
			carVal->type = booleanType;
			carVal->booleanValue = token;
			break;
	}
	cell->car = carVal;

	// Set the new value we just created
	newVal->type = cellType;
	newVal->cons = cell;

	// set the new cdr

	newVal->cons->cdr = head;

	// side effect: set what the new head of the linked list to what 
	// was just inserted.
	return newVal;
}

Value* createNewValue(float sum, int type){
	Value* newVal = malloc(sizeof(Value));
	ConsCell* cell = malloc(sizeof(ConsCell));
	Value* carVal = malloc(sizeof(Value));
	newVal = memset(newVal, 0, sizeof(Value));
	cell = memset(cell, 0, sizeof(ConsCell));
	carVal = memset(carVal, 0, sizeof(Value));

	if (type == 1){
		carVal->type = floatType;
		carVal->floatValue = sum;
	}
	else if (type == 0) {
		carVal->type = integerType;
		carVal->integerValue = (int)sum;
	}
	else if (type == 2) {
		carVal->type = booleanType;
		carVal->booleanValue = true;
	}
	else if (type == 3) {
		carVal->type = booleanType;
		carVal->booleanValue = false;
	}

	cell->car = carVal;

	// Set the new value we just created
	newVal->type = cellType;
	newVal->cons = cell;

	// set the new cdr
	newVal->cons->cdr = NULL;
	return newVal;
}


void popFromFront(Value **tokens, Value **token){

	// save the value being poped
	Value * popedValue;
	popedValue = *tokens;

	// save the second item which will become the new
	// head of the tokens
	Value *newHead = popedValue->cons->cdr;

	// Detach poped item from the rest of the list
	popedValue->cons->cdr = NULL;

	// Set the return values
	*tokens = newHead;
	*token = popedValue;

}


Value* reverseList(Value *head){
	
    Value *previous = NULL;
    while(head != NULL) {
        Value* temp = head->cons->cdr;
        head->cons->cdr = previous;
        previous = head;
        head = temp;
    }
    return previous;


}

void freeList(Value *head){
	Value* t;
	while(head!= NULL){
		t = head->cons->cdr;
		free(head->cons->car);
		free(head->cons);
		free(head);
		head = t;
	}
	t = NULL;
}

void printList(Value *head){
	Value *cdr = head;

	while(cdr != NULL){

		Value *curCar = cdr->cons->car;
		switch(curCar->type){
			case booleanType:
				if (curCar->booleanValue == true){
					printf("#t:boolean\n");
				}
				else{
					printf("#f:boolean\n");
				}
				break;

			case integerType:
				printf("%i:integer\n", curCar->integerValue);
				break;

			case floatType:
				printf("%f:float\n", curCar->floatValue);
				break;

			case stringType:
				printf("%s:string\n", curCar->stringValue);
				break;

			case symbolType:
				printf("%s:symbol\n", curCar->symbolValue);
				break;

			case openType:
				printf("%c:open\n", curCar->openValue);
				break;

			case closeType:
				printf("%c:close\n", curCar->closeValue);
				break;

			case cellType:
				printf("(:openType\n");
				printList(curCar);
				printf("):closeType\n");

			default:
				break;
		}

		cdr = cdr->cons->cdr;
	}
}