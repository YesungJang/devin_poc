import glossaryData from '../../docs/glossary-product.json';

export interface GlossaryTerm {
  term: string;
  ja: string;
  ko: string;
  [key: string]: string;
}

export interface Glossary {
  terms: GlossaryTerm[];
}

export async function loadGlossary(): Promise<Glossary> {
  try {
    return glossaryData as Glossary;
  } catch (error) {
    console.warn('Warning: Could not load glossary data:', error);
    return { terms: [] };
  }
}
