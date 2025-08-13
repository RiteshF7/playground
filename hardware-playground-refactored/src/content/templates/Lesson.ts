// Lesson Template System
import { Lesson, Activity } from '../../core/types';

export class LessonTemplate {
  static createBasicLesson(config: {
    id: string;
    title: string;
    description: string;
  }): Partial<Lesson> {
    return {
      id: config.id,
      title: config.title,
      description: config.description,
      type: 'tutorial',
      order: 1,
      metadata: {
        author: 'System',
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        version: '1.0.0',
        tags: [],
        difficulty: 'beginner',
        estimatedDuration: 15,
        prerequisites: [],
        learningObjectives: []
      }
    };
  }

  static createHandsOnActivity(config: {
    id: string;
    name: string;
    description: string;
    playgroundConfig: string;
    instructions: string[];
  }): Activity {
    return {
      id: config.id,
      name: config.name,
      description: config.description,
      type: 'guided_practice',
      instructions: config.instructions,
      playgroundConfig: config.playgroundConfig,
      expectedOutcome: 'Complete the activity successfully',
      hints: [],
      timeLimit: 600 // 10 minutes
    };
  }
}
