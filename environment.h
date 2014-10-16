#ifndef ENVIRONMENT_
#define ENVIRONMENT_

#include "linkedlist.h"
/**
  * environment.h
  *
  * Authors: Adan Nunez, Garo Anguiano-Sainz, Colby Seyferth
  * Date: February 26, 2014
  * CS 251: Programming Languages
  *
  * Declares types, and structs to be used to form the environment stack.
  *
  **/

typedef struct Environment{
	//keep track of how many variables we have binded
	int numVariables;
	Value* variables; 
	//data structure that will hold all of the bindings
	struct Environment *parent;
  struct Environment *child;
} Environment; 

void freeEnvironments(Environment *env);

#endif