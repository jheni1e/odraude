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
          break;
        case ";":
            this.addToken(TokenType.SEMICOLON);
            this.line++;
          break;
        case '"':
          let string = "";

          while (this.peek() !== '"' && this.current < this.source.length) {
            string += this.advance();
          }

          this.advance();

          this.addToken(TokenType.STRING, string);
          break;
        default:
          if (this.isDigit(char)) {
            let num = char;

            while (this.isDigit(this.peek())) {
              num += this.advance();
            }

            const number = parseInt(num);
            this.addToken(TokenType.NUMBER, number);
            break;
          } else {
            break;
          }
      }
    }

    this.addToken(TokenType.EOF);

    return this.tokens;
  }

  private isDigit(char: string): boolean {
    return char >= '0' && char <= '9';
  }

  private peek(): string {
    if (this.current >= this.source.length) return '\0';
    return this.source[this.current];
  }

  private addToken(type: TokenType, literal: unknown = null) {
    const lexeme = this.source.substring(this.start, this.current);

    this.tokens.push(new Token(type, lexeme, literal, this.line));
  }
}
