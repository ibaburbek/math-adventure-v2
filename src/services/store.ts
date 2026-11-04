import {
  World,
  Level,
  Question,
  QuestionSet,
  StudentAccount,
  ClassRoom,
  Assignment,
  ManualSubmission,
  StudentProgress,
  ShopItem,
  CharacterConfig,
} from '../types';
import { INITIAL_SHOP_ITEMS } from '../characters/characterPresets';

// =====================================================================
// 1. SEED DATA: 4 WORLDS, LEVELS, RICH KATEX QUESTIONS
// =====================================================================

export const SEED_WORLDS: World[] = [
  {
    id: 'world_forest',
    theme: 'forest',
    name: { en: 'Enchanted Forest', ru: 'Зачарованный лес', kk: 'Сиқырлы орман' },
    description: {
      en: 'Lush green woodlands, wooden river bridges, and magical glowing trees.',
      ru: 'Зеленые чащи, деревянные мостики и светящиеся волшебные деревья.',
      kk: 'Жасыл алқаптар, ағаш көпірлер және сиқырлы жарқыраған ағаштар.',
    },
    bgGradient: 'from-emerald-950 via-teal-950 to-slate-950',
    primaryColor: '#059669',
    accentColor: '#10b981',
    levelsCount: 3,
  },
  {
    id: 'world_desert',
    theme: 'desert',
    name: { en: 'Desert Kingdom', ru: 'Песчаное королевство', kk: 'Құм патшалығы' },
    description: {
      en: 'Golden sand dunes, ancient pyramids, and mystery oasis puzzles.',
      ru: 'Золотые барханы, древние пирамиды и солнечные оазисы.',
      kk: 'Алтын құм төбелері, ежелгі пирамидалар және күн шуақты оазистер.',
    },
    bgGradient: 'from-amber-950 via-orange-950 to-slate-950',
    primaryColor: '#d97706',
    accentColor: '#f59e0b',
    levelsCount: 2,
  },
  {
    id: 'world_ice',
    theme: 'ice',
    name: { en: 'Ice Kingdom', ru: 'Ледяное королевство', kk: 'Мұз патшалығы' },
    description: {
      en: 'Frosty peaks, crystal ice bridges, and frozen gemstone caverns.',
      ru: 'Снежные горы, хрустальные мосты и пещеры вечного льда.',
      kk: 'Қарлы шыңдар, хрусталь мұз көпірлері және мәңгілік мұз үңгірлері.',
    },
    bgGradient: 'from-sky-950 via-blue-950 to-slate-950',
    primaryColor: '#0284c7',
    accentColor: '#38bdf8',
    levelsCount: 2,
  },
  {
    id: 'world_castle',
    theme: 'castle',
    name: { en: 'Magic Castle', ru: 'Магический замок', kk: 'Сиқырлы сарай' },
    description: {
      en: 'Floating arcane towers, mystical portals, and final epic trials.',
      ru: 'Парящие башни, тайные порталы и финальные математические испытания.',
      kk: 'Қалықтаған мұнаралар, құпия порталдар және шешуші математикалық сынақтар.',
    },
    bgGradient: 'from-purple-950 via-indigo-950 to-slate-950',
    primaryColor: '#7c3aed',
    accentColor: '#a855f7',
    levelsCount: 2,
  },
];

