// utils/it-gender.ts
export type Gender = "m" | "f";

// const FEM_EXCEPTIONS = new Set([
//   "mano", "radio", "auto", "moto", "foto", "email", "mail", "password",
//   "serie", "specie"
// ]);

// const MASC_EXCEPTIONS = new Set([
//   "problema","programma","sistema","tema","poema","schema","dramma","dilemma",
//   "teorema","diagramma","telegramma","enigma","dogma","clima","carisma","trauma"
// ]);

// Order matters: check the more specific endings first.
const FEM_SUFFIXES = ["zione","sione","gione","trice","tudine","udine","tà","tù","si"]; // analisi, tesi, crisi...
const MASC_SUFFIXES = ["mento","aggio","ame","ume","ore"];

export function inferItalianGender(title: string): Gender {
  const word = title.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
  if (!word) return "m";
  // if (FEM_EXCEPTIONS.has(word)) return "f";
  // if (MASC_EXCEPTIONS.has(word)) return "m";
  if (FEM_SUFFIXES.some(s => word.endsWith(s))) return "f";  // es. opzione → f
  if (MASC_SUFFIXES.some(s => word.endsWith(s))) return "m";
  if (word.endsWith("a")) return "f";
  if (word.endsWith("o")) return "m";
  return "m"; // safe default
}