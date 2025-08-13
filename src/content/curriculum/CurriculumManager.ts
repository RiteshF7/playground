// Curriculum Management System
import {
  Curriculum,
  Lesson,
  ValidationResult,
  DifficultyLevel,
  ExecutionResult
} from '../../core/types';
import { ErrorUtils } from '../../core/utils';
import { ConfigStorage } from '../../services/storage';

export class CurriculumManager {
  private curricula: Map<string, Curriculum> = new Map();
  private lessons: Map<string, Lesson> = new Map();
  private storage: ConfigStorage;

  constructor() {
    this.storage = new ConfigStorage('curriculum');
  }

  /**
   * Load curriculum from configuration
   */
  async loadCurriculum(curriculum: Curriculum): Promise<ValidationResult> {
    try {
      // Validate curriculum
      const validation = this.validateCurriculum(curriculum);
      if (!validation.isValid) {
        return validation;
      }

      // Store curriculum
      this.curricula.set(curriculum.id, curriculum);

      // Index lessons
      for (const lesson of curriculum.lessons) {
        this.lessons.set(lesson.id, lesson);
      }

      // Persist to storage
      await this.storage.save(`curriculum_${curriculum.id}`, curriculum);

      console.log(`✅ Loaded curriculum: ${curriculum.name} (${curriculum.lessons.length} lessons)`);

      return { isValid: true, errors: [] };

    } catch (error) {
      return ErrorUtils.toValidationResult(error);
    }
  }

  /**
   * Get curriculum by ID
   */
  getCurriculum(id: string): Curriculum | null {
    return this.curricula.get(id) || null;
  }

  /**
   * Get all curricula
   */
  getAllCurricula(): Curriculum[] {
    return Array.from(this.curricula.values());
  }

  /**
   * Get curriculum by difficulty level
   */
  getCurriculaByDifficulty(level: DifficultyLevel): Curriculum[] {
    return Array.from(this.curricula.values()).filter(
      curriculum => curriculum.difficulty === level
    );
  }

  /**
   * Get lesson by ID
   */
  getLesson(id: string): Lesson | null {
    return this.lessons.get(id) || null;
  }

  /**
   * Get lessons for curriculum
   */
  getLessonsForCurriculum(curriculumId: string): Lesson[] {
    const curriculum = this.getCurriculum(curriculumId);
    if (!curriculum) return [];

    return curriculum.lessons.sort((a, b) => a.order - b.order);
  }

  /**
   * Get next lesson in sequence
   */
  getNextLesson(currentLessonId: string): Lesson | null {
    const currentLesson = this.getLesson(currentLessonId);
    if (!currentLesson) return null;

    // Find curriculum containing this lesson
    const curriculum = Array.from(this.curricula.values()).find(
      curr => curr.lessons.some(lesson => lesson.id === currentLessonId)
    );

    if (!curriculum) return null;

    const sortedLessons = curriculum.lessons.sort((a, b) => a.order - b.order);
    const currentIndex = sortedLessons.findIndex(lesson => lesson.id === currentLessonId);

    return currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null;
  }

  /**
   * Get previous lesson in sequence
   */
  getPreviousLesson(currentLessonId: string): Lesson | null {
    const currentLesson = this.getLesson(currentLessonId);
    if (!currentLesson) return null;

    // Find curriculum containing this lesson
    const curriculum = Array.from(this.curricula.values()).find(
      curr => curr.lessons.some(lesson => lesson.id === currentLessonId)
    );

    if (!curriculum) return null;

    const sortedLessons = curriculum.lessons.sort((a, b) => a.order - b.order);
    const currentIndex = sortedLessons.findIndex(lesson => lesson.id === currentLessonId);

    return currentIndex > 0 ? sortedLessons[currentIndex - 1] : null;
  }