// 10 Questions for World 1 Level 1 (Fractions & Arithmetic)
const FOREST_QUESTIONS_LVL1: Question[] = [
  {
    id: 'q_f1_1',
    type: 'multiple_choice',
    prompt: {
      en: 'Which fraction is equivalent to one half?',
      ru: 'Какая дробь эквивалентна одной второй?',
      kk: 'Қай бөлшек жартысына (1/2) тең?',
    },
    mathFormula: '\\frac{1}{2} = \\ ?',
    options: [
      { id: 'opt_1', text: '2/4', mathFormula: '\\frac{2}{4}', isCorrect: true },
      { id: 'opt_2', text: '1/3', mathFormula: '\\frac{1}{3}', isCorrect: false },
      { id: 'opt_3', text: '3/5', mathFormula: '\\frac{3}{5}', isCorrect: false },
      { id: 'opt_4', text: '2/6', mathFormula: '\\frac{2}{6}', isCorrect: false },
    ],
    correctAnswer: '2/4',
    explanation: {
      en: 'Multiply numerator and denominator by 2: \\frac{1 \\times 2}{2 \\times 2} = \\frac{2}{4}.',
      ru: 'Умножаем числитель и знаменатель на 2: 1/2 = 2/4.',
      kk: 'Алымы мен бөлімін 2-ге көбейтеміз: 1/2 = 2/4.',
    },
    difficulty: 'easy',
    coinReward: 10,
    isManualCheck: false,
    topic: 'Fractions',
  },
  {
    id: 'q_f1_2',
    type: 'numeric',
    prompt: {
      en: 'Calculate the sum of the fractions:',
      ru: 'Вычислите сумму дробей:',
      kk: 'Бөлшектердің қосындысын есептеңіз:',
    },
    mathFormula: '\\frac{3}{8} + \\frac{1}{8} = \\frac{x}{8}',
    correctAnswer: '4',
    explanation: {
      en: 'When denominators are equal, add numerators: 3 + 1 = 4. So x = 4 (or \\frac{4}{8} = \\frac{1}{2}).',
      ru: 'Одинаковые знаменатели складываем по числителям: 3 + 1 = 4.',
      kk: 'Бөлімдері бірдей бөлшектерді қосқанда алымдарын қосамыз: 3 + 1 = 4.',
    },
    difficulty: 'easy',
    coinReward: 10,
    isManualCheck: false,
    topic: 'Fractions',
  },
  {
    id: 'q_f1_3',
    type: 'multiple_choice',
    prompt: {
      en: 'Solve the magical woodland addition:',
      ru: 'Решите сложение:',
      kk: 'Қосу амалын орындаңыз:',
    },
    mathFormula: '45 + 55 = \\ ?',
    options: [
      { id: 'opt_1', text: '90', isCorrect: false },
      { id: 'opt_2', text: '100', isCorrect: true },
      { id: 'opt_3', text: '105', isCorrect: false },
      { id: 'opt_4', text: '110', isCorrect: false },
    ],
    correctAnswer: '100',
    explanation: {
      en: '45 + 55 = (40 + 50) + (5 + 5) = 90 + 10 = 100.',
      ru: '45 + 55 = 100.',
      kk: '45 + 55 = 100.',
    },
    difficulty: 'easy',
    coinReward: 10,
    isManualCheck: false,
    topic: 'Arithmetic',
  },
  {
    id: 'q_f1_4',
    type: 'numeric',
    prompt: {
      en: 'What is the missing number in this arithmetic pattern?',
      ru: 'Какое число пропущено в этой числовой последовательности?',
      kk: 'Бұл сан тізбегінде қай сан жетіспейді?',
    },
    mathFormula: '7, \\ 14, \\ 21, \\ [\\ ?\\ ], \\ 35',
    correctAnswer: '28',
    explanation: {
      en: 'The sequence increases by 7 each step: 21 + 7 = 28.',
      ru: 'Последовательность увеличивается на 7: 21 + 7 = 28.',
      kk: 'Әр қадам сайын 7-ге артып отырады: 21 + 7 = 28.',
    },
    difficulty: 'medium',
    coinReward: 20,
    isManualCheck: false,
    topic: 'Patterns',
  },
  {
    id: 'q_f1_5',
    type: 'multiple_choice',
    prompt: {
      en: 'Simplify the fraction to its lowest terms:',
      ru: 'Сократите дробь до простейшего вида:',
      kk: 'Бөлшекті қысқартыңыз:',
    },
    mathFormula: '\\frac{12}{16} = \\ ?',
    options: [
      { id: 'opt_1', text: '3/4', mathFormula: '\\frac{3}{4}', isCorrect: true },
      { id: 'opt_2', text: '2/3', mathFormula: '\\frac{2}{3}', isCorrect: false },
      { id: 'opt_3', text: '6/8', mathFormula: '\\frac{6}{8}', isCorrect: false },
      { id: 'opt_4', text: '4/5', mathFormula: '\\frac{4}{5}', isCorrect: false },
    ],
    correctAnswer: '3/4',
    explanation: {
      en: 'Divide both 12 and 16 by their greatest common divisor 4: \\frac{12 \\div 4}{16 \\div 4} = \\frac{3}{4}.',
      ru: 'Делим числитель и знаменатель на 4: 12/16 = 3/4.',
      kk: 'Алымы мен бөлімін 4-ке бөлеміз: 12/16 = 3/4.',
    },
    difficulty: 'medium',
    coinReward: 20,
    isManualCheck: false,
    topic: 'Fractions',
  },
  {
    id: 'q_f1_6',
    type: 'numeric',
    prompt: {
      en: 'Multiply the numbers to cross the river bridge:',
      ru: 'Перемножьте числа, чтобы перейти деревянный мост:',
      kk: 'Көпірден өту үшін сандарды көбейтіңіз:',
    },
    mathFormula: '12 \\times 8 = \\ ?',
    correctAnswer: '96',
    explanation: {
      en: '12 \\times 8 = 10 \\times 8 + 2 \\times 8 = 80 + 16 = 96.',
      ru: '12 * 8 = 96.',
      kk: '12 * 8 = 96.',
    },
    difficulty: 'medium',
    coinReward: 20,
    isManualCheck: false,
    topic: 'Multiplication',
  },
  {
    id: 'q_f1_7',
    type: 'multiple_choice',
    prompt: {
      en: 'Which inequality is TRUE?',
      ru: 'Какое неравенство ВЕРНО?',
      kk: 'Қай теңсіздік ДҰРЫС?',
    },
    mathFormula: '\\text{Compare: } \\frac{3}{5} \\text{ and } \\frac{2}{5}',
    options: [
      { id: 'opt_1', text: '3/5 > 2/5', mathFormula: '\\frac{3}{5} > \\frac{2}{5}', isCorrect: true },
      { id: 'opt_2', text: '3/5 < 2/5', mathFormula: '\\frac{3}{5} < \\frac{2}{5}', isCorrect: false },
      { id: 'opt_3', text: '3/5 = 2/5', mathFormula: '\\frac{3}{5} = \\frac{2}{5}', isCorrect: false },
      { id: 'opt_4', text: 'None', isCorrect: false },
    ],
    correctAnswer: '3/5 > 2/5',
    explanation: {
      en: 'With equal denominators 5, 3 is greater than 2, so 3/5 > 2/5.',
      ru: 'При одинаковом знаменателе 3 больше 2, значит 3/5 > 2/5.',
      kk: 'Бөлімдері бірдей болғандықтан, 3 > 2, сондықтан 3/5 > 2/5.',
    },
    difficulty: 'medium',
    coinReward: 20,
    isManualCheck: false,
    topic: 'Inequalities',
  },
  {
    id: 'q_f1_8',
    type: 'numeric',
    prompt: {
      en: 'Find the perimeter of a magical square with side length 9 meters:',
      ru: 'Найдите периметр квадрата со стороной 9 метров:',
      kk: 'Қабырғасы 9 метр болатын сиқырлы шаршының периметрін табыңыз:',
    },
    mathFormula: 'P = 4 \\times a = 4 \\times 9',
    correctAnswer: '36',
    explanation: {
      en: 'Perimeter of square P = 4 \\times 9 = 36 meters.',
      ru: 'Периметр квадрата P = 4 * 9 = 36 м.',
      kk: 'Шаршының периметрі P = 4 * 9 = 36 м.',
    },
    difficulty: 'medium',
    coinReward: 20,
    isManualCheck: false,
    topic: 'Geometry',
  },
  {
    id: 'q_f1_9',
    type: 'multiple_choice',
    prompt: {
      en: 'Calculate the common denominator fraction addition:',
      ru: 'Вычислите сложение дробей с разными знаменателями:',
      kk: 'Әр түрлі бөлімді бөлшектерді қосыңыз:',
    },
    mathFormula: '\\frac{1}{2} + \\frac{1}{4} = \\ ?',
    options: [
      { id: 'opt_1', text: '3/4', mathFormula: '\\frac{3}{4}', isCorrect: true },
      { id: 'opt_2', text: '2/6', mathFormula: '\\frac{2}{6}', isCorrect: false },
      { id: 'opt_3', text: '1/4', mathFormula: '\\frac{1}{4}', isCorrect: false },
      { id: 'opt_4', text: '5/4', mathFormula: '\\frac{5}{4}', isCorrect: false },
    ],
    correctAnswer: '3/4',
    explanation: {
      en: 'Convert \\frac{1}{2} to \\frac{2}{4}. Then \\frac{2}{4} + \\frac{1}{4} = \\frac{3}{4}.',
      ru: 'Приводим к общему знаменателю: 2/4 + 1/4 = 3/4.',
      kk: 'Ортақ бөлімге келтіреміз: 2/4 + 1/4 = 3/4.',
    },
    difficulty: 'hard',
    coinReward: 30,
    isManualCheck: false,
    topic: 'Fractions',
  },
  {
    id: 'q_f1_10',
    type: 'open_ended',
    prompt: {
      en: 'Final Challenge: A wizard gives 1/3 of his magic crystals to Leo, and 1/6 to Luna. What fraction of crystals does the wizard have left? Explain your working step-by-step.',
      ru: 'Финальный вызов: Маг отдал 1/3 своих кристаллов Лео и 1/6 Луне. Какая часть кристаллов осталась у мага? Опишите пошаговое решение.',
      kk: 'Соңғы сынақ: Сиқыршы кристаллдарының 1/3 бөлігін Леоға, ал 1/6 бөлігін Лунаға берді. Сиқыршыда қандай бөлігі қалды? Қадамдап жазыңыз.',
    },
    mathFormula: '1 - \\left( \\frac{1}{3} + \\frac{1}{6} \\right) = \\ ?',
    correctAnswer: '1/2',
    explanation: {
      en: 'Step 1: 1/3 = 2/6. Step 2: 2/6 + 1/6 = 3/6 = 1/2 given away. Step 3: 1 - 1/2 = 1/2 left.',
      ru: 'Шаг 1: 1/3 = 2/6. Шаг 2: 2/6 + 1/6 = 3/6 = 1/2 отдано. Шаг 3: Осталось 1 - 1/2 = 1/2.',
      kk: '1-қадам: 1/3 = 2/6. 2-қадам: 2/6 + 1/6 = 3/6 = 1/2 берілді. 3-қадам: 1 - 1/2 = 1/2 қалды.',
    },
    difficulty: 'hard',
    coinReward: 30,
    isManualCheck: true,
    topic: 'Word Problems',
  },
];

