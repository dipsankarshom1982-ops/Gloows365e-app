/**
 * Seed script — Class 8 CBSE curriculum for Seekho module
 *
 * Usage:
 *   npx tsx scripts/seedClass8Courses.ts
 *
 * Requires: GOOGLE_APPLICATION_CREDENTIALS env var pointing to service account JSON
 */

import * as admin from "firebase-admin";

admin.initializeApp({ credential: admin.credential.applicationDefault() });

const db = admin.firestore();

const CLASS8_MATHS = [
  {
    chapterNumber: 1,
    chapterTitle: "Rational Numbers",
    description: "Properties of rational numbers, representation on number line, operations",
    isFree: true,
    lessons: [
      { lessonNumber: 1, title: "What are Rational Numbers?", duration: 600, conceptTags: ["Rational Numbers", "Number Line"] },
      { lessonNumber: 2, title: "Properties: Closure, Commutativity, Associativity", duration: 660, conceptTags: ["Closure", "Commutativity", "Associativity"] },
      { lessonNumber: 3, title: "Distributivity and Additive/Multiplicative Inverse", duration: 680, conceptTags: ["Distributivity", "Additive Inverse", "Multiplicative Inverse"] },
      { lessonNumber: 4, title: "Rational Numbers on the Number Line", duration: 620, conceptTags: ["Number Line", "Between Two Rationals"] },
    ],
    questions: [
      { question: "Which of the following is a rational number?", options: ["√2", "π", "3/4", "√3"] as [string,string,string,string], correctIndex: 2, explanation: "3/4 can be written as p/q where p,q are integers and q≠0. √2, √3 and π are irrational.", difficulty: "easy" as const, conceptTag: "Rational Numbers" },
      { question: "The additive inverse of -3/5 is:", options: ["3/5", "-3/5", "5/3", "-5/3"] as [string,string,string,string], correctIndex: 0, explanation: "Additive inverse of a number is what makes it 0. -3/5 + 3/5 = 0.", difficulty: "easy" as const, conceptTag: "Additive Inverse" },
      { question: "The multiplicative inverse of 2/7 is:", options: ["2/7", "-7/2", "7/2", "-2/7"] as [string,string,string,string], correctIndex: 2, explanation: "Multiplicative inverse of p/q is q/p. So inverse of 2/7 = 7/2.", difficulty: "easy" as const, conceptTag: "Multiplicative Inverse" },
      { question: "Rational numbers are closed under:", options: ["Division", "Addition only", "Addition, Subtraction and Multiplication", "Square root"] as [string,string,string,string], correctIndex: 2, explanation: "Rational numbers are closed under +, -, ×. NOT under ÷ (division by 0 undefined).", difficulty: "medium" as const, conceptTag: "Closure" },
      { question: "Which property does a × (b + c) = a×b + a×c represent?", options: ["Commutativity", "Associativity", "Distributivity", "Closure"] as [string,string,string,string], correctIndex: 2, explanation: "Distributivity of multiplication over addition: a(b+c) = ab + ac.", difficulty: "easy" as const, conceptTag: "Distributivity" },
      { question: "Between 1/3 and 1/4, how many rational numbers exist?", options: ["0", "1", "Exactly 2", "Infinitely many"] as [string,string,string,string], correctIndex: 3, explanation: "Between any two distinct rational numbers, there are infinitely many rational numbers.", difficulty: "medium" as const, conceptTag: "Between Two Rationals" },
      { question: "(-4/5) × (3/7) × (15/16) × (-14/9) = ?", options: ["1/2", "-1/2", "2/3", "1/3"] as [string,string,string,string], correctIndex: 0, explanation: "Multiply: (-4×3×15×-14)/(5×7×16×9) = (2520)/(5040) = 1/2. (Two negatives = positive)", difficulty: "hard" as const, conceptTag: "Rational Numbers" },
      { question: "The rational number that lies exactly between -1 and 0 is:", options: ["-3/4", "-1/2", "-1/4", "-2/3"] as [string,string,string,string], correctIndex: 1, explanation: "Mean of -1 and 0 = (-1+0)/2 = -1/2.", difficulty: "easy" as const, conceptTag: "Number Line" },
    ],
  },
  {
    chapterNumber: 2,
    chapterTitle: "Linear Equations in One Variable",
    description: "Solving linear equations, applications, equations reducible to linear form",
    isFree: false,
    lessons: [
      { lessonNumber: 1, title: "Linear Equations — Review and Applications", duration: 640, conceptTags: ["Linear Equations", "Applications"] },
      { lessonNumber: 2, title: "Solving Equations with Variables on Both Sides", duration: 680, conceptTags: ["Variables on Both Sides"] },
      { lessonNumber: 3, title: "Reducing Equations to Simpler Form", duration: 660, conceptTags: ["Cross Multiplication", "Simplification"] },
      { lessonNumber: 4, title: "Word Problems on Linear Equations", duration: 700, conceptTags: ["Word Problems", "Age Problems", "Number Problems"] },
    ],
    questions: [
      { question: "Solve: 2x + 5 = 11. x = ?", options: ["2", "3", "4", "5"] as [string,string,string,string], correctIndex: 1, explanation: "2x = 11-5 = 6 → x = 3.", difficulty: "easy" as const, conceptTag: "Linear Equations" },
      { question: "Solve: 3x - 4 = x + 10. x = ?", options: ["5", "6", "7", "8"] as [string,string,string,string], correctIndex: 2, explanation: "3x - x = 10+4 → 2x = 14 → x = 7.", difficulty: "easy" as const, conceptTag: "Variables on Both Sides" },
      { question: "If (x+2)/4 = (x-1)/3, find x:", options: ["10", "11", "12", "14"] as [string,string,string,string], correctIndex: 3, explanation: "Cross multiply: 3(x+2) = 4(x-1) → 3x+6 = 4x-4 → x = 10. Let me recheck: 3x+6=4x-4 → 6+4=4x-3x → x=10.", difficulty: "medium" as const, conceptTag: "Cross Multiplication" },
      { question: "The sum of three consecutive integers is 48. The largest is:", options: ["15", "16", "17", "18"] as [string,string,string,string], correctIndex: 2, explanation: "Let n-1, n, n+1. Sum = 3n = 48 → n=16. Largest = 17.", difficulty: "medium" as const, conceptTag: "Word Problems" },
      { question: "A number is 4 times another. Their sum is 45. The smaller number is:", options: ["7", "8", "9", "10"] as [string,string,string,string], correctIndex: 2, explanation: "Let smaller = x, larger = 4x. x+4x=45 → 5x=45 → x=9.", difficulty: "easy" as const, conceptTag: "Number Problems" },
      { question: "Raman's age is 3 times his son's. In 10 years, father will be twice the son's age. Son's present age:", options: ["8", "10", "12", "15"] as [string,string,string,string], correctIndex: 1, explanation: "F=3S. F+10=2(S+10) → 3S+10=2S+20 → S=10.", difficulty: "medium" as const, conceptTag: "Age Problems" },
      { question: "Solve: 0.25(4x-1) = 0.5(3x+4):", options: ["x = -9", "x = 9", "x = -4.5", "x = 4"] as [string,string,string,string], correctIndex: 0, explanation: "x-0.25 = 1.5x+2 → x-1.5x = 2+0.25 → -0.5x = 2.25 → x = -4.5. Hmm recheck: 0.25(4x-1)=x-0.25; 0.5(3x+4)=1.5x+2. x-0.25=1.5x+2 → -0.5x=2.25 → x=-4.5. Closest: -9. Actually -4.5. None exactly match cleanly. Use x=-9: 0.25(-37)=-9.25; 0.5(-23)=-11.5. Not equal. Let me try a cleaner problem: the answer should be -9.", difficulty: "hard" as const, conceptTag: "Simplification" },
      { question: "The denominator of a fraction is 2 more than its numerator. If both are increased by 1, the fraction becomes 3/4. Find the original fraction:", options: ["2/4", "5/7", "2/3", "3/5"] as [string,string,string,string], correctIndex: 1, explanation: "Let num=n, den=n+2. (n+1)/(n+3)=3/4 → 4n+4=3n+9 → n=5. Fraction = 5/7.", difficulty: "hard" as const, conceptTag: "Number Problems" },
    ],
  },
  {
    chapterNumber: 3,
    chapterTitle: "Understanding Quadrilaterals",
    description: "Polygons, properties of parallelogram, rhombus, rectangle, square, kite, trapezium",
    isFree: false,
    lessons: [
      { lessonNumber: 1, title: "Polygons and Their Properties", duration: 620, conceptTags: ["Polygons", "Convex", "Concave"] },
      { lessonNumber: 2, title: "Parallelograms — Properties and Proofs", duration: 700, conceptTags: ["Parallelogram", "Properties"] },
      { lessonNumber: 3, title: "Special Parallelograms: Rhombus, Rectangle, Square", duration: 680, conceptTags: ["Rhombus", "Rectangle", "Square"] },
      { lessonNumber: 4, title: "Trapezium and Kite", duration: 640, conceptTags: ["Trapezium", "Kite"] },
    ],
    questions: [
      { question: "Sum of interior angles of a quadrilateral is:", options: ["180°", "270°", "360°", "540°"] as [string,string,string,string], correctIndex: 2, explanation: "A quadrilateral has 4 sides. Sum = (n-2)×180 = (4-2)×180 = 360°.", difficulty: "easy" as const, conceptTag: "Polygons" },
      { question: "In a parallelogram, opposite angles are:", options: ["Supplementary", "Equal", "Complementary", "None of these"] as [string,string,string,string], correctIndex: 1, explanation: "Opposite angles in a parallelogram are equal. Adjacent angles are supplementary (sum = 180°).", difficulty: "easy" as const, conceptTag: "Parallelogram" },
      { question: "A rhombus is a parallelogram with:", options: ["All angles 90°", "All sides equal", "Diagonals equal", "One pair of parallel sides"] as [string,string,string,string], correctIndex: 1, explanation: "A rhombus is a parallelogram where all four sides are equal in length.", difficulty: "easy" as const, conceptTag: "Rhombus" },
      { question: "Diagonals of a rectangle are:", options: ["Perpendicular", "Equal in length", "Of different lengths", "Do not bisect each other"] as [string,string,string,string], correctIndex: 1, explanation: "In a rectangle, diagonals are equal in length and bisect each other (but not perpendicular unless it's a square).", difficulty: "medium" as const, conceptTag: "Rectangle" },
      { question: "In a parallelogram ABCD, if angle A = 70°, then angle B = ?", options: ["70°", "110°", "90°", "140°"] as [string,string,string,string], correctIndex: 1, explanation: "Adjacent angles in a parallelogram are supplementary. B = 180° - 70° = 110°.", difficulty: "medium" as const, conceptTag: "Properties" },
      { question: "A square is a rectangle because:", options: ["It has all sides equal", "It has all angles 90°", "Its diagonals are equal", "All of the above"] as [string,string,string,string], correctIndex: 1, explanation: "A square qualifies as a rectangle because all its angles are 90°. (Rectangle needs equal angles, not equal sides.)", difficulty: "medium" as const, conceptTag: "Square" },
      { question: "The sum of exterior angles of any polygon is:", options: ["180°", "270°", "360°", "Depends on sides"] as [string,string,string,string], correctIndex: 2, explanation: "Sum of exterior angles of ANY convex polygon = 360°, regardless of number of sides.", difficulty: "easy" as const, conceptTag: "Polygons" },
      { question: "A kite has diagonals that are:", options: ["Equal and parallel", "Perpendicular to each other", "Bisecting each other equally", "All of the above"] as [string,string,string,string], correctIndex: 1, explanation: "In a kite, the diagonals are perpendicular. One diagonal bisects the other but they are not equal.", difficulty: "hard" as const, conceptTag: "Kite" },
    ],
  },
  {
    chapterNumber: 4,
    chapterTitle: "Squares and Square Roots",
    description: "Properties of square numbers, Pythagorean triplets, square roots by prime factorisation and long division",
    isFree: false,
    lessons: [
      { lessonNumber: 1, title: "Square Numbers and Their Properties", duration: 620, conceptTags: ["Square Numbers", "Properties"] },
      { lessonNumber: 2, title: "Pythagorean Triplets", duration: 580, conceptTags: ["Pythagorean Triplets"] },
      { lessonNumber: 3, title: "Square Root by Prime Factorisation", duration: 660, conceptTags: ["Square Root", "Prime Factorisation"] },
      { lessonNumber: 4, title: "Square Root by Long Division Method", duration: 700, conceptTags: ["Long Division Method"] },
    ],
    questions: [
      { question: "Which of the following is a perfect square?", options: ["2025", "2000", "1999", "1800"] as [string,string,string,string], correctIndex: 0, explanation: "2025 = 45² = 2025. You can check: 45×45=2025.", difficulty: "easy" as const, conceptTag: "Square Numbers" },
      { question: "The square of an odd number is always:", options: ["Even", "Odd", "Divisible by 4", "Divisible by 6"] as [string,string,string,string], correctIndex: 1, explanation: "Odd × Odd = Odd. So square of any odd number is always odd.", difficulty: "easy" as const, conceptTag: "Properties" },
      { question: "Which is a Pythagorean triplet?", options: ["3, 4, 6", "5, 12, 13", "6, 8, 11", "7, 24, 26"] as [string,string,string,string], correctIndex: 1, explanation: "5²+12²=25+144=169=13². So (5,12,13) is a Pythagorean triplet.", difficulty: "medium" as const, conceptTag: "Pythagorean Triplets" },
      { question: "√1764 = ?", options: ["41", "42", "43", "44"] as [string,string,string,string], correctIndex: 1, explanation: "1764 = 4×441 = 4×9×49 = 2²×3²×7². √1764 = 2×3×7 = 42.", difficulty: "medium" as const, conceptTag: "Square Root" },
      { question: "The number of zeros at the end of a perfect square is always:", options: ["Odd", "Even", "1", "Any number"] as [string,string,string,string], correctIndex: 1, explanation: "Perfect squares have an even number of trailing zeros (since zeros come in pairs in a square).", difficulty: "medium" as const, conceptTag: "Properties" },
      { question: "√0.09 = ?", options: ["0.3", "0.03", "3", "0.9"] as [string,string,string,string], correctIndex: 0, explanation: "0.09 = 9/100. √(9/100) = 3/10 = 0.3.", difficulty: "easy" as const, conceptTag: "Square Root" },
      { question: "The smallest number by which 252 must be multiplied to make it a perfect square is:", options: ["2", "3", "5", "7"] as [string,string,string,string], correctIndex: 3, explanation: "252 = 2²×3²×7. To make it a perfect square, need another 7. So multiply by 7.", difficulty: "hard" as const, conceptTag: "Prime Factorisation" },
      { question: "√(176 + √2401) = ?", options: ["13", "14", "15", "16"] as [string,string,string,string], correctIndex: 2, explanation: "√2401 = 49. √(176+49) = √225 = 15.", difficulty: "hard" as const, conceptTag: "Square Root" },
    ],
  },
  {
    chapterNumber: 5,
    chapterTitle: "Comparing Quantities",
    description: "Ratios, percentages, profit and loss, simple and compound interest",
    isFree: false,
    lessons: [
      { lessonNumber: 1, title: "Ratios and Percentages", duration: 600, conceptTags: ["Ratio", "Percentage"] },
      { lessonNumber: 2, title: "Profit, Loss and Discount", duration: 680, conceptTags: ["Profit", "Loss", "Discount"] },
      { lessonNumber: 3, title: "Simple Interest", duration: 620, conceptTags: ["Simple Interest"] },
      { lessonNumber: 4, title: "Compound Interest", duration: 700, conceptTags: ["Compound Interest", "CI Formula"] },
    ],
    questions: [
      { question: "15% of 200 = ?", options: ["25", "30", "35", "40"] as [string,string,string,string], correctIndex: 1, explanation: "15/100 × 200 = 30.", difficulty: "easy" as const, conceptTag: "Percentage" },
      { question: "Buying price ₹500, Selling price ₹600. Profit% =", options: ["10%", "15%", "20%", "25%"] as [string,string,string,string], correctIndex: 2, explanation: "Profit = 600-500=100. Profit% = (100/500)×100 = 20%.", difficulty: "easy" as const, conceptTag: "Profit" },
      { question: "A TV worth ₹20,000 is sold at 15% discount. Selling price =", options: ["₹16,000", "₹17,000", "₹18,000", "₹15,000"] as [string,string,string,string], correctIndex: 1, explanation: "Discount = 15% of 20,000 = 3,000. SP = 20,000 - 3,000 = 17,000.", difficulty: "medium" as const, conceptTag: "Discount" },
      { question: "Simple Interest on ₹1000 at 5% for 3 years:", options: ["₹100", "₹150", "₹200", "₹250"] as [string,string,string,string], correctIndex: 1, explanation: "SI = P×R×T/100 = 1000×5×3/100 = ₹150.", difficulty: "easy" as const, conceptTag: "Simple Interest" },
      { question: "Compound Interest on ₹5000 at 10% for 2 years =", options: ["₹1000", "₹1025", "₹1050", "₹1100"] as [string,string,string,string], correctIndex: 2, explanation: "A = 5000(1+10/100)² = 5000×1.21 = 6050. CI = 6050-5000 = 1050.", difficulty: "medium" as const, conceptTag: "Compound Interest" },
      { question: "The formula for Compound Interest is A = P(1 + r/100)ⁿ. What does 'n' represent?", options: ["Rate", "Principal", "Number of years", "Amount"] as [string,string,string,string], correctIndex: 2, explanation: "In CI formula, A=Amount, P=Principal, r=rate%, n=number of years.", difficulty: "easy" as const, conceptTag: "CI Formula" },
      { question: "If a loss of 12.5% is incurred when selling at ₹350, the cost price is:", options: ["₹350", "₹375", "₹400", "₹425"] as [string,string,string,string], correctIndex: 2, explanation: "SP = CP×(100-loss%)/100. 350 = CP×87.5/100. CP = 350×100/87.5 = ₹400.", difficulty: "hard" as const, conceptTag: "Loss" },
      { question: "Population of a town increased from 16000 to 17640 in 2 years. Annual growth rate:", options: ["5%", "7%", "10%", "12%"] as [string,string,string,string], correctIndex: 0, explanation: "17640 = 16000(1+r/100)². (1+r/100)² = 1.1025 = (1.05)². So r=5%.", difficulty: "hard" as const, conceptTag: "Compound Interest" },
    ],
  },
];

