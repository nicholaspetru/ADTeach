#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include "interpreterp1.h"
#include "parser.h"
#include "linkedlist.h"
#include "closure.h"

/**
  * interpreterp1.c
  *
  * Authors: Adan Nunez, Garo Anguiano-Sainz, Colby Seyferth
  * Last modified: March 17, 2014
  * CS 251: Programming Languages
  *
  * This is now third and final part of the interpreter project. 
  *
  * It does not work perfectly and it does have leaks.
  *
  * Test files give an idea of what does work.
  **/

Value* eval(Value *expr, Environment *env) {
  Value* resolved;

  if (expr == NULL) return NULL;

  if (expr->type == cellType){
    ConsCell *operator = expr->cons;

    Value *args = operator->cdr;

    // Switch on the type of value passed in at the head of the parsed tree
    switch (operator->car->type) {


      case symbolType:

        // Check to see if the symbol is a special type
        // if so, evaluate it with the proper eval function
        if (!strcmp(operator->car->symbolValue, "if")) {
          return evalIf(args, env);
        }

        else if (!strcmp(operator->car->symbolValue, "let")) {
          return evalLet(args, env);
        }

        else if (!strcmp(operator->car->symbolValue, "let*")) {
          return evalLet(args, env);
        }

        else if (!strcmp(operator->car->symbolValue, "quote")) {
          return evalQuote(args, env);
        }

        else if (!strcmp(operator->car->symbolValue, "define")) {
          evalDefine(args, env);
          return NULL;
        }

        else if(!strcmp(operator->car->symbolValue, "lambda")) {
          return evalLambda(args, env);
        }

        else if(!strcmp(operator->car->symbolValue, "and")) {
          return evalAnd(args, env);
        }

        else if(!strcmp(operator->car->symbolValue, "or")) {
          return evalOr(args, env);
        }

        else if (!strcmp(operator->car->symbolValue, "+")){
          return evalPlus(args, env);
        }

        else if (!strcmp(operator->car->symbolValue, "-")){
          return evalMinus(args, env);
        }

        else if (!strcmp(operator->car->symbolValue, "*")){
          return evalMult(args, env);
        }

        else if (!strcmp(operator->car->symbolValue, "/")){
          return evalDiv(args, env);
        }

        else if (!strcmp(operator->car->symbolValue, "<=")){
          return evalLeq(args, env);
        }
        
        else if (!strcmp(operator->car->symbolValue, ">=")){
          return evalGeq(args, env);
        }

        else if (!strcmp(operator->car->symbolValue, "<")){
          return evalLes(args, env);
        }
        
        else if (!strcmp(operator->car->symbolValue, ">")){
          return evalGre(args, env);
        }

        else if (!strcmp(operator->car->symbolValue, "=")){
          return evalEq(args, env);
        }

        else if (!strcmp(operator->car->symbolValue, "modulo")){
          return evalMod(args, env);
        }
        
        else if (!strcmp(operator->car->symbolValue, "null?")){
          return evalNull(0, args, env);
        }

        else if (!strcmp(operator->car->symbolValue, "car")){
          return evalCar(args, env);
        }

        else if (!strcmp(operator->car->symbolValue, "cdr")){
          return evalCdr(args, env);
        }

        else if (!strcmp(operator->car->symbolValue, "cons")){
          return evalCons(args, env);
        }

        else if (!strcmp(operator->car->symbolValue, "begin")){
          return evalBeg(args, env);
        }

        else if (!strcmp(operator->car->symbolValue, "cond")){
          return evalCond(args, env);
        }

        else {
          // not a recognized special form
          // Try to find the value for that symbol in the environments.

          resolved = resolveVariable(operator->car, env);

          //could not find the symbol
          if (resolved == NULL){
            printf("resolved is null.\n");
            evaluationError();
            return NULL;
          }

          // Check if the symbol is a pre-defined function, 
          // i.e. a closure.
          if (resolved->type == closureType){
            
            Environment* newEnv = malloc(sizeof(Environment));

            newEnv->parent = resolved->closure->parentEnv;

            Value* curParam = resolved->closure->formalParams->variables;
            Value* curVal = reverseList(args);
            newEnv->variables = NULL;

            while(curParam != NULL && curVal != NULL){
              Value* newBindVal = malloc(sizeof(Value));
              newBindVal->type = cellType;

              ConsCell* newBindCell = malloc(sizeof(ConsCell));
              newBindVal->cons = newBindCell;

              newBindCell->car = curParam->cons->car->cons->car;
              newBindCell->cdr = eval(curVal->cons->car, env);


              Value* topLevelVal = malloc(sizeof(Value));
              topLevelVal->type = cellType;

              ConsCell* topLevelCell = malloc(sizeof(ConsCell));
              topLevelVal->cons = topLevelCell;

              topLevelCell->car = newBindVal;

              topLevelCell->cdr = newEnv->variables;
              newEnv->variables = topLevelVal;

              curParam = curParam->cons->cdr;
              curVal = curVal->cons->cdr;

            }
            
            return eval(resolved->closure->body, newEnv);
          }

          return resolved;
        }

        break;

      // ValueType means we are entering the next level of the tree
      case valueType:
        return eval(expr->cons->car->val, env);
        break;

      // default means it is an int, float, string, etc. so just return the Value.
      default:
        return expr;
    }
    // If we get here, it is something completely unrecognized
    evaluationError();
    return NULL;
  }
  else {
    switch (expr->type) {

      case valueType:
        return eval(expr->val, env);
        break;

      case symbolType:
        resolved = resolveVariable(expr, env);
        if (resolved == NULL){
          evaluationError();
          return NULL;
        }
        return resolved;
        break;

      // default means it is an int, float, string, etc. so just return the Value.
      default:
        return expr;
    }
    evaluationError();
    return NULL;
  }
}