// Helper to clone / create 10 questions for other levels
const generateQuestionsForLevel = (worldId: string, levelNum: number, topic: string): Question[] => {
  return FOREST_QUESTIONS_LVL1.map((q, idx) => ({
    ...q,
    id: `q_${worldId}_${levelNum}_${idx + 1}`,
    worldId,
    levelId: `lvl_${worldId}_${levelNum}`,
    tileIndex: idx,
    topic,
  }));
};

export const SEED_LEVELS: Level[] = [
  // World 1: Forest
  {
    id: 'lvl_forest_1',
    worldId: 'world_forest',
    levelNumber: 1,
    title: { en: 'Grove of Fractions', ru: 'Роща дробей', kk: 'Бөлшектер тоғайы' },
    totalTiles: 10,
    questions: FOREST_QUESTIONS_LVL1,
  },
  {
    id: 'lvl_forest_2',
    worldId: 'world_forest',
    levelNumber: 2,
    title: { en: 'River of Ratios', ru: 'Река пропорций', kk: 'Пропорция өзені' },
    totalTiles: 10,
    questions: generateQuestionsForLevel('forest', 2, 'Ratios & Proportions'),
  },
  {
    id: 'lvl_forest_3',
    worldId: 'world_forest',
    levelNumber: 3,
    title: { en: 'Ancient Math Oak', ru: 'Древо вычислений', kk: 'Есептеулер емені' },
    totalTiles: 10,
    questions: generateQuestionsForLevel('forest', 3, 'Logic & Patterns'),
  },

  // World 2: Desert
  {
    id: 'lvl_desert_1',
    worldId: 'world_desert',
    levelNumber: 1,
    title: { en: 'Dunes of Geometry', ru: 'Барханы геометрии', kk: 'Геометрия құмдары' },
    totalTiles: 10,
    questions: generateQuestionsForLevel('desert', 1, 'Geometry'),
  },
  {
    id: 'lvl_desert_2',
    worldId: 'world_desert',
    levelNumber: 2,
    title: { en: 'Pyramid of Angles', ru: 'Пирамида углов', kk: 'Бұрыштар пирамидасы' },
    totalTiles: 10,
    questions: generateQuestionsForLevel('desert', 2, 'Angles & Polygons'),
  },

  // World 3: Ice
  {
    id: 'lvl_ice_1',
    worldId: 'world_ice',
    levelNumber: 1,
    title: { en: 'Glacier of Equations', ru: 'Ледник уравнений', kk: 'Теңдеулер мұздығы' },
    totalTiles: 10,
    questions: generateQuestionsForLevel('ice', 1, 'Equations'),
  },
  {
    id: 'lvl_ice_2',
    worldId: 'world_ice',
    levelNumber: 2,
    title: { en: 'Frosty Inequalities', ru: 'Морозные неравенства', kk: 'Мұзды теңсіздіктер' },
    totalTiles: 10,
    questions: generateQuestionsForLevel('ice', 2, 'Inequalities'),
  },

  // World 4: Castle
  {
    id: 'lvl_castle_1',
    worldId: 'world_castle',
    levelNumber: 1,
    title: { en: 'Tower of Powers', ru: 'Башня степеней', kk: 'Дәрежелер мұнарасы' },
    totalTiles: 10,
    questions: generateQuestionsForLevel('castle', 1, 'Powers & Roots'),
  },
  {
    id: 'lvl_castle_2',
    worldId: 'world_castle',
    levelNumber: 2,
    title: { en: 'Throne of Final Proofs', ru: 'Трон великих доказательств', kk: 'Ұлы дәлелдер тағы' },
    totalTiles: 10,
    questions: generateQuestionsForLevel('castle', 2, 'Advanced Algebra'),
  },
];

