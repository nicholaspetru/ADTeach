/**
  * parser.c
  *
  * Authors: Adan Nunez, Garo Anguiano-Sainz, Colby Seyferth
  * Date: February 19, 2014
  * CS 251: Programming Languages
  *
  * Implements methods declared in parser.h
  **/

#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include "parser.h"
#include "interpreterp1.h"

Value* addToParseTree(Value *tree, Value *token, int *depth){
	if (token->cons->car->type == valueType){
		// push it on to the stack
		token->cons->cdr = tree;
		return token;
	}

	else if (token->cons->car->type != closeType){
		// Check if it's an openType and increase depth
		if (token->cons->car->type == openType){
			*depth = *depth + 1;
		}

		// push it on to the stack
		token->cons->cdr = tree;
		return token;
	}
	else{
		// Decrement depth
		*depth = * depth - 1;

		//pop untill we see an open and add it again.
		Value *newLevel = NULL;
		Value *curToken;
		popFromFront(&tree, &curToken);
		while (curToken->cons->car->type != openType){
			newLevel = addToParseTree(newLevel, curToken, depth);
			popFromFront(&tree, &curToken);
		} 
		// We have reached an open bracket so we want to 
		// Create the new level in the tree and push it
		// back on to the stack.
		
		Value *newBreak = malloc(sizeof(Value));
		ConsCell *newCons = malloc(sizeof(ConsCell));
		Value *newCar = malloc(sizeof(Value));
		newBreak = memset(newBreak, 0, sizeof(Value));
		newCons = memset(newCons, 0, sizeof(ConsCell));
		newCar = memset(newCar, 0, sizeof(Value));

		newCar->type = valueType;
		newCar->val = newLevel;

		newCons->car = newCar;
		newCons->cdr = NULL;

		newBreak->type = cellType;
		newBreak->cons = newCons;

		// push it back into the stack
		tree = addToParseTree(tree, newBreak, depth);

		return tree; 
	}
}

void printTree(Value *tree){
	if (tree == NULL) return;
	if (tree->type != cellType){
		switch(tree->type){
			case booleanType:
				if (tree->booleanValue == true){
					printf("#t ");
				}
				else{
					printf("#f ");
				}
				break;

			case integerType:
				printf("%i ", tree->integerValue);
				break;

			case floatType:
				printf("%f ", tree->floatValue);
				break;

			case stringType:
				printf("%s ", tree->stringValue);
				break;

			case symbolType:
				printf("%s ", tree->symbolValue);
				break;

			case openType:
				printf("%c ", tree->openValue);
				break;

			case closeType:
				printf("%c ", tree->closeValue);
				break;

			case valueType:
				printf("(");
				printTree(tree->val);
				printf(") ");

			default:
				break;
		}
	}

	else {
		while(tree != NULL){
			fflush(stdout);

			switch(tree->cons->car->type){
				case booleanType:
					if (tree->cons->car->booleanValue == true){
						printf("#t ");
					}
					else{
						printf("#f ");
					}
					break;

				case integerType:
					printf("%i ", tree->cons->car->integerValue);
					if (tree->cons->cdr != NULL && tree->cons->cdr->type != cellType){
						printf(". ");
						printTree(tree->cons->cdr);
						return;
					}
					break;

				case floatType:
					printf("%f ", tree->cons->car->floatValue);
					if (tree->cons->cdr != NULL && tree->cons->cdr->type != cellType){
						printf(". ");
						printTree(tree->cons->cdr);
						return;
					}
					break;

				case stringType:
					printf("%s ", tree->cons->car->stringValue);
					if (tree->cons->cdr != NULL && tree->cons->cdr->type != cellType){
						printf(". ");
						printTree(tree->cons->cdr);
						return;
					}
					break;

				case symbolType:
					printf("%s ", tree->cons->car->symbolValue);
					break;

				case openType:
					printf("%c ", tree->cons->car->openValue);
					break;

				case closeType:
					printf("%c ", tree->cons->car->closeValue);
					break;

				case cellType:
					printf("(");
					fflush(stdout);
					printTree(tree->cons->car);
					printf(") ");
					break;

				case valueType:
					printf("(");
					printTree(tree->cons->car->val);
					printf(") ");
					if (tree->cons->cdr != NULL && tree->cons->cdr->type != cellType){
						printf(". ");
						printTree(tree->cons->cdr);
						return;
					}
					break;

				default:
					break;
			}
				fflush(stdout);
				tree = tree->cons->cdr;
		}
	}
}

void freeTree(Value *tree){
	Value* t;
	while(tree != NULL){
		if (tree->type == cellType){
			if(tree->cons->car->type == valueType){
				freeTree(tree->cons->car->val);
			}
			t = tree->cons->cdr;
			free(tree->cons->car);
			free(tree->cons);
			free(tree);
			tree = t;
		}
		else{
			tree = NULL;
		}
	}
	t = NULL;
}

void syntaxError(){
	printf("syntax error\n");
	exit(0);
}