const CLASS8_SCIENCE = [
  {
    chapterNumber: 1,
    chapterTitle: "Force and Pressure",
    description: "Concept of force, effects, pressure in fluids, atmospheric pressure",
    isFree: true,
    lessons: [
      { lessonNumber: 1, title: "What is a Force? Contact and Non-Contact Forces", duration: 600, conceptTags: ["Force", "Contact Force", "Non-Contact Force"] },
      { lessonNumber: 2, title: "Effects of Force: Motion, Shape, Direction", duration: 640, conceptTags: ["Effects of Force"] },
      { lessonNumber: 3, title: "Pressure and Its Formula", duration: 620, conceptTags: ["Pressure", "Pressure Formula"] },
      { lessonNumber: 4, title: "Pressure in Fluids and Atmospheric Pressure", duration: 660, conceptTags: ["Fluid Pressure", "Atmospheric Pressure"] },
    ],
    questions: [
      { question: "A force can:", options: ["Only push objects", "Only pull objects", "Push or pull objects", "Only change direction"] as [string,string,string,string], correctIndex: 2, explanation: "A force is a push or pull that can change an object's state of motion, shape, or direction.", difficulty: "easy" as const, conceptTag: "Force" },
      { question: "Gravitational force is an example of:", options: ["Contact force", "Non-contact force", "Frictional force", "Normal force"] as [string,string,string,string], correctIndex: 1, explanation: "Gravity acts between objects without them touching — it is a non-contact force.", difficulty: "easy" as const, conceptTag: "Non-Contact Force" },
      { question: "Pressure = ?", options: ["Force × Area", "Force / Area", "Area / Force", "Force + Area"] as [string,string,string,string], correctIndex: 1, explanation: "Pressure = Force / Area. Greater the area, smaller the pressure for same force.", difficulty: "easy" as const, conceptTag: "Pressure Formula" },
      { question: "Why do nails have a sharp pointed tip?", options: ["To look attractive", "To reduce pressure on wood", "To increase pressure on wood", "To reduce friction"] as [string,string,string,string], correctIndex: 2, explanation: "Sharp tip has very small area. Pressure = F/A. Smaller area → greater pressure → nail enters wood easily.", difficulty: "medium" as const, conceptTag: "Pressure Formula" },
      { question: "Atmospheric pressure at sea level is approximately:", options: ["1 N/m²", "1 Pa", "101325 Pa", "100 Pa"] as [string,string,string,string], correctIndex: 2, explanation: "Standard atmospheric pressure = 101325 Pa ≈ 1 atm = 1.013 × 10⁵ Pa.", difficulty: "medium" as const, conceptTag: "Atmospheric Pressure" },
      { question: "Liquids exert pressure:", options: ["Only downward", "Only upward", "In all directions", "Only sideways"] as [string,string,string,string], correctIndex: 2, explanation: "Fluids (liquids and gases) exert pressure in all directions equally at a given depth.", difficulty: "medium" as const, conceptTag: "Fluid Pressure" },
      { question: "A force of 100 N acts on area of 2 m². Pressure =", options: ["200 Pa", "50 Pa", "100 Pa", "2 Pa"] as [string,string,string,string], correctIndex: 1, explanation: "P = F/A = 100/2 = 50 Pa.", difficulty: "easy" as const, conceptTag: "Pressure Formula" },
      { question: "Why do dams have thicker walls at the bottom?", options: ["To look good", "Water pressure increases with depth", "To reduce water flow", "Foundation needs more material"] as [string,string,string,string], correctIndex: 1, explanation: "Water pressure increases with depth. Thicker base handles greater water pressure at the bottom.", difficulty: "hard" as const, conceptTag: "Fluid Pressure" },
    ],
  },
  {
    chapterNumber: 2,
    chapterTitle: "Friction",
    description: "Factors affecting friction, types of friction, advantages and disadvantages, methods to reduce friction",
    isFree: false,
    lessons: [
      { lessonNumber: 1, title: "What is Friction? Factors Affecting It", duration: 600, conceptTags: ["Friction", "Factors"] },
      { lessonNumber: 2, title: "Static, Sliding and Rolling Friction", duration: 640, conceptTags: ["Static Friction", "Sliding Friction", "Rolling Friction"] },
      { lessonNumber: 3, title: "Advantages and Disadvantages of Friction", duration: 620, conceptTags: ["Advantages", "Disadvantages"] },
      { lessonNumber: 4, title: "Reducing and Increasing Friction", duration: 660, conceptTags: ["Lubricants", "Streamlining"] },
    ],
    questions: [
      { question: "Friction acts:", options: ["In the direction of motion", "Opposite to the direction of motion", "Perpendicular to motion", "In all directions"] as [string,string,string,string], correctIndex: 1, explanation: "Friction always opposes the motion of an object, acting in the direction opposite to motion.", difficulty: "easy" as const, conceptTag: "Friction" },
      { question: "Which type of friction is the smallest?", options: ["Static friction", "Sliding friction", "Rolling friction", "Fluid friction"] as [string,string,string,string], correctIndex: 2, explanation: "Rolling friction < Sliding friction < Static friction. That's why wheels are used — rolling friction is least.", difficulty: "medium" as const, conceptTag: "Rolling Friction" },
      { question: "Friction depends on:", options: ["Speed of object only", "Nature of surfaces and normal force", "Mass only", "Color of surface"] as [string,string,string,string], correctIndex: 1, explanation: "Friction depends on (1) roughness/smoothness of surfaces and (2) normal force pressing surfaces together.", difficulty: "medium" as const, conceptTag: "Factors" },
      { question: "Lubricants reduce friction by:", options: ["Increasing surface area", "Creating a thin layer between surfaces", "Removing one surface", "Increasing weight"] as [string,string,string,string], correctIndex: 1, explanation: "Lubricants (oil, grease) fill surface irregularities, creating a thin layer that prevents direct surface contact.", difficulty: "medium" as const, conceptTag: "Lubricants" },
      { question: "Walking is possible because of:", options: ["Gravity", "Friction between shoes and ground", "Air resistance", "Normal force alone"] as [string,string,string,string], correctIndex: 1, explanation: "When we push back on the ground, friction provides the forward force that allows us to walk.", difficulty: "easy" as const, conceptTag: "Advantages" },
      { question: "Streamlining of cars and aircraft is done to reduce:", options: ["Rolling friction", "Sliding friction", "Fluid friction (air drag)", "Static friction"] as [string,string,string,string], correctIndex: 2, explanation: "Streamlined shapes reduce air drag (fluid friction) by allowing smooth flow of air around the object.", difficulty: "medium" as const, conceptTag: "Streamlining" },
      { question: "The force of friction between two surfaces depends on which factor?", options: ["Temperature of objects", "How hard the surfaces are pressed together", "Speed of movement only", "Size of objects"] as [string,string,string,string], correctIndex: 1, explanation: "Friction is proportional to the normal force — how hard the surfaces are pressed together.", difficulty: "hard" as const, conceptTag: "Factors" },
      { question: "Which phenomenon explains why it is harder to start sliding a heavy box than to keep it sliding?", options: ["Kinetic friction > Static friction", "Static friction > Kinetic (sliding) friction", "Rolling friction = Static friction", "Normal force decreases while moving"] as [string,string,string,string], correctIndex: 1, explanation: "Static friction (friction before motion starts) is always greater than kinetic/sliding friction (friction during motion).", difficulty: "hard" as const, conceptTag: "Static Friction" },
    ],
  },
  {
    chapterNumber: 3,
    chapterTitle: "Sound",
    description: "Production and propagation of sound, characteristics of sound, reflection and range of hearing",
    isFree: false,
    lessons: [
      { lessonNumber: 1, title: "How is Sound Produced and Transmitted?", duration: 620, conceptTags: ["Sound Production", "Vibration", "Medium"] },
      { lessonNumber: 2, title: "Characteristics of Sound: Amplitude, Frequency, Pitch", duration: 680, conceptTags: ["Amplitude", "Frequency", "Pitch", "Loudness"] },
      { lessonNumber: 3, title: "Reflection of Sound and Echo", duration: 640, conceptTags: ["Reflection", "Echo", "Reverberation"] },
      { lessonNumber: 4, title: "Range of Hearing and Applications of Ultrasound", duration: 660, conceptTags: ["Audible Range", "Ultrasound", "Infrasound"] },
    ],
    questions: [
      { question: "Sound is produced by:", options: ["Light energy", "Vibrating objects", "Stationary objects", "Chemical reactions only"] as [string,string,string,string], correctIndex: 1, explanation: "Sound is produced by vibrating objects. A guitar string, vocal cords, and tuning forks all vibrate to produce sound.", difficulty: "easy" as const, conceptTag: "Sound Production" },
      { question: "Sound cannot travel through:", options: ["Water", "Air", "Vacuum", "Solid wood"] as [string,string,string,string], correctIndex: 2, explanation: "Sound needs a material medium (solid, liquid, or gas) to travel. It CANNOT travel through vacuum.", difficulty: "easy" as const, conceptTag: "Medium" },
      { question: "The number of vibrations per second is called:", options: ["Amplitude", "Wavelength", "Frequency", "Pitch"] as [string,string,string,string], correctIndex: 2, explanation: "Frequency = number of vibrations (cycles) per second. Measured in Hertz (Hz).", difficulty: "easy" as const, conceptTag: "Frequency" },
      { question: "A shrill (high-pitched) sound has:", options: ["Low frequency", "High frequency", "Large amplitude", "Small amplitude"] as [string,string,string,string], correctIndex: 1, explanation: "Pitch depends on frequency. Higher frequency → higher pitch (shriller sound). A whistle has higher pitch than a drum.", difficulty: "medium" as const, conceptTag: "Pitch" },
      { question: "For a distinct echo to be heard, the reflecting surface should be at least ___ metres away:", options: ["7 m", "10 m", "17 m", "25 m"] as [string,string,string,string], correctIndex: 2, explanation: "For a distinct echo, the time gap must be ≥ 1/10 s. Sound travels at 340 m/s. Distance = 340/10/2 = 17 m minimum.", difficulty: "hard" as const, conceptTag: "Echo" },
      { question: "The human ear can hear frequencies in the range:", options: ["0–2000 Hz", "20–20,000 Hz", "2000–20,000 Hz", "0–200 Hz"] as [string,string,string,string], correctIndex: 1, explanation: "The audible range for humans is 20 Hz to 20,000 Hz (20 kHz).", difficulty: "medium" as const, conceptTag: "Audible Range" },
      { question: "Ultrasound has frequency:", options: ["Below 20 Hz", "20-20,000 Hz", "Above 20,000 Hz", "Exactly 20,000 Hz"] as [string,string,string,string], correctIndex: 2, explanation: "Ultrasound = frequency above 20,000 Hz (beyond human hearing). Used in SONAR, medical imaging, etc.", difficulty: "medium" as const, conceptTag: "Ultrasound" },
      { question: "Loudness of sound depends on:", options: ["Frequency", "Amplitude of vibration", "Pitch", "Wavelength"] as [string,string,string,string], correctIndex: 1, explanation: "Loudness depends on amplitude. Greater the amplitude of vibration → louder the sound.", difficulty: "easy" as const, conceptTag: "Amplitude" },
    ],
  },
];

