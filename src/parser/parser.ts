import { LetStmt, ShowStmt, Stmt } from "../ast/stmt";
import { Expr, NumberExpr, StringExpr, IdentifierExpr, BinaryExpr } from "../ast/expr";
import { Token } from "../lexer/token";
import { TokenType } from "../lexer/token-type";

export class Parser {
  private current = 0;

  constructor(private tokens: Token[]) {}

  private peek(): Token {
    return this.tokens[this.current]!;
  }

  private previous(): Token {
    return this.tokens[this.current - 1]!;
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  private advance(): Token {
    if (!this.isAtEnd()) {
      this.current++;
    }

    return this.previous();
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;

    return this.peek().type === type;
  }

  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }

    return false;
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) {
      return this.advance();
    }

    throw new Error(message);
  }

  private primary(): Expr {
    if (this.match(TokenType.NUMBER)) {
      return new NumberExpr(this.previous().literal as number);
    }

    if (this.match(TokenType.STRING)) {
      return new StringExpr(this.previous().literal as string);
    }

    if (this.match(TokenType.IDENTIFIER)) {
      return new IdentifierExpr(this.previous());
    }

    if (this.match(TokenType.LEFT_PAREN)) {
      const expression = this.expression();

      this.consume(TokenType.RIGHT_PAREN, "Expected ')' after expression.");

      return expression;
    }

    throw new Error("Expected expression.");
  }

  private term(): Expr {
    let left = this.factor();

    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const operator = this.previous();
      const right = this.factor();

      left = new BinaryExpr(left, operator, right);
    }

    return left;
  }

  private factor(): Expr {
    let left = this.primary();

    while (this.match(TokenType.STAR, TokenType.SLASH)) {
      const operator = this.previous();
      const right = this.primary();

      left = new BinaryExpr(left, operator, right);
    }

    return left;
  }

  private equality(): Expr {
    let left = this.comparison();

    while (this.match(TokenType.EQUAL_EQUAL)) {
      const operator = this.previous();
      const right = this.comparison();

      left = new BinaryExpr(left, operator, right);
    }

    return left;
  }

  private comparison(): Expr {
    let left = this.term();

    while (this.match(TokenType.GREATER, TokenType.LESS)) {
      const operator = this.previous();
      const right = this.term();

      left = new BinaryExpr(left, operator, right);
    }

    return left;
  }

  private expression(): Expr {
    return this.equality();
  }

  private showStatement(): ShowStmt {
    const expression = this.expression();

    this.consume(TokenType.SEMICOLON, "Expected ';' after show statement.");

    return new ShowStmt(expression);
  }

  private letStatement(): LetStmt {
    const name = this.consume(TokenType.IDENTIFIER, "Expected variable name.");

    this.consume(TokenType.EQUAL, "Expected '=' after variable name.");

    const initializer = this.expression();

    this.consume(
      TokenType.SEMICOLON,
      "Expected ';' after variable declaration."
    );

    return new LetStmt(name, initializer);
  }

  private statement(): Stmt {
    if (this.match(TokenType.SHOW)) {
      return this.showStatement();
    }
    if (this.match(TokenType.LET)) {
      return this.letStatement();
    }
    throw new Error("Expected statement.");
  }

  parse(): Stmt[] {
    const statements: Stmt[] = [];

    while (!this.isAtEnd()) {
      statements.push(this.statement());
    }

    return statements;
  }
}
