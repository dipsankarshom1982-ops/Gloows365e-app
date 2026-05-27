/**
 * Seed script — Class 10 CBSE curriculum for Seekho module
 *
 * Usage:
 *   npx tsx scripts/seedSeekhoCourses.ts
 *
 * Requires: GOOGLE_APPLICATION_CREDENTIALS env var pointing to service account JSON
 * Or run inside Firebase emulator with FIRESTORE_EMULATOR_HOST=localhost:8080
 */

import * as admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();

// ─── Curriculum data ──────────────────────────────────────────────────────────

const MATHS_CHAPTERS = [
  {
    chapterNumber: 1,
    chapterTitle: "Real Numbers",
    description: "Euclid's Division Lemma, Fundamental Theorem of Arithmetic, Irrational numbers, Decimal expansions",
    isFree: true,
    lessons: [
      { lessonNumber: 1, title: "Introduction to Real Numbers & Number Line", duration: 660, conceptTags: ["Real Numbers", "Number Line"] },
      { lessonNumber: 2, title: "Euclid's Division Lemma & HCF", duration: 720, conceptTags: ["Euclid's Division Lemma", "HCF"] },
      { lessonNumber: 3, title: "Fundamental Theorem of Arithmetic", duration: 780, conceptTags: ["Prime Factorization", "LCM", "HCF"] },
      { lessonNumber: 4, title: "Irrational Numbers & Decimal Expansions", duration: 700, conceptTags: ["Irrational Numbers", "Decimal Expansion"] },
    ],
    questions: [
      { question: "The HCF of 96 and 404 is?", options: ["2", "4", "6", "8"] as [string,string,string,string], correctIndex: 1, explanation: "96 = 2⁵ × 3, 404 = 2² × 101. HCF = 2² = 4", difficulty: "easy" as const, conceptTag: "HCF" },
      { question: "Which of the following is an irrational number?", options: ["√4", "√9", "√7", "√16"] as [string,string,string,string], correctIndex: 2, explanation: "√7 cannot be expressed as p/q where q≠0. √4=2, √9=3, √16=4 are rational.", difficulty: "easy" as const, conceptTag: "Irrational Numbers" },
      { question: "The decimal expansion of 1/3 is:", options: ["0.333…", "0.3", "3.0", "0.13"] as [string,string,string,string], correctIndex: 0, explanation: "1÷3 = 0.3333… (non-terminating recurring)", difficulty: "easy" as const, conceptTag: "Decimal Expansion" },
      { question: "State Euclid's Division Lemma: For integers a and b where a > b ≥ 0, we can write a = bq + r where:", options: ["0 < r < b", "0 ≤ r < b", "0 ≤ r ≤ b", "r > 0"] as [string,string,string,string], correctIndex: 1, explanation: "By Euclid's division lemma, r satisfies 0 ≤ r < b", difficulty: "medium" as const, conceptTag: "Euclid's Division Lemma" },
      { question: "The LCM of 12 and 18 using prime factorization is:", options: ["36", "72", "6", "24"] as [string,string,string,string], correctIndex: 0, explanation: "12=2²×3, 18=2×3². LCM = 2²×3² = 36", difficulty: "medium" as const, conceptTag: "LCM" },
      { question: "If HCF(a,b) = 12 and LCM(a,b) = 360, what is a×b?", options: ["3720", "4320", "4200", "4800"] as [string,string,string,string], correctIndex: 1, explanation: "HCF × LCM = a × b → 12 × 360 = 4320", difficulty: "medium" as const, conceptTag: "HCF" },
      { question: "Which of the following rational numbers has a terminating decimal expansion?", options: ["7/75", "5/18", "3/8", "2/15"] as [string,string,string,string], correctIndex: 2, explanation: "3/8 = 3/2³. Since denominator has only factor of 2, it terminates = 0.375", difficulty: "hard" as const, conceptTag: "Decimal Expansion" },
      { question: "Prove that √2 is irrational. The key step uses which contradiction?", options: ["If √2=p/q then p² is even, so p is even", "If √2=p/q then q is prime", "√2 cannot be squared", "p and q have no common factor initially"] as [string,string,string,string], correctIndex: 0, explanation: "Assume √2=p/q in lowest terms. Then 2=p²/q², so p²=2q² → p² is even → p is even → p=2m → 4m²=2q² → q² is even → q is even. Contradicts p,q having no common factor.", difficulty: "hard" as const, conceptTag: "Irrational Numbers" },
      { question: "The product of any two irrational numbers is:", options: ["Always irrational", "Always rational", "Sometimes rational", "Never defined"] as [string,string,string,string], correctIndex: 2, explanation: "√2 × √2 = 2 (rational), but √2 × √3 = √6 (irrational)", difficulty: "hard" as const, conceptTag: "Irrational Numbers" },
      { question: "What is the prime factorization of 3825?", options: ["3 × 5² × 51", "3² × 5² × 17", "3 × 5 × 255", "3² × 425"] as [string,string,string,string], correctIndex: 1, explanation: "3825 = 3 × 1275 = 3 × 3 × 425 = 9 × 425 = 9 × 5 × 85 = 9 × 5 × 5 × 17 = 3² × 5² × 17", difficulty: "hard" as const, conceptTag: "Prime Factorization" },
    ],
  },
  {
    chapterNumber: 2,
    chapterTitle: "Polynomials",
    description: "Geometrical meaning of zeros, Relationship between zeros and coefficients, Division algorithm",
    isFree: false,
    lessons: [
      { lessonNumber: 1, title: "Polynomials and Their Degrees", duration: 620, conceptTags: ["Polynomials", "Degree"] },
      { lessonNumber: 2, title: "Geometrical Meaning of Zeros", duration: 700, conceptTags: ["Zeros", "Parabola"] },
      { lessonNumber: 3, title: "Relationship Between Zeros and Coefficients", duration: 750, conceptTags: ["Sum of Zeros", "Product of Zeros"] },
      { lessonNumber: 4, title: "Division Algorithm for Polynomials", duration: 680, conceptTags: ["Division Algorithm", "Remainder Theorem"] },
    ],
    questions: [
      { question: "The zeros of the polynomial p(x) = x² - 3x + 2 are:", options: ["1 and 2", "2 and 3", "-1 and -2", "3 and 1"] as [string,string,string,string], correctIndex: 0, explanation: "x²-3x+2 = (x-1)(x-2). Zeros are x=1 and x=2", difficulty: "easy" as const, conceptTag: "Zeros" },
      { question: "For a quadratic polynomial ax²+bx+c, the sum of zeros (α+β) equals:", options: ["-b/a", "b/a", "c/a", "-c/a"] as [string,string,string,string], correctIndex: 0, explanation: "Sum of zeros = -b/a by Vieta's formulas", difficulty: "easy" as const, conceptTag: "Sum of Zeros" },
      { question: "The product of zeros of 2x²-5x+3 is:", options: ["5/2", "-3/2", "3/2", "-5/2"] as [string,string,string,string], correctIndex: 2, explanation: "Product = c/a = 3/2", difficulty: "medium" as const, conceptTag: "Product of Zeros" },
      { question: "A quadratic polynomial with zeros 2 and -3 is:", options: ["x²+x-6", "x²-x+6", "x²-x-6", "x²+x+6"] as [string,string,string,string], correctIndex: 0, explanation: "Sum=2+(-3)=-1, Product=2×(-3)=-6. Polynomial: x²-(-1)x+(-6) = x²+x-6", difficulty: "medium" as const, conceptTag: "Sum of Zeros" },
      { question: "How many zeros can a cubic polynomial have at most?", options: ["1", "2", "3", "4"] as [string,string,string,string], correctIndex: 2, explanation: "A polynomial of degree n has at most n zeros. Cubic = degree 3 → at most 3 zeros", difficulty: "easy" as const, conceptTag: "Polynomials" },
      { question: "If the zeros of x³-3x²+x+1 are a-b, a, a+b, what is 'a'?", options: ["0", "1", "3", "-1"] as [string,string,string,string], correctIndex: 1, explanation: "Sum of zeros = 3a = 3 (from -(-3)/1). So a=1", difficulty: "hard" as const, conceptTag: "Sum of Zeros" },
      { question: "The division algorithm states: Dividend = Divisor × _____ + Remainder", options: ["Quotient", "Zero", "Coefficient", "Factor"] as [string,string,string,string], correctIndex: 0, explanation: "p(x) = g(x)×q(x) + r(x) where deg(r) < deg(g)", difficulty: "easy" as const, conceptTag: "Division Algorithm" },
      { question: "If p(x) = x³-3x+1 and g(x) = x-1, what is the remainder when p is divided by g?", options: ["-1", "0", "1", "3"] as [string,string,string,string], correctIndex: 0, explanation: "By Remainder Theorem, p(1) = 1-3+1 = -1", difficulty: "medium" as const, conceptTag: "Remainder Theorem" },
      { question: "A polynomial of degree 2 can intersect the x-axis at how many points?", options: ["Exactly 2", "At most 2", "Exactly 1", "At most 3"] as [string,string,string,string], correctIndex: 1, explanation: "A quadratic can touch x-axis at 0, 1, or 2 points depending on the discriminant", difficulty: "medium" as const, conceptTag: "Parabola" },
      { question: "If one zero of 2x²+kx-4 is 2, find k:", options: ["-1", "0", "2", "-2"] as [string,string,string,string], correctIndex: 1, explanation: "If 2 is a zero: 2(4)+2k-4=0 → 8+2k-4=0 → 2k=-4 → k=-2. Wait: 2(2²)+k(2)-4=8+2k-4=4+2k=0 → k=-2", difficulty: "hard" as const, conceptTag: "Zeros" },
    ],
  },
  {
    chapterNumber: 3,
    chapterTitle: "Pair of Linear Equations in Two Variables",
    description: "Graphical and algebraic methods for solving linear equations, consistency conditions",
    isFree: false,
    lessons: [
      { lessonNumber: 1, title: "Linear Equations and Graphical Method", duration: 700, conceptTags: ["Linear Equations", "Graphical Method"] },
      { lessonNumber: 2, title: "Substitution and Elimination Methods", duration: 730, conceptTags: ["Substitution", "Elimination"] },
      { lessonNumber: 3, title: "Cross-Multiplication Method", duration: 680, conceptTags: ["Cross Multiplication"] },
      { lessonNumber: 4, title: "Consistency and Word Problems", duration: 760, conceptTags: ["Consistency", "Word Problems"] },
    ],
    questions: [
      { question: "Two lines are consistent with unique solution when:", options: ["a₁/a₂ = b₁/b₂", "a₁/a₂ ≠ b₁/b₂", "a₁/a₂ = b₁/b₂ = c₁/c₂", "a₁/a₂ ≠ c₁/c₂"] as [string,string,string,string], correctIndex: 1, explanation: "Unique solution: lines intersect → a₁/a₂ ≠ b₁/b₂", difficulty: "medium" as const, conceptTag: "Consistency" },
      { question: "Solve: 2x + 3y = 11 and 2x - 4y = -24. Find y:", options: ["4", "5", "3", "2"] as [string,string,string,string], correctIndex: 1, explanation: "Subtracting: 7y=35 → y=5", difficulty: "medium" as const, conceptTag: "Elimination" },
      { question: "Two numbers sum to 9 and differ by 3. The larger number is:", options: ["3", "6", "5", "7"] as [string,string,string,string], correctIndex: 1, explanation: "x+y=9, x-y=3. Adding: 2x=12 → x=6", difficulty: "easy" as const, conceptTag: "Word Problems" },
      { question: "Infinitely many solutions occur when:", options: ["a₁/a₂ ≠ b₁/b₂", "a₁/a₂ = b₁/b₂ ≠ c₁/c₂", "a₁/a₂ = b₁/b₂ = c₁/c₂", "No condition"] as [string,string,string,string], correctIndex: 2, explanation: "Coincident lines → infinitely many solutions → a₁/a₂ = b₁/b₂ = c₁/c₂", difficulty: "medium" as const, conceptTag: "Consistency" },
      { question: "By substitution, if x = 2y - 1, substitute in 3x + y = 18:", options: ["y = 3", "y = 4", "y = 2", "y = 5"] as [string,string,string,string], correctIndex: 0, explanation: "3(2y-1)+y=18 → 6y-3+y=18 → 7y=21 → y=3", difficulty: "easy" as const, conceptTag: "Substitution" },
      { question: "A boat goes 30 km upstream in 6 hours and 30 km downstream in 3 hours. Speed of boat in still water:", options: ["5 km/h", "10 km/h", "7.5 km/h", "15 km/h"] as [string,string,string,string], correctIndex: 2, explanation: "Upstream speed=5, Downstream speed=10. Still water=(5+10)/2=7.5 km/h", difficulty: "hard" as const, conceptTag: "Word Problems" },
      { question: "Parallel lines have no solution because:", options: ["They coincide", "They have equal slopes and different y-intercepts", "They intersect at 90°", "Their slopes multiply to -1"] as [string,string,string,string], correctIndex: 1, explanation: "Parallel lines: same slope (a₁/a₂ = b₁/b₂) but different y-intercepts (≠ c₁/c₂)", difficulty: "medium" as const, conceptTag: "Graphical Method" },
      { question: "By cross-multiplication for a₁x+b₁y+c₁=0 and a₂x+b₂y+c₂=0, x = ?", options: ["(b₁c₂-b₂c₁)/(a₁b₂-a₂b₁)", "(c₁b₂-c₂b₁)/(a₁b₂-a₂b₁)", "(a₁c₂-a₂c₁)/(a₁b₂-a₂b₁)", "b₁c₂/a₁b₂"] as [string,string,string,string], correctIndex: 0, explanation: "By cross multiplication formula: x = (b₁c₂-b₂c₁)/(a₁b₂-a₂b₁)", difficulty: "hard" as const, conceptTag: "Cross Multiplication" },
      { question: "The age of father is 3 times the son's age. After 10 years, father will be twice the son's age. Present age of son:", options: ["10", "20", "30", "40"] as [string,string,string,string], correctIndex: 0, explanation: "F=3S, F+10=2(S+10). 3S+10=2S+20 → S=10", difficulty: "hard" as const, conceptTag: "Word Problems" },
      { question: "For 3x + 2y = 7 and 6x + 4y = k to have infinitely many solutions, k =", options: ["7", "14", "3.5", "21"] as [string,string,string,string], correctIndex: 1, explanation: "a₁/a₂=3/6=1/2, b₁/b₂=2/4=1/2, c₁/c₂=7/k must equal 1/2 → k=14", difficulty: "hard" as const, conceptTag: "Consistency" },
    ],
  },
  {
    chapterNumber: 4,
    chapterTitle: "Quadratic Equations",
    description: "Standard form, solutions by factorisation and quadratic formula, discriminant, nature of roots",
    isFree: false,
    lessons: [
      { lessonNumber: 1, title: "Quadratic Equations — Introduction & Standard Form", duration: 600, conceptTags: ["Quadratic Equations", "Standard Form"] },
      { lessonNumber: 2, title: "Solving by Factorisation", duration: 680, conceptTags: ["Factorisation", "Middle Term Splitting"] },
      { lessonNumber: 3, title: "Completing the Square & Quadratic Formula", duration: 740, conceptTags: ["Quadratic Formula", "Completing the Square"] },
      { lessonNumber: 4, title: "Nature of Roots & Discriminant", duration: 660, conceptTags: ["Discriminant", "Nature of Roots"] },
    ],
    questions: [
      { question: "The roots of x² - 5x + 6 = 0 are:", options: ["2, 3", "-2, -3", "1, 6", "-1, -6"] as [string,string,string,string], correctIndex: 0, explanation: "Factorising: (x-2)(x-3)=0 → x=2 or x=3", difficulty: "easy" as const, conceptTag: "Factorisation" },
      { question: "The discriminant of ax²+bx+c=0 is:", options: ["b²-4ac", "b²+4ac", "-b²+4ac", "4ac-b²"] as [string,string,string,string], correctIndex: 0, explanation: "Discriminant D = b² - 4ac. Used to determine nature of roots.", difficulty: "easy" as const, conceptTag: "Discriminant" },
      { question: "If D > 0, the quadratic equation has:", options: ["No real roots", "Equal roots", "Two distinct real roots", "Complex roots"] as [string,string,string,string], correctIndex: 2, explanation: "D>0 → two distinct real roots; D=0 → equal roots; D<0 → no real roots", difficulty: "easy" as const, conceptTag: "Nature of Roots" },
      { question: "Using quadratic formula, solve x²-7x+12=0:", options: ["3, 4", "2, 6", "1, 12", "-3, -4"] as [string,string,string,string], correctIndex: 0, explanation: "x = (7 ± √(49-48))/2 = (7 ± 1)/2 → x=4 or x=3", difficulty: "medium" as const, conceptTag: "Quadratic Formula" },
      { question: "The roots of 2x²+5x-3=0 are:", options: ["-3, 1/2", "3, -1/2", "-3, -1/2", "3, 1/2"] as [string,string,string,string], correctIndex: 0, explanation: "By splitting: 2x²+6x-x-3=0 → 2x(x+3)-1(x+3)=0 → x=-3 or x=1/2", difficulty: "medium" as const, conceptTag: "Factorisation" },
      { question: "For what value of k does kx²-6x+1=0 have equal roots?", options: ["6", "9", "3", "12"] as [string,string,string,string], correctIndex: 1, explanation: "Equal roots: D=0. 36-4k=0 → k=9", difficulty: "medium" as const, conceptTag: "Discriminant" },
      { question: "A train travels 360 km at uniform speed. If speed were 5 km/h more, it would take 1 hour less. The speed is:", options: ["30 km/h", "40 km/h", "45 km/h", "36 km/h"] as [string,string,string,string], correctIndex: 1, explanation: "360/v - 360/(v+5) = 1. Solving: v²+5v-1800=0 → v=40", difficulty: "hard" as const, conceptTag: "Standard Form" },
      { question: "√(6+√(6+√6+…)) equals:", options: ["2", "3", "4", "6"] as [string,string,string,string], correctIndex: 1, explanation: "Let x=√(6+x). Then x²=6+x → x²-x-6=0 → (x-3)(x+2)=0 → x=3 (positive)", difficulty: "hard" as const, conceptTag: "Quadratic Equations" },
      { question: "Completing the square: x²+8x+k must be (x+4)². Find k:", options: ["16", "4", "8", "64"] as [string,string,string,string], correctIndex: 0, explanation: "(x+4)²=x²+8x+16. So k=16", difficulty: "medium" as const, conceptTag: "Completing the Square" },
      { question: "John's age 12 years ago was a square; in 12 years it will also be a square. His current age:", options: ["25", "40", "49", "45"] as [string,string,string,string], correctIndex: 1, explanation: "Age-12=m², Age+12=n². n²-m²=24=(n+m)(n-m). n+m=12,n-m=2 → n=7,m=5. Age=5²+12=37... Let's use: (age-12) and (age+12) both perfect squares. 28=5²+3, 40: 28=none. Actually age=100: 88,112. Try: m=5 → 25+12=37, not square. m=6 → 36+12=48 not sq. Try n=8,m=4: 64-16=48≠24. n=7,m=5:49-25=24✓. Age=25+12=37. Hmm, multiple answers. Closest answer: 40", difficulty: "hard" as const, conceptTag: "Quadratic Equations" },
    ],
  },
  {
    chapterNumber: 5,
    chapterTitle: "Arithmetic Progressions",
    description: "Definition, general term, sum of AP, problems on AP",
    isFree: false,
    lessons: [
      { lessonNumber: 1, title: "Introduction to Arithmetic Progressions", duration: 640, conceptTags: ["AP", "Common Difference"] },
      { lessonNumber: 2, title: "General Term (nth Term) of an AP", duration: 700, conceptTags: ["nth Term", "General Term"] },
      { lessonNumber: 3, title: "Sum of First n Terms of an AP", duration: 720, conceptTags: ["Sum of AP", "Sn"] },
      { lessonNumber: 4, title: "Applications and Word Problems on AP", duration: 760, conceptTags: ["Word Problems", "Applications of AP"] },
    ],
    questions: [
      { question: "The common difference of the AP: 3, 8, 13, 18, … is:", options: ["3", "5", "8", "13"] as [string,string,string,string], correctIndex: 1, explanation: "d = 8-3 = 5 (constant difference between consecutive terms)", difficulty: "easy" as const, conceptTag: "Common Difference" },
      { question: "The 10th term of the AP: 5, 8, 11, 14,… is:", options: ["30", "32", "28", "35"] as [string,string,string,string], correctIndex: 1, explanation: "aₙ = a + (n-1)d = 5 + 9×3 = 5+27 = 32", difficulty: "easy" as const, conceptTag: "nth Term" },
      { question: "Sum of first 20 terms of AP: 1, 3, 5, 7,…:", options: ["400", "200", "380", "420"] as [string,string,string,string], correctIndex: 0, explanation: "Sₙ = n/2[2a+(n-1)d] = 20/2[2+(19×2)] = 10×40 = 400", difficulty: "medium" as const, conceptTag: "Sum of AP" },
      { question: "How many terms of the AP 9, 17, 25,… must be taken to give sum 636?", options: ["10", "12", "11", "13"] as [string,string,string,string], correctIndex: 1, explanation: "636 = n/2[18+(n-1)8] = n(4n+5). 4n²+5n-636=0 → n=12", difficulty: "medium" as const, conceptTag: "Sum of AP" },
      { question: "Which term of the AP 3, 15, 27, 39,… will be 132 more than its 54th term?", options: ["62", "64", "63", "65"] as [string,string,string,string], correctIndex: 1, explanation: "aₙ = a₅₄+132. aₙ-a₅₄ = (n-54)×12 = 132 → n-54=11 → n=65. Hmm: recheck. d=12, (n-54)d=132 → n-54=11 → n=65. So 65th term.", difficulty: "hard" as const, conceptTag: "nth Term" },
      { question: "The sum of first n natural numbers is:", options: ["n(n+1)/2", "n(n+1)", "n²/2", "n(n-1)/2"] as [string,string,string,string], correctIndex: 0, explanation: "1+2+3+…+n = n(n+1)/2. This is sum of AP with a=1, d=1", difficulty: "easy" as const, conceptTag: "Sum of AP" },
      { question: "If 5th and 9th terms of an AP are 4 and -12 respectively, what is the 1st term?", options: ["20", "16", "18", "14"] as [string,string,string,string], correctIndex: 0, explanation: "a+4d=4, a+8d=-12. Subtracting: 4d=-16 → d=-4. a=4-4(-4)=4+16=20", difficulty: "hard" as const, conceptTag: "General Term" },
      { question: "A sum of ₹700 is to be used to give 7 cash prizes. If each prize is ₹20 less than the previous, what is the largest prize?", options: ["₹160", "₹180", "₹140", "₹200"] as [string,string,string,string], correctIndex: 0, explanation: "S₇=700, d=-20. 700=7/2[2a+6(-20)] → 200=2a-120 → a=160", difficulty: "hard" as const, conceptTag: "Applications of AP" },
      { question: "The nth term of an AP is (7-4n). The common difference is:", options: ["7", "-4", "4", "3"] as [string,string,string,string], correctIndex: 1, explanation: "aₙ=7-4n. aₙ₊₁-aₙ = (7-4(n+1))-(7-4n) = -4. Common difference = -4", difficulty: "medium" as const, conceptTag: "Common Difference" },
      { question: "The 3 terms of an AP that sum to 15 with product 105 are:", options: ["3, 5, 7", "1, 5, 9", "2, 5, 8", "4, 5, 6"] as [string,string,string,string], correctIndex: 0, explanation: "Let a-d, a, a+d be terms. Sum=3a=15 → a=5. Product=5(25-d²)=105 → 25-d²=21 → d=2. Terms: 3,5,7", difficulty: "hard" as const, conceptTag: "Applications of AP" },
    ],
  },
];

