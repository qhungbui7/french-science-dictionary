# French Science Dictionary: Lexicon Specification

This document details the data schema, linguistic specifications, domain taxonomies, and academic reference citations for the French Science Dictionary database.

---

## 1. Lexicon Entry Schema

Every entry in the dictionary conforms to the following strict schema:

```typescript
interface ScienceTermSense {
  id: string;              // Stable unique identifier (e.g. 'variete-diff-geom')
  domain: string;          // Human-readable discipline name (e.g. 'Differential Geometry')
  category: 'math' | 'ai' | 'cs' | 'science' | 'general';
  translation: string;     // Contextual English scientific translation
  definition?: string;     // Discipline-specific definition
  note?: string;           // Precision warning or notation caveat
}

interface ScienceTermEntry {
  fr: string;              // French headword in standard citation form
  en: string;              // Primary precision English scientific translation
  alt?: string[];          // Authorized alternative / synonymous English terms
  category: 'math' | 'ai' | 'cs' | 'science' | 'general';
  subcategories?: string[]; // Granular discipline tags (e.g., 'linear_algebra', 'topology')
  pos?: string;            // Part of speech (e.g., 'n.m.', 'n.f.', 'adj.', 'v.', 'loc. adv.')
  definition?: string;     // Rigorous English scientific definition
  note?: string;           // Domain caveat / false friend warning
  source?: string;         // Primary bibliographic or textbook source citation (e.g., Bourbaki, Schwartz, Serre)
  senses?: ScienceTermSense[]; // Explicit multi-sense taxonomy across disciplines
  examples?: {
    fr: string;            // French usage sentence
    en: string;            // Accurate corresponding English translation
    source?: string;       // Bibliographic reference or page citation
    type?: 'citation' | 'illustrative'; // 'citation' = verbatim literature excerpt; 'illustrative' = standardized pedagogical sentence
  }[];
  synonyms?: string[];     // French synonyms or alternate orthographies
  antonyms?: string[];     // Direct conceptual opposites (e.g., ouvert <-> fermé)
}
```

