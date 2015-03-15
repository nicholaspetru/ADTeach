#include "environment.h"

#include <stdlib.h>

/**
  * environment.c
  *
  * Authors: Adan Nunez, Garo Anguiano-Sainz, Colby Seyferth
  * Date: March 05, 2014
  * CS 251: Programming Languages
  *
  * Implements environment.h
  *
  **/

void freeEnvironments(Environment *env){
	if (env == NULL){
		return;
	}
	else if (env->child != NULL){
		freeEnvironments(env->child);
		env->child = NULL;
	}
	free(env->variables);
	free(env);
}