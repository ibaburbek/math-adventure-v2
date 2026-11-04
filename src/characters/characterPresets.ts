import { CharacterPreset, ShopItem } from '../types';

export const CHARACTER_PRESETS: CharacterPreset[] = [
  {
    id: 'wizard',
    name: { en: 'Astra', ru: 'Астра', kk: 'Астра' },
    title: { en: 'Cosmic Wizard', ru: 'Космический маг', kk: 'Ғарыш сиқыршысы' },
    description: {
      en: 'Wielder of starlight equations and mystical algebraic spells.',
      ru: 'Властелин уравнений звездного света и магических формул.',
      kk: 'Жұлдызды теңдеулер мен сиқырлы алгебраның шебері.',
    },
    baseColor: '#6366f1', // Indigo
    secondaryColor: '#f59e0b', // Amber
    skinTone: '#fed7aa',
    role: 'Mage',
  },
  {
    id: 'knight',
    name: { en: 'Leo', ru: 'Лео', kk: 'Лео' },
    title: { en: 'Brave Knight', ru: 'Храбрый рыцарь', kk: 'Батыл сері' },
    description: {
      en: 'Defends the kingdom with geometric shields and solid logic.',
      ru: 'Защищает королевство геометрическим щитом и твердой логикой.',
      kk: 'Патшалықты геометриялық қалқанмен және мызғымас логикамен қорғайды.',
    },
    baseColor: '#3b82f6', // Blue
    secondaryColor: '#e2e8f0', // Silver
    skinTone: '#fde047',
    role: 'Warrior',
  },
  {
    id: 'elf',
    name: { en: 'Luna', ru: 'Луна', kk: 'Луна' },
    title: { en: 'Elf Ranger', ru: 'Эльф-следопыт', kk: 'Эльф мергені' },
    description: {
      en: 'Swift tracker who measures distances and angles with pinpoint accuracy.',
      ru: 'Быстрый следопыт, измеряющий расстояния и углы с идеальной точностью.',
      kk: 'Қашықтықтар мен бұрыштарды жоғары дәлдікпен есептейтін жылдам саяхатшы.',
    },
    baseColor: '#10b981', // Emerald
    secondaryColor: '#f59e0b',
    skinTone: '#ffedd5',
    role: 'Ranger',
  },
  {
    id: 'robot',
    name: { en: 'Sparky', ru: 'Спарки', kk: 'Спарки' },
    title: { en: 'Cyber Golem', ru: 'Кибер-голем', kk: 'Кибер-голем' },
    description: {
      en: 'Powered by binary circuits and rapid computational algorithms.',
      ru: 'Работает на двоичных схемах и сверхбыстрых вычислительных алгоритмах.',
      kk: 'Екілік жүйемен және жылдам есептеу алгоритмдерімен жұмыс істейді.',
    },
    baseColor: '#06b6d4', // Cyan
    secondaryColor: '#f43f5e', // Rose
    skinTone: '#94a3b8',
    role: 'Tech',
  },
  {
    id: 'fox',
    name: { en: 'Fenn', ru: 'Фенн', kk: 'Фенн' },
    title: { en: 'Fox Adventurer', ru: 'Лис-исследователь', kk: 'Түлкі саяхатшысы' },
    description: {
      en: 'Clever scout skilled at fractions, treasure hunting, and secret shortcuts.',
      ru: 'Умный разведчик, мастер дробей, поиска сокровищ и тайных троп.',
      kk: 'Бөлшектерді, қазына іздеуді және құпия жолдарды жетік меңгерген пысық барлаушы.',
    },
    baseColor: '#ea580c', // Orange
    secondaryColor: '#fef08a',
    skinTone: '#f97316',
    role: 'Scout',
  },
  {
    id: 'dragon',
    name: { en: 'Puff', ru: 'Пафф', kk: 'Пафф' },
    title: { en: 'Baby Dragon', ru: 'Малыш дракон', kk: 'Кішкентай айдаһар' },
    description: {
      en: 'A playful dragon who breathes spark math fireworks and loves gold coins.',
      ru: 'Игривый дракончик, пускающий математические искры и обожающий монеты.',
      kk: 'Математикалық ұшқындар шашатын және алтын тиындарды жақсы көретін ерке айдаһар.',
    },
    baseColor: '#8b5cf6', // Violet
    secondaryColor: '#ec4899', // Pink
    skinTone: '#c084fc',
    role: 'Mythic',
  },
  {
    id: 'space',
    name: { en: 'Nova', ru: 'Нова', kk: 'Нова' },
    title: { en: 'Cosmonaut', ru: 'Космонавт', kk: 'Ғарышкер' },
    description: {
      en: 'Navigates 3D planetary orbits and calculates gravitational velocities.',
      ru: 'Прокладывает орбиты планет и рассчитывает гравитационную скорость.',
      kk: 'Планеталардың орбитасын сызып, гравитациялық жылдамдықты есептейді.',
    },
    baseColor: '#f43f5e', // Rose
    secondaryColor: '#38bdf8', // Sky
    skinTone: '#fef08a',
    role: 'Astronaut',
  },
  {
    id: 'owl',
    name: { en: 'Pip', ru: 'Пип', kk: 'Пип' },
    title: { en: 'Owl Scholar', ru: 'Ученый филин', kk: 'Ғалым үкі' },
    description: {
      en: 'Ancient keeper of library theorems, geometry proofs, and math riddles.',
      ru: 'Мудрый хранитель математических теорем, геометрии и древних загадок.',
      kk: 'Кітапхана теоремаларының, геометрияның және көне жұмбақтардың дана қорғаушысы.',
    },
    baseColor: '#78350f', // Warm Amber Wood
    secondaryColor: '#fbbf24',
    skinTone: '#d97706',
    role: 'Scholar',
  },
];