Value* evalIf(Value *args, Environment *env){
  // Check if statement for validity 
  // (has cond, true and false expressions and notthing else)
  if(args == NULL){
    evaluationError();
  }
  else if(args->cons->cdr == NULL){
    evaluationError();
  }
  else if(args->cons->cdr->cons->cdr == NULL){
    evaluationError();
  }
  else if(args->cons->cdr->cons->cdr->cons->cdr != NULL){
    evaluationError();
  }

  Value *condition = eval(copyValue(args), env);

  // Check if the test evaluates to a boolean
  if (condition->cons->car->type != booleanType){
    evaluationError();
  }

  // it is a boolean and it evaluates to a true
  else if (condition->cons->car->booleanValue == true){

    Value *trueExpr = copyValue(args->cons->cdr);
    trueExpr->cons->cdr = NULL;
    trueExpr = eval(trueExpr, env); 
    return trueExpr;
  }

  // condition is false
  else {
    Value* exprCopy = copyValue(args->cons->cdr->cons->cdr);
    Value *falseExpr = eval(exprCopy, env);
    return falseExpr;
  }
  return NULL;
}

Value* evalCond(Value *args, Environment *env){
  // Check if statement for validity 
  // (has an arg)
  if(args == NULL){
    evaluationError();
  }
  // Loop through all arguments
  while(args != NULL){

    //Make sure args are formatted properly
    if(args->cons->car->type != valueType){
        evaluationError();
      }

    //Check to see if we are at the else case
    if (args->cons->car->val->cons->car->type == symbolType && !strcmp(args->cons->car->val->cons->car->symbolValue, "else")){
    if (args->cons->car->val->cons->cdr != NULL && args->cons->car->val->cons->cdr->cons->cdr == NULL){
    
      return eval(args->cons->car->val->cons->cdr, env);
    }
    else{
      evaluationError();
    }

  }
      //Explore the first condition
      Value* curCond = args->cons->car->val;
      Value* curBoolean = eval(curCond->cons->car, env);
      if(curBoolean->type == cellType) {
        curBoolean = eval(curBoolean->cons->car, env);
      }
    // If the condition is true, return it's result
    if (curBoolean->type != booleanType || curBoolean->booleanValue == true){
      // Make sure result is formatted properly
      if (curCond->cons->cdr != NULL && curCond->cons->cdr->cons->cdr == NULL){
        return eval(curCond->cons->cdr, env);
      }
      
      else{
        evaluationError();
      }
    }
    // If it is false, move to the next condition
    else{
      args = args->cons->cdr;
    }
  }
  return NULL;
}

