import { Lexer } from "../src/lexer/lexer";

const code = `
let name = "Jhenie";
let idade = 19;
show(32 + 35);
-- oiiiii
`;

const lexer = new Lexer(code);

console.log(lexer.scanTokens());