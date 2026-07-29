import type { ValueType } from "../shared/types/value-type";

export interface SymbolInfo {
  type: ValueType;
  mutable: boolean;
  initialized: boolean;
}
