#ifndef INTERPRETERP1_
#define INTERPRETERP1_

#include "linkedlist.h"
#include "environment.h"

/**
  * interpreterp1.h
  *
  * Authors: Adan Nunez, Garo Anguiano-Sainz, Colby Seyferth
  * Date: February 25, 2014
  * CS 251: Programming Languages
  *
  * Functions used in interpreter:
  **/


/**
 * Given an expression and an environment: 
 *
 * @return: the evaluated expression in the form 
 * of a Value pointer to the head of the tree. 
 *
 */
Value *eval(Value * expr, Environment *env);


/**
 * Given a let expression and an environment: 
 * Makes a new environment frame and adds it
 * to current Environment, then evaluates.
 *
 * @return: the evaluated expression in the form 
 * of a Value pointer to the head of the tree.
 *
 */
Value *evalLet(Value * expr, Environment *env);


/**
 * Given list of args and an environment: 
 * Creates an empty environment frame and calls
 * addBinding to populate it with bindings from args.
 *
 * @return: the evaluated expression in the form 
 * of a Value pointer to the head of the tree .
 *
 */
Environment *createEnvironment(Value *args, Environment *parentEnv);


/**
 * Given list of bindings and curent environment: 
 * add the bindings to the environment.
 *
 * @return: the new environment complete with all 
 * of the bindings from let.
 *
 */
Environment *addBinding(Value *binding, Environment *env);

void addParameter(Value* binding, Environment* env);

/**
 * returns 1 if parameters updated succesfully
 * else returns 0;
 */
int updateParameters(Value* values, Environment* formalParams, Environment* env);

/**
 * Given an if expression and an environment: 
 *
 * @return: the first arg if the condition is true,
 * or the second arg if the condition is false.
 *
 */
Value *evalIf(Value * expr, Environment *env);


/**
 * Given a quote expression and an environment: 
 *
 * @return: the variable arg with a single 
 * quote in front of it.
 *
 */
Value *evalQuote(Value * expr, Environment *env);

/**
 * Given a symbol and an environment: 
 * Check the environment to find the symbol's binding
 *
 * @return: the value of symbol assigned in let
 * or NULL if it is not in the environment
 *
 */

void evalDefine(Value *args, Environment *env);

Value* evalLambda(Value* args, Environment* env);

/**
 * Given a symbol and an environment: 
 * Check the environment to find the args's binding
 *
 * @return: addition of the args after the symbol
 *
 */

Value* evalPlus(Value* args, Environment* env);

/**
 * Given a symbol and an environment: 
 * Check the environment to find the args's binding
 *
 * @return: subtracts args among themselve 
 * starting from the first arg 
 */

Value* evalMinus(Value* args, Environment* env);

/**
 * Given a symbol and an environment: 
 * Check the environment to find the args's binding
 *
 * @return: product of all args 
 */


Value* evalMult(Value* args, Environment* env);

/**
 * Given a symbol and an environment: 
 * Check the environment to find the args's binding
 * compares two args to see if the first
 * is less than to the second
 * @return: boolean
 */

Value* evalLes(Value* args, Environment* env);

/**
 * Given a symbol and an environment: 
 * Check the environment to find the args's binding
 * compares two args to see if the first
 * is greater than to the second
 * @return: boolean
 */

Value* evalGre(Value* args, Environment* env);

/**
 * Given a symbol and an environment: 
 * Check the environment to find the args's binding
 * compares two args to see if the first
 * is less than or equal to the second
 * @return: boolean
 */

Value* evalLeq(Value* args, Environment* env);

/**
 * Given a symbol and an environment: 
 * Check the environment to find the args's binding
 * compares two args to see if the first
 * is greater than or equal to the second
 * @return: boolean
 */

Value* evalGeq(Value* args, Environment* env);

/**
 * Given a symbol and an environment: 
 * Check the environment to find the args's binding
 * compares two args to see if the first
 * is equal to the second
 * @return: boolean
 */

Value* evalEq(Value* args, Environment* env);

/**
 * Given a symbol and an environment: 
 * Check the environment to find the args's binding
 *
 * @return: modulo of both args
 */

Value* evalMod(Value* args, Environment* env);

/**
 * Given a symbol and an environment: 
 * Check the environment to find the args's binding
 *
 * @return: division of all args 
 */

Value* evalDiv(Value* args, Environment* env);

/**
 * Given a symbol and an environment: 
 * Check the environment to find the args's binding
 * searches list to see if empty
 *
 * @return: boolean
 */

Value* evalNull(int depth, Value* args, Environment* env);

/**
 * Given a symbol and an environment: 
 * Check the environment to find the args's binding
 * searches list
 *
 * @return: first item in list
 */

Value* evalCar(Value* args, Environment* env);

/**
 * Given a symbol and an environment: 
 * Check the environment to find the args's binding
 * searches list
 *
 * @return: all items after the first
 */

Value* evalCdr(Value* args, Environment* env);

/**
 * Given a symbol and an environment: 
 * Check the environment to find the args's binding
 * couples items together
 *
 * @return: list of items
 */

Value* evalCons(Value* args, Environment* env);

Value* evalClosure(Value* closureVal);

Value *resolveVariable(Value *symbol, Environment *env);

/**
 * Given a symbol and an environment: 
 * Check the environment to find the args's binding
 * list all items together
 *
 * @return: list of items
 */

Value* createQuotedList(Value *items);

Value* copyValue(Value* orig);

/**
 * Given a symbol and an environment: 
 * Check the environment to find the args's binding
 * evaluates each argument to see if true
 *
 * @return: evaluation of last item
 */

Value* evalAnd(Value *args, Environment *env);

/**
 * Given a symbol and an environment: 
 * Check the environment to find the args's binding
 * evaluates each argument to see if one is true
 *
 * @return: evalutation of first item
 */

Value* evalOr(Value *args, Environment *env);

/**
 * Given a symbol and an environment: 
 * Check the environment to find the args's binding
 * evaluates each argument 
 *
 * @return: evaluation of last arg
 */

Value* evalBeg(Value *args, Environment *env);

/**
 * Given a symbol and an environment: 
 * Check the environment to find the args's binding
 * handles multiple if statements 
 *
 * @return: evaluation of first true statement or nothing
 */

Value* evalCond(Value *args, Environment *env);

/**
 * Prints "Evaluation Error" and the exit's the program
 *
 */
void evaluationError();

/**
 * Prints type of given item/arg
 *
 */

void printType(Value* val);
#endif







