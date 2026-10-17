/**
 * French Science Dictionary - Core Lookup & Lemmatization Engine
 * Fast, offline-first bilingual dictionary with normalized matching,
 * multi-word scientific expression parsing, and morphology handling.
 */

(function (global) {
  'use strict';

  // Normalize text: lowercase, remove accents, trim
  function normalizeText(str) {
    if (!str) return '';
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove diacritics
      .replace(/['’]/g, "'")
      .trim();
  }

  // Strip French elision and articles from start of string
  function stripArticlesAndElision(str) {
    if (!str) return '';
    let s = str.trim();
    // remove quotes / brackets around selection
    s = s.replace(/^["'«“(\[{]+|["'»”)\]}]+$/g, '').trim();
    
    // strip French elisions: l', d', s', c', qu', j', t', m', n'
    s = s.replace(/^(?:l|d|s|c|qu|j|t|m|n)['’]/i, '');
    
    // strip articles: le, la, les, un, une, des, du, au, aux
    s = s.replace(/^(?:le|la|les|un|une|des|du|au|aux)\s+/i, '');
    
    return s.trim();
  }

  // Strip punctuation at token boundaries (commas, periods, colons, semicolons, brackets, quotes)
  // while strictly preserving internal hyphens (sous-espace) and internal apostrophes (d'onde, s'annuler)
  function stripBoundaryPunctuation(str) {
    if (!str) return '';
    let s = str.trim();
    const boundaryPunctRegex = /^[\s,;:!?.…"'«»“”()[\]{}—–\-_/\\<>*+=~`^|]+|[\s,;:!?.…"'«»“”()[\]{}—–\-_/\\<>*+=~`^|]+$/g;
    s = s.replace(boundaryPunctRegex, '').trim();
    // Remove isolated leading/trailing apostrophes
    s = s.replace(/^['’]+|['’]+$/g, '').trim();
    return s;
  }

  // Normalize delimiters to spaces for robust subphrase matching in mathematical prose
  function tokenizePhraseForSubphraseMatch(text) {
    if (!text) return '';
    return normalizeText(text)
      .replace(/[,;:!?…«»“”"()[\]{}—–\/\\<>*+=~`^|]/g, ' ')
      .replace(/(^|\s)['’]|['’](\s|$)/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Generate morphological stems / candidates for a French word
  function generateMorphologicalCandidates(word) {
    const candidates = new Set();
    const clean = word.trim();
    candidates.add(clean);

    const stripped = stripArticlesAndElision(clean);
    if (stripped !== clean) {
      candidates.add(stripped);
    }

    const words = stripped.split(/\s+/);
    if (words.length === 1) {
      const w = words[0];
      // Plural to singular rules
      if (w.endsWith('eaux')) {
        candidates.add(w.slice(0, -1)); // réseaux -> réseau
      } else if (w.endsWith('aux')) {
        candidates.add(w.slice(0, -3) + 'al'); // normaux -> normal
      } else if (w.endsWith('s') && !w.endsWith('ss') && !w.endsWith('is')) {
        candidates.add(w.slice(0, -1)); // valeurs -> valeur
      } else if (w.endsWith('x') && !w.endsWith('ix') && !w.endsWith('ux')) {
        candidates.add(w.slice(0, -1));
      }

      // Feminine to masculine
      if (w.endsWith('ée')) {
        candidates.add(w.slice(0, -1)); // bornée -> borné
        candidates.add(w.slice(0, -2) + 'er'); // dérivée -> dériver
      } else if (w.endsWith('ées')) {
        candidates.add(w.slice(0, -2)); // bornées -> borné
      } else if (w.endsWith('ive')) {
        candidates.add(w.slice(0, -3) + 'if'); // récursive -> récursif
      } else if (w.endsWith('ives')) {
        candidates.add(w.slice(0, -4) + 'if');
      } else if (w.endsWith('e') && !w.endsWith('te') && !w.endsWith('me')) {
        candidates.add(w.slice(0, -1)); // compacte -> compact
      }

      // Conjugated verbs (common French academic verbs)
      if (w.endsWith('ent')) {
        candidates.add(w.slice(0, -3) + 'er'); // convergent -> converger
        candidates.add("s'" + w.slice(0, -3) + 'er'); // annulent -> s'annuler
        candidates.add("se " + w.slice(0, -3) + 'er');
        candidates.add(w.slice(0, -3));        // annulent -> annuler / annule
      } else if (w.endsWith('ant')) {
        candidates.add(w.slice(0, -3) + 'er'); // convergeant -> converger
        candidates.add("s'" + w.slice(0, -3) + 'er');
      } else if (w.endsWith('ait')) {
        candidates.add(w.slice(0, -3) + 'er');
      } else if (w.endsWith('ons')) {
        candidates.add(w.slice(0, -3) + 'er'); // posons -> poser
      } else if (w.endsWith('e')) {
        candidates.add("s'" + w + 'r'); // annule -> s'annuler
        candidates.add(w + 'r');        // converge -> converger
      }
    } else {
      // Multi-word phrase: e.g. "valeurs propres" -> "valeur propre"
      // "espaces vectoriels" -> "espace vectoriel"
      const singularWords = words.map(subw => {
        if (subw.endsWith('eaux')) return subw.slice(0, -1);
        if (subw.endsWith('aux')) return subw.slice(0, -3) + 'al';
        if (subw.endsWith('s') && !['corps', 'cas', 'fois', 'vers', 'sans', 'dans', 'près'].includes(subw.toLowerCase())) {
          return subw.slice(0, -1);
        }
        return subw;
      });
      candidates.add(singularWords.join(' '));

      // Also try feminine singular to masculine singular:
      // "matrices carrées" -> "matrice carrée"
      const cleanedWords = words.map(subw => {
        if (subw.endsWith('s') && !['corps', 'cas', 'fois', 'vers', 'sans', 'dans', 'près'].includes(subw.toLowerCase())) {
          return subw.slice(0, -1);
        }
        return subw;
      });
      candidates.add(cleanedWords.join(' '));
    }

    return Array.from(candidates);
  }

  // Additional STEM & General French entries compiled directly in core
  const EXTENDED_ENTRIES = [
    {
      fr: "espace métrique",
      en: "metric space",
      category: "math",
      subcategories: ["topology"],
      pos: "n.m.",
      definition: "A set endowed with a distance function (metric) satisfying non-negativity, identity of indiscernibles, symmetry, and triangle inequality.",
      examples: [{ fr: "Tout espace vectoriel normé est un espace métrique.", en: "Every normed vector space is a metric space." }]
    },
    {
      fr: "espace topologique",
      en: "topological space",
      category: "math",
      subcategories: ["topology"],
      pos: "n.m.",
      definition: "A set together with a topology (a collection of open sets) satisfying the topological axioms.",
      examples: [{ fr: "Soit (X, τ) un espace topologique séparé.", en: "Let (X, τ) be a Hausdorff topological space." }]
    },
    {
      fr: "point fixe",
      en: "fixed point",
      category: "math",
      subcategories: ["analysis"],
      pos: "n.m.",
      definition: "A point x in the domain of a function f such that f(x) = x.",
      examples: [{ fr: "D'après le théorème du point fixe de Banach, toute contraction admet un unique point fixe.", en: "According to the Banach fixed-point theorem, every contraction admits a unique fixed point." }]
    },
    {
      fr: "matrice carrée",
      en: "square matrix",
      category: "math",
      subcategories: ["linear_algebra"],
      pos: "n.f.",
      definition: "A matrix with the same number of rows and columns (n × n).",
      examples: [{ fr: "Une matrice carrée d'ordre n admet au plus n valeurs propres distinctes.", en: "A square matrix of order n admits at most n distinct eigenvalues." }]
    },
    {
      fr: "matrice orthogonale",
      en: "orthogonal matrix",
      category: "math",
      subcategories: ["linear_algebra"],
      pos: "n.f.",
      definition: "A real square matrix whose columns and rows are orthonormal vectors: Q^T Q = I.",
      examples: [{ fr: "Les matrices orthogonales conservent le produit scalaire et les distances.", en: "Orthogonal matrices preserve the inner product and distances." }]
    },
    {
      fr: "matrice unitaire",
      en: "unitary matrix",
      category: "math",
      subcategories: ["linear_algebra"],
      pos: "n.f.",
      definition: "A complex square matrix whose conjugate transpose equals its inverse: U* U = I.",
      examples: [{ fr: "Toute matrice unitaire a un déterminant de module 1.", en: "Every unitary matrix has a determinant of modulus 1." }]
    },
    {
      fr: "matrice symétrique",
      en: "symmetric matrix",
      category: "math",
      subcategories: ["linear_algebra"],
      pos: "n.f.",
      definition: "A square matrix that is equal to its transpose: A^T = A.",
      examples: [{ fr: "Toute matrice symétrique réelle est orthogonalement diagonalisable.", en: "Every real symmetric matrix is orthogonally diagonalizable." }]
    },
    {
      fr: "matrice définie positive",
      en: "positive-definite matrix",
      category: "math",
      subcategories: ["linear_algebra", "optimization"],
      pos: "n.f.",
      definition: "A symmetric matrix M such that x^T M x > 0 for all non-zero vectors x.",
      examples: [{ fr: "La matrice hessienne est définie positive en un minimum local strict.", en: "The Hessian matrix is positive-definite at a strict local minimum." }]
    },
    {
      fr: "hessienne",
      en: "Hessian matrix",
      alt: ["Hessian"],
      category: "math",
      subcategories: ["multivariable_calculus", "optimization"],
      pos: "n.f.",
      definition: "A square matrix of second-order partial derivatives of a scalar-valued function.",
      examples: [{ fr: "On calcule la hessienne pour déterminer la courbure locale de la fonction de coût.", en: "We compute the Hessian to determine the local curvature of the cost function." }]
    },
    {
      fr: "jacobienne",
      en: "Jacobian matrix",
      alt: ["Jacobian"],
      category: "math",
      subcategories: ["multivariable_calculus"],
      pos: "n.f.",
      definition: "The matrix of all first-order partial derivatives of a vector-valued function.",
      examples: [{ fr: "Le déterminant de la jacobienne intervient dans le changement de variables en intégration multiple.", en: "The determinant of the Jacobian appears in the change of variables for multiple integrals." }]
    },
    {
      fr: "gradient",
      en: "gradient",
      category: "math",
      subcategories: ["multivariable_calculus", "optimization"],
      pos: "n.m.",
      definition: "A vector of partial derivatives pointing in the direction of the greatest rate of increase of a function: ∇f.",
      examples: [{ fr: "Le gradient est orthogonal aux lignes de niveau de la fonction.", en: "The gradient is orthogonal to the level curves of the function." }]
    },
    {
      fr: "base canonique",
      en: "canonical basis / standard basis",
      category: "math",
      subcategories: ["linear_algebra"],
      pos: "n.f.",
      definition: "The standard basis vectors (e1, e2, ..., en) where each vector has a 1 in one coordinate and 0 elsewhere.",
      examples: [{ fr: "Soit (e1, ..., en) la base canonique de ℝ^n.", en: "Let (e1, ..., en) be the canonical basis of ℝ^n." }]
    },
    {
      fr: "dérivée",
      en: "derivative",
      category: "math",
      subcategories: ["calculus"],
      pos: "n.f.",
      definition: "The rate of change of a function with respect to an independent variable.",
      examples: [{ fr: "La dérivée d'une fonction croissante est positive ou nulle.", en: "The derivative of an increasing function is non-negative." }]
    },
    {
      fr: "dérivée partielle",
      en: "partial derivative",
      category: "math",
      subcategories: ["multivariable_calculus"],
      pos: "n.f.",
      definition: "The derivative of a multivariable function with respect to one variable, holding all other variables constant: ∂f/∂x.",
      examples: [{ fr: "Calculer les dérivées partielles premières de f(x, y).", en: "Compute the first-order partial derivatives of f(x, y)." }]
    },
    {
      fr: "continuité uniforme",
      en: "uniform continuity",
      category: "math",
      subcategories: ["analysis"],
      pos: "n.f.",
      definition: "A stronger form of continuity where the choice of δ depends only on ε, not on the point in the domain.",
      examples: [{ fr: "D'après le théorème de Heine, toute fonction continue sur un compact est uniformément continue.", en: "According to Heine's theorem, every continuous function on a compact set is uniformly continuous." }]
    },
    {
      fr: "densité",
      en: "density",
      alt: ["dense set (topology)", "probability density (probability)"],
      category: "math",
      subcategories: ["topology", "probability", "physics"],
      pos: "n.f.",
      definition: "In topology, a subset whose closure is the entire space; in probability, the derivative of the cumulative distribution function; in physics, mass per unit volume.",
      source: "Rudin, W. (1976). Principles of Mathematical Analysis; Feller, W. (1968). Introduction to Probability Theory.",
      senses: [
        {
          id: "densite-probability",
          domain: "Probability & Statistics",
          category: "math",
          translation: "probability density function (PDF)",
          definition: "A function representing a continuous probability distribution such that P(a <= X <= b) = int_a^b f(t) dt.",
          note: "Often termed 'densité de probabilité'."
        },
        {
          id: "densite-topology",
          domain: "Topology & Functional Analysis",
          category: "math",
          translation: "dense set / density",
          definition: "A subset whose topological closure equals the whole space (e.g. ℚ is dense in ℝ).",
          note: "Used for dense subspaces and approximation theorems."
        },
        {
          id: "densite-physics",
          domain: "Physics & Chemistry",
          category: "science",
          translation: "density / specific gravity",
          definition: "Mass per unit volume or dimensionless relative density.",
          note: "Physical material density."
        }
      ],
      examples: [
        { fr: "L'ensemble ℚ des rationnels est dense dans ℝ.", en: "The set ℚ of rationals is dense in ℝ.", source: "Rudin, W. (1976). Principles of Mathematical Analysis." },
        { fr: "La fonction de densité de probabilité de la loi normale.", en: "The probability density function of the normal distribution.", source: "Feller, W. (1968). Introduction to Probability Theory." }
      ]
    },
    {
      fr: "morphisme",
      en: "morphism / homomorphism",
      category: "math",
      subcategories: ["abstract_algebra", "category_theory"],
      pos: "n.m.",
      definition: "A structure-preserving map between two algebraic structures or objects in a category.",
      examples: [{ fr: "Soit φ un morphisme de groupes de G vers H.", en: "Let φ be a group homomorphism from G to H." }]
    },
    {
      fr: "isomorphisme",
      en: "isomorphism",
      category: "math",
      subcategories: ["abstract_algebra"],
      pos: "n.m.",
      definition: "A bijective morphism whose inverse is also a morphism, establishing structural equivalence.",
      examples: [{ fr: "Deux espaces vectoriels de même dimension finie sont isomorphes.", en: "Two vector spaces of the same finite dimension are isomorphic." }]
    },
    {
      fr: "endomorphisme",
      en: "endomorphism",
      category: "math",
      subcategories: ["linear_algebra", "abstract_algebra"],
      pos: "n.m.",
      definition: "A morphism of a mathematical object to itself (e.g. a linear map f: E → E).",
      examples: [{ fr: "L'ensemble des endomorphismes d'un espace vectoriel E forme une algèbre notée ℒ(E).", en: "The set of endomorphisms of a vector space E forms an algebra denoted ℒ(E)." }]
    },
    {
      fr: "automorphisme",
      en: "automorphism",
      category: "math",
      subcategories: ["abstract_algebra"],
      pos: "n.m.",
      definition: "An isomorphism from a mathematical object to itself.",
      examples: [{ fr: "Le groupe des automorphismes de G est noté Aut(G).", en: "The automorphism group of G is denoted Aut(G)." }]
    },
    {
      fr: "injectif",
      en: "injective / one-to-one",
      category: "math",
      subcategories: ["set_theory", "algebra"],
      pos: "adj.",
      definition: "A function where distinct elements map to distinct elements: f(a) = f(b) implies a = b.",
      examples: [{ fr: "Une application linéaire est injective si et seulement si son noyau est réduit au vecteur nul.", en: "A linear map is injective if and only if its kernel is reduced to the zero vector." }]
    },
    {
      fr: "surjectif",
      en: "surjective / onto",
      category: "math",
      subcategories: ["set_theory", "algebra"],
      pos: "adj.",
      definition: "A function whose image equals its codomain: for every y, there exists x such that f(x) = y.",
      examples: [{ fr: "Une application est bijective si elle est à la fois injective et surjective.", en: "A map is bijective if it is both injective and surjective." }]
    },
    {
      fr: "bijectif",
      en: "bijective / one-to-one correspondence",
      category: "math",
      subcategories: ["set_theory", "algebra"],
      pos: "adj.",
      definition: "A function that is both injective and surjective, establishing a one-to-one correspondence.",
      examples: [{ fr: "Une bijection continue entre deux espaces compacts est un homéomorphisme.", en: "A continuous bijection between two compact spaces is a homeomorphism." }]
    },
    {
      fr: "loi de probabilité",
      en: "probability distribution",
      category: "math",
      subcategories: ["probability"],
      pos: "n.f.",
      definition: "A mathematical function that gives the probabilities of occurrence of different possible outcomes for an experiment.",
      examples: [{ fr: "La loi de Poisson modélise les événements rares survenant à taux constant.", en: "The Poisson distribution models rare events occurring at a constant rate." }]
    },
    {
      fr: "loi normale",
      en: "normal distribution / Gaussian distribution",
      category: "math",
      subcategories: ["probability", "statistics"],
      pos: "n.f.",
      definition: "A bell-shaped continuous probability distribution symmetric about its mean: 𝒩(μ, σ^2).",
      examples: [{ fr: "Le théorème central limite explique l'omniprésence de la loi normale dans la nature.", en: "The central limit theorem explains the ubiquity of the normal distribution in nature." }]
    },
    {
      fr: "loi forte des grands nombres",
      en: "strong law of large numbers",
      category: "math",
      subcategories: ["probability"],
      pos: "n.f.",
      definition: "States that the sample average converges almost surely to the expected value: (1/n) ∑ X_i → 𝔼[X] a.s.",
      examples: [{ fr: "La loi forte des grands nombres garantit la convergence presque sûre de la moyenne empirique.", en: "The strong law of large numbers guarantees the almost sure convergence of the sample average." }]
    },
    {
      fr: "théorème central limite",
      en: "central limit theorem (CLT)",
      category: "math",
      subcategories: ["probability"],
      pos: "n.m.",
      definition: "States that under mild conditions, the sum of a large number of independent random variables tends toward a normal distribution.",
      note: "Abbreviated 'TCL' in French, 'CLT' in English.",
      examples: [{ fr: "Le théorème central limite est fondamental pour la construction des tests statistiques.", en: "The central limit theorem is fundamental for constructing statistical tests." }]
    },
    {
      fr: "intervalle de confiance",
      en: "confidence interval",
      category: "math",
      subcategories: ["statistics"],
      pos: "n.m.",
      definition: "An estimated range of values that is likely to include an unknown population parameter, with a specified confidence level (e.g. 95%).",
      examples: [{ fr: "On calcule un intervalle de confiance asymptotique à 95% pour la proportion.", en: "We compute a 95% asymptotic confidence interval for the proportion." }]
    },
    {
      fr: "maximum de vraisemblance",
      en: "maximum likelihood",
      alt: ["maximum likelihood estimation (MLE)"],
      category: "math",
      subcategories: ["statistics"],
      pos: "n.m.",
      definition: "A method of estimating the parameters of an assumed probability distribution, given some observed data.",
      examples: [{ fr: "L'estimateur du maximum de vraisemblance est asymptotiquement sans biais et efficace.", en: "The maximum likelihood estimator is asymptotically unbiased and efficient." }]
    },
    {
      fr: "réseau de neurones",
      en: "neural network",
      alt: ["artificial neural network"],
      category: "ai",
      subcategories: ["deep_learning"],
      pos: "n.m.",
      definition: "A computational model inspired by the biological neural networks that constitute animal brains.",
      examples: [{ fr: "Un réseau de neurones multicouche est un approximateur universel de fonctions continues.", en: "A multilayer neural network is a universal approximator of continuous functions." }]
    },
    {
      fr: "couche cachée",
      en: "hidden layer",
      category: "ai",
      subcategories: ["deep_learning"],
      pos: "n.f.",
      definition: "A layer between the input layer and the output layer in a neural network where artificial neurons take in a set of weighted inputs and produce an output through an activation function.",
      examples: [{ fr: "L'ajout de couches cachées permet d'apprendre des représentations hiérarchiques.", en: "Adding hidden layers allows learning hierarchical representations." }]
    },
    {
      fr: "fonction d'activation",
      en: "activation function",
      category: "ai",
      subcategories: ["deep_learning"],
      pos: "n.f.",
      definition: "A mathematical function added to an artificial neural network in order to help the network learn non-linear patterns in the data (e.g. ReLU, GELU, sigmoid).",
      examples: [{ fr: "La fonction d'activation ReLU évite le problème de la disparition du gradient.", en: "The ReLU activation function avoids the vanishing gradient problem." }]
    },
    {
      fr: "grand modèle de langage",
      en: "large language model (LLM)",
      alt: ["LLM"],
      category: "ai",
      subcategories: ["nlp", "generative_ai"],
      pos: "n.m.",
      definition: "A computational model notable for its ability to achieve general-purpose language generation and understanding, trained on vast corpora of text.",
      examples: [{ fr: "Les grands modèles de langage sont pré-entraînés sur des milliards de jetons.", en: "Large language models are pre-trained on billions of tokens." }]
    },
    {
      fr: "invite",
      en: "prompt",
      category: "ai",
      subcategories: ["nlp", "generative_ai"],
      pos: "n.f.",
      definition: "Natural language input supplied to an AI model to guide its generation.",
      note: "Formal French translation of 'prompt'.",
      examples: [{ fr: "L'ingénierie d'invites optimise les requêtes adressées aux modèles génératifs.", en: "Prompt engineering optimizes queries submitted to generative models." }]
    },
    {
      fr: "validation croisée",
      en: "cross-validation",
      category: "ai",
      subcategories: ["machine_learning"],
      pos: "n.f.",
      definition: "A resampling technique used to evaluate machine learning models on a limited data sample (e.g. k-fold cross-validation).",
      examples: [{ fr: "Une validation croisée à 5 blocs évalue la capacité de généralisation du modèle.", en: "A 5-fold cross-validation evaluates the generalization capability of the model." }]
    },
    {
      fr: "arbre binaire de recherche",
      en: "binary search tree (BST)",
      alt: ["BST", "ABR"],
      category: "cs",
      subcategories: ["data_structures"],
      pos: "n.m.",
      definition: "A rooted binary tree data structure with the key of each internal node being greater than all keys in the left subtree and less than those in the right subtree.",
      examples: [{ fr: "La recherche dans un arbre binaire de recherche équilibré s'effectue en O(log n).", en: "Search in a balanced binary search tree takes O(log n) time." }]
    },
    {
      fr: "recherche dichotomique",
      en: "binary search",
      category: "cs",
      subcategories: ["algorithms"],
      pos: "n.f.",
      definition: "A search algorithm that finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.",
      examples: [{ fr: "La recherche dichotomique nécessite que le tableau soit préalablement trié.", en: "Binary search requires that the array be sorted beforehand." }]
    },
    {
      fr: "tri rapide",
      en: "quicksort",
      category: "cs",
      subcategories: ["algorithms"],
      pos: "n.m.",
      definition: "An efficient divide-and-conquer sorting algorithm that partitions an array around a pivot element.",
      examples: [{ fr: "Le tri rapide a une complexité moyenne en O(n log n).", en: "Quicksort has an average-case complexity of O(n log n)." }]
    },
    {
      fr: "tri par fusion",
      en: "merge sort",
      category: "cs",
      subcategories: ["algorithms"],
      pos: "n.m.",
      definition: "A stable divide-and-conquer comparison-based sorting algorithm with guaranteed O(n log n) worst-case time.",
      examples: [{ fr: "Le tri par fusion garantit un temps d'exécution en O(n log n) dans le pire des cas.", en: "Merge sort guarantees an O(n log n) runtime in the worst case." }]
    },
    {
      fr: "graphe orienté",
      en: "directed graph / digraph",
      category: "cs",
      subcategories: ["graph_theory"],
      pos: "n.m.",
      definition: "A graph in which edges have orientations (arrows from one vertex to another).",
      examples: [{ fr: "Un graphe orienté sans cycle est appelé un DAG (Directed Acyclic Graph).", en: "A directed acyclic graph is called a DAG." }]
    },
    {
      fr: "parcours en largeur",
      en: "breadth-first search (BFS)",
      alt: ["BFS"],
      category: "cs",
      subcategories: ["algorithms", "graph_theory"],
      pos: "n.m.",
      definition: "An algorithm for traversing or searching tree or graph data structures, exploring all neighbor nodes at the present depth prior to moving on to nodes at the next depth level.",
      examples: [{ fr: "Le parcours en largeur permet de trouver le chemin le plus court dans un graphe non pondéré.", en: "Breadth-first search finds the shortest path in an unweighted graph." }]
    },
    {
      fr: "parcours en profondeur",
      en: "depth-first search (DFS)",
      alt: ["DFS"],
      category: "cs",
      subcategories: ["algorithms", "graph_theory"],
      pos: "n.m.",
      definition: "An algorithm for traversing or searching tree or graph data structures, exploring as far as possible along each branch before backtracking.",
      examples: [{ fr: "Le parcours en profondeur permet de détecter la présence de cycles dans un graphe.", en: "Depth-first search enables the detection of cycles in a graph." }]
    },
    {
      fr: "mémoire virtuelle",
      en: "virtual memory",
      category: "cs",
      subcategories: ["operating_systems"],
      pos: "n.f.",
      definition: "A memory management capability of an operating system that uses hardware and software to allow a computer to address more memory than is physically available.",
      examples: [{ fr: "La mémoire virtuelle isole l'espace d'adressage de chaque processus pour des raisons de sécurité.", en: "Virtual memory isolates each process's address space for security reasons." }]
    },
    {
      fr: "défaut de page",
      en: "page fault",
      category: "cs",
      subcategories: ["operating_systems"],
      pos: "n.m.",
      definition: "An exception raised by computer hardware when a running program accesses a memory page that is mapped in the virtual address space, but not loaded in physical RAM.",
      examples: [{ fr: "Un défaut de page déclenche une interruption matérielle transférant le contrôle au système d'exploitation.", en: "A page fault triggers a hardware interrupt transferring control to the OS." }]
    },
    {
      fr: "appel système",
      en: "system call / syscall",
      category: "cs",
      subcategories: ["operating_systems"],
      pos: "n.m.",
      definition: "The programmatic way in which a computer program requests a service from the kernel of the operating system.",
      examples: [{ fr: "L'instruction de lecture ou d'écriture de fichier invoque un appel système.", en: "A file read or write instruction invokes a system call." }]
    },
    {
      fr: "verrou",
      en: "lock / mutex",
      alt: ["mutex"],
      category: "cs",
      subcategories: ["concurrency"],
      pos: "n.m.",
      definition: "A synchronization primitive that enforces limits on access to a resource when there are many execution threads.",
      examples: [{ fr: "Un fil d'exécution doit acquérir le verrou avant de modifier la variable partagée.", en: "A thread must acquire the lock before modifying the shared variable." }]
    },
    {
      fr: "condition de course",
      en: "race condition",
      category: "cs",
      subcategories: ["concurrency"],
      pos: "n.f.",
      definition: "An undesirable situation that occurs when a device or system attempts to perform two or more operations at the same time, but because of the nature of the device or system, the operations must be done in the proper sequence.",
      examples: [{ fr: "L'utilisation de sections critiques protégées par mutex prévient les conditions de course.", en: "Using critical sections protected by mutexes prevents race conditions." }]
    },
    {
      fr: "longueur d'onde",
      en: "wavelength",
      category: "science",
      subcategories: ["physics", "waves"],
      pos: "n.f.",
      definition: "The distance between successive crests of a wave: λ = v / f.",
      examples: [{ fr: "La longueur d'onde de la lumière visible s'étend de 400 nm à 700 nm environ.", en: "The wavelength of visible light ranges from approximately 400 nm to 700 nm." }]
    },
    {
      fr: "fréquence",
      en: "frequency",
      category: "science",
      subcategories: ["physics"],
      pos: "n.f.",
      definition: "The number of occurrences of a repeating event per unit of time (Hertz, Hz).",
      examples: [{ fr: "L'énergie d'un photon est proportionnelle à sa fréquence : E = hν.", en: "The energy of a photon is proportional to its frequency: E = hν." }]
    },
    {
      fr: "champ magnétique",
      en: "magnetic field",
      category: "science",
      subcategories: ["physics", "electromagnetism"],
      pos: "n.m.",
      definition: "A vector field that describes the magnetic influence on moving electric charges, electric currents, and magnetic materials (B).",
      examples: [{ fr: "La force de Lorentz s'exprime par F = q(E + v ∧ B).", en: "The Lorentz force is given by F = q(E + v × B)." }]
    },
    {
      fr: "champ électrique",
      en: "electric field",
      category: "science",
      subcategories: ["physics", "electromagnetism"],
      pos: "n.m.",
      definition: "A vector field surrounding an electric charge that exerts force on other charges (E).",
      examples: [{ fr: "D'après la loi de Gauss, le flux du champ électrique à travers une surface fermée dépend de la charge enfermée.", en: "By Gauss's law, the electric field flux through a closed surface depends on the enclosed charge." }]
    },
    {
      fr: "relativité générale",
      en: "general relativity",
      category: "science",
      subcategories: ["physics", "relativity"],
      pos: "n.f.",
      definition: "Einstein's geometric theory of gravitation, describing gravity not as a force, but as a curvature of spacetime caused by mass and energy.",
      examples: [{ fr: "Les équations de champ d'Einstein forment le cœur de la relativité générale.", en: "Einstein's field equations form the core of general relativity." }]
    },
    {
      fr: "relativité restreinte",
      en: "special relativity",
      category: "science",
      subcategories: ["physics", "relativity"],
      pos: "n.f.",
      definition: "The theory of the relationship between space and time for objects moving at a constant speed in a straight line.",
      examples: [{ fr: "En relativité restreinte, la vitesse de la lumière dans le vide est invariante dans tous les référentiels inertiels.", en: "In special relativity, the speed of light in a vacuum is invariant in all inertial frames of reference." }]
    }
  ];

  // Master Database Class
  class FrenchScienceDictionary {
    constructor() {
      this.entries = [];
      this.exactMap = new Map();
      this.normMap = new Map();
      this.enToFrMap = new Map();
      this.initialized = false;
    }

    init() {
      if (this.initialized) return;

      const all = [];

      // Add terms from external scripts if present
      if (typeof SCIENCE_TERMS !== 'undefined' && Array.isArray(SCIENCE_TERMS)) {
        all.push(...SCIENCE_TERMS);
      }
      if (typeof ACADEMIC_FRENCH !== 'undefined' && Array.isArray(ACADEMIC_FRENCH)) {
        all.push(...ACADEMIC_FRENCH);
      }
      all.push(...EXTENDED_ENTRIES);

      // Deduplicate by normalized French term while preserving distinct domain senses and metadata
      this.entries = [];

      for (const entry of all) {
        if (!entry || !entry.fr || !entry.en) continue;
        const normKey = normalizeText(entry.fr);

        if (this.normMap.has(normKey)) {
          const existing = this.normMap.get(normKey);

          // Ensure existing entry has senses array initialized if not present
          if (!existing.senses) {
            existing.senses = [{
              id: existing.id || `${normKey}-1`,
              domain: existing.domain || (existing.subcategories && existing.subcategories[0]) || existing.category,
              category: existing.category,
              translation: existing.en,
              definition: existing.definition || '',
              note: existing.note || ''
            }];
          }

          // If entry has explicit senses, merge them
          if (entry.senses && Array.isArray(entry.senses)) {
            for (const s of entry.senses) {
              if (!existing.senses.some(es => es.translation.toLowerCase() === s.translation.toLowerCase() && es.domain === s.domain)) {
                existing.senses.push(s);
              }
            }
          } else {
            // Check if this incoming entry represents a new sense (different translation or domain)
            const isDifferentSense = !existing.senses.some(es =>
              es.translation.toLowerCase() === entry.en.toLowerCase()
            );
            if (isDifferentSense) {
              existing.senses.push({
                id: entry.id || `${normKey}-${existing.senses.length + 1}`,
                domain: entry.domain || (entry.subcategories && entry.subcategories[0]) || entry.category,
                category: entry.category,
                translation: entry.en,
                definition: entry.definition || '',
                note: entry.note || ''
              });
            }
          }

          // Merge alternative translations
          if (entry.alt && Array.isArray(entry.alt)) {
            existing.alt = existing.alt || [];
            for (const a of entry.alt) {
              if (!existing.alt.includes(a)) existing.alt.push(a);
            }
          }

          // Merge synonyms
          if (entry.synonyms && Array.isArray(entry.synonyms)) {
            existing.synonyms = existing.synonyms || [];
            for (const syn of entry.synonyms) {
              if (!existing.synonyms.includes(syn)) existing.synonyms.push(syn);
            }
          }

          // Merge examples without duplicating
          if (entry.examples && Array.isArray(entry.examples)) {
            existing.examples = existing.examples || [];
            for (const ex of entry.examples) {
              if (!existing.examples.some(e => e.fr === ex.fr)) {
                existing.examples.push(ex);
              }
            }
          }

          // Merge subcategories
          if (entry.subcategories && Array.isArray(entry.subcategories)) {
            existing.subcategories = existing.subcategories || [];
            for (const sub of entry.subcategories) {
              if (!existing.subcategories.includes(sub)) existing.subcategories.push(sub);
            }
          }

          // Merge citations / source metadata
          if (entry.source && !existing.source) {
            existing.source = entry.source;
          }

          // Continue without creating duplicate top-level entry
          continue;
        }

        this.entries.push(entry);

        // Populate lookup maps
        const frLower = entry.fr.toLowerCase().trim();
        this.exactMap.set(frLower, entry);
        this.normMap.set(normKey, entry);

        const frStripped = stripArticlesAndElision(entry.fr);
        if (frStripped !== entry.fr) {
          const strippedLower = frStripped.toLowerCase();
          const strippedNorm = normalizeText(frStripped);
          if (!this.exactMap.has(strippedLower)) this.exactMap.set(strippedLower, entry);
          if (!this.normMap.has(strippedNorm)) this.normMap.set(strippedNorm, entry);
        }

        // English reverse index
        const enLower = entry.en.toLowerCase().trim();
        this.enToFrMap.set(enLower, entry);

        // Split by / or ; or , to index individual translation alternatives
        const enParts = entry.en.split(/[\/,;()]+/).map(p => p.trim().toLowerCase()).filter(p => p.length >= 2);
        for (const part of enParts) {
          if (!this.enToFrMap.has(part)) {
            this.enToFrMap.set(part, entry);
          }
        }

        if (entry.alt) {
          for (const a of entry.alt) {
            this.enToFrMap.set(a.toLowerCase().trim(), entry);
          }
        }

        if (entry.senses && Array.isArray(entry.senses)) {
          for (const s of entry.senses) {
            if (s.translation) {
              const transLower = s.translation.toLowerCase().trim();
              if (!this.enToFrMap.has(transLower)) {
                this.enToFrMap.set(transLower, entry);
              }
            }
          }
        }
      }

      // Sort entries by length of French term descending for greedy phrase matching
      this.sortedPhrases = [...this.entries].sort((a, b) => b.fr.length - a.fr.length);

      this.initialized = true;
    }

    /**
     * Primary lookup: looks up a selected word or phrase
     * Returns the best matching Entry or null
     */
    lookup(text) {
      if (!this.initialized) this.init();
      if (!text || typeof text !== 'string') return null;

      // 0. Clean outer boundary punctuation (commas, periods, colons, brackets, quotes)
      const cleaned = stripBoundaryPunctuation(text);
      if (!cleaned || cleaned.length < 2) return null;

      // 1. Direct match on cleaned input
      const lower = cleaned.toLowerCase();
      if (this.exactMap.has(lower)) {
        return this.exactMap.get(lower);
      }

      // 2. Normalized match (accents removed)
      const norm = normalizeText(cleaned);
      if (this.normMap.has(norm)) {
        return this.normMap.get(norm);
      }

      // 3. Morphological candidates (stemming, plurals, elisions, feminine endings)
      const candidates = generateMorphologicalCandidates(cleaned);
      for (const cand of candidates) {
        const cLower = cand.toLowerCase();
        if (this.exactMap.has(cLower)) {
          return this.exactMap.get(cLower);
        }
        const cNorm = normalizeText(cand);
        if (this.normMap.has(cNorm)) {
          return this.normMap.get(cNorm);
        }
      }

      // 4. Exact English to French reverse lookup
      if (this.enToFrMap.has(lower)) {
        return this.enToFrMap.get(lower);
      }
      if (this.enToFrMap.has(norm)) {
        return this.enToFrMap.get(norm);
      }

      // 5. Multi-word sub-phrase match with punctuation boundary normalization:
      // Handles complete sentences or clauses like "La valeur propre, notée λ, ..."
      // Replaces clause-separating punctuation with spaces to ensure exact token boundary matches
      const phraseNormInput = ' ' + tokenizePhraseForSubphraseMatch(cleaned) + ' ';
      for (const entry of this.sortedPhrases) {
        const entryNorm = tokenizePhraseForSubphraseMatch(entry.fr);
        if (entryNorm.length >= 3 && phraseNormInput.includes(' ' + entryNorm + ' ')) {
          return entry;
        }
      }

      return null;
    }

    /**
     * Fuzzy / Prefix Search for Popup autocomplete
     * Indexes headword, translation, alt translations, synonyms, domain senses, definitions, and examples
     */
    search(query, category = 'all', limit = 20) {
      if (!this.initialized) this.init();
      if (!query || typeof query !== 'string') return [];

      const qClean = stripBoundaryPunctuation(query);
      const qNorm = normalizeText(qClean || query);
      if (!qNorm) return [];

      const results = [];
      for (const entry of this.entries) {
        if (category !== 'all' && entry.category !== category) {
          continue;
        }

        const frNorm = normalizeText(entry.fr);
        const enNorm = normalizeText(entry.en);

        let score = 0;
        if (frNorm === qNorm || enNorm === qNorm) {
          score = 100; // Exact headword / primary translation
        } else if (frNorm.startsWith(qNorm) || enNorm.startsWith(qNorm)) {
          score = 80; // Prefix match in French headword or English
        } else if (frNorm.includes(qNorm) || enNorm.includes(qNorm)) {
          score = 60; // Substring in headword or English
        } else if (entry.alt && entry.alt.some(a => normalizeText(a).includes(qNorm))) {
          score = 50; // Match in alternative English translation
        } else if (entry.synonyms && entry.synonyms.some(s => normalizeText(s).includes(qNorm))) {
          score = 45; // Match in French synonyms
        } else if (entry.senses && entry.senses.some(s =>
          (s.translation && normalizeText(s.translation).includes(qNorm)) ||
          (s.domain && normalizeText(s.domain).includes(qNorm)) ||
          (s.definition && normalizeText(s.definition).includes(qNorm)) ||
          (s.note && normalizeText(s.note).includes(qNorm))
        )) {
          score = 40; // Match in domain-specific senses
        } else if (entry.definition && normalizeText(entry.definition).includes(qNorm)) {
          score = 30; // Match in definition text
        } else if (entry.examples && entry.examples.some(ex =>
          (ex.fr && normalizeText(ex.fr).includes(qNorm)) ||
          (ex.en && normalizeText(ex.en).includes(qNorm))
        )) {
          score = 20; // Match in authentic example sentences
        }

        if (score > 0) {
          results.push({ entry, score });
        }
      }

      results.sort((a, b) => b.score - a.score || a.entry.fr.localeCompare(b.entry.fr));
      return results.slice(0, limit).map(r => r.entry);
    }

    /**
     * Get Word / Concept of the day
     */
    getWordOfTheDay() {
      if (!this.initialized) this.init();
      const today = new Date();
      // deterministic daily index
      const dayIndex = (today.getFullYear() * 365 + today.getMonth() * 31 + today.getDate()) % this.entries.length;
      return this.entries[dayIndex] || this.entries[0];
    }

    /**
     * Get Category Statistics
     */
    getStats() {
      if (!this.initialized) this.init();
      const stats = { total: this.entries.length, math: 0, ai: 0, cs: 0, science: 0, general: 0 };
      for (const e of this.entries) {
        if (stats[e.category] !== undefined) {
          stats[e.category]++;
        }
      }
      return stats;
    }
  }

  // Instantiate singleton
  const dict = new FrenchScienceDictionary();
  dict.init();

  // Expose globally
  global.FrenchScienceDict = dict;
  global.FrenchScienceNormalize = normalizeText;
  global.FrenchScienceStrip = stripArticlesAndElision;
  global.FrenchScienceStripPunct = stripBoundaryPunctuation;
  global.FrenchScienceTokenizePhrase = tokenizePhraseForSubphraseMatch;

})(typeof window !== 'undefined' ? window : globalThis);
