import { Token } from "./token";
import { TokenType } from "./token-type";

export class Lexer {
  constructor(private source: string) {}

  private current = 0;
  private start = 0;
  private line = 1;
  private tokens: Token[] = [];

  private advance(): string {
    return this.source[this.current++];
  }

  scanTokens() {
    while (this.current < this.source.length) {
      this.start = this.current;

      const char = this.advance();

      switch (char) {
        case "\n":
          break;
        case "=":
          this.addToken(TokenType.EQUAL);
          break;
        case "+":
          this.addToken(TokenType.PLUS);
          break;
        case "-":
          this.addToken(TokenType.MINUS);
          break;
        case ">":
          this.addToken(TokenType.GREATER);
          break;
        case "<":
          this.addToken(TokenType.LESS);
        case ";":
          this.addToken(TokenType.SEMICOLON);
          break;
        case '"':
          let string = "";
          let c = this.advance();

          while (c != '"') {
            string = string.concat(c);
            c = this.advance();
          }

          this.addToken(TokenType.STRING, string);
          break;
      }
    }

    this.addToken(TokenType.EOF);

    return this.tokens;
  }

  private addToken(type: TokenType, literal: unknown = null) {
    const lexeme = this.source.substring(this.start, this.current);

    this.tokens.push(new Token(type, lexeme, literal, this.line));
  }
}
