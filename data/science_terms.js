/**
 * French Science Dictionary - Core Scientific Lexicon
 * Specially curated for high precision in Mathematics, AI, Computer Science, and Physics.
 */

const SCIENCE_TERMS = [
  // ==========================================
  // MATHEMATICS (Linear Algebra, Analysis, Topology, etc.)
  // ==========================================
  {
    fr: "valeur propre",
    en: "eigenvalue",
    alt: ["proper value", "characteristic value"],
    category: "math",
    subcategories: ["linear_algebra", "spectral_theory"],
    pos: "n.f.",
    definition: "A scalar λ such that T(v) = λv for a non-zero vector v under a linear transformation T.",
    note: "CRITICAL: 'propre' here means 'characteristic / proper / eigen' (from German 'eigen' meaning 'own'). Do NOT translate as 'clean value'.",
    examples: [
      { fr: "Les valeurs propres de cette matrice hermitienne sont toutes réelles.", en: "The eigenvalues of this Hermitian matrix are all real." },
      { fr: "Soit λ une valeur propre de l'endomorphisme u.", en: "Let λ be an eigenvalue of the endomorphism u." }
    ],
    synonyms: ["valeur caractéristique"],
    antonyms: []
  },
  {
    fr: "vecteur propre",
    en: "eigenvector",
    alt: ["proper vector", "characteristic vector"],
    category: "math",
    subcategories: ["linear_algebra", "spectral_theory"],
    pos: "n.m.",
    definition: "A non-zero vector whose direction remains unchanged when a linear transformation is applied, only scaled by the eigenvalue.",
    note: "Never translate as 'clean vector'.",
    examples: [
      { fr: "On cherche les vecteurs propres associés à la plus grande valeur propre.", en: "We seek the eigenvectors associated with the largest eigenvalue." }
    ],
    synonyms: [],
    antonyms: []
  },
  {
    fr: "sous-espace propre",
    en: "eigenspace",
    alt: ["characteristic subspace"],
    category: "math",
    subcategories: ["linear_algebra"],
    pos: "n.m.",
    definition: "The subspace formed by all eigenvectors corresponding to a given eigenvalue, along with the zero vector: Ker(A - λI).",
    note: "Eigenspace corresponding to an eigenvalue.",
    examples: [
      { fr: "La somme directe des sous-espaces propres est égale à l'espace tout entier si la matrice est diagonalisable.", en: "The direct sum of the eigenspaces equals the entire space if the matrix is diagonalizable." }
    ]
  },
  {
    fr: "espace vectoriel",
    en: "vector space",
    alt: ["linear space"],
    category: "math",
    subcategories: ["linear_algebra"],
    pos: "n.m.",
    definition: "A set endowed with vector addition and scalar multiplication satisfying the vector space axioms.",
    note: "Abbreviated 'ev' in French notes.",
    examples: [
      { fr: "Soit E un espace vectoriel de dimension finie sur le corps K.", en: "Let E be a finite-dimensional vector space over the field K." }
    ]
  },
  {
    fr: "sous-espace vectoriel",
    en: "subspace / linear subspace",
    alt: ["vector subspace"],
    category: "math",
    subcategories: ["linear_algebra"],
    pos: "n.m.",
    definition: "A subset of a vector space that is itself closed under vector addition and scalar multiplication.",
    note: "Often abbreviated 'sev'.",
    examples: [
      { fr: "L'intersection de deux sous-espaces vectoriels est encore un sous-espace vectoriel.", en: "The intersection of two linear subspaces is also a linear subspace." }
    ]
  },
  {
    fr: "corps",
    en: "field",
    alt: ["division ring", "skew field (if non-commutative)"],
    category: "math",
    subcategories: ["abstract_algebra"],
    pos: "n.m.",
    definition: "An algebraic structure with addition and multiplication where every non-zero element has a multiplicative inverse.",
    note: "FALSE FRIEND: In abstract algebra, 'corps' translates to 'field' (when commutative) or 'division ring / skew field' (corps gauche). Never translate as 'body'!",
    examples: [
      { fr: "L'ensemble des nombres réels ℝ forme un corps commutatif.", en: "The set of real numbers ℝ forms a field." },
      { fr: "Soit 𝔽_q un corps fini à q éléments.", en: "Let 𝔽_q be a finite field with q elements." }
    ],
    synonyms: ["corps commutatif"]
  },
  {
    fr: "corps fini",
    en: "finite field",
    alt: ["Galois field"],
    category: "math",
    subcategories: ["abstract_algebra", "cryptography"],
    pos: "n.m.",
    definition: "A field that contains a finite number of elements, always of prime-power order p^k.",
    note: "Also known as Galois field GF(p^k).",
    examples: [
      { fr: "La cryptographie moderne repose largement sur l'arithmétique des corps finis.", en: "Modern cryptography relies heavily on the arithmetic of finite fields." }
    ]
  },
  {
    fr: "anneau",
    en: "ring",
    category: "math",
    subcategories: ["abstract_algebra"],
    pos: "n.m.",
    definition: "An algebraic structure consisting of a set with two binary operations (addition and multiplication) generalizing integers.",
    note: "In mathematics, 'anneau' is a ring, not a loop, ringlet, or jewelry.",
    examples: [
      { fr: "ℤ[X] est un anneau commutatif unitaire intègre.", en: "ℤ[X] is a commutative unitary integral domain (ring)." }
    ]
  },
  {
    fr: "variété",
    en: "manifold (differential geometry) / variety (algebraic geometry)",
    alt: ["manifold", "algebraic variety"],
    category: "math",
    subcategories: ["differential_geometry", "topology", "algebraic_geometry"],
    pos: "n.f.",
    definition: "A topological space that locally resembles Euclidean space near each point.",
    note: "CRITICAL DISTINCTION: In differential geometry and topology, 'variété' translates to 'manifold' (e.g. 'variété riemannienne' = 'Riemannian manifold'). In algebraic geometry, 'variété algébrique' translates to 'algebraic variety'.",
    examples: [
      { fr: "Une sphère est une variété différentielle compacte de dimension 2.", en: "A sphere is a compact 2-dimensional smooth manifold." },
      { fr: "L'espace tangent en un point d'une variété différentielle.", en: "The tangent space at a point on a smooth manifold." }
    ]
  },
  {
    fr: "adhérence",
    en: "closure",
    alt: ["topological closure"],
    category: "math",
    subcategories: ["topology", "analysis"],
    pos: "n.f.",
    definition: "The union of a set and its limit points, denoted Ā or Cl(A).",
    note: "FALSE FRIEND: In topology, 'adhérence' is the 'closure' of a set. Do NOT translate as 'adherence' or 'stickiness'.",
    examples: [
      { fr: "L'adhérence de l'intervalle ouvert (0, 1) dans ℝ est [0, 1].", en: "The closure of the open interval (0, 1) in ℝ is [0, 1]." },
      { fr: "Un sous-ensemble est fermé si et seulement s'il est égal à son adhérence.", en: "A subset is closed if and only if it is equal to its closure." }
    ],
    synonyms: ["fermeture"],
    antonyms: ["intérieur"]
  },
  {
    fr: "noyau",
    en: "kernel / null space",
    alt: ["kernel", "nullspace"],
    category: "math",
    subcategories: ["linear_algebra", "abstract_algebra"],
    pos: "n.m.",
    definition: "The set of elements mapped to the zero element by a homomorphism or linear map: Ker(f).",
    note: "FALSE FRIEND: In linear algebra / algebra, 'noyau' is 'kernel' or 'null space'. Never translate as 'core', 'nucleus', or 'pit'.",
    examples: [
      { fr: "Le noyau d'une application linéaire injective est réduit au vecteur nul.", en: "The kernel of an injective linear map consists only of the zero vector." }
    ]
  },
  {
    fr: "image",
    en: "image / range",
    alt: ["column space (for matrices)"],
    category: "math",
    subcategories: ["linear_algebra", "analysis"],
    pos: "n.f.",
    definition: "The set of all output values a function or linear map may produce: Im(f).",
    note: "In linear algebra, Im(A) corresponds to the range or column space of matrix A.",
    examples: [
      { fr: "D'après le théorème du rang, dim(Ker f) + dim(Im f) = dim(E).", en: "By the rank-nullity theorem, dim(Ker f) + dim(Im f) = dim(E)." }
    ]
  },
  {
    fr: "théorème du rang",
    en: "rank-nullity theorem",
    category: "math",
    subcategories: ["linear_algebra"],
    pos: "n.m.",
    definition: "dim(Ker f) + dim(Im f) = dim(E) for a linear map f: E → F on a finite-dimensional space E.",
    note: "In French known as 'théorème du rang', in English 'rank-nullity theorem'.",
    examples: [
      { fr: "On applique le théorème du rang pour calculer la dimension de l'image.", en: "We apply the rank-nullity theorem to compute the dimension of the image." }
    ]
  },
  {
    fr: "recouvrement",
    en: "covering / cover",
    alt: ["open cover"],
    category: "math",
    subcategories: ["topology"],
    pos: "n.m.",
    definition: "A collection of sets whose union contains the given set.",
    note: "FALSE FRIEND: In topology, 'recouvrement d'ouverts' is 'open covering / open cover'. Never translate as 'recovery' or 'overlap'.",
    examples: [
      { fr: "Tout recouvrement ouvert d'un espace compact admet un sous-recouvrement fini.", en: "Every open cover of a compact space admits a finite subcover." }
    ]
  },
  {
    fr: "compact",
    en: "compact",
    category: "math",
    subcategories: ["topology", "analysis"],
    pos: "adj.",
    definition: "A topological space where every open cover has a finite subcover; in ℝ^n, closed and bounded (Heine-Borel).",
    examples: [
      { fr: "Une fonction continue sur un espace métrique compact est uniformément continue.", en: "A continuous function on a compact metric space is uniformly continuous." }
    ]
  },
  {
    fr: "compacité",
    en: "compactness",
    category: "math",
    subcategories: ["topology"],
    pos: "n.f.",
    definition: "The topological property of being compact.",
    examples: [
      { fr: "La compacité permet d'extraire des sous-suites convergentes.", en: "Compactness allows one to extract convergent subsequences." }
    ]
  },
  {
    fr: "connexe",
    en: "connected",
    category: "math",
    subcategories: ["topology"],
    pos: "adj.",
    definition: "A topological space that cannot be partitioned into two disjoint non-empty open sets.",
    examples: [
      { fr: "L'image d'un espace connexe par une application continue est connexe.", en: "The image of a connected space under a continuous map is connected." }
    ]
  },
  {
    fr: "connexe par arcs",
    en: "path-connected",
    category: "math",
    subcategories: ["topology"],
    pos: "adj.",
    definition: "A space where any two points can be joined by a continuous path.",
    note: "Path-connected implies connected, but the converse is not always true.",
    examples: [
      { fr: "Tout espace vectoriel normé est connexe par arcs.", en: "Every normed vector space is path-connected." }
    ]
  },
  {
    fr: "borne supérieure",
    en: "supremum / least upper bound",
    alt: ["sup", "LUB"],
    category: "math",
    subcategories: ["analysis"],
    pos: "n.f.",
    definition: "The smallest real number greater than or equal to every number in a given set.",
    note: "Abbreviated 'sup'. Distinguish from 'maximum', which must belong to the set.",
    examples: [
      { fr: "Toute partie non vide et majorée de ℝ admet une borne supérieure.", en: "Every non-empty subset of ℝ bounded above admits a supremum." }
    ],
    antonyms: ["borne inférieure"]
  },
  {
    fr: "borne inférieure",
    en: "infimum / greatest lower bound",
    alt: ["inf", "GLB"],
    category: "math",
    subcategories: ["analysis"],
    pos: "n.f.",
    definition: "The largest real number less than or equal to every number in a given set.",
    note: "Abbreviated 'inf'. Distinguish from 'minimum'.",
    examples: [
      { fr: "La borne inférieure de l'ensemble {1/n : n ∈ ℕ*} est 0.", en: "The infimum of the set {1/n : n ∈ ℕ*} is 0." }
    ],
    antonyms: ["borne supérieure"]
  },
  {
    fr: "majorant",
    en: "upper bound",
    category: "math",
    subcategories: ["analysis"],
    pos: "n.m.",
    definition: "An element greater than or equal to all elements of a subset.",
    examples: [
      { fr: "1 est un majorant de l'intervalle ouvert (0, 1).", en: "1 is an upper bound of the open interval (0, 1)." }
    ]
  },
  {
    fr: "minorant",
    en: "lower bound",
    category: "math",
    subcategories: ["analysis"],
    pos: "n.m.",
    definition: "An element less than or equal to all elements of a subset.",
    examples: [
      { fr: "0 est un minorant de l'ensemble des réels positifs.", en: "0 is a lower bound of the set of positive real numbers." }
    ]
  },
  {
    fr: "majoré",
    en: "bounded above",
    category: "math",
    subcategories: ["analysis"],
    pos: "adj.",
    definition: "Possessing an upper bound.",
    examples: [
      { fr: "Une suite croissante et majorée converge dans ℝ.", en: "A non-decreasing sequence bounded above converges in ℝ." }
    ]
  },
  {
    fr: "minoré",
    en: "bounded below",
    category: "math",
    subcategories: ["analysis"],
    pos: "adj.",
    definition: "Possessing a lower bound.",
    examples: [
      { fr: "La fonction exponentielle est minorée par zéro.", en: "The exponential function is bounded below by zero." }
    ]
  },
  {
    fr: "borné",
    en: "bounded",
    category: "math",
    subcategories: ["analysis", "topology"],
    pos: "adj.",
    definition: "Having both an upper and lower bound, or contained in a ball of finite radius.",
    examples: [
      { fr: "Toute fonction continue sur un segment [a, b] est bornée et atteint ses bornes.", en: "Every continuous function on a closed interval [a, b] is bounded and attains its bounds." }
    ]
  },
  {
    fr: "dénombrable",
    en: "countable",
    category: "math",
    subcategories: ["set_theory", "analysis"],
    pos: "adj.",
    definition: "Having the same cardinality as a subset of natural numbers ℕ.",
    note: "In French, 'dénombrable' usually means countably infinite or finite, though in English some authors distinguish 'at most countable'.",
    examples: [
      { fr: "L'ensemble des nombres rationnels ℚ est dénombrable.", en: "The set of rational numbers ℚ is countable." },
      { fr: "L'ensemble des nombres réels ℝ n'est pas dénombrable.", en: "The set of real numbers ℝ is uncountable." }
    ],
    antonyms: ["indénombrable", "non dénombrable"]
  },
  {
    fr: "suite",
    en: "sequence",
    category: "math",
    subcategories: ["analysis"],
    pos: "n.f.",
    definition: "An ordered collection of elements indexed by natural numbers (u_n)_{n ∈ ℕ}.",
    note: "Distinguish 'suite' (sequence) from 'série' (series = sum of sequence terms).",
    examples: [
      { fr: "On considère la suite définie par récurrence u_{n+1} = f(u_n).", en: "Consider the sequence defined by the recurrence u_{n+1} = f(u_n)." }
    ]
  },
  {
    fr: "série entière",
    en: "power series",
    category: "math",
    subcategories: ["analysis", "complex_analysis"],
    pos: "n.f.",
    definition: "An infinite series of the form ∑ a_n (z - z_0)^n.",
    examples: [
      { fr: "Le rayon de convergence de la série entière ∑ z^n / n! est infini.", en: "The radius of convergence of the power series ∑ z^n / n! is infinite." }
    ]
  },
  {
    fr: "rayon de convergence",
    en: "radius of convergence",
    category: "math",
    subcategories: ["analysis"],
    pos: "n.m.",
    definition: "The radius R of the largest open disk in which a power series converges.",
    examples: [
      { fr: "La règle de d'Alembert permet de déterminer le rayon de convergence.", en: "d'Alembert's ratio test allows determining the radius of convergence." }
    ]
  },
  {
    fr: "développement limité",
    en: "Taylor expansion / asymptotic expansion",
    alt: ["DL", "local polynomial expansion"],
    category: "math",
    subcategories: ["analysis"],
    pos: "n.m.",
    definition: "Approximation of a function by a polynomial near a point with a Peano or Landau remainder: f(x) = P(x) + o((x-x_0)^n).",
    note: "Abbreviated 'DL' in French French mathematics notes and exams.",
    examples: [
      { fr: "Calculer le développement limité à l'ordre 3 en 0 de sin(x).", en: "Compute the 3rd-order Taylor expansion at 0 of sin(x)." }
    ]
  },
  {
    fr: "primitive",
    en: "antiderivative / primitive",
    category: "math",
    subcategories: ["calculus", "analysis"],
    pos: "n.f.",
    definition: "A differentiable function F whose derivative equals f on an interval: F' = f.",
    note: "In English calculus courses, 'antiderivative' or 'indefinite integral' is much more common than 'primitive'.",
    examples: [
      { fr: "Une primitive de la fonction 1/x sur ℝ+* est ln(x).", en: "An antiderivative of the function 1/x on ℝ+* is ln(x)." }
    ]
  },
  {
    fr: "théorème des accroissements finis",
    en: "mean value theorem (MVT)",
    alt: ["TAF"],
    category: "math",
    subcategories: ["analysis"],
    pos: "n.m.",
    definition: "For f differentiable on (a, b) and continuous on [a, b], there exists c ∈ (a, b) such that f(b) - f(a) = f'(c)(b - a).",
    note: "Abbreviated 'TAF' in French literature.",
    examples: [
      { fr: "Le théorème des accroissements finis implique que si f' est nulle, f est constante.", en: "The mean value theorem implies that if f' is zero, f is constant." }
    ]
  },
  {
    fr: "théorème des valeurs intermédiaires",
    en: "intermediate value theorem (IVT)",
    alt: ["TVI"],
    category: "math",
    subcategories: ["analysis"],
    pos: "n.m.",
    definition: "A continuous function on [a, b] attains every value between f(a) and f(b).",
    note: "Abbreviated 'TVI'.",
    examples: [
      { fr: "Par le théorème des valeurs intermédiaires, ce polynôme admet au moins une racine réelle.", en: "By the intermediate value theorem, this polynomial admits at least one real root." }
    ]
  },
  {
    fr: "théorème des gendarmes",
    en: "squeeze theorem / sandwich theorem",
    alt: ["pinch theorem"],
    category: "math",
    subcategories: ["analysis"],
    pos: "n.m.",
    definition: "If g(x) ≤ f(x) ≤ h(x) and lim g = lim h = L, then lim f = L.",
    note: "In French called 'théorème des gendarmes' (police theorem); in English called 'squeeze theorem' or 'sandwich theorem'.",
    examples: [
      { fr: "Par le théorème des gendarmes, la limite de x sin(1/x) en 0 est 0.", en: "By the squeeze theorem, the limit of x sin(1/x) at 0 is 0." }
    ]
  },
  {
    fr: "espace préhilbertien",
    en: "inner product space / pre-Hilbert space",
    category: "math",
    subcategories: ["functional_analysis", "linear_algebra"],
    pos: "n.m.",
    definition: "A vector space equipped with an inner product (not necessarily complete).",
    note: "If it is complete with respect to the induced norm, it is a Hilbert space.",
    examples: [
      { fr: "Un espace préhilbertien complet est appelé espace de Hilbert.", en: "A complete pre-Hilbert space is called a Hilbert space." }
    ]
  },
  {
    fr: "espace de Hilbert",
    en: "Hilbert space",
    category: "math",
    subcategories: ["functional_analysis"],
    pos: "n.m.",
    definition: "A complete inner product space.",
    examples: [
      { fr: "L^2(ℝ) est un espace de Hilbert muni du produit scalaire usuel.", en: "L^2(ℝ) is a Hilbert space equipped with the standard inner product." }
    ]
  },
  {
    fr: "espace de Banach",
    en: "Banach space",
    category: "math",
    subcategories: ["functional_analysis"],
    pos: "n.m.",
    definition: "A complete normed vector space.",
    examples: [
      { fr: "L'espace C([0, 1]) muni de la norme infinie est un espace de Banach.", en: "The space C([0, 1]) equipped with the supremum norm is a Banach space." }
    ]
  },
  {
    fr: "tribu",
    en: "sigma-algebra / sigma-field",
    alt: ["σ-algèbre"],
    category: "math",
    subcategories: ["measure_theory", "probability"],
    pos: "n.f.",
    definition: "A collection of subsets of a sample space closed under complement and countable unions.",
    note: "CRITICAL: In French measure theory and probability, 'tribu' is the standard term for a σ-algebra. Never translate as 'tribe'!",
    examples: [
      { fr: "La tribu borélienne sur ℝ est engendrée par les intervalles ouverts.", en: "The Borel σ-algebra on ℝ is generated by the open intervals." },
      { fr: "Soit (Ω, ℱ, ℙ) un espace probabilisé où ℱ est une tribu.", en: "Let (Ω, ℱ, ℙ) be a probability space where ℱ is a σ-algebra." }
    ],
    synonyms: ["sigma-algèbre", "corps de Borel"]
  },
  {
    fr: "variable aléatoire",
    en: "random variable",
    alt: ["r.v."],
    category: "math",
    subcategories: ["probability"],
    pos: "n.f.",
    definition: "A measurable function from a probability space to a measurable state space.",
    note: "Abbreviated 'v.a.' in French, 'r.v.' in English.",
    examples: [
      { fr: "Soit X une variable aléatoire réelle d'espérance finie.", en: "Let X be a real random variable with finite expectation." }
    ]
  },
  {
    fr: "espérance",
    en: "expected value / expectation",
    alt: ["mathematical expectation", "mean"],
    category: "math",
    subcategories: ["probability"],
    pos: "n.f.",
    definition: "The probability-weighted average of all possible values of a random variable: 𝔼[X].",
    note: "CRITICAL: In probability, 'espérance' is 'expected value' or 'expectation'. Never translate as 'hope'!",
    examples: [
      { fr: "Par linéarité de l'espérance, 𝔼[aX + bY] = a𝔼[X] + b𝔼[Y].", en: "By linearity of expectation, 𝔼[aX + bY] = a𝔼[X] + b𝔼[Y]." }
    ]
  },
  {
    fr: "écart-type",
    en: "standard deviation",
    alt: ["std dev", "sigma"],
    category: "math",
    subcategories: ["statistics", "probability"],
    pos: "n.m.",
    definition: "The square root of the variance, measuring the dispersion of a distribution: σ = √Var(X).",
    examples: [
      { fr: "La loi normale centrée réduite a une moyenne nulle et un écart-type égal à 1.", en: "The standard normal distribution has zero mean and a standard deviation equal to 1." }
    ]
  },
  {
    fr: "estimateur sans biais",
    en: "unbiased estimator",
    category: "math",
    subcategories: ["statistics"],
    pos: "n.m.",
    definition: "An estimator whose expected value equals the true parameter value being estimated: 𝔼[θ̂] = θ.",
    examples: [
      { fr: "La moyenne empirique est un estimateur sans biais de l'espérance.", en: "The sample mean is an unbiased estimator of the expectation." }
    ]
  },
  {
    fr: "matrice de passage",
    en: "change-of-basis matrix / transition matrix",
    category: "math",
    subcategories: ["linear_algebra"],
    pos: "n.f.",
    definition: "An invertible matrix representing the transformation from one basis to another: P_{B→B'}.",
    examples: [
      { fr: "Soit P la matrice de passage de la base canonique à la base de vecteurs propres.", en: "Let P be the change-of-basis matrix from the canonical basis to the eigenvector basis." }
    ]
  },
  {
    fr: "déterminant",
    en: "determinant",
    category: "math",
    subcategories: ["linear_algebra"],
    pos: "n.m.",
    definition: "A scalar value derived from the elements of a square matrix reflecting its invertibility and geometric volume scaling.",
    examples: [
      { fr: "Une matrice carrée est inversible si et seulement si son déterminant est non nul.", en: "A square matrix is invertible if and only if its determinant is non-zero." }
    ]
  },
  {
    fr: "polynôme caractéristique",
    en: "characteristic polynomial",
    category: "math",
    subcategories: ["linear_algebra"],
    pos: "n.m.",
    definition: "The polynomial det(A - λI) whose roots are the eigenvalues of matrix A.",
    examples: [
      { fr: "D'après le théorème de Cayley-Hamilton, toute matrice annule son polynôme caractéristique.", en: "According to the Cayley-Hamilton theorem, every matrix annihilates its characteristic polynomial." }
    ]
  },
  {
    fr: "diagonalisable",
    en: "diagonalizable",
    category: "math",
    subcategories: ["linear_algebra"],
    pos: "adj.",
    definition: "Similar to a diagonal matrix; possessing a basis of eigenvectors.",
    examples: [
      { fr: "Toute matrice symétrique réelle est diagonalisable dans une base orthonormée.", en: "Every real symmetric matrix is diagonalizable in an orthonormal basis." }
    ]
  },
  {
    fr: "forme linéaire",
    en: "linear form / linear functional",
    alt: ["linear 1-form", "covector"],
    category: "math",
    subcategories: ["linear_algebra"],
    pos: "n.f.",
    definition: "A linear map from a vector space to its underlying scalar field.",
    examples: [
      { fr: "Le dual topologique E* est l'espace des formes linéaires continues sur E.", en: "The topological dual E* is the space of continuous linear forms on E." }
    ]
  },
  {
    fr: "produit scalaire",
    en: "dot product / inner product / scalar product",
    category: "math",
    subcategories: ["linear_algebra"],
    pos: "n.m.",
    definition: "A positive-definite symmetric (or Hermitian) bilinear form mapping pairs of vectors to scalars.",
    examples: [
      { fr: "Deux vecteurs sont orthogonaux si leur produit scalaire est nul.", en: "Two vectors are orthogonal if their inner product is zero." }
    ]
  },

  // ==========================================
  // ARTIFICIAL INTELLIGENCE & MACHINE LEARNING
  // ==========================================
  {
    fr: "apprentissage automatique",
    en: "machine learning (ML)",
    alt: ["ML"],
    category: "ai",
    subcategories: ["machine_learning"],
    pos: "n.m.",
    definition: "The study of computer algorithms that improve automatically through experience and data.",
    examples: [
      { fr: "L'apprentissage automatique transforme l'analyse des données massives.", en: "Machine learning transforms big data analytics." }
    ]
  },
  {
    fr: "apprentissage profond",
    en: "deep learning (DL)",
    category: "ai",
    subcategories: ["deep_learning"],
    pos: "n.m.",
    definition: "A subset of machine learning based on artificial neural networks with representation learning across multiple layers.",
    examples: [
      { fr: "L'apprentissage profond a permis des percées majeures en vision par ordinateur.", en: "Deep learning has enabled major breakthroughs in computer vision." }
    ]
  },
  {
    fr: "apprentissage par renforcement",
    en: "reinforcement learning (RL)",
    category: "ai",
    subcategories: ["reinforcement_learning"],
    pos: "n.m.",
    definition: "An area of machine learning concerned with how intelligent agents ought to take actions in an environment to maximize cumulative reward.",
    examples: [
      { fr: "L'apprentissage par renforcement avec retour humain (RLHF) est crucial pour aligner les LLM.", en: "Reinforcement learning from human feedback (RLHF) is crucial for aligning LLMs." }
    ]
  },
  {
    fr: "descente de gradient",
    en: "gradient descent",
    category: "ai",
    subcategories: ["optimization", "deep_learning"],
    pos: "n.f.",
    definition: "A first-order iterative optimization algorithm for finding a local minimum of a differentiable function.",
    examples: [
      { fr: "On met à jour les poids selon la règle de la descente de gradient: θ ← θ - η∇L(θ).", en: "Weights are updated according to the gradient descent rule: θ ← θ - η∇L(θ)." }
    ]
  },
  {
    fr: "descente de gradient stochastique",
    en: "stochastic gradient descent (SGD)",
    alt: ["SGD"],
    category: "ai",
    subcategories: ["optimization", "deep_learning"],
    pos: "n.f.",
    definition: "An iterative method for optimizing an objective function with suitable smoothness properties using sub-sampled mini-batches.",
    examples: [
      { fr: "La descente de gradient stochastique avec impulsion accélère la convergence.", en: "Stochastic gradient descent with momentum accelerates convergence." }
    ]
  },
  {
    fr: "rétropropagation",
    en: "backpropagation / backward pass",
    alt: ["backprop"],
    category: "ai",
    subcategories: ["deep_learning"],
    pos: "n.f.",
    definition: "An algorithm for computing the gradient of the loss function with respect to weights by applying the chain rule backwards through network layers.",
    examples: [
      { fr: "La rétropropagation du gradient permet de mettre à jour les couches profondes du réseau.", en: "Backpropagation of the gradient allows updating the deep layers of the network." }
    ]
  },
  {
    fr: "fonction de perte",
    en: "loss function / cost function / objective function",
    alt: ["cost function", "error function"],
    category: "ai",
    subcategories: ["machine_learning", "optimization"],
    pos: "n.f.",
    definition: "A function that maps an event or values of one or more variables onto a real number representing some 'cost' associated with the event.",
    examples: [
      { fr: "L'entropie croisée est la fonction de perte standard pour la classification multi-classes.", en: "Cross-entropy is the standard loss function for multi-class classification." }
    ],
    synonyms: ["fonction de coût"]
  },
  {
    fr: "taux d'apprentissage",
    en: "learning rate",
    category: "ai",
    subcategories: ["optimization", "deep_learning"],
    pos: "n.m.",
    definition: "A tuning parameter in an optimization algorithm that determines the step size at each iteration toward a minimum of a loss function.",
    note: "Usually designated by η (eta) or α (alpha).",
    examples: [
      { fr: "Un taux d'apprentissage trop élevé peut entraîner une divergence de l'optimisation.", en: "A learning rate that is too high can cause optimization divergence." }
    ]
  },
  {
    fr: "surapprentissage",
    en: "overfitting",
    category: "ai",
    subcategories: ["machine_learning"],
    pos: "n.m.",
    definition: "The production of an analysis that corresponds too closely or exactly to a particular set of data, and may therefore fail to fit to additional data or predict future observations reliably.",
    examples: [
      { fr: "La régularisation et le dropout permettent d'atténuer le surapprentissage.", en: "Regularization and dropout help mitigate overfitting." }
    ],
    antonyms: ["sous-apprentissage"]
  },
  {
    fr: "sous-apprentissage",
    en: "underfitting",
    category: "ai",
    subcategories: ["machine_learning"],
    pos: "n.m.",
    definition: "Occurs when a machine learning model cannot adequately capture the underlying structure of the data.",
    examples: [
      { fr: "Un modèle linéaire sur des données non linéaires souffre de sous-apprentissage.", en: "A linear model on non-linear data suffers from underfitting." }
    ],
    antonyms: ["surapprentissage"]
  },
  {
    fr: "plongement",
    en: "embedding",
    alt: ["vector embedding", "latent representation"],
    category: "ai",
    subcategories: ["nlp", "deep_learning"],
    pos: "n.m.",
    definition: "A relatively low-dimensional space into which you can translate high-dimensional vectors, capturing semantic meaning.",
    note: "In NLP, 'plongement lexical' is 'word embedding'. In mathematics, 'plongement' translates to 'immersion / embedding' of manifolds.",
    examples: [
      { fr: "Les plongements lexicaux capturent les relations sémantiques entre les mots.", en: "Word embeddings capture semantic relationships between words." }
    ]
  },
  {
    fr: "auto-attention",
    en: "self-attention",
    category: "ai",
    subcategories: ["deep_learning", "nlp"],
    pos: "n.f.",
    definition: "An attention mechanism relating different positions of a single sequence in order to compute a representation of the sequence.",
    examples: [
      { fr: "L'auto-attention multi-têtes est le composant central de l'architecture Transformer.", en: "Multi-head self-attention is the core component of the Transformer architecture." }
    ]
  },
  {
    fr: "transformeur",
    en: "transformer",
    category: "ai",
    subcategories: ["deep_learning", "nlp"],
    pos: "n.m.",
    definition: "A deep learning architecture based on self-attention mechanisms, introduced by Vaswani et al. in 2017.",
    examples: [
      { fr: "Les modèles de fondation reposent presque tous sur des transformeurs.", en: "Foundation models almost all rely on transformers." }
    ]
  },
  {
    fr: "espace latent",
    en: "latent space",
    category: "ai",
    subcategories: ["deep_learning", "generative_ai"],
    pos: "n.m.",
    definition: "A manifold or vector space where similar data points are mapped closer together in compressed dimensional representation.",
    examples: [
      { fr: "L'auto-encodeur encode l'image d'entrée dans un espace latent de dimension réduite.", en: "The autoencoder encodes the input image into a reduced-dimensional latent space." }
    ]
  },
  {
    fr: "abandon",
    en: "dropout",
    category: "ai",
    subcategories: ["deep_learning", "regularization"],
    pos: "n.m.",
    definition: "A regularization technique where randomly selected neurons are ignored during training.",
    note: "Often kept as 'dropout' even in French papers, but translated as 'abandon' in formal publications.",
    examples: [
      { fr: "Un taux d'abandon de 0.2 est appliqué après chaque couche dense.", en: "A dropout rate of 0.2 is applied after each dense layer." }
    ]
  },
  {
    fr: "matrice de confusion",
    en: "confusion matrix",
    category: "ai",
    subcategories: ["evaluation_metrics"],
    pos: "n.f.",
    definition: "A table used to describe the performance of a classification model on test data for which true values are known.",
    examples: [
      { fr: "La diagonale de la matrice de confusion indique les prédictions correctes.", en: "The diagonal of the confusion matrix indicates the correct predictions." }
    ]
  },
  {
    fr: "rappel",
    en: "recall / sensitivity",
    alt: ["true positive rate", "sensitivity"],
    category: "ai",
    subcategories: ["evaluation_metrics"],
    pos: "n.m.",
    definition: "The fraction of relevant instances that were retrieved: TP / (TP + FN).",
    examples: [
      { fr: "En diagnostic médical, on privilégie un rappel élevé pour éviter les faux négatifs.", en: "In medical diagnostics, high recall is favored to avoid false negatives." }
    ]
  },
  {
    fr: "précision",
    en: "precision / positive predictive value",
    category: "ai",
    subcategories: ["evaluation_metrics"],
    pos: "n.f.",
    definition: "The fraction of relevant instances among the retrieved instances: TP / (TP + FP).",
    note: "Distinguish from accuracy ('exactitude' / 'justesse'). Precision measures purity of positive predictions.",
    examples: [
      { fr: "Le score F1 est la moyenne harmonique entre la précision et le rappel.", en: "The F1 score is the harmonic mean between precision and recall." }
    ]
  },
  {
    fr: "modèle génératif",
    en: "generative model",
    category: "ai",
    subcategories: ["generative_ai"],
    pos: "n.m.",
    definition: "A statistical model of the joint probability distribution P(X, Y) or P(X), capable of generating new synthetic data.",
    examples: [
      { fr: "Les modèles de diffusion sont aujourd'hui l'état de l'art en modèles génératifs d'images.", en: "Diffusion models are currently state-of-the-art in generative image models." }
    ]
  },
  {
    fr: "ajustement fin",
    en: "fine-tuning",
    category: "ai",
    subcategories: ["deep_learning"],
    pos: "n.m.",
    definition: "Taking a pre-trained model and adapting its parameters on a smaller, domain-specific dataset.",
    examples: [
      { fr: "L'ajustement fin avec LoRA réduit drastiquement le nombre de paramètres modifiés.", en: "Fine-tuning with LoRA drastically reduces the number of modified parameters." }
    ]
  },

  // ==========================================
  // COMPUTER SCIENCE & SYSTEMS
  // ==========================================
  {
    fr: "table de hachage",
    en: "hash table / hash map",
    category: "cs",
    subcategories: ["data_structures"],
    pos: "n.f.",
    definition: "A data structure that implements an associative array abstract data type using a hash function.",
    examples: [
      { fr: "La recherche dans une table de hachage bien dimensionnée se fait en O(1) en moyenne.", en: "Lookup in a well-sized hash table occurs in O(1) average time." }
    ]
  },
  {
    fr: "tas",
    en: "heap",
    alt: ["binary heap"],
    category: "cs",
    subcategories: ["data_structures"],
    pos: "n.m.",
    definition: "A specialized tree-based data structure satisfying the heap property (max-heap or min-heap).",
    note: "Do NOT translate as 'pile' (which is 'stack'). 'tas' = 'heap'; 'pile' = 'stack'.",
    examples: [
      { fr: "Une file à priorité peut être efficacement implémentée à l'aide d'un tas binaire.", en: "A priority queue can be efficiently implemented using a binary heap." }
    ]
  },
  {
    fr: "pile",
    en: "stack",
    category: "cs",
    subcategories: ["data_structures"],
    pos: "n.f.",
    definition: "An abstract data type serving as a collection with Last-In-First-Out (LIFO) semantics.",
    note: "FALSE FRIEND: 'pile' = 'stack' (LIFO). 'tas' = 'heap'. Do NOT confuse with battery ('pile électrique').",
    examples: [
      { fr: "Les appels de fonctions récursives sont empilés sur la pile d'exécution.", en: "Recursive function calls are pushed onto the call stack." }
    ]
  },
  {
    fr: "file",
    en: "queue",
    alt: ["FIFO queue"],
    category: "cs",
    subcategories: ["data_structures"],
    pos: "n.f.",
    definition: "A collection of entities maintained in a sequence with First-In-First-Out (FIFO) semantics.",
    examples: [
      { fr: "Le parcours en largeur d'un graphe utilise une file.", en: "Breadth-first search of a graph utilizes a queue." }
    ]
  },
  {
    fr: "arbre couvrant minimal",
    en: "minimum spanning tree (MST)",
    alt: ["arbre de recouvrement minimal"],
    category: "cs",
    subcategories: ["graph_theory", "algorithms"],
    pos: "n.m.",
    definition: "A subset of the edges of a connected, edge-weighted undirected graph that connects all the vertices together without any cycles and with minimum total weight.",
    examples: [
      { fr: "Les algorithmes de Kruskal et de Prim permettent de trouver un arbre couvrant minimal.", en: "Kruskal's and Prim's algorithms allow finding a minimum spanning tree." }
    ]
  },
  {
    fr: "complexité amortie",
    en: "amortized complexity / amortized analysis",
    category: "cs",
    subcategories: ["algorithms", "complexity"],
    pos: "n.f.",
    definition: "A method of analyzing algorithms that considers the average running time per operation over a worst-case sequence of operations.",
    examples: [
      { fr: "L'insertion en fin de tableau dynamique a un coût amorti en O(1).", en: "Insertion at the end of a dynamic array has an amortized cost of O(1)." }
    ]
  },
  {
    fr: "programmation dynamique",
    en: "dynamic programming (DP)",
    category: "cs",
    subcategories: ["algorithms"],
    pos: "n.f.",
    definition: "Both a mathematical optimization method and a computer programming method based on breaking a problem down into simpler overlapping subproblems.",
    examples: [
      { fr: "Le problème du sac à dos se résout classiquement par programmation dynamique.", en: "The knapsack problem is classically solved via dynamic programming." }
    ]
  },
  {
    fr: "interblocage",
    en: "deadlock",
    category: "cs",
    subcategories: ["operating_systems", "concurrency"],
    pos: "n.m.",
    definition: "A state in which each member of a group waits for another member, including itself, to take action, such as sending a message or releasing a lock.",
    examples: [
      { fr: "Les conditions de Coffman caractérisent la possibilité d'un interblocage.", en: "Coffman conditions characterize the possibility of a deadlock." }
    ]
  },
  {
    fr: "exclusion mutuelle",
    en: "mutual exclusion (mutex)",
    category: "cs",
    subcategories: ["operating_systems", "concurrency"],
    pos: "n.f.",
    definition: "A property of concurrency control preventing simultaneous access to a shared resource by multiple concurrent threads.",
    examples: [
      { fr: "On utilise un verrou pour garantir l'exclusion mutuelle dans la section critique.", en: "A lock is used to guarantee mutual exclusion in the critical section." }
    ]
  },
  {
    fr: "fil d'exécution",
    en: "thread",
    alt: ["thread of execution"],
    category: "cs",
    subcategories: ["operating_systems"],
    pos: "n.m.",
    definition: "The smallest sequence of programmed instructions that can be managed independently by an operating system scheduler.",
    examples: [
      { fr: "Le multithreading permet à plusieurs fils d'exécution de partager le même espace mémoire.", en: "Multithreading allows multiple threads to share the same memory address space." }
    ]
  },
  {
    fr: "ramasse-miettes",
    en: "garbage collector (GC)",
    category: "cs",
    subcategories: ["compilers", "runtime"],
    pos: "n.m.",
    definition: "A form of automatic memory management that attempts to reclaim memory occupied by objects that are no longer in use.",
    examples: [
      { fr: "Le ramasse-miettes libère automatiquement la mémoire des objets inaccessibles.", en: "The garbage collector automatically reclaims memory from unreachable objects." }
    ]
  },
  {
    fr: "problème de l'arrêt",
    en: "halting problem",
    category: "cs",
    subcategories: ["computability", "theoretical_cs"],
    pos: "n.m.",
    definition: "The problem of determining, from a description of an arbitrary computer program and an input, whether the program will finish running or continue to run forever.",
    examples: [
      { fr: "Alan Turing a démontré l'indécidabilité du problème de l'arrêt.", en: "Alan Turing proved the undecidability of the halting problem." }
    ]
  },

  // ==========================================
  // PHYSICS & GENERAL SCIENCE
  // ==========================================
  {
    fr: "onde",
    en: "wave",
    category: "science",
    subcategories: ["physics", "waves"],
    pos: "n.f.",
    definition: "A propagating dynamic disturbance (change from equilibrium) of one or more physical quantities.",
    examples: [
      { fr: "Une onde électromagnétique se propage dans le vide à la vitesse de la lumière.", en: "An electromagnetic wave propagates in a vacuum at the speed of light." }
    ]
  },
  {
    fr: "fonction d'onde",
    en: "wave function",
    category: "science",
    subcategories: ["quantum_mechanics"],
    pos: "n.f.",
    definition: "A mathematical description of the quantum state of an isolated quantum system, usually denoted by ψ (psi).",
    examples: [
      { fr: "Le module au carré de la fonction d'onde représente la densité de probabilité de présence.", en: "The squared modulus of the wave function represents the probability density of presence." }
    ]
  },
  {
    fr: "équation de Schrödinger",
    en: "Schrödinger equation",
    category: "science",
    subcategories: ["quantum_mechanics"],
    pos: "n.f.",
    definition: "A linear partial differential equation that governs the wave function of a quantum-mechanical system: iħ ∂ψ/∂t = Ĥψ.",
    examples: [
      { fr: "L'équation de Schrödinger indépendante du temps donne les états stationnaires.", en: "The time-independent Schrödinger equation yields the stationary states." }
    ]
  },
  {
    fr: "principe d'incertitude",
    en: "uncertainty principle / Heisenberg uncertainty principle",
    category: "science",
    subcategories: ["quantum_mechanics"],
    pos: "n.m.",
    definition: "A fundamental limit to the precision with which certain pairs of physical properties of a particle (such as position and momentum) can be known: Δx Δp ≥ ħ/2.",
    examples: [
      { fr: "Le principe d'incertitude de Heisenberg interdit de mesurer simultanément la position et l'impulsion avec une précision infinie.", en: "Heisenberg's uncertainty principle forbids measuring position and momentum simultaneously with infinite precision." }
    ]
  },
  {
    fr: "intrication quantique",
    en: "quantum entanglement",
    category: "science",
    subcategories: ["quantum_mechanics", "quantum_computing"],
    pos: "n.f.",
    definition: "A physical phenomenon that occurs when a group of particles interact in ways such that the quantum state of each particle cannot be described independently of the state of the others.",
    examples: [
      { fr: "L'intrication quantique est au cœur des protocoles de téléportation quantique.", en: "Quantum entanglement is at the heart of quantum teleportation protocols." }
    ]
  },
  {
    fr: "effet tunnel",
    en: "quantum tunneling",
    category: "science",
    subcategories: ["quantum_mechanics"],
    pos: "n.m.",
    definition: "A quantum phenomenon where a subatomic particle passes through a potential energy barrier that it classically cannot surmount.",
    examples: [
      { fr: "L'effet tunnel explique la radioactivité alpha et le fonctionnement du microscope à effet tunnel.", en: "Quantum tunneling explains alpha decay and the operation of the scanning tunneling microscope." }
    ]
  },
  {
    fr: "entropie",
    en: "entropy",
    category: "science",
    subcategories: ["thermodynamics", "information_theory"],
    pos: "n.f.",
    definition: "A measure of molecular disorder or randomness in thermodynamics (S = k ln Ω), or the average amount of information produced by a stochastic source of data (Shannon entropy).",
    examples: [
      { fr: "Le second principe de la thermodynamique stipule que l'entropie d'un système isolé ne peut qu'augmenter.", en: "The second law of thermodynamics states that the entropy of an isolated system can only increase." }
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SCIENCE_TERMS };
}
