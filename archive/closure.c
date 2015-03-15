#include <stdlib.h>

#include "closure.h"

/**
  * closure.c
  *
  * Authors: Adan Nunez, Garo Anguiano-Sainz, Colby Seyferth
  * Date: March 17, 2014
  * CS 251: Programming Languages
  *
  * Implements closure.h
  *
  **/

void freeClosure(Closure* closure){
	freeEnvironments(closure->formalParams);
	free(closure->body);
	free(closure);
}