### Provenance Classification Standards:
- **Canonical Terminology Source (`entry.source`)**: Bibliographic attribution specifying the treatise, monograph, or textbook establishing the canonical French-to-English terminological correspondence (e.g. *Bourbaki Algèbre*, *Schwartz Topologie*, *Hartshorne Algebraic Geometry*).
- **Verbatim Excerpts (`type: 'citation'`)**: Literal, authentic sentences quoted directly from cited French mathematical monographs, textbooks, or journal articles.
- **Pedagogical Sentences (`type: 'illustrative'`)**: Standardized illustrative examples constructed to demonstrate correct grammatical agreement, prepositional usage (e.g., *converger vers*, *tendre vers*, *s'annuler en*), and mathematical phrasing commonly encountered in university lecture notes.

---

## 2. Cataloged Lexicon by Domain

### 2.1 Mathematics: Linear & Multilinear Algebra

| French Headword | POS | Primary English Translation | Discipline Subcategory | Key Caveat / Note |
| :--- | :--- | :--- | :--- | :--- |
| **valeur propre** | n.f. | eigenvalue | linear_algebra, spectral_theory | "propre" = characteristic / eigen. Do not translate as clean value. |
| **vecteur propre** | n.m. | eigenvector | linear_algebra, spectral_theory | Non-zero vector invariant in direction under $T$. |
| **sous-espace propre** | n.m. | eigenspace | linear_algebra | Subspace $\ker(T - \lambda I)$. |
| **espace vectoriel** | n.m. | vector space | linear_algebra | Abbreviated "ev" in French academic notes. |
| **sous-espace vectoriel** | n.m. | linear subspace | linear_algebra | Abbreviated "sev" in French academic notes. |
| **base canonique** | n.f. | canonical basis / standard basis | linear_algebra | Standard coordinate basis $(e_1, \dots, e_n)$. |
| **noyau** | n.m. | kernel / null space | linear_algebra, abstract_algebra | $\ker(f)$. Never translate as nucleus or core. |
| **image** | n.f. | image / range / column space | linear_algebra | Range or column space of matrix $A$. |
| **théorème du rang** | n.m. | rank-nullity theorem | linear_algebra | $\dim(\ker f) + \dim(\mathrm{Im} f) = \dim(E)$. |
| **matrice semblable** | n.f. | similar matrix | linear_algebra | Matrices related by similarity transform $P^{-1} A P$. |
| **matrice de passage** | n.f. | change-of-basis matrix | linear_algebra | Transition matrix between two coordinate systems. |
| **matrice orthogonale** | n.f. | orthogonal matrix | linear_algebra | Real matrix where $Q^T Q = I$. |
| **matrice unitaire** | n.f. | unitary matrix | linear_algebra | Complex matrix where $U^* U = I$. |
| **matrice symétrique** | n.f. | symmetric matrix | linear_algebra | Real matrix where $A^T = A$. |
| **matrice définie positive** | n.f. | positive-definite matrix | linear_algebra, optimization | $x^T M x > 0$ for all non-zero $x$. |
| **déterminant** | n.m. | determinant | linear_algebra | Scalar scaling factor of volume under transformation. |
| **polynôme caractéristique** | n.m. | characteristic polynomial | linear_algebra | $\det(A - \lambda I)$. Roots are eigenvalues. |
| **diagonalisable** | adj. | diagonalizable | linear_algebra | Possesses an eigenbasis. |
| **forme linéaire** | n.f. | linear functional / linear form | linear_algebra | Linear map from vector space $E \to K$. |
| **produit scalaire** | n.m. | dot product / inner product | linear_algebra | Positive-definite symmetric bilinear form. |
| **espace préhilbertien** | n.m. | inner product space | linear_algebra, functional_analysis | Vector space with inner product, before completion. |
| **endomorphisme** | n.m. | endomorphism | linear_algebra | Linear map from vector space to itself. |
| **isomorphisme** | n.m. | isomorphism | linear_algebra, abstract_algebra | Bijective structure-preserving map. |
| **automorphisme** | n.m. | automorphism | abstract_algebra | Isomorphism of an object onto itself. |

### 2.2 Mathematics: Abstract Algebra & Topology

| French Headword | POS | Primary English Translation | Discipline Subcategory | Key Caveat / Note |
| :--- | :--- | :--- | :--- | :--- |
| **corps** | n.m. | field / division ring | abstract_algebra | In algebra, "corps" = field. Never translate as body. |
| **corps fini** | n.m. | finite field / Galois field | abstract_algebra | Field of prime-power order $\mathbb{F}_q$. |
| **anneau** | n.m. | ring | abstract_algebra | Ring structure $(A, +, \cdot)$. |
| **idéal** | n.m. | ideal | abstract_algebra | Subring absorbing multiplication. |
| **espace métrique** | n.m. | metric space | topology | Set equipped with distance metric $d(x, y)$. |
| **espace topologique** | n.m. | topological space | topology | Set equipped with topology $\tau$. |
| **espace de Hilbert** | n.m. | Hilbert space | functional_analysis | Complete inner product space. |
| **espace de Banach** | n.m. | Banach space | functional_analysis | Complete normed vector space. |
| **adhérence** | n.f. | closure | topology | Topological closure $\bar{A}$. False friend: not adherence. |
| **variété** | n.f. | manifold / variety | differential_geometry, topology | Manifold in diff geom; algebraic variety in alg geom. |
| **recouvrement** | n.m. | covering / cover | topology | Collection of sets covering space. Not recovery. |
| **voisinage** | n.m. | neighborhood | topology | Set containing an open set around point. |
| **compact** | adj. | compact | topology | Every open cover admits a finite subcover. |
| **compacité** | n.f. | compactness | topology | Topological compactness property. |
| **connexe** | adj. | connected | topology | Cannot be partitioned into two disjoint open sets. |
| **connexe par arcs** | adj. | path-connected | topology | Any two points joinable by continuous path. |
| **dénombrable** | adj. | countable | set_theory, analysis | In bijection with subset of $\mathbb{N}$. |
| **point fixe** | n.m. | fixed point | analysis | Point where $f(x) = x$. |
| **densité** | n.f. | density | topology, probability | Dense set in topology; pdf in probability. |
| **injectif** | adj. | injective / one-to-one | set_theory | $f(a) = f(b) \implies a = b$. |
| **surjectif** | adj. | surjective / onto | set_theory | $\mathrm{Im}(f) = \text{codomain}$. |
| **bijectif** | adj. | bijective / one-to-one correspondence | set_theory | Injective and surjective simultaneously. |

### 2.3 Mathematics: Analysis & Measure Theory

| French Headword | POS | Primary English Translation | Discipline Subcategory | Key Caveat / Note |
| :--- | :--- | :--- | :--- | :--- |
| **développement limité** | n.m. | Taylor expansion / asymptotic expansion | analysis | Local polynomial approximation (DL). |
| **primitive** | n.f. | antiderivative | calculus | $F' = f$. English standardly uses antiderivative. |
| **théorème des accroissements finis** | n.m. | mean value theorem (MVT) | analysis | Abbreviated TAF in French. |
| **théorème des gendarmes** | n.m. | squeeze theorem / sandwich theorem | analysis | Encadrer par deux suites / fonctions. |
| **théorème des valeurs intermédiaires** | n.m. | intermediate value theorem (IVT) | analysis | Abbreviated TVI in French. |
| **borne supérieure** | n.f. | supremum (sup) | analysis | Least upper bound. |
| **borne inférieure** | n.f. | infimum (inf) | analysis | Greatest lower bound. |
| **majorant / minorant** | n.m. | upper bound / lower bound | analysis | Element bounding set from above/below. |
| **majoré / minoré** | adj. | bounded above / bounded below | analysis | Possessing an upper / lower bound. |
| **borné** | adj. | bounded | analysis | Contained within finite metric ball. |
| **suite** | n.f. | sequence | analysis | Ordered sequence $(u_n)$. Series = série. |
| **série entière** | n.f. | power series | analysis, complex_analysis | Series $\sum a_n (z - z_0)^n$. |
| **rayon de convergence** | n.m. | radius of convergence | analysis | Radius $R$ of disk of convergence. |
| **dérivée** | n.f. | derivative | calculus | Rate of change. |
| **dérivée partielle** | n.f. | partial derivative | multivariable_calculus | $\partial f / \partial x$. |
| **gradient** | n.m. | gradient | multivariable_calculus, optimization | $\nabla f$. Orthogonal to level sets. |
| **hessienne** | n.f. | Hessian matrix | multivariable_calculus, optimization | Matrix of second-order partial derivatives. |
| **jacobienne** | n.f. | Jacobian matrix | multivariable_calculus | Matrix of first-order partial derivatives. |
| **continuité uniforme** | n.f. | uniform continuity | analysis | $\delta$ independent of location $x$. |
| **s'annuler** | v. pron. | to vanish / to equal zero | analysis, algebra | Standard formal English: function vanishes. |
| **tribu** | n.f. | $\sigma$-algebra / $\sigma$-field | measure_theory, probability | Collection closed under complement and countable unions. |
| **variable aléatoire** | n.f. | random variable | probability | Measurable function $X: \Omega \to E$. |
| **espérance** | n.f. | expected value / expectation | probability | $\mathbb{E}[X]$. Never translate as hope. |
| **écart-type** | n.m. | standard deviation | statistics, probability | $\sigma = \sqrt{\mathrm{Var}(X)}$. |
| **estimateur sans biais** | n.m. | unbiased estimator | statistics | $\mathbb{E}[\hat{\theta}] = \theta$. |
| **loi de probabilité** | n.f. | probability distribution | probability | Distribution of random variable. |
| **loi normale** | n.f. | normal distribution / Gaussian | probability, statistics | Bell curve $\mathcal{N}(\mu, \sigma^2)$. |
| **loi forte des grands nombres** | n.f. | strong law of large numbers (SLLN) | probability | Sample average converges almost surely. |
| **théorème central limite** | n.m. | central limit theorem (CLT) | probability | Normalized sum converges to Gaussian. |
| **intervalle de confiance** | n.m. | confidence interval | statistics | Estimated range containing parameter. |
| **maximum de vraisemblance** | n.m. | maximum likelihood | statistics | Parameter estimation via likelihood maximization. |
| **presque sûrement** | loc. adv. | almost surely (a.s.) | probability | Occurs with probability 1. |
| **presque partout** | loc. adv. | almost everywhere (a.e.) | measure_theory | Holds outside measure-zero set. |

### 2.4 Artificial Intelligence & Machine Learning

| French Headword | POS | Primary English Translation | Discipline Subcategory | Key Caveat / Note |
| :--- | :--- | :--- | :--- | :--- |
| **apprentissage automatique** | n.m. | machine learning (ML) | machine_learning | Broad field of adaptive statistical algorithms. |
| **apprentissage profond** | n.m. | deep learning (DL) | deep_learning | Multi-layer neural representation learning. |
| **apprentissage par renforcement** | n.m. | reinforcement learning (RL) | reinforcement_learning | Agent-environment cumulative reward maximization. |
| **descente de gradient** | n.f. | gradient descent | optimization, deep_learning | First-order iterative optimization. |
| **descente de gradient stochastique**| n.f. | stochastic gradient descent (SGD) | optimization, deep_learning | Mini-batch gradient estimation. |
| **rétropropagation** | n.f. | backpropagation / backward pass | deep_learning | Chain-rule gradient evaluation. |
| **fonction de perte** | n.f. | loss function / cost function | machine_learning | Objective error measure. |
| **taux d'apprentissage** | n.m. | learning rate | optimization, deep_learning | Step size parameter $\eta$ or $\alpha$. |
| **surapprentissage** | n.m. | overfitting | machine_learning | Fitting training noise rather than true distribution. |
| **sous-apprentissage** | n.m. | underfitting | machine_learning | Insufficient model capacity to fit data. |
| **plongement** | n.m. | embedding | nlp, deep_learning | Continuous vector mapping (word/entity embedding). |
| **auto-attention** | n.f. | self-attention | deep_learning, nlp | Scaled dot-product intra-sequence attention. |
| **transformeur** | n.m. | transformer | deep_learning, nlp | Attention-based foundation architecture. |
| **espace latent** | n.m. | latent space | deep_learning, generative_ai | Compressed representation manifold. |
| **abandon** | n.m. | dropout | deep_learning, regularization | Random neuron deactivation for regularization. |
| **matrice de confusion** | n.f. | confusion matrix | evaluation_metrics | Contingency table of predictions vs ground truth. |
| **rappel** | n.m. | recall / sensitivity | evaluation_metrics | $\mathrm{TP} / (\mathrm{TP} + \mathrm{FN})$. |
| **précision** | n.f. | precision / positive predictive value | evaluation_metrics | $\mathrm{TP} / (\mathrm{TP} + \mathrm{FP})$. |
| **modèle génératif** | n.m. | generative model | generative_ai | Models joint distribution $P(X)$. |
| **ajustement fin** | n.m. | fine-tuning | deep_learning | Adapting pre-trained model on specific task. |
| **grand modèle de langage** | n.m. | large language model (LLM) | nlp, generative_ai | Massive transformer-based linguistic models. |
| **invite** | n.f. | prompt | nlp, generative_ai | Conditioning query to generative AI. |
| **validation croisée** | n.f. | cross-validation | machine_learning | K-fold data resampling validation technique. |
| **réseau de neurones** | n.m. | neural network | deep_learning | Interconnected artificial neuron architecture. |
| **couche cachée** | n.f. | hidden layer | deep_learning | Intermediate layer between input and output. |
| **fonction d'activation** | n.f. | activation function | deep_learning | Non-linear activation (ReLU, GELU, Sigmoid). |

### 2.5 Computer Science & Discrete Systems

| French Headword | POS | Primary English Translation | Discipline Subcategory | Key Caveat / Note |
| :--- | :--- | :--- | :--- | :--- |
| **table de hachage** | n.f. | hash table / hash map | data_structures | Associative array with hash indexing. |
| **tas** | n.m. | heap (binary heap) | data_structures | Binary/Fibonacci heap. Distinct from stack. |
| **pile** | n.f. | stack | data_structures | LIFO data structure. "tas" is heap; "pile" is stack. |
| **file** | n.f. | queue | data_structures | FIFO data structure. |
| **arbre couvrant minimal** | n.m. | minimum spanning tree (MST) | graph_theory, algorithms | Minimum total weight acyclic subgraph (Kruskal/Prim). |
| **complexité amortie** | n.f. | amortized complexity | algorithms, complexity | Average operation cost over worst-case sequence. |
| **programmation dynamique** | n.f. | dynamic programming (DP) | algorithms | Optimization via overlapping subproblems. |
| **interblocage** | n.m. | deadlock | operating_systems, concurrency | Circular wait among concurrent processes. |
| **exclusion mutuelle** | n.f. | mutual exclusion (mutex) | operating_systems, concurrency | Ensuring single-thread critical section access. |
| **fil d'exécution** | n.m. | thread | operating_systems | Light-weight unit of CPU scheduling. |
| **ramasse-miettes** | n.m. | garbage collector (GC) | runtime, compilers | Automatic heap memory management. |
| **problème de l'arrêt** | n.m. | halting problem | computability, theoretical_cs | Canonical undecidable decision problem (Turing). |
| **arbre binaire de recherche**| n.m. | binary search tree (BST) | data_structures | Binary search tree (ABR). |
| **recherche dichotomique** | n.f. | binary search | algorithms | $O(\log n)$ search on sorted arrays. |
| **tri rapide** | n.m. | quicksort | algorithms | Divide-and-conquer partition sorting. |
| **tri par fusion** | n.m. | merge sort | algorithms | Guaranteed $O(n \log n)$ stable sort. |
| **graphe orienté** | n.m. | directed graph / digraph | graph_theory | Graph with ordered pairs of vertices. |
| **parcours en largeur** | n.m. | breadth-first search (BFS) | algorithms, graph_theory | Level-by-level queue graph traversal. |
| **parcours en profondeur** | n.m. | depth-first search (DFS) | algorithms, graph_theory | Stack-based recursive graph traversal. |
| **mémoire virtuelle** | n.f. | virtual memory | operating_systems | Hardware-software address space abstraction. |
| **défaut de page** | n.m. | page fault | operating_systems | Interrupt when virtual page is not in physical RAM. |
| **appel système** | n.m. | system call / syscall | operating_systems | User space request to kernel service. |
| **verrou** | n.m. | lock / mutex | concurrency | Concurrency synchronization lock. |
| **condition de course** | n.f. | race condition | concurrency | Unsynchronized concurrent memory access conflict. |

### 2.6 Physics & Quantum Science

| French Headword | POS | Primary English Translation | Discipline Subcategory | Key Caveat / Note |
| :--- | :--- | :--- | :--- | :--- |
| **onde** | n.f. | wave | physics, waves | Propagating disturbance in physical field. |
| **fonction d'onde** | n.f. | wave function | quantum_mechanics | Quantum state description $\psi$. |
| **équation de Schrödinger** | n.f. | Schrödinger equation | quantum_mechanics | $i\hbar \partial\psi/\partial t = \hat{H}\psi$. |
| **principe d'incertitude** | n.m. | uncertainty principle | quantum_mechanics | Heisenberg limit: $\Delta x \Delta p \ge \hbar/2$. |
| **intrication quantique** | n.f. | quantum entanglement | quantum_mechanics | Non-separable quantum state correlations. |
| **effet tunnel** | n.m. | quantum tunneling | quantum_mechanics | Barrier penetration by quantum wave packet. |
| **entropie** | n.f. | entropy | thermodynamics, information_theory | $S = k \ln \Omega$ or Shannon information measure. |
| **longueur d'onde** | n.f. | wavelength | physics, waves | $\lambda = v / f$. |
| **fréquence** | n.f. | frequency | physics | Cycles per unit time (Hz). |
| **champ magnétique** | n.m. | magnetic field | electromagnetism | Vector field $\mathbf{B}$ acting on moving charges. |
| **champ électrique** | n.m. | electric field | electromagnetism | Vector field $\mathbf{E}$ exerting electrostatic force. |
| **relativité générale** | n.f. | general relativity | relativity, physics | Geometric theory of gravity via spacetime curvature. |
| **relativité restreinte** | n.f. | special relativity | relativity, physics | Invariant speed of light in inertial reference frames. |

---

## 3. Reference Literature & Citations

1. **Bourbaki, N.** *Éléments de mathématique : Algèbre*, Chapitres 1 à 10, Springer-Verlag.
2. **Bourbaki, N.** *Éléments de mathématique : Topologie générale*, Chapitres 1 à 10, Springer-Verlag.
3. **Schwartz, L.** *Théorie des distributions*, Hermann, Paris.
4. **Rudin, W.** *Principes d'analyse mathématique* (traduction française), Dunod.
5. **LeCun, Y., Bengio, Y., & Hinton, G.** *Deep Learning*, Nature 521, 436–444 (2015).
6. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** *Introduction à l'algorithmique* (traduction française), Dunod.
7. **Cohen-Tannoudji, C., Diu, B., & Laloë, F.** *Mécanique quantique*, Hermann, Paris.