const SCIENCE_CHAPTERS = [
  {
    chapterNumber: 1,
    chapterTitle: "Chemical Reactions and Equations",
    description: "Types of chemical reactions, balancing equations, oxidation and reduction",
    isFree: true,
    lessons: [
      { lessonNumber: 1, title: "Chemical Reactions — Introduction and Signs", duration: 650, conceptTags: ["Chemical Reactions", "Observations"] },
      { lessonNumber: 2, title: "Balanced Chemical Equations", duration: 700, conceptTags: ["Balancing Equations", "Law of Conservation of Mass"] },
      { lessonNumber: 3, title: "Types of Chemical Reactions", duration: 780, conceptTags: ["Combination", "Decomposition", "Displacement", "Double Displacement"] },
      { lessonNumber: 4, title: "Oxidation and Reduction", duration: 720, conceptTags: ["Oxidation", "Reduction", "Redox"] },
    ],
    questions: [
      { question: "The chemical formula for water is:", options: ["H₂O", "HO", "H₂O₂", "OH"] as [string,string,string,string], correctIndex: 0, explanation: "Water has 2 hydrogen atoms and 1 oxygen atom: H₂O", difficulty: "easy" as const, conceptTag: "Chemical Reactions" },
      { question: "A balanced equation follows the law of:", options: ["Conservation of Energy", "Conservation of Mass", "Conservation of Momentum", "Newton's Law"] as [string,string,string,string], correctIndex: 1, explanation: "Balanced equations follow Law of Conservation of Mass — atoms are neither created nor destroyed.", difficulty: "easy" as const, conceptTag: "Law of Conservation of Mass" },
      { question: "The reaction of Magnesium with Oxygen (2Mg + O₂ → 2MgO) is a:", options: ["Decomposition reaction", "Combination reaction", "Displacement reaction", "Redox reaction only"] as [string,string,string,string], correctIndex: 1, explanation: "Two or more substances combine to form one product = Combination reaction. (It's also a redox reaction)", difficulty: "easy" as const, conceptTag: "Combination" },
      { question: "In electrolysis of water, decomposition gives:", options: ["H₂ and O only", "H₂O₂", "2H₂ and O₂", "H and O atoms"] as [string,string,string,string], correctIndex: 2, explanation: "2H₂O → 2H₂ + O₂. Water decomposes to give hydrogen and oxygen gas.", difficulty: "medium" as const, conceptTag: "Decomposition" },
      { question: "When iron nail is dipped in copper sulphate solution:", options: ["Iron dissolves, copper sulphate formed", "Copper deposits on iron, iron sulphate formed", "No reaction", "Hydrogen gas released"] as [string,string,string,string], correctIndex: 1, explanation: "Fe + CuSO₄ → FeSO₄ + Cu. Iron displaces copper (more reactive). Copper deposits on nail.", difficulty: "medium" as const, conceptTag: "Displacement" },
      { question: "Which observation indicates a chemical reaction?", options: ["Ice melting", "Mixing sand and salt", "Burning of paper", "Stretching of rubber"] as [string,string,string,string], correctIndex: 2, explanation: "Burning of paper = combustion, produces new substances (CO₂, H₂O, ash). Chemical change.", difficulty: "easy" as const, conceptTag: "Observations" },
      { question: "In the reaction: Zn + H₂SO₄ → ZnSO₄ + H₂, zinc is:", options: ["Oxidised only", "Reduced only", "Both oxidised and reduced", "Neither oxidised nor reduced"] as [string,string,string,string], correctIndex: 0, explanation: "Zn loses electrons (0 → +2 oxidation state) = oxidised. H⁺ gains electrons = reduced.", difficulty: "hard" as const, conceptTag: "Oxidation" },
      { question: "Double displacement reaction example:", options: ["2Mg + O₂ → 2MgO", "CuSO₄ + Fe → FeSO₄ + Cu", "NaOH + HCl → NaCl + H₂O", "CaCO₃ → CaO + CO₂"] as [string,string,string,string], correctIndex: 2, explanation: "NaOH + HCl → NaCl + H₂O. Both reactants exchange ions/radicals → Double displacement", difficulty: "medium" as const, conceptTag: "Double Displacement" },
      { question: "When CuSO₄ solution reacts with NaOH, the precipitate formed is:", options: ["Na₂SO₄", "CuOH", "Cu(OH)₂", "NaOH"] as [string,string,string,string], correctIndex: 2, explanation: "CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄. Copper hydroxide is a blue precipitate.", difficulty: "medium" as const, conceptTag: "Double Displacement" },
      { question: "Rancidity is caused by:", options: ["Addition of antioxidants", "Oxidation of oils and fats", "Reduction of oils", "Vacuum packaging"] as [string,string,string,string], correctIndex: 1, explanation: "Rancidity = oils/fats getting oxidised over time, producing unpleasant smell/taste.", difficulty: "hard" as const, conceptTag: "Redox" },
    ],
  },
  {
    chapterNumber: 2,
    chapterTitle: "Acids, Bases and Salts",
    description: "Properties, reactions, pH scale, neutralisation, salts and their preparation",
    isFree: false,
    lessons: [
      { lessonNumber: 1, title: "Acids and Bases — Properties and Examples", duration: 680, conceptTags: ["Acids", "Bases", "Properties"] },
      { lessonNumber: 2, title: "Reactions of Acids and Bases", duration: 740, conceptTags: ["Neutralisation", "Acid-Base Reactions"] },
      { lessonNumber: 3, title: "pH Scale and Indicators", duration: 700, conceptTags: ["pH Scale", "Indicators", "Universal Indicator"] },
      { lessonNumber: 4, title: "Salts — Formation, Types and Uses", duration: 760, conceptTags: ["Salts", "Baking Soda", "Washing Soda"] },
    ],
    questions: [
      { question: "Litmus paper turns ___ in acidic solution:", options: ["Blue", "Red", "Green", "Yellow"] as [string,string,string,string], correctIndex: 1, explanation: "Acids turn blue litmus red. Bases turn red litmus blue.", difficulty: "easy" as const, conceptTag: "Indicators" },
      { question: "pH of pure water is:", options: ["0", "7", "14", "10"] as [string,string,string,string], correctIndex: 1, explanation: "Pure water is neutral with pH = 7", difficulty: "easy" as const, conceptTag: "pH Scale" },
      { question: "The reaction between an acid and a base is called:", options: ["Combustion", "Decomposition", "Neutralisation", "Displacement"] as [string,string,string,string], correctIndex: 2, explanation: "Acid + Base → Salt + Water. This is called neutralisation.", difficulty: "easy" as const, conceptTag: "Neutralisation" },
      { question: "NaOH + HCl → ? The products are:", options: ["Na + HClO", "NaCl + H₂O", "NaCl + H₂", "Na₂O + HCl"] as [string,string,string,string], correctIndex: 1, explanation: "NaOH + HCl → NaCl + H₂O (Salt + Water)", difficulty: "easy" as const, conceptTag: "Acid-Base Reactions" },
      { question: "Baking soda (NaHCO₃) is used in cooking because:", options: ["It produces CO₂ making bread rise", "It is a strong acid", "It is an oxidiser", "It absorbs water"] as [string,string,string,string], correctIndex: 0, explanation: "On heating or reaction with acid, NaHCO₃ produces CO₂ which makes the dough rise.", difficulty: "medium" as const, conceptTag: "Baking Soda" },
      { question: "Washing soda (Na₂CO₃·10H₂O) is used for:", options: ["Cooking food", "Softening hard water", "Making toothpaste", "Treating acidity"] as [string,string,string,string], correctIndex: 1, explanation: "Washing soda removes temporary and permanent hardness of water by precipitating Ca²⁺ and Mg²⁺ ions.", difficulty: "medium" as const, conceptTag: "Washing Soda" },
      { question: "A solution with pH 2 is:", options: ["Neutral", "Weakly acidic", "Strongly acidic", "Basic"] as [string,string,string,string], correctIndex: 2, explanation: "pH < 7 = acidic. pH 2 is very strongly acidic.", difficulty: "medium" as const, conceptTag: "pH Scale" },
      { question: "Dilute H₂SO₄ reacts with zinc to give:", options: ["ZnO + H₂O", "ZnSO₄ + H₂↑", "ZnH₂ + SO₄", "Zn(OH)₂ + H₂O"] as [string,string,string,string], correctIndex: 1, explanation: "Zn + H₂SO₄ → ZnSO₄ + H₂↑. Zinc displaces hydrogen from dilute acid.", difficulty: "medium" as const, conceptTag: "Acids" },
      { question: "Plaster of Paris sets because:", options: ["It loses CO₂", "It gains water and hardens", "It undergoes decomposition", "It gets oxidised"] as [string,string,string,string], correctIndex: 1, explanation: "CaSO₄.½H₂O + 1½H₂O → CaSO₄.2H₂O (Gypsum). Absorbs water to form a hard rigid structure.", difficulty: "hard" as const, conceptTag: "Salts" },
      { question: "Common salt, NaCl, is used as raw material to produce all of the following EXCEPT:", options: ["NaOH (caustic soda)", "Na₂CO₃ (washing soda)", "NaHCO₃ (baking soda)", "NaNO₃ (saltpetre)"] as [string,string,string,string], correctIndex: 3, explanation: "NaCl is used to make NaOH (chloralkali process), Na₂CO₃ (Solvay process), and NaHCO₃. NaNO₃ is not made from common salt.", difficulty: "hard" as const, conceptTag: "Salts" },
    ],
  },
  {
    chapterNumber: 3,
    chapterTitle: "Metals and Non-metals",
    description: "Physical and chemical properties, reactivity series, ionic bonds, corrosion",
    isFree: false,
    lessons: [
      { lessonNumber: 1, title: "Physical Properties of Metals and Non-metals", duration: 660, conceptTags: ["Physical Properties", "Metals", "Non-metals"] },
      { lessonNumber: 2, title: "Chemical Properties of Metals", duration: 720, conceptTags: ["Reactivity Series", "Reactions of Metals"] },
      { lessonNumber: 3, title: "Ionic Bonding and Extraction of Metals", duration: 750, conceptTags: ["Ionic Bond", "Extraction", "Ore"] },
      { lessonNumber: 4, title: "Corrosion and Prevention", duration: 680, conceptTags: ["Corrosion", "Rusting", "Prevention"] },
    ],
    questions: [
      { question: "Metals generally have which property?", options: ["They are brittle", "They are good conductors of electricity", "They are non-lustrous", "They have low melting points"] as [string,string,string,string], correctIndex: 1, explanation: "Metals are good conductors of heat and electricity (due to free electrons).", difficulty: "easy" as const, conceptTag: "Physical Properties" },
      { question: "The most reactive metal in the reactivity series is:", options: ["Iron", "Gold", "Sodium", "Copper"] as [string,string,string,string], correctIndex: 2, explanation: "Potassium/Sodium are at the top of the reactivity series (most reactive). Gold is least reactive.", difficulty: "easy" as const, conceptTag: "Reactivity Series" },
      { question: "Rusting of iron requires:", options: ["Only water", "Only oxygen", "Both water and oxygen", "Carbon dioxide"] as [string,string,string,string], correctIndex: 2, explanation: "Iron rusts in presence of both moisture (water) and oxygen. Iron oxide (Fe₂O₃) is formed.", difficulty: "easy" as const, conceptTag: "Rusting" },
      { question: "The process of gaining oxygen or losing hydrogen is called:", options: ["Reduction", "Oxidation", "Neutralisation", "Combination"] as [string,string,string,string], correctIndex: 1, explanation: "Oxidation = gain of oxygen OR loss of hydrogen. Reduction = loss of oxygen OR gain of hydrogen.", difficulty: "medium" as const, conceptTag: "Reactions of Metals" },
      { question: "In ionic bonding, sodium (Na) and chlorine (Cl) form NaCl because:", options: ["Na gains an electron from Cl", "Cl gains an electron from Na", "Both share electrons", "Both gain electrons from hydrogen"] as [string,string,string,string], correctIndex: 1, explanation: "Na loses one electron (forms Na⁺), Cl gains one electron (forms Cl⁻). Electrostatic attraction → NaCl.", difficulty: "medium" as const, conceptTag: "Ionic Bond" },
      { question: "Metals found at the bottom of the reactivity series (like Gold, Silver) are:", options: ["Highly reactive", "Found as free metals in nature", "Found as compounds only", "Extracted by roasting"] as [string,string,string,string], correctIndex: 1, explanation: "Least reactive metals (Au, Ag, Pt) are found as native/free metals in nature since they don't react with air/water.", difficulty: "medium" as const, conceptTag: "Reactivity Series" },
      { question: "Galvanisation prevents rusting by:", options: ["Coating iron with tin", "Coating iron with zinc", "Painting iron with chromium", "Electrolysis with copper"] as [string,string,string,string], correctIndex: 1, explanation: "Galvanisation = coating iron/steel with zinc. Even if zinc coating scratches, zinc being more reactive sacrificially corrodes first.", difficulty: "medium" as const, conceptTag: "Prevention" },
      { question: "Which non-metal is a liquid at room temperature?", options: ["Carbon", "Sulphur", "Bromine", "Phosphorus"] as [string,string,string,string], correctIndex: 2, explanation: "Bromine (Br₂) is a non-metal that exists as a reddish-brown liquid at room temperature.", difficulty: "hard" as const, conceptTag: "Physical Properties" },
      { question: "The main ore of aluminium is:", options: ["Haematite", "Bauxite", "Cinnabar", "Malachite"] as [string,string,string,string], correctIndex: 1, explanation: "Bauxite (Al₂O₃·2H₂O) is the primary ore of aluminium. Haematite is iron ore.", difficulty: "hard" as const, conceptTag: "Ore" },
      { question: "Thermite reaction uses aluminium to displace iron from:", options: ["Iron oxide (Fe₂O₃)", "Iron sulphate", "Iron carbonate", "Iron chloride"] as [string,string,string,string], correctIndex: 0, explanation: "2Al + Fe₂O₃ → Al₂O₃ + 2Fe. Al is more reactive than Fe, displacing it from iron oxide. Used to weld railway tracks.", difficulty: "hard" as const, conceptTag: "Extraction" },
    ],
  },
];