  /**
   * Search lessons
   */
  searchLessons(query: string): Lesson[] {
    const lowerQuery = query.toLowerCase();

    return Array.from(this.lessons.values()).filter(lesson =>
      lesson.title.toLowerCase().includes(lowerQuery) ||
      lesson.description.toLowerCase().includes(lowerQuery) ||
      lesson.metadata.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get lessons by type
   */
  getLessonsByType(type: string): Lesson[] {
    return Array.from(this.lessons.values()).filter(lesson => lesson.type === type);
  }

  /**
   * Get recommended lessons for user level
   */
  getRecommendedLessons(completedLessons: string[], difficulty: DifficultyLevel): Lesson[] {
    const lessons = Array.from(this.lessons.values())
      .filter(lesson => {
        // Not already completed
        if (completedLessons.includes(lesson.id)) return false;

        // Matches difficulty level
        if (lesson.metadata.difficulty !== difficulty) return false;

        // Prerequisites met
        return lesson.metadata.prerequisites.every(prereq =>
          completedLessons.includes(prereq)
        );
      })
      .sort((a, b) => a.order - b.order);

    return lessons.slice(0, 5); // Return top 5 recommendations
  }

  /**
   * Calculate curriculum progress
   */
  calculateProgress(curriculumId: string, completedLessons: string[]): {
    total: number;
    completed: number;
    percentage: number;
    nextLesson: Lesson | null;
  } {
    const curriculum = this.getCurriculum(curriculumId);
    if (!curriculum) {
      return { total: 0, completed: 0, percentage: 0, nextLesson: null };
    }

    const total = curriculum.lessons.length;
    const completed = curriculum.lessons.filter(lesson =>
      completedLessons.includes(lesson.id)
    ).length;

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Find next uncompleted lesson
    const sortedLessons = curriculum.lessons.sort((a, b) => a.order - b.order);
    const nextLesson = sortedLessons.find(lesson =>
      !completedLessons.includes(lesson.id)
    ) || null;

    return { total, completed, percentage, nextLesson };
  }

  /**
   * Validate curriculum structure
   */
  private validateCurriculum(curriculum: Curriculum): ValidationResult {
    const errors: string[] = [];

    // Basic validation
    if (!curriculum.id || !curriculum.name) {
      errors.push('Curriculum must have id and name');
    }

    if (!curriculum.lessons || curriculum.lessons.length === 0) {
      errors.push('Curriculum must have lessons');
    }

    // Validate lessons
    const lessonIds = new Set<string>();
    const lessonOrders = new Set<number>();

    for (const lesson of curriculum.lessons) {
      // Check for duplicate IDs
      if (lessonIds.has(lesson.id)) {
        errors.push(`Duplicate lesson ID: ${lesson.id}`);
      }
      lessonIds.add(lesson.id);

      // Check for duplicate orders
      if (lessonOrders.has(lesson.order)) {
        errors.push(`Duplicate lesson order: ${lesson.order}`);
      }
      lessonOrders.add(lesson.order);

      // Validate individual lesson
      const lessonValidation = this.validateLesson(lesson);
      if (!lessonValidation.isValid) {
        errors.push(`Invalid lesson ${lesson.id}: ${lessonValidation.errors.join(', ')}`);
      }
    }

    // Validate prerequisite references
    for (const lesson of curriculum.lessons) {
      for (const prereq of lesson.metadata.prerequisites) {
        if (!lessonIds.has(prereq) && !this.lessons.has(prereq)) {
          errors.push(`Lesson ${lesson.id} references unknown prerequisite: ${prereq}`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate individual lesson
   */
  private validateLesson(lesson: Lesson): ValidationResult {
    const errors: string[] = [];

    if (!lesson.id || !lesson.title) {
      errors.push('Lesson must have id and title');
    }

    if (typeof lesson.order !== 'number' || lesson.order < 0) {
      errors.push('Lesson must have valid order number');
    }

    if (!lesson.content) {
      errors.push('Lesson must have content');
    }

    if (!lesson.metadata) {
      errors.push('Lesson must have metadata');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Export curriculum to JSON
   */
  async exportCurriculum(curriculumId: string): Promise<ExecutionResult<string>> {
    try {
      const curriculum = this.getCurriculum(curriculumId);
      if (!curriculum) {
        return {
          success: false,
          error: `Curriculum not found: ${curriculumId}`,
          timestamp: Date.now()
        };
      }

      const json = JSON.stringify(curriculum, null, 2);

      return {
        success: true,
        data: json,
        timestamp: Date.now()
      };

    } catch (error) {
      return ErrorUtils.toExecutionResult(error);
    }
  }

  /**
   * Import curriculum from JSON
   */
  async importCurriculum(json: string): Promise<ValidationResult> {
    try {
      const curriculum: Curriculum = JSON.parse(json);
      return await this.loadCurriculum(curriculum);
    } catch (error) {
      return ErrorUtils.toValidationResult(error);
    }
  }

  /**
   * Get curriculum statistics
   */
  getStats(): {
    totalCurricula: number;
    totalLessons: number;
    lessonsByType: Record<string, number>;
    lessonsByDifficulty: Record<string, number>;
  } {
    const stats = {
      totalCurricula: this.curricula.size,
      totalLessons: this.lessons.size,
      lessonsByType: {} as Record<string, number>,
      lessonsByDifficulty: {} as Record<string, number>
    };

    for (const lesson of this.lessons.values()) {
      // Count by type
      stats.lessonsByType[lesson.type] = (stats.lessonsByType[lesson.type] || 0) + 1;

      // Count by difficulty
      const difficulty = lesson.metadata.difficulty;
      stats.lessonsByDifficulty[difficulty] = (stats.lessonsByDifficulty[difficulty] || 0) + 1;
    }

    return stats;
  }
}
