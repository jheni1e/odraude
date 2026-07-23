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

            switch(char) {
                case ' ':
                    break;
                case '=':
                    this.addToken(TokenType.EQUAL)
                    break;
            }
        }

        this.addToken(TokenType.EOF);

        return this.tokens;
    }

    private addToken(type: TokenType, literal: unknown = null) {
        const lexeme = this.source.substring(this.start, this.current);

        this.tokens.push(
            new Token(
                type,
                lexeme,
                literal,
                this.line
            )
        );
    }
}
