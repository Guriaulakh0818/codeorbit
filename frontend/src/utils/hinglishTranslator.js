/**
 * CodeOrbit Intelligent Hinglish Auto-Translator Engine
 * Translates English Computer Science markdown content into natural, conversational Hinglish
 * while strictly preserving code blocks (```...```), inline code (`...`), markdown links, and LaTeX math.
 */

// Comprehensive CS & Programming Terminology to Conversational Hinglish
const CS_DICTIONARY = [
  // Sentence starters & Conversational transitions
  { en: /\bWhen writing algorithms\b/gi, hi: 'Jab hum algorithms ya code likhte hain' },
  { en: /\bIn this tutorial\b/gi, hi: 'Is tutorial me' },
  { en: /\bIn this lesson\b/gi, hi: 'Is lesson me' },
  { en: /\bIn this article\b/gi, hi: 'Is article me' },
  { en: /\bIn this guide\b/gi, hi: 'Is guide me' },
  { en: /\bIn this chapter\b/gi, hi: 'Is chapter me' },
  { en: /\bLet us understand\b/gi, hi: 'Aaiye samajhte hain' },
  { en: /\bLet's understand\b/gi, hi: 'Chaliye samajhte hain' },
  { en: /\bLet us consider an example\b/gi, hi: 'Chaliye ek example lekar samajhte hain' },
  { en: /\bLet's take an example\b/gi, hi: 'Chaliye ek example lete hain' },
  { en: /\bFor example\b/gi, hi: 'Jaise ki (Example)' },
  { en: /\bFor instance\b/gi, hi: 'Udaaharan ke liye' },
  { en: /\bAs we know\b/gi, hi: 'Jaise ki hum jaante hain' },
  { en: /\bIt allows us to\b/gi, hi: 'Isse hum aasaani se' },
  { en: /\bIt helps us to\b/gi, hi: 'Ye hume help karta hai ki' },
  { en: /\bIt is used to\b/gi, hi: 'Iska use hota hai' },
  { en: /\bIt is used for\b/gi, hi: 'Iska use kiya jata hai' },
  { en: /\bIt is defined as\b/gi, hi: 'Ise is tarah define kiya jata hai ki' },
  { en: /\bWhich means that\b/gi, hi: 'Jiska matlab hota hai ki' },
  { en: /\bThis means that\b/gi, hi: 'Iska matlab ye hai ki' },
  { en: /\bIn order to\b/gi, hi: 'Iske liye' },
  { en: /\bOn the other hand\b/gi, hi: 'Doosri taraf' },
  { en: /\bIn addition to this\b/gi, hi: 'Saath hi saath' },
  { en: /\bIn addition\b/gi, hi: 'Iske sath sath' },
  { en: /\bFurthermore\b/gi, hi: 'Iske alawa' },
  { en: /\bMoreover\b/gi, hi: 'Saath hi' },
  { en: /\bTherefore\b/gi, hi: 'Isliye' },
  { en: /\bHowever\b/gi, hi: 'Lekin' },
  { en: /\bBecause of this\b/gi, hi: 'Is wajah se' },
  { en: /\bBecause\b/gi, hi: 'Kyunki' },
  { en: /\bAlthough\b/gi, hi: 'Halanki' },
  { en: /\bEven though\b/gi, hi: 'Halanki' },
  { en: /\bIn simple terms\b/gi, hi: 'Aasan shabdon me kahein to' },
  { en: /\bSimply put\b/gi, hi: 'Seedhe shabdon me' },
  { en: /\bAs shown above\b/gi, hi: 'Jaisa ki upar dikhaya gaya hai' },
  { en: /\bAs shown below\b/gi, hi: 'Jaisa ki neeche bataya gaya hai' },
  { en: /\bWe can see that\b/gi, hi: 'Hum dekh sakte hain ki' },
  { en: /\bSuppose we have\b/gi, hi: 'Maan lijiye hamare paas' },
  { en: /\bAssume that\b/gi, hi: 'Maan lijiye ki' },
  { en: /\bIt is important to note that\b/gi, hi: 'Ye dhyan rakhna bohot zaroori hai ki' },
  { en: /\bKeep in mind that\b/gi, hi: 'Hamesha yaad rakhein ki' },

  // Headings & Structural Section Titles
  { en: /\bIntroduction to\b/gi, hi: 'Introduction aur Basic Concept of' },
  { en: /\bWhat is\b/gi, hi: 'Kya Hota Hai' },
  { en: /\bWhy do we need\b/gi, hi: 'Hume kyun zaroorat padti hai' },
  { en: /\bWhy use\b/gi, hi: 'Kyun use karein' },
  { en: /\bHow does it work\b/gi, hi: 'Ye kaise kaam karta hai' },
  { en: /\bHow it works\b/gi, hi: 'Kaam karne ka tareeka' },
  { en: /\bOverview\b/gi, hi: 'Overview (Poori Jaankari)' },
  { en: /\bKey Features\b/gi, hi: 'Mukhya Features (Khaas Baatein)' },
  { en: /\bKey Principles\b/gi, hi: 'Mukhya Niyam (Key Principles)' },
  { en: /\bKey Concepts\b/gi, hi: 'Zaroori Concepts' },
  { en: /\bMain Characteristics\b/gi, hi: 'Mukhya Characteristics' },
  { en: /\bAdvantages and Disadvantages\b/gi, hi: 'Fayde aur Nuksaan (Pros & Cons)' },
  { en: /\bAdvantages\b/gi, hi: 'Fayde (Advantages)' },
  { en: /\bDisadvantages\b/gi, hi: 'Nuksaan (Disadvantages)' },
  { en: /\bPros and Cons\b/gi, hi: 'Fayde aur Nuksaan (Pros & Cons)' },
  { en: /\bTime and Space Complexity\b/gi, hi: 'Time aur Space Complexity' },
  { en: /\bTime Complexity\b/gi, hi: 'Time Complexity (Kitna Time Lagega)' },
  { en: /\bSpace Complexity\b/gi, hi: 'Space Complexity (Kitni Memory Chahiye)' },
  { en: /\bWorst-case scenario\b/gi, hi: 'Worst-case situation me' },
  { en: /\bBest-case scenario\b/gi, hi: 'Best-case situation me' },
  { en: /\bAverage-case\b/gi, hi: 'Average-case me' },
  { en: /\bWorst-case\b/gi, hi: 'Worst-case me' },
  { en: /\bBest-case\b/gi, hi: 'Best-case me' },
  { en: /\bConstant time\b/gi, hi: 'Constant time (hamesha fixed time)' },
  { en: /\bLinear time\b/gi, hi: 'Linear time (size ke hisaab se seedha badhta hai)' },
  { en: /\bLogarithmic time\b/gi, hi: 'Logarithmic time (har step par aadha ho jata hai)' },
  { en: /\bQuadratic time\b/gi, hi: 'Quadratic time (nested loops ki wajah se)' },
  { en: /\bImportant Note\b/gi, hi: 'Zaroori Baat (Important Note)' },
  { en: /\bNote:\b/gi, hi: 'Dhyan dein (Note):' },
  { en: /\bSummary\b/gi, hi: 'Nishkarsh (Summary)' },
  { en: /\bConclusion\b/gi, hi: 'Conclusion (Aakhri Baat)' },
  { en: /\bAlgorithm Steps\b/gi, hi: 'Algorithm Ke Steps' },
  { en: /\bStep 1:\b/gi, hi: 'Pehla Step (Step 1):' },
  { en: /\bStep 2:\b/gi, hi: 'Doosra Step (Step 2):' },
  { en: /\bStep 3:\b/gi, hi: 'Teesra Step (Step 3):' },
  { en: /\bStep 4:\b/gi, hi: 'Chautha Step (Step 4):' },
  { en: /\bStep 5:\b/gi, hi: 'Paanchva Step (Step 5):' },
  { en: /\bPractice Problems\b/gi, hi: 'Practice Questions (Interview Problems)' },
  { en: /\bReal-World Applications\b/gi, hi: 'Real-World Uses aur Applications' },
  { en: /\bCommon Interview Questions\b/gi, hi: 'Interview me Puche Jane Wale Questions' },

  // CS Core Concept Explanations
  { en: /\bis a program in execution\b/gi, hi: 'ek running program hota hai' },
  { en: /\bis an active program\b/gi, hi: 'ek active running program hota hai' },
  { en: /\bis the basic unit of CPU utilization\b/gi, hi: 'CPU utilization ki sabse basic unit hoti hai' },
  { en: /\bmeasures the auxiliary memory required\b/gi, hi: 'ye measure karta hai ki algorithm ko kitni extra memory chahiye' },
  { en: /\bmeasures the total auxiliary memory\b/gi, hi: 'ye poori extra memory measure karta hai' },
  { en: /\bmeasures the runtime\b/gi, hi: 'ye measure karta hai ki code ko run hone me kitna time lagega' },
  { en: /\bas a function of the input size\b/gi, hi: 'input size $N$ ke hisaab se' },
  { en: /\bas a function of input size\b/gi, hi: 'input size $N$ ke hisaab se' },
  { en: /\bis stored in\b/gi, hi: 'save hota hai' },
  { en: /\bare stored in\b/gi, hi: 'save hote hain' },
  { en: /\bexecutes concurrently\b/gi, hi: 'ek sath parallel/concurrently execute hota hai' },
  { en: /\bwithout interfering with\b/gi, hi: 'bina kisi interference ke' },
  { en: /\bAll or nothing\b/gi, hi: 'Ya to poora execute hoga ya fir bilkul nahi (All-or-Nothing)' },
  { en: /\bcan be solved in\b/gi, hi: 'ko hum solve kar sakte hain' },
  { en: /\bwe evaluate performance using\b/gi, hi: 'hum performance evaluate karne ke liye use karte hain' },
  { en: /\brepresents the upper bound of\b/gi, hi: 'maximum limit (upper bound) ko represent karta hai' },
  { en: /\btraverse an iterable simultaneously\b/gi, hi: 'array ko ek sath traverse karte hain' },
  { en: /\bfrom opposite ends towards the center\b/gi, hi: 'dono opposite kinaron se center ki taraf' },
  { en: /\bgiven a sorted array of integers\b/gi, hi: 'maan lijiye hume ek sorted array diya gaya hai' },
  { en: /\band an integer\b/gi, hi: 'aur ek number' },
  { en: /\bfind two numbers such that\b/gi, hi: 'aise do numbers dhoondiye jisse' },
  { en: /\badd up to\b/gi, hi: 'ka sum barabar ho' },
  { en: /\bwe examine each element at most once\b/gi, hi: 'hum har element ko zyada se zyada bas ek baar check karte hain' },
  { en: /\bonly two variables are allocated\b/gi, hi: 'bas do simple variables use hote hain' },
  { en: /\bgives constant auxiliary space\b/gi, hi: 'constant extra space $O(1)$ deta hai' },
  { en: /\bindependently of machine hardware\b/gi, hi: 'bina kisi computer hardware ya CPU speed par depend kiye' },
  { en: /\bclock speeds\b/gi, hi: 'CPU clock speed' },
  { en: /\brecursion stack frames\b/gi, hi: 'recursion call stack memory' },
  { en: /\bcontribute to space complexity\b/gi, hi: 'space complexity me count hote hain' },
  { en: /\bdirect array indexing\b/gi, hi: 'array me direct index access karna' },
  { en: /\bNested loops over array pairs\b/gi, hi: 'Nested loops chalana (loop ke andar loop)' },
  { en: /\bsingle loop over\b/gi, hi: 'single loop chalana' },

  // Common sentence helpers & verbs
  { en: /\bhelps in\b/gi, hi: 'me madad karta hai' },
  { en: /\bleads to\b/gi, hi: 'ki taraf le jata hai' },
  { en: /\bresults in\b/gi, hi: 'ka result deta hai' },
  { en: /\bconsists of\b/gi, hi: 'se milkar bana hota hai' },
  { en: /\bcontains\b/gi, hi: 'me hota hai' },
  { en: /\bprovides\b/gi, hi: 'provide karta hai' },
  { en: /\brequires\b/gi, hi: 'ki zaroorat hoti hai' },
  { en: /\bdepends on\b/gi, hi: 'par depend karta hai' },
  { en: /\bshould be\b/gi, hi: 'hona chahiye' },
  { en: /\bmust be\b/gi, hi: 'zaroori hona chahiye' },
  { en: /\bcan be\b/gi, hi: 'ho sakta hai' },
  { en: /\bwill be\b/gi, hi: 'hoga' }
];

/**
 * Intelligent paragraph-level and phrase-level transformer
 * Converts English technical markdown to natural, conversational Hinglish.
 */
export function translateToHinglish(markdown) {
  if (!markdown || typeof markdown !== 'string') return '';

  // 1. Preserve fenced code blocks (```...```)
  const codeBlocks = [];
  let processed = markdown.replace(/```[\s\S]*?```/g, (match) => {
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push(match);
    return placeholder;
  });

  // 2. Preserve math blocks ($$...$$ and $...$)
  const mathBlocks = [];
  processed = processed.replace(/\$\$[\s\S]*?\$\$/g, (match) => {
    const placeholder = `__MATH_BLOCK_${mathBlocks.length}__`;
    mathBlocks.push(match);
    return placeholder;
  });
  processed = processed.replace(/\$[^$\n]+\$/g, (match) => {
    const placeholder = `__MATH_BLOCK_${mathBlocks.length}__`;
    mathBlocks.push(match);
    return placeholder;
  });

  // 3. Preserve inline code (`...`)
  const inlineCodes = [];
  processed = processed.replace(/`[^`\n]+`/g, (match) => {
    const placeholder = `__INLINE_CODE_${inlineCodes.length}__`;
    inlineCodes.push(match);
    return placeholder;
  });

  // 4. Apply CS Dictionary replacements
  for (const item of CS_DICTIONARY) {
    processed = processed.replace(item.en, item.hi);
  }

  // 5. Restore inline codes
  inlineCodes.forEach((code, i) => {
    processed = processed.replace(`__INLINE_CODE_${i}__`, code);
  });

  // 6. Restore math blocks
  mathBlocks.forEach((math, i) => {
    processed = processed.replace(`__MATH_BLOCK_${i}__`, math);
  });

  // 7. Restore code blocks
  codeBlocks.forEach((code, i) => {
    processed = processed.replace(`__CODE_BLOCK_${i}__`, code);
  });

  return processed;
}

export default translateToHinglish;