Value* evalAnd(Value *args, Environment *env){
  // If no args, return #t
  if(args == NULL){

    return createNewValue(0, 2);

  } 
  // Loop through all args
  while(args != NULL){

    args->cons->car = eval(args, env)->cons->car;

    // Make sure all args are truuuu
    if (args->cons->car->type != booleanType || args->cons->car->booleanValue == true){
      
      // If you get to the last arg, return it's value
      if(args->cons->cdr == NULL){
        
        return eval(args, env);
      
      }

      args = args->cons->cdr;
    
    }
    
    else{
      // If you find a false, return false
      args->cons->cdr = NULL;
      return eval(args, env);

    }
  
  }
  

  return createNewValue(0, 2);
}


Value* evalOr(Value *args, Environment *env){

  if(args == NULL){

    //If no args, return false
    return createNewValue(0, 3);

  } 

  while(args != NULL){

    args->cons->car = eval(args, env)->cons->car;

    // Return the first non-false arg you find
    if (args->cons->car->type != booleanType || args->cons->car->booleanValue == true){

      args->cons->cdr = NULL;
      return eval(args, env);
    
    }
    
    else{
      args = args->cons->cdr;
      

    }
  
  }
  // If they are all false, return false
  return createNewValue(0, 3);
}

Value* evalBeg(Value *args, Environment *env){

  // If no args, return NULL
  if(args == NULL){
    return NULL;

  } 
  // Loop through all args to get to the end
  while(args != NULL){

    args->cons->car = eval(args, env)->cons->car;

    if(args->cons->cdr == NULL){
      
      // Return the last arg  
      return eval(args, env);
      
    }

      args = args->cons->cdr;
    
  }
  return NULL;
}

Value* evalLet(Value *args, Environment *env){
  // Create new environment
  Environment *newEnv = createEnvironment(args, env);

  // Evaluate the expression in let
  return eval(args->cons->cdr, newEnv);
}

Environment* createEnvironment(Value *args, Environment* parentEnv){

  // Create and malloc space for new frame of environment
  Environment *newEnv = malloc(sizeof(Environment));
  newEnv->variables = NULL;
  newEnv->parent = parentEnv;
  newEnv->numVariables = 0;

  Value *curCdr = args->cons->car->val;

  // loop through each (symbol value) pair and bind them
  while (curCdr != NULL){
    newEnv = addBinding(curCdr->cons->car->val, newEnv);
    curCdr = curCdr->cons->cdr;
  }

  return newEnv;
}

Environment *addBinding(Value *binding, Environment *env){

  Value* newBinding = malloc(sizeof(Value));
  ConsCell* newCons = malloc(sizeof(ConsCell));

  newBinding->type = cellType;
  newBinding->cons = newCons;

  Value* Binding = malloc(sizeof(Value));
  ConsCell* Cell = malloc(sizeof(ConsCell));

  Binding->type = cellType;
  Binding->cons = Cell;

  newBinding->cons->car = Binding;
  newBinding->cons->cdr = env->variables;

  env->variables = newBinding;

  newBinding->cons->car->cons->car = copyValue(binding->cons->car);

  newBinding->cons->car->cons->cdr = copyValue(eval(binding->cons->cdr, env));
  return env;

}

void addParameter(Value* binding, Environment* env){
  Value* newBinding = malloc(sizeof(Value));
  ConsCell* newCons = malloc(sizeof(ConsCell));

  newBinding->type = cellType;
  newBinding->cons = newCons;

  Value* Binding = malloc(sizeof(Value));
  ConsCell* Cell = malloc(sizeof(ConsCell));

  Binding->type = cellType;
  Binding->cons = Cell;

  newBinding->cons->car = Binding;
  newBinding->cons->cdr = env->variables;

  env->variables = newBinding;


  newBinding->cons->car->cons->car = copyValue(binding);

  newBinding->cons->car->cons->cdr = NULL;
}

