export type Stmt =
  | { tag: "define", name: string, value: Expr } // like "x"(name) = "5"(value) => this is define which is basically an identifier
  | { tag: "expr", expr: Expr }

export type Expr =
    { tag: "num", value: number }
  | { tag: "id", name: string }
  | { tag: "builtin1", name: string, arg: Expr }
  | { tag: "builtin2", name: string, arg1: Expr, arg2: Expr }
  | { tag: "binexpr", left: Expr, op: string, right: Expr }

/*export type Assign = 
    { tag: "assignFunction", name:string, value: Expr}*/