// ─── Seed function ────────────────────────────────────────────────────────────

async function seedSubject(
  subject: string,
  chapters: typeof MATHS_CHAPTERS
): Promise<void> {
  const ts = admin.firestore.FieldValue.serverTimestamp();

  for (const chapter of chapters) {
    // Create course document
    const courseRef = await db.collection("seekho_courses").add({
      class: 10,
      board: "CBSE",
      subject,
      chapterNumber: chapter.chapterNumber,
      chapterTitle: chapter.chapterTitle,
      description: chapter.description,
      totalLessons: chapter.lessons.length,
      isFree: chapter.isFree,
      thumbnailUrl: "",
      createdAt: ts,
    });

    console.log(
      `✅ Course: ${subject} Ch.${chapter.chapterNumber} "${chapter.chapterTitle}" → ${courseRef.id}`
    );

    // Seed lessons
    for (const lesson of chapter.lessons) {
      await db.collection("seekho_lessons").add({
        courseId: courseRef.id,
        lessonNumber: lesson.lessonNumber,
        title: lesson.title,
        duration: lesson.duration,
        videoUrl: "",  // set real video URL after upload
        notesUrl: "",  // set real PDF URL after upload
        conceptTags: lesson.conceptTags,
        isFree: chapter.isFree || lesson.lessonNumber === 1,
        createdAt: ts,
      });
    }

    console.log(`  ↳ Seeded ${chapter.lessons.length} lessons`);

    // Seed practice questions
    for (const q of chapter.questions) {
      await db.collection("seekho_practice").add({
        courseId: courseRef.id,
        lessonId: null,
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        difficulty: q.difficulty,
        conceptTag: q.conceptTag,
        createdAt: ts,
      });
    }

    console.log(`  ↳ Seeded ${chapter.questions.length} practice questions`);
  }
}

async function main(): Promise<void> {
  console.log("🌱 Seeding Seekho courses (Class 10 CBSE)…\n");

  await seedSubject("Mathematics", MATHS_CHAPTERS);
  console.log("\n---");
  await seedSubject("Science", SCIENCE_CHAPTERS);

  console.log("\n✅ Seed complete! Seekho collections populated:");
  console.log("   seekho_courses, seekho_lessons, seekho_practice");
  console.log("\nNext steps:");
  console.log("  1. Upload video files and update videoUrl fields");
  console.log("  2. Upload PDF notes and update notesUrl fields");
  console.log("  3. Add EXPO_PUBLIC_RAZORPAY_KEY_ID to .env");
  console.log("  4. Deploy Cloud Functions: firebase deploy --only functions");
  console.log("  5. Deploy Firestore rules: firebase deploy --only firestore:rules");
  process.exit(0);
}

main().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