export const SEED_CLASSES: ClassRoom[] = [
  {
    id: 'class_grade4',
    teacherId: 'teacher_1',
    name: 'Grade 4 Math Champions',
    grade: 'Grade 4',
    description: 'Adventurous young learners exploring fractions, 2D shapes, and arithmetic.',
    createdAt: new Date().toISOString(),
    studentCount: 2,
  },
  {
    id: 'class_grade6',
    teacherId: 'teacher_1',
    name: 'Grade 6 Math Explorers',
    grade: 'Grade 6',
    description: 'Mastering equations, geometry proofs, ratios, and integers.',
    createdAt: new Date().toISOString(),
    studentCount: 2,
  },
];

export const SEED_STUDENTS: StudentAccount[] = [
  {
    id: 'student_leo',
    teacherId: 'teacher_1',
    username: 'leo',
    pinHash: btoa('1234'),
    plainPinForTeacher: '1234',
    fullName: 'Leo the Knight',
    classId: 'class_grade4',
    className: 'Grade 4 Math Champions',
    avatarId: 'knight',
    characterConfig: {
      characterId: 'knight',
      primaryColor: '#3b82f6',
      secondaryColor: '#f59e0b',
      skinTone: '#fcd34d',
      hatId: 'helm',
      outfitId: 'armor',
      accessoryId: 'shield',
      shoesId: 'boots',
      animationState: 'idle',
    },
    currentWorldId: 'world_forest',
    currentLevelId: 'lvl_forest_1',
    coins: 70,
    isActive: true,
    createdAt: new Date().toISOString(),
    completedLevelsCount: 1,
  },
  {
    id: 'student_astra',
    teacherId: 'teacher_1',
    username: 'astra',
    pinHash: btoa('1234'),
    plainPinForTeacher: '1234',
    fullName: 'Astra Starweaver',
    classId: 'class_grade4',
    className: 'Grade 4 Math Champions',
    avatarId: 'wizard',
    characterConfig: {
      characterId: 'wizard',
      primaryColor: '#6366f1',
      secondaryColor: '#f59e0b',
      skinTone: '#fed7aa',
      hatId: 'wizard_hat',
      outfitId: 'robe',
      accessoryId: 'staff',
      shoesId: 'boots',
      animationState: 'idle',
    },
    currentWorldId: 'world_forest',
    currentLevelId: 'lvl_forest_1',
    coins: 120,
    isActive: true,
    createdAt: new Date().toISOString(),
    completedLevelsCount: 2,
  },
  {
    id: 'student_luna',
    teacherId: 'teacher_1',
    username: 'luna',
    pinHash: btoa('1234'),
    plainPinForTeacher: '1234',
    fullName: 'Luna Swiftarrow',
    classId: 'class_grade6',
    className: 'Grade 6 Math Explorers',
    avatarId: 'elf',
    characterConfig: {
      characterId: 'elf',
      primaryColor: '#10b981',
      secondaryColor: '#f59e0b',
      skinTone: '#ffedd5',
      hatId: 'none',
      outfitId: 'tunic',
      accessoryId: 'none',
      shoesId: 'winged_boots',
      animationState: 'idle',
    },
    currentWorldId: 'world_desert',
    currentLevelId: 'lvl_desert_1',
    coins: 90,
    isActive: true,
    createdAt: new Date().toISOString(),
    completedLevelsCount: 2,
  },
  {
    id: 'student_sparky',
    teacherId: 'teacher_1',
    username: 'sparky',
    pinHash: btoa('1234'),
    plainPinForTeacher: '1234',
    fullName: 'Sparky Circuit',
    classId: 'class_grade6',
    className: 'Grade 6 Math Explorers',
    avatarId: 'robot',
    characterConfig: {
      characterId: 'robot',
      primaryColor: '#06b6d4',
      secondaryColor: '#f43f5e',
      skinTone: '#94a3b8',
      hatId: 'none',
      outfitId: 'cyber',
      accessoryId: 'none',
      shoesId: 'boots',
      animationState: 'idle',
    },
    currentWorldId: 'world_ice',
    currentLevelId: 'lvl_ice_1',
    coins: 110,
    isActive: true,
    createdAt: new Date().toISOString(),
    completedLevelsCount: 3,
  },
];

