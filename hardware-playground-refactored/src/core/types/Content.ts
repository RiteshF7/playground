// Content Management Type Definitions

export interface Curriculum {
  id: string;
  name: string;
  description: string;
  version: string;
  targetAge: AgeRange;
  difficulty: DifficultyLevel;
  lessons: Lesson[];
  prerequisites: string[];
  learningObjectives: string[];
  estimatedDuration: number; // minutes
}

export interface AgeRange {
  min: number;
  max: number;
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  order: number;
  type: LessonType;
  content: LessonContent;
  activities: Activity[];
  assessments: Assessment[];
  resources: Resource[];
  metadata: LessonMetadata;
}

export type LessonType = 'tutorial' | 'practice' | 'challenge' | 'project' | 'assessment';

export interface LessonContent {
  introduction: ContentBlock[];
  explanation: ContentBlock[];
  examples: ContentBlock[];
  summary: ContentBlock[];
}

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  title?: string;
  content: string;
  media?: MediaItem[];
  interactive?: InteractiveElement;
}

export type ContentBlockType =
  | 'text'
  | 'code'
  | 'image'
  | 'video'
  | 'audio'
  | 'interactive'
  | 'quiz'
  | 'diagram';

export interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  alt?: string;
  caption?: string;
  metadata?: Record<string, any>;
}

export interface InteractiveElement {
  type: 'playground' | 'simulation' | 'quiz' | 'coding_exercise';
  configuration: Record<string, any>;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  type: ActivityType;
  instructions: string[];
  playgroundConfig?: string; // Playground configuration ID
  expectedOutcome: string;
  hints: Hint[];
  timeLimit?: number;
}

export type ActivityType =
  | 'guided_practice'
  | 'free_exploration'
  | 'problem_solving'
  | 'creative_project';

export interface Hint {
  id: string;
  trigger: HintTrigger;
  content: string;
  media?: MediaItem;
  priority: number;
}

export interface HintTrigger {
  type: 'time_based' | 'attempt_based' | 'error_based' | 'request_based';
  parameters: Record<string, any>;
}

export interface Assessment {
  id: string;
  name: string;
  type: AssessmentType;
  questions: Question[];
  passingScore: number;
  timeLimit?: number;
  attempts: number;
}

export type AssessmentType = 'quiz' | 'practical' | 'project' | 'peer_review';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: QuestionOption[];
  correctAnswer: any;
  explanation?: string;
  points: number;
}

export type QuestionType =
  | 'multiple_choice'
  | 'true_false'
  | 'short_answer'
  | 'code_completion'
  | 'drag_drop';

export interface QuestionOption {
  id: string;
  text: string;
  correct: boolean;
  feedback?: string;
}

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  url?: string;
  content?: string;
  downloadable: boolean;
  category: string;
}

export type ResourceType =
  | 'reference'
  | 'tutorial'
  | 'code_example'
  | 'datasheet'
  | 'video'
  | 'external_link';

export interface LessonMetadata {
  author: string;
  created: string;
  modified: string;
  version: string;
  tags: string[];
  difficulty: DifficultyLevel;
  estimatedDuration: number;
  prerequisites: string[];
  learningObjectives: string[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  difficulty: DifficultyLevel;
  objectives: string[];
  instructions: ChallengeInstruction[];
  constraints: ChallengeConstraint[];
  testCases: ChallengeTestCase[];
  hints: Hint[];
  solution?: ChallengeSolution;
  scoring: ScoringCriteria;
}

export type ChallengeCategory =
  | 'basic_control'
  | 'pattern_creation'
  | 'sensor_integration'
  | 'multi_module'
  | 'optimization'
  | 'creative';

export interface ChallengeInstruction {
  step: number;
  description: string;
  media?: MediaItem;
  code?: string;
}

export interface ChallengeConstraint {
  type: 'block_limit' | 'time_limit' | 'resource_limit' | 'custom';
  parameters: Record<string, any>;
  description: string;
}

export interface ChallengeTestCase {
  id: string;
  name: string;
  input: any;
  expected: any;
  hidden: boolean;
  weight: number;
}

export interface ChallengeSolution {
  blocks: BlockInstance[];
  explanation: string;
  alternative?: ChallengeSolution[];
}

export interface ScoringCriteria {
  maxScore: number;
  criteria: ScoringCriterion[];
  bonusPoints?: BonusPoint[];
}

export interface ScoringCriterion {
  name: string;
  weight: number;
  type: 'correctness' | 'efficiency' | 'style' | 'creativity';
  description: string;
}

export interface BonusPoint {
  condition: string;
  points: number;
  description: string;
}
