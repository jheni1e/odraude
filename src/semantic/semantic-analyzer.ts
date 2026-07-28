import { Expr } from "../ast/expr";
import { LetStmt, ShowStmt, type Stmt } from "../ast/stmt";

export class SemanticAnalyzer {
  analyze(statements: Stmt[]): void {
    for (const statement of statements) {
      this.visitStatement(statement);
    }
  }

  private visitStatement(statement: Stmt): void {
    if (statement instanceof LetStmt) {
      this.visitLetStatement(statement);
    } else if (statement instanceof ShowStmt) {
      this.visitShowStatement(statement);
    }
  }

  private visitExpression(expression: Expr): void {
    //...
  }

  private visitLetStatement(statement: LetStmt) {
    console.log(statement);
  }

  private visitShowStatement(statement: ShowStmt) {
    console.log(statement);
  }
}