export const SEED_QUESTION_SETS: QuestionSet[] = [
  {
    id: 'qset_fractions',
    teacherId: 'teacher_1',
    title: 'Fractions & Equivalence Core Set',
    topic: 'Fractions',
    difficulty: 'medium',
    coinReward: 20,
    questions: FOREST_QUESTIONS_LVL1,
    createdAt: new Date().toISOString(),
  },
];

export const SEED_SUBMISSIONS: ManualSubmission[] = [
  {
    id: 'sub_1',
    studentId: 'student_leo',
    studentName: 'Leo the Knight',
    questionId: 'q_f1_10',
    questionTitle: 'Enchanted Forest — Wizard Crystals Problem',
    worldId: 'world_forest',
    levelId: 'lvl_forest_1',
    tileIndex: 9,
    solutionText:
      'First I found common denominator for 1/3 and 1/6, which is 6. 1/3 = 2/6. Then 2/6 + 1/6 = 3/6. Simplifying 3/6 gives 1/2. The total was 1, so 1 - 1/2 = 1/2 crystals remaining.',
    status: 'pending',
    coinReward: 30,
    submittedAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

// =====================================================================
// 2. UNIFIED STORE ENGINE WITH REACTIVE EVENT BUS & LOCAL PERSISTENCE
// =====================================================================

class GameStore {
  private students: StudentAccount[] = [];
  private classes: ClassRoom[] = [];
  private questionSets: QuestionSet[] = [];
  private assignments: Assignment[] = [];
  private submissions: ManualSubmission[] = [];
  private studentProgress: Record<string, StudentProgress> = {};
  private studentInventory: Record<string, string[]> = {};
  private listeners: Array<() => void> = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;

    try {
      const savedStudents = localStorage.getItem('math_adv_students');
      const savedClasses = localStorage.getItem('math_adv_classes');
      const savedQSets = localStorage.getItem('math_adv_qsets');
      const savedAssignments = localStorage.getItem('math_adv_assignments');
      const savedSubmissions = localStorage.getItem('math_adv_submissions');
      const savedProgress = localStorage.getItem('math_adv_progress');
      const savedInventory = localStorage.getItem('math_adv_inventory');

      this.students = savedStudents ? JSON.parse(savedStudents) : SEED_STUDENTS;
      this.classes = savedClasses ? JSON.parse(savedClasses) : SEED_CLASSES;
      this.questionSets = savedQSets ? JSON.parse(savedQSets) : SEED_QUESTION_SETS;
      this.assignments = savedAssignments ? JSON.parse(savedAssignments) : [];
      this.submissions = savedSubmissions ? JSON.parse(savedSubmissions) : SEED_SUBMISSIONS;
      this.studentProgress = savedProgress ? JSON.parse(savedProgress) : {};
      this.studentInventory = savedInventory
        ? JSON.parse(savedInventory)
        : {
            student_leo: ['hat_crown', 'acc_shield', 'outfit_armor'],
            student_astra: ['hat_wizard', 'acc_staff', 'outfit_robe'],
          };
    } catch {
      this.resetToDefaults();
    }
  }

  public saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('math_adv_students', JSON.stringify(this.students));
      localStorage.setItem('math_adv_classes', JSON.stringify(this.classes));
      localStorage.setItem('math_adv_qsets', JSON.stringify(this.questionSets));
      localStorage.setItem('math_adv_assignments', JSON.stringify(this.assignments));
      localStorage.setItem('math_adv_submissions', JSON.stringify(this.submissions));
      localStorage.setItem('math_adv_progress', JSON.stringify(this.studentProgress));
      localStorage.setItem('math_adv_inventory', JSON.stringify(this.studentInventory));
    } catch {
      // safe fallback
    }
    this.notify();
  }

  public subscribe(fn: () => void) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public resetToDefaults() {
    this.students = SEED_STUDENTS;
    this.classes = SEED_CLASSES;
    this.questionSets = SEED_QUESTION_SETS;
    this.assignments = [];
    this.submissions = SEED_SUBMISSIONS;
    this.studentProgress = {};
    this.studentInventory = {
      student_leo: ['hat_crown', 'acc_shield', 'outfit_armor'],
    };
    this.saveToStorage();
  }

  // Getters
  public getStudents(): StudentAccount[] {
    return this.students;
  }

  public getClasses(): ClassRoom[] {
    return this.classes;
  }

  public getQuestionSets(): QuestionSet[] {
    return this.questionSets;
  }

  public getAssignments(): Assignment[] {
    return this.assignments;
  }

  public getSubmissions(): ManualSubmission[] {
    return this.submissions;
  }

  public getStudentProgress(studentId: string, levelId: string): StudentProgress {
    const key = `${studentId}_${levelId}`;
    if (!this.studentProgress[key]) {
      this.studentProgress[key] = {
        studentId,
        worldId: 'world_forest',
        levelId,
        currentTile: 0,
        completedTiles: [],
        isCompleted: false,
        stars: 0,
        coinsAwardedQuestionIds: [],
        lastUpdated: new Date().toISOString(),
      };
    }
    return this.studentProgress[key];
  }

  public getAllProgressForStudent(studentId: string): Record<string, StudentProgress> {
    const result: Record<string, StudentProgress> = {};
    Object.keys(this.studentProgress).forEach((key) => {
      if (key.startsWith(`${studentId}_`)) {
        const lvlId = key.replace(`${studentId}_`, '');
        result[lvlId] = this.studentProgress[key];
      }
    });
    return result;
  }

  public getStudentInventory(studentId: string): string[] {
    return this.studentInventory[studentId] || [];
  }

  // Mutations
  public addStudent(studentData: Omit<StudentAccount, 'id' | 'createdAt' | 'completedLevelsCount'>) {
    const newStudent: StudentAccount = {
      ...studentData,
      id: `student_${Date.now()}`,
      createdAt: new Date().toISOString(),
      completedLevelsCount: 0,
    };
    this.students.push(newStudent);
    this.saveToStorage();
  }

  public updateStudent(id: string, updates: Partial<StudentAccount>) {
    this.students = this.students.map((s) => (s.id === id ? { ...s, ...updates } : s));
    this.saveToStorage();
  }

  public deleteStudent(id: string) {
    this.students = this.students.filter((s) => s.id !== id);
    this.saveToStorage();
  }

  public addClass(classData: Omit<ClassRoom, 'id' | 'createdAt' | 'studentCount'>) {
    const newClass: ClassRoom = {
      ...classData,
      id: `class_${Date.now()}`,
      createdAt: new Date().toISOString(),
      studentCount: 0,
    };
    this.classes.push(newClass);
    this.saveToStorage();
  }

  public deleteClass(id: string) {
    this.classes = this.classes.filter((c) => c.id !== id);
    this.saveToStorage();
  }

  public addQuestionSet(setData: Omit<QuestionSet, 'id' | 'createdAt'>) {
    const newSet: QuestionSet = {
      ...setData,
      id: `qset_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.questionSets.push(newSet);
    this.saveToStorage();
  }

  public updateQuestionSet(id: string, updates: Partial<QuestionSet>) {
    this.questionSets = this.questionSets.map((s) => (s.id === id ? { ...s, ...updates } : s));
    this.saveToStorage();
  }

  public deleteQuestionSet(id: string) {
    this.questionSets = this.questionSets.filter((s) => s.id !== id);
    this.saveToStorage();
  }

  public addAssignment(assignmentData: Omit<Assignment, 'id' | 'createdAt'>) {
    const newAssignment: Assignment = {
      ...assignmentData,
      id: `asgn_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.assignments.push(newAssignment);
    this.saveToStorage();
  }

  public deleteAssignment(id: string) {
    this.assignments = this.assignments.filter((a) => a.id !== id);
    this.saveToStorage();
  }

  public reviewSubmission(id: string, status: 'approved' | 'rejected', feedback?: string) {
    const sub = this.submissions.find((s) => s.id === id);
    if (!sub) return;

    sub.status = status;
    sub.teacherFeedback = feedback;
    sub.reviewedAt = new Date().toISOString();

    if (status === 'approved') {
      // Award step and coins to student
      this.advanceStudentTile(sub.studentId, sub.levelId, sub.tileIndex, sub.coinReward);
    }

    this.saveToStorage();
  }

  // Advance student 1 step forward along the 2D map path and award coins (only once!)
  public advanceStudentTile(
    studentId: string,
    levelId: string,
    tileIndex: number,
    coinsEarned: number
  ) {
    const student = this.students.find((s) => s.id === studentId);
    if (!student) return;

    const progressKey = `${studentId}_${levelId}`;
    const progress = this.getStudentProgress(studentId, levelId);

    // Only award coins if this tile hasn't awarded coins before
    const tileKey = `${levelId}_${tileIndex}`;
    const alreadyAwardedCoins = progress.coinsAwardedQuestionIds.includes(tileKey);

    if (!alreadyAwardedCoins && coinsEarned > 0) {
      student.coins += coinsEarned;
      progress.coinsAwardedQuestionIds.push(tileKey);
    }

    // Step character forward: currentTile becomes at least tileIndex + 1
    if (tileIndex >= progress.currentTile) {
      progress.currentTile = tileIndex + 1;
    }

    if (!progress.completedTiles.includes(tileIndex)) {
      progress.completedTiles.push(tileIndex);
    }

    // If completed 10 tiles, mark level completed
    if (progress.currentTile >= 10 && !progress.isCompleted) {
      progress.isCompleted = true;
      progress.stars = 3;
      student.completedLevelsCount = (student.completedLevelsCount || 0) + 1;
    }

    progress.lastUpdated = new Date().toISOString();
    this.studentProgress[progressKey] = progress;
    this.saveToStorage();
  }

  public buyShopItem(studentId: string, item: ShopItem): boolean {
    const student = this.students.find((s) => s.id === studentId);
    if (!student || student.coins < item.price) return false;

    const inventory = this.studentInventory[studentId] || [];
    if (inventory.includes(item.id)) return true; // already owned

    student.coins -= item.price;
    inventory.push(item.id);
    this.studentInventory[studentId] = inventory;

    // Equip item immediately
    this.equipShopItem(studentId, item);
    this.saveToStorage();
    return true;
  }

  public equipShopItem(studentId: string, item: ShopItem) {
    const student = this.students.find((s) => s.id === studentId);
    if (!student) return;

    const cfg = { ...student.characterConfig };
    if (item.category === 'hats') cfg.hatId = item.assetKey;
    if (item.category === 'clothing') cfg.outfitId = item.assetKey;
    if (item.category === 'accessories') cfg.accessoryId = item.assetKey;
    if (item.category === 'shoes') cfg.shoesId = item.assetKey;

    student.characterConfig = cfg;
    this.saveToStorage();
  }
}

export const gameStore = new GameStore();