export const INITIAL_SHOP_ITEMS: ShopItem[] = [
  // Hats
  {
    id: 'hat_wizard',
    name: { en: 'Arcane Star Hat', ru: 'Звездная шляпа мага', kk: 'Жұлдызды сиқыршы қалпағы' },
    category: 'hats',
    price: 40,
    assetKey: 'wizard_hat',
    colorHex: '#6366f1',
    description: { en: 'Spangled with glowing math constellation stars.', ru: 'Усыпана светящимися математическими созвездиями.', kk: 'Жарқыраған жұлдыздармен көмкерілген.' },
  },
  {
    id: 'hat_crown',
    name: { en: 'Golden Crown', ru: 'Золотая корона', kk: 'Алтын тәж' },
    category: 'hats',
    price: 80,
    assetKey: 'crown',
    colorHex: '#fbbf24',
    badge: 'Legendary',
    description: { en: 'Reserved for royal math arithmetic masters.', ru: 'Для королевских мастеров арифметики.', kk: 'Арифметика патшаларына арналған.' },
  },
  {
    id: 'hat_fedora',
    name: { en: 'Explorer Fedora', ru: 'Шляпа исследователя', kk: 'Саяхатшы қалпағы' },
    category: 'hats',
    price: 35,
    assetKey: 'fedora',
    colorHex: '#92400e',
    description: { en: 'Perfect for dusty pyramid quests and jungle expeditions.', ru: 'Идеальна для пустынных экспедиций и пирамид.', kk: 'Шөлді экспедициялар мен пирамидаларға арналған.' },
  },
  {
    id: 'hat_bunny',
    name: { en: 'Lucky Bunny Ears', ru: 'Ушки удачи', kk: 'Қоян құлақтары' },
    category: 'hats',
    price: 50,
    assetKey: 'bunny_ears',
    colorHex: '#f472b6',
    description: { en: 'Cute twitching ears that boost your puzzle instincts.', ru: 'Милые ушки, усиливающие математическую интуицию.', kk: 'Математикалық түйсікті арттыратын сүйкімді құлақтар.' },
  },

  // Outfits
  {
    id: 'outfit_armor',
    name: { en: 'Silver Knight Cuirass', ru: 'Серебряный панцирь', kk: 'Күміс сауыт' },
    category: 'clothing',
    price: 60,
    assetKey: 'armor',
    colorHex: '#94a3b8',
    description: { en: 'Heavy polished steel imbued with geometric precision.', ru: 'Полированная сталь с геометрическими гравюрами.', kk: 'Геометриялық өрнектері бар жылтыр болат сауыт.' },
  },
  {
    id: 'outfit_robe',
    name: { en: 'Scholar Rune Robe', ru: 'Мантия рун', kk: 'Руна шапаны' },
    category: 'clothing',
    price: 45,
    assetKey: 'robe',
    colorHex: '#8b5cf6',
    description: { en: 'Embroidered with KaTeX equations and pi digits.', ru: 'Вышита уравнениями KaTeX и цифрами числа пи.', kk: 'KaTeX теңдеулерімен кестеленген шапан.' },
  },
  {
    id: 'outfit_cyber',
    name: { en: 'Neon Cyber Plating', ru: 'Неоновый экзокостюм', kk: 'Неонды кибер киім' },
    category: 'clothing',
    price: 75,
    assetKey: 'cyber',
    colorHex: '#06b6d4',
    badge: 'Epic',
    description: { en: 'Glowing circuits that compute solutions in nanoseconds.', ru: 'Светящиеся микросхемы, считающие за наносекунды.', kk: 'Есептерді санаулы секундта шешетін микросхемалар.' },
  },

  // Accessories
  {
    id: 'acc_staff',
    name: { en: 'Crystal Magic Wand', ru: 'Кристальный посох', kk: 'Хрусталь таяқша' },
    category: 'accessories',
    price: 50,
    assetKey: 'staff',
    colorHex: '#a855f7',
    description: { en: 'Flashes rainbow colors when a fraction is simplified.', ru: 'Сверкает радугой при сокращении дробей.', kk: 'Бөлшектер қысқарғанда кемпірқосақша жарқырайды.' },
  },
  {
    id: 'acc_shield',
    name: { en: 'Golden Crest Shield', ru: 'Золотой гербовый щит', kk: 'Алтын таңбалы қалқан' },
    category: 'accessories',
    price: 65,
    assetKey: 'shield',
    colorHex: '#f59e0b',
    description: { en: 'Blocks math misconceptions with radiant proof logic.', ru: 'Отражает математические ошибки строгой логикой.', kk: 'Математикалық қателерді қатал логикамен тойтарады.' },
  },
  {
    id: 'acc_wings',
    name: { en: 'Dragon Glider Wings', ru: 'Крылья дракона', kk: 'Айдаһар қанаттары' },
    category: 'accessories',
    price: 90,
    assetKey: 'wings',
    colorHex: '#ef4444',
    badge: 'Legendary',
    description: { en: 'Spreads fiery wings to soar above difficult levels.', ru: 'Огненные крылья для полета над сложными задачами.', kk: 'Күрделі тапсырмалардан самғап өтетін отты қанаттар.' },
  },

  // Shoes
  {
    id: 'shoes_winged',
    name: { en: 'Hermes Winged Boots', ru: 'Крылатые сапоги', kk: 'Қанатты етіктер' },
    category: 'shoes',
    price: 45,
    assetKey: 'winged_boots',
    colorHex: '#38bdf8',
    description: { en: 'Grants a spring in your step along the 2D game path.', ru: 'Дарит легкую поступь на тропе математических квестов.', kk: 'Ойын жолында жеңіл әрі тез жүруге мүмкіндік береді.' },
  },
  {
    id: 'shoes_boots',
    name: { en: 'Leather Ranger Boots', ru: 'Кожаные сапоги рейнджера', kk: 'Былғары саяхатшы етігі' },
    category: 'shoes',
    price: 30,
    assetKey: 'boots',
    colorHex: '#78350f',
    description: { en: 'Sturdy, mud-proof boots crafted for forest treks.', ru: 'Прочные сапоги для лесных и горных троп.', kk: 'Орман мен тау жолдарына арналған мықты етік.' },
  },
];