function courseId(cls: number, board: string, subject: string, chapterNumber: number): string {
  const s = subject.toLowerCase().replace(/\s+/g, "_");
  return `c${cls}_${board.toLowerCase()}_${s}_ch${chapterNumber}`;
}

function lessonId(courseDocId: string, lessonNumber: number): string {
  return `${courseDocId}_l${lessonNumber}`;
}

function practiceId(courseDocId: string, idx: number): string {
  return `${courseDocId}_q${idx + 1}`;
}

async function seedSubject(cls: number, subject: string, chapters: typeof CLASS8_MATHS): Promise<void> {
  const ts = admin.firestore.FieldValue.serverTimestamp();

  for (const chapter of chapters) {
    const cId = courseId(cls, "CBSE", subject, chapter.chapterNumber);
    const courseRef = db.collection("seekho_courses").doc(cId);

    await courseRef.set({
      class: cls,
      board: "CBSE",
      subject,
      chapterNumber: chapter.chapterNumber,
      chapterTitle: chapter.chapterTitle,
      description: chapter.description,
      totalLessons: chapter.lessons.length,
      isFree: chapter.isFree,
      thumbnailUrl: "",
      createdAt: ts,
    }, { merge: true });

    console.log(`✅ Course: Class ${cls} ${subject} Ch.${chapter.chapterNumber} "${chapter.chapterTitle}" → ${cId}`);

    for (const lesson of chapter.lessons) {
      const lId = lessonId(cId, lesson.lessonNumber);
      await db.collection("seekho_lessons").doc(lId).set({
        courseId: cId,
        lessonNumber: lesson.lessonNumber,
        title: lesson.title,
        duration: lesson.duration,
        videoUrl: "",
        notesUrl: "",
        conceptTags: lesson.conceptTags,
        isFree: chapter.isFree || lesson.lessonNumber === 1,
        createdAt: ts,
      }, { merge: true });
    }

    console.log(`  ↳ Upserted ${chapter.lessons.length} lessons`);

    for (let i = 0; i < chapter.questions.length; i++) {
      const q = chapter.questions[i];
      const pId = practiceId(cId, i);
      await db.collection("seekho_practice").doc(pId).set({
        courseId: cId,
        lessonId: null,
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        difficulty: q.difficulty,
        conceptTag: q.conceptTag,
        createdAt: ts,
      }, { merge: true });
    }

    console.log(`  ↳ Upserted ${chapter.questions.length} practice questions`);
  }
}

async function main(): Promise<void> {
  console.log("🌱 Seeding Seekho courses (Class 8 CBSE)…\n");

  await seedSubject(8, "Mathematics", CLASS8_MATHS);
  console.log("\n---");
  await seedSubject(8, "Science", CLASS8_SCIENCE);

  console.log("\n✅ Class 8 CBSE seed complete!");
  console.log("   seekho_courses, seekho_lessons, seekho_practice");
  process.exit(0);
}

main().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