// int updateParameters(Value* values, Environment* formalParams, Environment* env){  
//   Value* curVal = values;
//   Value* curParam = formalParams->variables;

//   while (curVal != NULL && curParam != NULL){
//     // printf("about to copy   ");
//     // printTree(curVal->cons->car); printf("\n");
//     // printf("into   ");
//     Value* evaled = eval(curVal->cons->car, formalParams);
//     // printf("......");
//     // printTree(evaled); printf("\n");
//     // printf("**********\n");
//     // printType(evaled->cons->cdr);
//     // printf("**********\n");
//     Value* copy = copyValue(evaled);

//     // printf("the copy is    "); printTree(copy); printf("\n");
//     // printTree(evaled); printf("\n");
//     curParam->cons->car->cons->cdr = NULL;
//     curParam->cons->car->cons->cdr = copy;

//     curVal = curVal->cons->cdr;
//     curParam = curParam->cons->cdr;
//   }
//   // printf("update successfull:    "); printTree(curParam->cons->car->cons->cdr); printf("\n");

//   if (curVal == NULL && curParam == NULL) return 1;
//   else return 0;
// }

Value* evalQuote(Value *args, Environment *env){
  // Correct number of arguments
  if (args->cons->cdr == NULL){
    char *newQuote = malloc(sizeof(char) * 2);
    newQuote[0] = '\'';
    newQuote[1] = '\0';

    return insertToken(newQuote, args);

  }
  else {
    printf("Error in quote.\n");
    evaluationError();
  }
  return NULL;
}

void evalDefine(Value *args, Environment *env){
  env = addBinding(args, env);
}

Value* evalLambda(Value* args, Environment* env){

  // malloc for the new closure
  Value* newValue = malloc(sizeof(Value));
  Closure* newClosure = malloc(sizeof(Closure));

  // set the new value to closure type
  newValue->type = closureType;
  newValue->closure = newClosure;

  // malloc for the new environment which will hold
  // the list of the formal parameters
  Environment* newEnv = malloc(sizeof(Environment));

  // create skeleton of parameters
  Value* curArg = args->cons->car->val;
  int numParams = 0;
  while (curArg != NULL){
    numParams++;
    addParameter(curArg->cons->car, newEnv);
    curArg = curArg->cons->cdr;
  }
  newEnv->numVariables = numParams;

  // copy the body
  newClosure->body = copyValue(args->cons->cdr);


  //link the parent environment  
  newClosure->parentEnv = env;

  // newEnv->variables = reverseList(newEnv->variables);
  newClosure->formalParams = newEnv;
  newClosure->formalParams->parent = env;

  return newValue;
}

Value* evalPlus(Value* args, Environment* env){
  float sum = 0.0;
  int isFloat = 0;

  Value* cur = args;

  while (cur != NULL){
    Value* addend = eval(cur, env);
    
    if (addend->type == cellType){
      addend = addend->cons->car;
    }
    if (addend->type != integerType && addend->type != floatType){
      evaluationError();
    }
    else if (addend->type == floatType){
      sum += addend->floatValue;
      isFloat = 1;
    }
    else if (addend->type == integerType){
      sum += addend->integerValue;
    }
    cur = cur->cons->cdr;
  }

  return createNewValue(sum, isFloat);  
}

Value* evalMinus(Value* args, Environment* env){
  if(args == NULL) evaluationError();

  float diff;
  int isFloat = 0;

  //Set first to the first arg, the number from which you are subtracting
  Value* first = eval(args->cons->car, env);
  if (first->type == integerType){
    diff = first->integerValue;
  }
  if (first->type == floatType){
    diff = first->floatValue;
    isFloat = 1;
  }

  Value* cur = args->cons->cdr;

  while (cur != NULL){
    Value* addend = eval(cur, env);
    if (addend->type == cellType){
      addend = addend->cons->car;
    }
    if (addend->type != integerType && addend->type != floatType){
      evaluationError();
    }
    else if (addend->type == floatType){
      diff -= addend->floatValue;
      isFloat = 1;
    }
    else if (addend->type == integerType){
      diff -= addend->integerValue;
    }

    cur = cur->cons->cdr;
  }

  return createNewValue(diff, isFloat);  
}

