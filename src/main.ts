import { Lexer } from "../src/lexer/lexer";
import { Parser } from "./parser/parser";

const code = `
let name = "Jhenie";
let idade = 19;
show name;
show idade;
-- oiiiii
`;

const lexer = new Lexer(code);
const tokens = lexer.scanTokens();

console.log(tokens);

const parser = new Parser(tokens);
const ast = parser.parse();

console.log(ast);