import { Lexer } from "../src/lexer/lexer";
import { TokenType } from "./lexer/token-type";
import { Parser } from "./parser/parser";
import { SemanticAnalyzer } from "./semantic/semantic-analyzer";

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

// console.log(tokens);

const parser = new Parser(tokens);
const ast = parser.parse();

// console.dir(ast, { depth: null });

const analyzer = new SemanticAnalyzer();
analyzer.analyze(ast);