Value* evalMult(Value* args, Environment* env){
  

  float product = 1.0;
  int isFloat = 0;

  Value* cur = args;

  while (cur != NULL){
    Value* addend = eval(cur, env);
    if (addend->type == cellType){
      addend = addend->cons->car;
    }
    if (addend->type != integerType && addend->type != floatType){
      evaluationError();
    }
    else if (addend->type == floatType){
      product = product * addend->floatValue;
      isFloat = 1;
    }
    else if (addend->type == integerType){
      product = product * addend->integerValue;
    }

    cur = cur->cons->cdr;
  }

  return createNewValue(product, isFloat);  
}

Value* evalDiv(Value* args, Environment* env){
  
  if(args == NULL) evaluationError();
  
  float dividen;

  if(args->cons->cdr == NULL && args->cons->car->type == integerType) {
   
    return createNewValue(1/args->cons->car->integerValue, 0);
  
  }

    if(args->cons->cdr == NULL && args->cons->car->type == floatType) {
   
    return createNewValue(1/args->cons->car->floatValue, 0);
  
  }

  //Set first to the first arg, the number from which you are subtracting
  int isFloat = 0;
  Value* first = eval(args->cons->car, env);
  if (first->type == integerType){
    dividen = first->integerValue;
  }
  if (first->type == floatType){
    isFloat = 1;
    dividen = first->floatValue;
  }

  Value* cur = args->cons->cdr;

  while (cur != NULL){
    Value* addend = eval(cur, env);
    if (addend->type == cellType){
      addend = addend->cons->car;
    }
    if (addend->type != integerType && addend->type != floatType){
      evaluationError();
    }
    else if (addend->type == floatType){
      isFloat = 1;
      dividen = dividen / addend->floatValue;
    }
    else if (addend->type == integerType){
      if (isFloat==0 && ((int)dividen % addend->integerValue) != 0) isFloat = 1;
      dividen = dividen / addend->integerValue;
    }

    cur = cur->cons->cdr;
  }

  return createNewValue(dividen, isFloat);  
}

Value* evalMod(Value* args, Environment* env){
  
  if(args == NULL) evaluationError();
  if(args->cons->cdr == NULL) evaluationError();
  if(args->cons->cdr->cons->cdr != NULL) evaluationError();

  int modulo;
  int isFloat = 0;
  Value* first = eval(args->cons->car, env);
  if (first->type == integerType){
    modulo = first->integerValue;
  }
  else evaluationError();

  Value* addend = eval(args->cons->cdr, env);

  if (addend->type == cellType){
    addend = addend->cons->car;
  }
  if (addend->type != integerType){
    evaluationError();
  }
  else if (addend->type == integerType){
    modulo = modulo % addend->integerValue;
  }
  
  return createNewValue(modulo, isFloat);  
}

Value* evalLeq(Value* args, Environment* env){
  if(args == NULL) evaluationError();
  if(args->cons->cdr == NULL) evaluationError();
  if(args->cons->cdr->cons->cdr != NULL) evaluationError();

  Value* first = eval(args->cons->car, env);
  Value* second = eval(args->cons->cdr->cons->car, env);

  if (first->type != integerType && second->type != floatType){
      evaluationError();
    }
    
  else if (first->type == integerType && second->type == integerType){
    if (first->integerValue <= second->integerValue){
      return createNewValue(0, 2);
    }
    else{
      return createNewValue(0, 3);
    }
  }
  else if (first->type == integerType && second->type == floatType){
    if (first->integerValue <= second->floatValue){
      return createNewValue(0, 2);
    }
    else{
      return createNewValue(0, 3);
    }
  
  }
  else if (first->type == floatType && second->type == integerType){
    if (first->floatValue <= second->integerValue){
      return createNewValue(0, 2);
    }
    else{
      return createNewValue(0, 3);
    }
  
  }
  else if (first->type == floatType && second->type == floatType){
    if (first->floatValue <= second->floatValue){
      return createNewValue(0, 2);
    }
    else{
      return createNewValue(0, 3);
    }
    
    }
    return NULL;

}

