import { BinaryExpr, Expr, IdentifierExpr, NumberExpr, StringExpr, UnaryExpr } from "../ast/expr";
import { LetStmt, ShowStmt, Stmt } from "../ast/stmt";

export class JSGenerator {
  generate(statements: Stmt[]): string {
    return statements.map((stmt) => this.visitStatement(stmt)).join("\n");
  }

  private visitStatement(stmt: Stmt): string {
    if (stmt instanceof LetStmt) {
      return this.visitLet(stmt);
    }

    if (stmt instanceof ShowStmt) {
      return this.visitShow(stmt);
    }

    throw new Error("Unknown statement.");
  }

  private visitExpression(expr: Expr): string {
    if (expr instanceof NumberExpr) {
      return expr.value.toString();
    }

    if (expr instanceof StringExpr) {
      return `"${expr.value}"`;
    }

    if (expr instanceof IdentifierExpr) {
      return expr.name.lexeme;
    }

    if (expr instanceof UnaryExpr) {
      return `${expr.operator.lexeme}${this.visitExpression(expr.right)}`;
    }

    if (expr instanceof BinaryExpr) {
      return `(${this.visitExpression(expr.left)} ${
        expr.operator.lexeme
      } ${this.visitExpression(expr.right)})`;
    }

    throw new Error("Unknown expression.");
  }

  private visitLet(stmt: LetStmt): string {
    const initializer = this.visitExpression(stmt.initializer);

    return `let ${stmt.name.lexeme} = ${initializer};`;
  }

  private visitShow(stmt: ShowStmt): string {
    return `console.log(${this.visitExpression(stmt.expression)});`;
  }
}
