                                                *** WRITE UP ***

-------------------------------------------------------------------------------------------------------------------------------

1. Three examples of anormal behaviour of our compiler parsing with that of Python's
   inherent compiling are:

    a.) The builtin1 function "abs" throws an error while running: "-abs(5)".
        It should ideally print out "-5" but instead it throws an error. 
        It's probably because we have defined "-" and "+" in the function "UnaryExpression". 
        So, if something comes after "-" and "+", it must be a number value whereas our input
        is not a UnaryExpression.

        *Proposed Solution:
            To tackle this, we can instantiate a new tag in the "Expr" in the ast.ts 
            which takes in {tag: "specialCase", left: "string", right: "Expr"} and since "builtin1" is 
            already defined in "Expr", the error will be solved potentially.(I think!)

    b.) The builtin2 functions "max" and "min" gives error while handling more
        than 2 arguments whereas it can include multiple arguments ideally.
        This is happening because we are just accepting 2 argumentsfor these functions
        in our "CallExpression" case in parser.ts

        *Proposed Solution:
            A simple solution to this anomaly would be to simply remove the "if" condition which 
            prohibits from passing more than 2 arguments and keep in iterating the "argslist"
            untill termination and return all those parameters.

    c.) Our compiler is not able to return a function in a variable. For ex. "x = abs(-5)"
        is not compiled when "print(x)" is called. It is because in parser.ts this comes under
        "AssignStatement" case and the value being returned is a simple traversal of the CallExpression
        after the equivalence operator.

        *Proposed Solution:
            What could be done is instead of simple "const value = traverseExpr(c, s);", we could traverse 
            the value in a similar manner as we did with builtin1 or builtin2 by using an array of parameters.
            That way the Expr being returned would not be a simple parameter but an array of parameters.(I think!)

-------------------------------------------------------------------------------------------------------------------------------

2. I found these two websites other than the material provided in the class as really really
   effective: "https://blog.logrocket.com/the-introductory-guide-to-assemblyscript/" AND "https://dev.to/jtenner/an-assemblyscript-primer-for-typescript-developers-lf1"
   Both of them primarily to understand the already provided code in depth.
   Other than these, the office hours really helped a lot in understanding what lezer Python
   was doing to the code and cleared the concepts regarding the tree-stack like behaviour
   of the parsing.

------------------------------------------------------------------------------------------------------------------------------

3. NONE 