Value* evalGeq(Value* args, Environment* env){
  if(args == NULL) evaluationError();
  if(args->cons->cdr == NULL) evaluationError();
  if(args->cons->cdr->cons->cdr != NULL) evaluationError();

  Value* first = eval(args->cons->car, env);
  Value* second = eval(args->cons->cdr->cons->car, env);

  if (first->type != integerType && second->type != floatType){
      evaluationError();
    }
  else if (first->type == integerType && second->type == integerType){
    if (first->integerValue >= second->integerValue){
      return createNewValue(0, 2);
    }
    else{
      return createNewValue(0, 3);
    }
  }
  else if (first->type == integerType && second->type == floatType){
    if (first->integerValue >= second->floatValue){
      return createNewValue(0, 2);
    }
    else{
      return createNewValue(0, 3);
    }
  
  }
  else if (first->type == floatType && second->type == integerType){
    if (first->floatValue >= second->integerValue){
      return createNewValue(0, 2);
    }
    else{
      return createNewValue(0, 3);
    }
  
  }
  else if (first->type == floatType && second->type == floatType){
    if (first->floatValue >= second->floatValue){
      return createNewValue(0, 2);
    }
    else{
      return createNewValue(0, 3);
    }
    
    }
    return NULL;

}

Value* evalGre(Value* args, Environment* env){
  if(args == NULL) evaluationError();
  if(args->cons->cdr == NULL) evaluationError();
  if(args->cons->cdr->cons->cdr != NULL) evaluationError();

  Value* first = eval(args->cons->car, env);
  Value* second = eval(args->cons->cdr->cons->car, env);

  if (first->type != integerType && second->type != floatType){
      evaluationError();
    }
  else if (first->type == integerType && second->type == integerType){
    if (first->integerValue > second->integerValue){
      return createNewValue(0, 2);
    }
    else{
      return createNewValue(0, 3);
    }
  }
  else if (first->type == integerType && second->type == floatType){
    if (first->integerValue > second->floatValue){
      return createNewValue(0, 2);
    }
    else{
      return createNewValue(0, 3);
    }
  
  }
  else if (first->type == floatType && second->type == integerType){
    if (first->floatValue > second->integerValue){
      return createNewValue(0, 2);
    }
    else{
      return createNewValue(0, 3);
    }
  
  }
  else if (first->type == floatType && second->type == floatType){
    if (first->floatValue > second->floatValue){
      return createNewValue(0, 2);
    }
    else{
      return createNewValue(0, 3);
    }
    
    }
    return NULL;

}

Value* evalLes(Value* args, Environment* env){
  if(args == NULL) evaluationError();
  if(args->cons->cdr == NULL) evaluationError();
  if(args->cons->cdr->cons->cdr != NULL) evaluationError();

  Value* first = eval(args->cons->car, env);
  Value* second = eval(args->cons->cdr->cons->car, env);

  if (first->type != integerType && second->type != floatType){
      evaluationError();
    }
  else if (first->type == integerType && second->type == integerType){
    if (first->integerValue < second->integerValue){
      return createNewValue(0, 2);
    }
    else{
      return createNewValue(0, 3);
    }
  }
  else if (first->type == integerType && second->type == floatType){
    if (first->integerValue < second->floatValue){
      return createNewValue(0, 2);
    }
    else{
      return createNewValue(0, 3);
    }
  
  }
  else if (first->type == floatType && second->type == integerType){
    if (first->floatValue < second->integerValue){
      return createNewValue(0, 2);
    }
    else{
      return createNewValue(0, 3);
    }
  
  }
  else if (first->type == floatType && second->type == floatType){
    if (first->floatValue < second->floatValue){
      return createNewValue(0, 2);
    }
    else{
      return createNewValue(0, 3);
    }
    
    }
    return NULL;

}

