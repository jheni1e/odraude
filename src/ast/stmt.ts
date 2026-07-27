import type { Token } from "../lexer/token";
import type { Expr } from "./expr";

export abstract class Stmt {}

export class LetStmt extends Stmt {
    constructor(
        public name: Token,
        public initializer: Expr
    ) {
        super();
    }
}
    
export class ShowStmt extends Stmt {
    constructor(public expression: Expr) {
        super();
    }
}