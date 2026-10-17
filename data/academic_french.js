/**
 * French Science Dictionary - Academic French & Mathematical Reasoning Lexicon
 * Connectors, proof patterns, academic discourse verbs, and false friends.
 */

const ACADEMIC_FRENCH = [
  {
    fr: "soit",
    en: "let / suppose / given",
    alt: ["consider"],
    category: "general",
    subcategories: ["academic_discourse", "proof_language"],
    pos: "v. subjonctif",
    definition: "Standard introductory formula in French mathematical proofs to introduce a variable, set, or hypothesis.",
    note: "Translates to 'Let' in English proofs (e.g. 'Soit x ∈ ℝ' = 'Let x ∈ ℝ').",
    examples: [
      { fr: "Soit E un espace vectoriel de dimension finie sur ℝ.", en: "Let E be a finite-dimensional vector space over ℝ." },
      { fr: "Soit ε > 0 donné.", en: "Let ε > 0 be given." }
    ]
  },
  {
    fr: "posons",
    en: "let us set / let us define",
    alt: ["define", "set"],
    category: "general",
    subcategories: ["academic_discourse"],
    pos: "v. 1ère pers. pluriel",
    definition: "Used to define a convenient notation, constant, or substitution in a proof.",
    examples: [
      { fr: "Posons M = sup_{x ∈ [a,b]} |f(x)|.", en: "Let us set M = sup_{x ∈ [a,b]} |f(x)|." }
    ]
  },
  {
    fr: "supposons",
    en: "suppose / assume",
    alt: ["let us assume"],
    category: "general",
    subcategories: ["academic_discourse", "proof_language"],
    pos: "v.",
    definition: "Used to introduce an assumption or hypothesis.",
    examples: [
      { fr: "Supposons par l'absurde que l'ensemble des nombres premiers est fini.", en: "Suppose for the sake of contradiction that the set of prime numbers is finite." }
    ]
  },
  {
    fr: "d'où",
    en: "whence / hence / from which",
    alt: ["therefore", "thus"],
    category: "general",
    subcategories: ["academic_discourse", "logical_connectors"],
    pos: "loc. adv.",
    definition: "Indicates a direct logical deduction or result from the preceding line.",
    examples: [
      { fr: "On a f'(x) > 0 pour tout x, d'où f est strictement croissante.", en: "We have f'(x) > 0 for all x, whence f is strictly increasing." },
      { fr: "D'où le résultat annoncé.", en: "Hence the stated result." }
    ]
  },
  {
    fr: "il s'ensuit que",
    en: "it follows that",
    alt: ["consequently", "as a consequence"],
    category: "general",
    subcategories: ["academic_discourse", "logical_connectors"],
    pos: "loc. verb.",
    definition: "Expresses logical consequence in academic texts.",
    examples: [
      { fr: "Comme la suite est bornée, il s'ensuit qu'elle admet une sous-suite convergente.", en: "Since the sequence is bounded, it follows that it admits a convergent subsequence." }
    ]
  },
  {
    fr: "or",
    en: "now / yet / however",
    category: "general",
    subcategories: ["academic_discourse", "logical_connectors"],
    pos: "conj.",
    definition: "A crucial deductive conjunction used to introduce a known premise or established fact into a syllogism.",
    note: "In English proofs, translated as 'Now, ...' or 'However, ...'. It introduces a previously known theorem or condition: 'Or f est continue, donc...'",
    examples: [
      { fr: "Or, par hypothèse, f est lipschitzienne, donc elle est uniformément continue.", en: "Now, by assumption, f is Lipschitz, hence it is uniformly continuous." }
    ]
  },
  {
    fr: "en effet",
    en: "indeed / in fact",
    category: "general",
    subcategories: ["academic_discourse", "logical_connectors"],
    pos: "loc. adv.",
    definition: "Used to introduce the proof or justification of a claim that was just made.",
    examples: [
      { fr: "Cette matrice est symétrique réelle. En effet, sa transposée coïncide avec elle-même.", en: "This matrix is real symmetric. Indeed, its transpose coincides with itself." }
    ]
  },
  {
    fr: "par l'absurde",
    en: "by contradiction / reductio ad absurdum",
    alt: ["for the sake of contradiction"],
    category: "math",
    subcategories: ["proof_language"],
    pos: "loc. adv.",
    definition: "A method of proof in which a proposition is proven by following the implications of the proposition's negation to a logical contradiction.",
    examples: [
      { fr: "Raisonnons par l'absurde pour démontrer l'irrationalité de √2.", en: "Let us argue by contradiction to prove the irrationality of √2." }
    ]
  },
  {
    fr: "par récurrence",
    en: "by mathematical induction / by induction",
    category: "math",
    subcategories: ["proof_language"],
    pos: "loc. adv.",
    definition: "Proof technique establishing a base case and an inductive step for all n ∈ ℕ.",
    examples: [
      { fr: "On démontre la formule pour tout entier n par récurrence sur n.", en: "We prove the formula for every integer n by mathematical induction on n." }
    ]
  },
  {
    fr: "réciproquement",
    en: "conversely",
    category: "general",
    subcategories: ["proof_language", "logical_connectors"],
    pos: "adv.",
    definition: "Used when proving an equivalence (if and only if) to introduce the proof of the reverse implication.",
    examples: [
      { fr: "Réciproquement, supposons que f soit injective...", en: "Conversely, assume that f is injective..." }
    ]
  },
  {
    fr: "il vient",
    en: "we obtain / it follows",
    category: "general",
    subcategories: ["academic_discourse"],
    pos: "loc. verb.",
    definition: "French mathematical idiom meaning 'it results' or 'after calculation, we get'.",
    examples: [
      { fr: "En intégrant par parties, il vient : ∫ u v' = [u v] - ∫ u' v.", en: "Integrating by parts, we obtain: ∫ u v' = [u v] - ∫ u' v." }
    ]
  },
  {
    fr: "CQFD",
    en: "QED (quod erat demonstrandum / which was to be demonstrated)",
    alt: ["Q.E.D."],
    category: "math",
    subcategories: ["proof_language"],
    pos: "abréviation",
    definition: "Abbreviation for 'ce qu'il fallait démontrer', placed at the end of a mathematical proof.",
    examples: [
      { fr: "D'où l'inégalité triangulaire. CQFD.", en: "Hence the triangle inequality. QED." }
    ]
  },
  {
    fr: "si et seulement si",
    en: "if and only if (iff)",
    alt: ["iff"],
    category: "math",
    subcategories: ["proof_language"],
    pos: "loc. conj.",
    definition: "Biconditional logical connective indicating equivalence.",
    note: "Abbreviated 'ssi' in French, 'iff' in English.",
    examples: [
      { fr: "Une matrice est inversible si et seulement si son déterminant est non nul.", en: "A matrix is invertible if and only if its determinant is non-zero." }
    ]
  },
  {
    fr: "sans perte de généralité",
    en: "without loss of generality (WLOG)",
    alt: ["WLOG"],
    category: "math",
    subcategories: ["proof_language"],
    pos: "loc. adv.",
    definition: "Assumption that simplifies the proof without affecting the validity of the general theorem.",
    note: "Abbreviated 'SPDG' in French, 'WLOG' in English.",
    examples: [
      { fr: "On peut supposer, sans perte de généralité, que a ≤ b.", en: "We can assume, without loss of generality, that a ≤ b." }
    ]
  },
  {
    fr: "presque sûrement",
    en: "almost surely (a.s.)",
    alt: ["a.s."],
    category: "math",
    subcategories: ["probability"],
    pos: "loc. adv.",
    definition: "An event happens almost surely if it occurs with probability 1.",
    note: "Abbreviated 'p.s.' in French, 'a.s.' in English.",
    examples: [
      { fr: "D'après la loi forte des grands nombres, la moyenne empirique converge presque sûrement.", en: "According to the strong law of large numbers, the sample mean converges almost surely." }
    ]
  },
  {
    fr: "presque partout",
    en: "almost everywhere (a.e.)",
    alt: ["a.e."],
    category: "math",
    subcategories: ["measure_theory", "analysis"],
    pos: "loc. adv.",
    definition: "A property holds almost everywhere if the set of points where it fails has measure zero.",
    note: "Abbreviated 'p.p.' in French, 'a.e.' in English.",
    examples: [
      { fr: "Deux fonctions égales presque partout ont la même intégrale de Lebesgue.", en: "Two functions equal almost everywhere have the same Lebesgue integral." }
    ]
  },
  {
    fr: "s'annuler",
    en: "to vanish / to equal zero",
    alt: ["to cancel out"],
    category: "math",
    subcategories: ["analysis", "algebra"],
    pos: "v. pronominal",
    definition: "When a function or derivative takes the value 0: f(x) = 0.",
    note: "In English mathematics, 'vanish' is the standard formal term for 's'annuler' (e.g. 'the function vanishes at the boundary').",
    examples: [
      { fr: "Le gradient s'annule en tout extremum local d'une fonction différentiable.", en: "The gradient vanishes at every local extremum of a differentiable function." }
    ]
  },
  {
    fr: "muni de",
    en: "equipped with / endowed with",
    category: "math",
    subcategories: ["topology", "algebra"],
    pos: "loc. adj.",
    definition: "Specifying the mathematical structure or metric associated with a set.",
    examples: [
      { fr: "Soit E un espace vectoriel normé muni de la topologie induite.", en: "Let E be a normed vector space endowed with the induced topology." }
    ]
  },
  {
    fr: "engendré par",
    en: "generated by / spanned by",
    category: "math",
    subcategories: ["linear_algebra", "group_theory"],
    pos: "loc. adj.",
    definition: "Formed by linear combinations or algebraic operations of a given generating set.",
    examples: [
      { fr: "Le sous-espace vectoriel engendré par la famille de vecteurs (v1, ..., vk).", en: "The vector subspace spanned by the family of vectors (v1, ..., vk)." }
    ]
  },
  {
    fr: "à savoir",
    en: "namely / that is to say",
    category: "general",
    subcategories: ["academic_discourse"],
    pos: "loc. adv.",
    definition: "Used to introduce more specific information or an explanation.",
    examples: [
      { fr: "L'équation admet deux solutions distinctes, à savoir x = 1 et x = -1.", en: "The equation admits two distinct solutions, namely x = 1 and x = -1." }
    ]
  },
  {
    fr: "notamment",
    en: "notably / in particular / especially",
    category: "general",
    subcategories: ["academic_discourse"],
    pos: "adv.",
    definition: "Used to single out an important example or case.",
    examples: [
      { fr: "Ce résultat s'applique à de nombreuses structures algébriques, notamment les groupes de Lie.", en: "This result applies to many algebraic structures, notably Lie groups." }
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ACADEMIC_FRENCH };
}
