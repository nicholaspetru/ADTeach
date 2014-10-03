/**
  * tokenizer.c
  *
  * Authors: Adan Nunez, Garo Anguiano-Sainz, Colby Seyferth
  * Date: February 12, 2014
  * CS 251: Programming Languages
  *
  * Implementation of tokenizer.h
  *
  **/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include "tokenizer.h"

void clearTemp(char* temp, int j){
	int i;
	for (i=0; i<j; i++){
		temp[i] = '\0';
	}
}

Value* tokenize(char* expression){
	Value* head = NULL;


	char* temp = malloc(256 * sizeof(char));
	temp = memset(temp, 0, (256 * sizeof(char)));
	int j = 0;
	int stringFlag = 0;
	
	int i;
	for (i=0; expression[i]; i++){

		switch(expression[i]){
			case '(':
				if (strlen(temp) == 0){
					temp[0] = '(';
					head = insertToken(temp, head);
					clearTemp(temp, 1);
				}
				else {
					head = insertToken(temp, head);
					if (head == NULL){
						printf("Untokenizable input: %s \n", temp);
						return NULL;
					}
					clearTemp(temp, j);
					temp[0] = '(';
					head = insertToken(temp, head);
					clearTemp(temp, 1);
					j=0;
				}
				break;
			case ')':
				if (strlen(temp) == 0){
					temp[0] = ')';
					head = insertToken(temp, head);
					clearTemp(temp, 1);
				}
				else {
					head = insertToken(temp, head);
					if (head == NULL){
						printf("Untokenizable input: %s \n", temp);
						return NULL;
					}
					clearTemp(temp, j);
					temp[0] = ')';
					head = insertToken(temp, head);
					clearTemp(temp, 1);
					j=0;
				}
				break;
			case ' ':
				if (stringFlag){
					temp[j] = expression[i];
					j++;
					break;
				}
				if (strlen(temp) > 0){
					head = insertToken(temp, head);
					if (head == NULL){
						printf("Untokenizable input: %s \n", temp);
						return NULL;
					}
					clearTemp(temp, j);
					j=0;
				}
				break;
			case '\t':
				if (stringFlag){
					temp[j] = expression[i];
					j++;
					break;
				}
				if (strlen(temp) > 0){
					head = insertToken(temp, head);
					if (head == NULL){
						printf("Untokenizable input: %s \n", temp);
						return NULL;
					}
					clearTemp(temp, j);
					j=0;
				}
				break;
			case '\n':
				if (strlen(temp) > 0){
					head = insertToken(temp, head);
					if (head == NULL){
						printf("Untokenizable input: %s \n", temp);
						return NULL;
					}
					clearTemp(temp, j);
					j=0;
				}
				break;
			case ';':
				return NULL;
			default:
				if (expression[i] == '\"') stringFlag = (stringFlag + 1) % 2;
				temp[j] = expression[i];
				j++;
				break;
		}
	}
	// check if it's greater than one because it will have a '\n' from pressing the enter key.
	if (strlen(temp) > 1){
		printf("Invalid input, boy!\n");
	}
	free(temp);


	head = reverseList(head);
	return head;

}