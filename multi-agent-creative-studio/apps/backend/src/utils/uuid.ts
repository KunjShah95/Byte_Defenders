/**
 * UUID utility for generating unique identifiers
 */
import { v4 as uuidv4 } from 'uuid';

export class UUIDUtil {
  /**
   * Generate a new UUID
   */
  static generate(): string {
    return uuidv4();
  }

  /**
   * Generate a prefixed UUID
   */
  static generateWithPrefix(prefix: string): string {
    return `${prefix}_${uuidv4()}`;
  }

  /**
   * Validate a UUID
   */
  static isValid(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}