Value* evalEq(Value* args, Environment* env){
  if(args == NULL) evaluationError();
  if(args->cons->cdr == NULL) evaluationError();
  if(args->cons->cdr->cons->cdr != NULL) evaluationError();

  Value* first = eval(args->cons->car, env);
  Value* second = eval(args->cons->cdr->cons->car, env);

  if (first->type != integerType && second->type != floatType){
      evaluationError();
    }
  else if (first->type == integerType && second->type == integerType){
    if (first->integerValue == second->integerValue){
      return createNewValue(0, 2);
    }
    else{
      return createNewValue(0, 3);
    }
  }
  else if (first->type == integerType && second->type == floatType){
    if (first->integerValue == second->floatValue){
      return createNewValue(0, 2);
    }
    else{
      return createNewValue(0, 3);
    }
  
  }
  else if (first->type == floatType && second->type == integerType){
    if (first->floatValue == second->integerValue){
      return createNewValue(0, 2);
    }
    else{
      return createNewValue(0, 3);
    }
  
  }
  else if (first->type == floatType && second->type == floatType){
    if (first->floatValue == second->floatValue){
      return createNewValue(0, 2);
    }
    else{
      return createNewValue(0, 3);
    }
    
    }
    return NULL;

}

Value* evalNull(int depth, Value* args, Environment* env){

  // if this is the first time this is called.
  if (depth == 0){
    // check if no arguments given.
    if (args == NULL){
      evaluationError();
    } 
    // check for more than one argument
    if (args->type == cellType && args->cons->cdr != NULL){
      evaluationError();
    } 
    
  }

  else{
    if (args == NULL) return insertToken("#t", NULL);
  }

  if (args->type == valueType) {
    return evalNull(depth+1, eval(args->val, env), env);
  } 

  else if (args->type == cellType){
    if (args->cons->car->type == symbolType && !strcmp(args->cons->car->symbolValue, "\'")) {
      return evalNull(depth+1, args->cons->cdr, env);
    }

    else {
      return evalNull(depth+1, args->cons->car, env);
    }
  } 

  else if (args->type == symbolType){
    return evalNull(depth+1, eval(args, env), env);
  }
    

  else {
    return insertToken("#f", NULL);
  }
}

Value* evalCar(Value* args, Environment* env){
  Value* evaled = eval(args, env);

  if (evaled->type == cellType){
    if (evaled->cons->car->type == symbolType && !strcmp(evaled->cons->car->symbolValue, "'")){
      if (evaled->cons->cdr->cons->car->type == valueType){
        Value* retCar = copyValue(evaled->cons->cdr->cons->car->val->cons->car);
        if (retCar->type != cellType && retCar->type != valueType
            && retCar->type != closureType){
          // if primitive type, we need to wrap it in a cell Value
          Value* newVal = malloc(sizeof(Value));
          ConsCell* newCell = malloc(sizeof(ConsCell));

          newVal->type = cellType;
          newVal->cons = newCell;

          newCell->car = retCar;
          newCell->cdr = NULL;
          return newVal;
        }

        return evaled->cons->cdr->cons->car->val->cons->car;
      }
      else evaluationError();
    }
    else {
      evaluationError();
    }
  }
  else evaluationError();
  return NULL;
}

Value* evalCdr(Value* args, Environment* env){
  Value* evaled = eval(args, env);

  if (evaled->type == cellType){
    if (evaled->cons->car->type == symbolType && !strcmp(evaled->cons->car->symbolValue, "'")){
      if (evaled->cons->cdr->cons->car->type == valueType){
        if (evaled->cons->cdr->cons->car->val != NULL){
          // printTree(evaled->cons->cdr->cons->car->val->cons->cdr);
          Value* ret = createQuotedList(evaled->cons->cdr->cons->car->val->cons->cdr);
          return ret;
        }
        else {
          // If it was empty, DrRacket yells at you. We just don't return anything
          // so nothing get's printed
        }
      } 
      else evaluationError();
    }
    else evaluationError();
  }
  else evaluationError();
  return NULL;
}

