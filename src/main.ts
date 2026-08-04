import * as fs from "node:fs";

import { Lexer } from "../src/lexer/lexer";
import { JSGenerator } from "./generator/js-generator";
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

try {
    const lexer = new Lexer(code);
    const tokens = lexer.scanTokens();

    const parser = new Parser(tokens);
    const ast = parser.parse();

    const analyzer = new SemanticAnalyzer();
    analyzer.analyze(ast);

    const generator = new JSGenerator();
    const js = generator.generate(ast);

    fs.mkdirSync("src/build", { recursive: true });

    fs.writeFileSync("src/build/output.js", js);
}
catch (error) {
    if (error instanceof SemanticError) {
        console.error(error.message);
    } else {
        console.error(error);
    }
}
