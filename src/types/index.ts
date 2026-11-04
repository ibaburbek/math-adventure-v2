export type Language = 'en' | 'ru' | 'kk';

export type UserRole = 'teacher' | 'student';

export interface UserProfile {
  id: string;
  role: UserRole;
  username: string;
  fullName: string;
  avatarId?: string;
  teacherId?: string;
}

export type QuestionType =
  | 'multiple_choice'
  | 'numeric'
  | 'text'
  | 'image_based'
  | 'open_ended';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface QuestionOption {
  id: string;
  text: string;
  mathFormula?: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  questionSetId?: string;
  worldId?: string;
  levelId?: string;
  tileIndex?: number;
  type: QuestionType;
  prompt: {
    en: string;
    ru: string;
    kk: string;
  };
  mathFormula?: string;
  imageUrl?: string;
  options?: QuestionOption[]; // for multiple_choice
  correctAnswer: string; // for numeric or text
  acceptableTolerance?: number; // for numeric answers
  explanation: {
    en: string;
    ru: string;
    kk: string;
  };
  difficulty: Difficulty;
  coinReward: number; // 10, 20, 30
  isManualCheck: boolean;
  topic?: string;
}

export interface QuestionSet {
  id: string;
  teacherId: string;
  title: string;
  topic: string;
  difficulty: Difficulty;
  coinReward: number;
  questions: Question[];
  createdAt: string;
}

export interface World {
  id: string;
  name: {
    en: string;
    ru: string;
    kk: string;
  };
  theme: 'forest' | 'desert' | 'ice' | 'castle';
  description: {
    en: string;
    ru: string;
    kk: string;
  };
  bgGradient: string;
  primaryColor: string;
  accentColor: string;
  levelsCount: number;
}

export interface Level {
  id: string;
  worldId: string;
  levelNumber: number;
  title: {
    en: string;
    ru: string;
    kk: string;
  };
  totalTiles: number; // usually 8-10
  questions: Question[];
}

export interface StudentProgress {
  studentId: string;
  worldId: string;
  levelId: string;
  currentTile: number; // 0 to totalTiles
  completedTiles: number[];
  isCompleted: boolean;
  stars: number; // 1 to 3
  coinsAwardedQuestionIds: string[];
  lastUpdated: string;
}

export interface QuestionAttempt {
  id: string;
  studentId: string;
  questionId: string;
  levelId: string;
  tileIndex: number;
  attemptNumber: number;
  submittedAnswer: string;
  isCorrect: boolean;
  createdAt: string;
}

export interface ManualSubmission {
  id: string;
  studentId: string;
  studentName: string;
  questionId: string;
  questionTitle: string;
  worldId: string;
  levelId: string;
  tileIndex: number;
  solutionText: string;
  imageUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  teacherFeedback?: string;
  coinReward: number;
  submittedAt: string;
  reviewedAt?: string;
}

export interface StudentAccount {
  id: string;
  teacherId: string;
  username: string;
  pinHash: string; // SHA-256 hashed
  plainPinForTeacher?: string; // stored for teacher ease of distribution
  fullName: string;
  classId?: string;
  className?: string;
  avatarId: string;
  characterConfig: CharacterConfig;
  currentWorldId: string;
  currentLevelId: string;
  coins: number;
  isActive: boolean;
  createdAt: string;
  completedLevelsCount: number;
}

export interface ClassRoom {
  id: string;
  teacherId: string;
  name: string;
  grade: string;
  description?: string;
  createdAt: string;
  studentCount?: number;
}

export interface Assignment {
  id: string;
  teacherId: string;
  questionSetId: string;
  classId?: string;
  studentIds?: string[];
  title: string;
  dueDate: string;
  createdAt: string;
}

export type ShopCategory =
  | 'characters'
  | 'hats'
  | 'clothing'
  | 'accessories'
  | 'shoes';

export interface ShopItem {
  id: string;
  name: {
    en: string;
    ru: string;
    kk: string;
  };
  category: ShopCategory;
  price: number;
  assetKey: string;
  description: {
    en: string;
    ru: string;
    kk: string;
  };
  colorHex?: string;
  badge?: string;
}

export interface CharacterConfig {
  characterId: string; // 1 of 8 characters: 'wizard' | 'knight' | 'elf' | 'robot' | 'fox' | 'dragon' | 'space' | 'owl'
  primaryColor: string;
  secondaryColor: string;
  skinTone: string;
  hatId: string;
  outfitId: string;
  accessoryId: string;
  shoesId: string;
  animationState: 'idle' | 'walking' | 'celebration' | 'victory';
}

export interface CharacterPreset {
  id: string;
  name: {
    en: string;
    ru: string;
    kk: string;
  };
  title: {
    en: string;
    ru: string;
    kk: string;
  };
  description: {
    en: string;
    ru: string;
    kk: string;
  };
  baseColor: string;
  secondaryColor: string;
  skinTone: string;
  role: string;
}