Value* evalCons(Value* args, Environment* env){
  if(args == NULL){
    evaluationError();
  }
  else if(args->cons->cdr == NULL){
    evaluationError();
  }
  else if (args->cons->cdr->cons->cdr != NULL){
    evaluationError();
  }

  Value* first = eval(args, env);
  Value* rest = eval(args->cons->cdr, env);
  fflush(stdout);
  // if first part is a list
  if (first->cons->car->type == symbolType && !strcmp(first->cons->car->symbolValue, "'")){
    first = first->cons->cdr;
  }
  if (rest->cons->car->type == symbolType && !strcmp(rest->cons->car->symbolValue, "'")){
    rest = rest->cons->cdr->cons->car->val;
  }
  else {
    rest = rest->cons->car;
  }

  first->cons->cdr = rest;

  return createQuotedList(first);
}

Value* resolveVariable(Value *symbol, Environment *env){

  if (!strcmp(symbol->symbolValue, "'")){
    return symbol;
  }

  Value *resolved = NULL;

  Environment* initialEnv = env;

  Environment *curEnv = env;

  // Loop through each environment and fech binding in the environment
  while (curEnv != NULL && resolved == NULL){
    
    Value* curVar = curEnv->variables;

    while (curVar != NULL && resolved == NULL){
      if (!strcmp(curVar->cons->car->cons->car->symbolValue, symbol->symbolValue)){
        resolved = copyValue(curVar->cons->car->cons->cdr);
      }

      curVar = curVar->cons->cdr;
    }
    curEnv = curEnv->parent;
  }

  env = initialEnv;
  return resolved;
}

Value* createQuotedList(Value* items){

  Value* newLevel = malloc(sizeof(Value));
  newLevel->type = valueType;
  newLevel->val = items;

  Value* frame = malloc(sizeof(Value));
  frame->type = cellType;
  ConsCell *cell = malloc(sizeof(ConsCell));
  cell->car = newLevel;
  cell->cdr = NULL;
  frame->cons = cell;

  return insertToken("'", frame);
}

Value* evalClosure(Value* closureVal){
  return eval(closureVal->closure->body, closureVal->closure->formalParams);
}

Value* copyValue(Value* orig){
  if (orig == NULL) return NULL;

  Value* newVal = malloc(sizeof(Value));

  newVal->type = orig->type;

  switch(orig->type){

    case closureType:
      newVal->closure = orig->closure;
      break;

    case valueType:
      newVal->val = copyValue(orig->val);
      break;
    
    case cellType:
      // malloc and set a new cell
      printf("");
      ConsCell *newCons = malloc(sizeof(ConsCell));
      newVal->cons = newCons;

      // copy the car
      newCons->car = copyValue(orig->cons->car);

      // copy the cdr
      newCons->cdr = copyValue(orig->cons->cdr);
      break;


    case symbolType:
      newVal->symbolValue = orig->symbolValue;
      break;

    case integerType:
      newVal->integerValue = orig->integerValue;
      break;

    case booleanType:
      newVal->booleanValue = orig->booleanValue;
      break;
    case stringType:
      newVal->stringValue = orig->stringValue;
      break;

    default:
      // it should never get here
      printf("It's something other than those.\n");
      printType(orig);
      break;  
  }
  return newVal;
}

void evaluationError(){
  printf("Evaluation Error\n");
  fflush(stdout);
  exit(0);
}

void printType(Value *val){
  if (val == NULL) printf("it is NULL\n");
  else if (val->type == cellType) printf("it's a cell.\n");
  else if (val->type == integerType) printf("it's an int.\n");
  else if (val->type == symbolType) printf("it's a symbol.\n");
  else if (val->type == floatType) printf("it's a float.\n");
  else if (val->type == stringType) printf("it's a string.\n"); 
  else if (val->type == booleanType) printf("it's a booool.\n");
  else if (val->type == openType) printf("it's a open.\n");
  else if (val->type == closeType) printf("it's a close.\n");
  else if (val->type == valueType) printf("it's a value.\n");
  else if (val->type == closureType) printf("it's a closure.\n");
  else printf("it's none of them.\n");
}