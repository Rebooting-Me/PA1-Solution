import {parser} from "lezer-python";
import {TreeCursor} from "lezer-tree";
import {Expr, Stmt} from "./ast";

export function traverseExpr(c : TreeCursor, s : string) : Expr {
  switch(c.type.name) {
    case "Number":
      return {
        tag: "num",
        value: Number(s.substring(c.from, c.to))
      }
    case "VariableName":
      return {
        tag: "id",
        name: s.substring(c.from, c.to)
      }
    case "CallExpression":
      c.firstChild();
      const callName = s.substring(c.from, c.to);
      c.nextSibling();
      var args = [];
      c.firstChild();
      while(c.nextSibling()){
        args.push(traverseExpr(c,s));
        c.nextSibling();
      };
      if(args.length > 2){
        throw new Error("Argument limit exceeded: The function takes only 2 arguments")
      }
      if(args.length == 1){
        if(callName != "print" && callName != "abs"){
          throw new Error("Cannot accept other functions than print and abs for one argument");
        }
        return {
          tag: "builtin1",
          name: callName,
          arg: args[0]
        }
      }
      if(args.length == 2){
        if(callName != "max" && callName != "min" && callName != "pow"){
          throw new Error("Cannot accept other functions than min, max and pow for 2 arguments");
        }
        return{
          tag: "builtin2",
          name: callName,
          arg1: args[0],
          arg2: args[1]
        }
      }


      /*c.nextSibling(); // go to arglist
      c.firstChild(); // go into arglist
      c.nextSibling(); // find single argument in arglist
      const arg = traverseExpr(c, s);
      c.parent(); // pop arglist
      c.parent(); // pop CallExpression*/

    case "UnaryExpression":
      const val = Number(s.substring(c.from, c.to));
      c.firstChild();
      const unaryop = s.substring(c.from, c.to)
      if(unaryop != "+" && unaryop != "-"){
        throw new Error("Parse Error: Unsupported unary operator")
      }
      //c.nextSibling();
      
      c.parent();
      return {
        tag: "num",
        value: val
      }

    case "BinaryExpression":

      c.firstChild();
      const left = traverseExpr(c,s);
      c.nextSibling();
      const operator = s.substring(c.from, c.to)
      if (operator != "+" && operator != "-" && operator != "*"){
        throw new Error("Parse Error: Invalid Expression!")
      }
      c.nextSibling();
      const right = traverseExpr(c,s);
      c.parent();

      return{
        tag: "binexpr",
        left: left,
        op: operator,
        right: right,
      };

    default:
      throw new Error("Could not parse expr at " + c.from + " " + c.to + ": " + s.substring(c.from, c.to));
  }
}

export function traverseStmt(c : TreeCursor, s : string) : Stmt {
  switch(c.node.type.name) {
    case "AssignStatement":
      c.firstChild(); // go to name
      const name = s.substring(c.from, c.to);
      c.nextSibling(); // go to equals
      c.nextSibling(); // go to value
      const value = traverseExpr(c, s);
      c.parent();
      return {
        tag: "define",
        name: name,
        value: value
      }
    case "ExpressionStatement":
      c.firstChild();
      const expr = traverseExpr(c, s);
      c.parent(); // pop going into stmt
      return { tag: "expr", expr: expr }
    default:
      throw new Error("Could not parse stmt at " + c.node.from + " " + c.node.to + ": " + s.substring(c.from, c.to));
  }
}

export function traverse(c : TreeCursor, s : string) : Array<Stmt> {
  switch(c.node.type.name) {
    case "Script":
      const stmts = [];
      c.firstChild();
      do {
        stmts.push(traverseStmt(c, s));
      } while(c.nextSibling())
      console.log("traversed " + stmts.length + " statements ", stmts, "stopped at " , c.node);
      return stmts;
    default:
      throw new Error("Could not parse program at " + c.node.from + " " + c.node.to);
  }
}
export function parse(source : string) : Array<Stmt> {
  const t = parser.parse(source);
  return traverse(t.cursor(), source);
}
