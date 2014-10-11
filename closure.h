#ifndef CLOSURE_
#define CLOSURE_

#include "environment.h"

/**
  * closure.h
  *
  * Authors: Adan Nunez, Garo Anguiano-Sainz, Colby Seyferth
  * Date: March 17, 2014
  * CS 251: Programming Languages
  *
  * A struct that will represent the closure created by lambda
  *
  **/

typedef struct __Closure{
	// we decided to use the Environment, its variables list, and
	// the functions that we have for it to use as the list
	// of formal parameters.
	Environment* formalParams;

	// Just a copy of the body of the lambda
	Value* body;

	// Link to the environment where this lambda was created
	Environment* parentEnv;
} Closure;

/*
 * function to be used to free the closure.
 */
void freeClosure(Closure* closure);

#endif