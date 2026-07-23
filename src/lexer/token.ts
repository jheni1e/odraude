import { TokenType } from "./token-type";

export class Token {
    constructor(
        public readonly type: TokenType,
        public readonly lexeme: string,
        public readonly literal: unknown,
        public readonly line: number
    ) {}
}