import type { Token } from "../lexer/token";

export abstract class Expr {}

export class NumberExpr extends Expr {
    constructor(public value: number) {
        super();
    }
}

export class StringExpr extends Expr {
    constructor(public value: string) {
        super();
    }
}

export class IdentifierExpr extends Expr {
    constructor(public name: Token) {
        super();
    }
}

export class BinaryExpr extends Expr {
    constructor(
        public left: Expr,
        public operator: Token,
        public right: Expr
    ) {
        super();
    }
}

export class UnaryExpr extends Expr {
    constructor(
        public operator: Token,
        public right: Expr
    ) {
        super();
    }
}
