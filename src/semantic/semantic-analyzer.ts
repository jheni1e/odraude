import { BinaryExpr, Expr, IdentifierExpr, NumberExpr, StringExpr, UnaryExpr } from "../ast/expr";
import { LetStmt, ShowStmt, type Stmt } from "../ast/stmt";
import { TokenType } from "../lexer/token-type";
import { SemanticError } from "../shared/errors/semantic-error";
import { ValueType } from "../shared/types/value-type";
import { SymbolTable } from "./symbol-table";

export class SemanticAnalyzer {
  private symbols = new SymbolTable();

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

  private visitExpression(expression: Expr): ValueType {
    if (expression instanceof NumberExpr) {
      return ValueType.NUMBER;
    }

    if (expression instanceof StringExpr) {
      return ValueType.STRING;
    }

    if (expression instanceof IdentifierExpr) {
      return this.visitIdentifier(expression);
    }

    if (expression instanceof BinaryExpr) {
      return this.visitBinary(expression);
    }

    if (expression instanceof UnaryExpr) {
      return this.visitUnary(expression);
    }

    throw new SemanticError("Unknown expression.");
  }

  private visitIdentifier(expr: IdentifierExpr): ValueType {
    const symbol = this.symbols.lookup(expr.name.lexeme);

    if (!symbol) {
      throw new SemanticError(`Variable '${expr.name.lexeme}' does not exist.`);
    }

    return symbol.type;
  }

  private visitBinary(expr: BinaryExpr): ValueType {
    const left = this.visitExpression(expr.left);
    const right = this.visitExpression(expr.right);

    switch (expr.operator.type) {
      case TokenType.PLUS:
        if (left === ValueType.NUMBER && right === ValueType.NUMBER) {
          return ValueType.NUMBER;
        }

        if (left === ValueType.STRING && right === ValueType.STRING) {
          return ValueType.STRING;
        }

        throw new SemanticError(
          `Operator '+' cannot be applied to ${left} and ${right}.`
        );
      case TokenType.MINUS:
      case TokenType.STAR:
      case TokenType.SLASH:
        if (left !== ValueType.NUMBER || right !== ValueType.NUMBER) {
          throw new SemanticError(`Operator '${expr.operator.lexeme}' cannot be applied to ${left} and ${right}.`);
        }

        return ValueType.NUMBER;

      case TokenType.GREATER:
      case TokenType.LESS:
        if (left !== ValueType.NUMBER || right !== ValueType.NUMBER) {
          throw new SemanticError("Comparison operators require numbers.");
        }

        return ValueType.BOOLEAN;

      case TokenType.EQUAL_EQUAL:
        if (left !== right) {
          throw new SemanticError("Cannot compare different types.");
        }

        return ValueType.BOOLEAN;
    }

    throw new SemanticError(`Unknown operator '${expr.operator.lexeme}'.`);
  }

  private visitUnary(expr: UnaryExpr): ValueType {
    const right = this.visitExpression(expr.right);

    switch (expr.operator.type) {
      case TokenType.MINUS:
        if (right !== ValueType.NUMBER) {
          throw new SemanticError("Unary '-' can only be applied to numbers.");
        }

        return ValueType.NUMBER;
      case TokenType.BANG:
        if (right !== ValueType.BOOLEAN) {
          throw new SemanticError("Unary '!' can only be applied to booleans.");
        }

        return ValueType.BOOLEAN;
      default:
        throw new SemanticError(`Unknown unary operator '${expr.operator.lexeme}'.`);
    }
  }

  private visitLetStatement(statement: LetStmt) {
    const name = statement.name.lexeme;

    const type = this.visitExpression(statement.initializer);

    if (this.symbols.lookup(name)) {
      throw new SemanticError(`Variable '${name}' is already declared.`);
    }

    this.symbols.define(name, {
      type,
      mutable: true,
      initialized: true,
    });
  }

  private visitShowStatement(statement: ShowStmt) {
    this.visitExpression(statement.expression);
  }
}
