import { SemanticError } from "../shared/errors/semantic-error";
import type { SymbolInfo } from "./symbol-info";

export class SymbolTable {
  private symbols = new Map<string, SymbolInfo>();

  define(name: string, symbol: SymbolInfo): void {
    if (this.symbols.has(name)) {
      throw new Error(`Symbol '${name}' already defined.`);
    }

    this.symbols.set(name, symbol);
  }

  lookup(name: string): SymbolInfo | undefined {
    return this.symbols.get(name);
  }

  has(name: string): boolean {
    return this.symbols.has(name);
  }

  assign(name: string, updates: Partial<SymbolInfo>): void {
    const symbol = this.lookup(name);

    if (!symbol) {
      throw new SemanticError(`Undefined symbol '${name}'.`);
    }

    this.symbols.set(name, {
      ...symbol,
      ...updates,
    });
  }

  remove(name: string): void {
    this.symbols.delete(name);
  }
}
