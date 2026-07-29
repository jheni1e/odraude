import { Lexer } from "../src/lexer/lexer";
import { Parser } from "./parser/parser";
import { SemanticAnalyzer } from "./semantic/semantic-analyzer";
import { SemanticError } from "./shared/errors/semantic-error";

const code = `
let name = "Jhenie";
let idade = 19;
show name;
show idade;
-- oiiiii
let x = 10 + 20 * 5;
show x;
`;

const lexer = new Lexer(code);
const tokens = lexer.scanTokens();
const parser = new Parser(tokens);
const ast = parser.parse();
const analyzer = new SemanticAnalyzer();

try {
    lexer.scanTokens();
    parser.parse();
    analyzer.analyze(ast);
}
catch (error) {
    if (error instanceof SemanticError) {
        console.error(error.message);
    }
}
