/**
 * Validation Utilities for Vocab Guide
 * Provides client-side validation for all forms
 */

export interface ValidationResult {
  isValid: boolean
  error?: string
}

/**
 * Validate a name field (study level, unit, lesson, section)
 * Rules:
 * - Required (not empty)
 * - Max length: 100 characters
 * - Min length: 1 character
 * - No leading/trailing whitespace after trim
 */
export function validateName(name: string): ValidationResult {
  // Trim the name
  const trimmedName = name.trim()

  // Check if empty
  if (!trimmedName) {
    return {
      isValid: false,
      error: "Name is required and cannot be empty",
    }
  }

  // Check minimum length
  if (trimmedName.length < 1) {
    return {
      isValid: false,
      error: "Name must be at least 1 character long",
    }
  }

  // Check maximum length
  if (trimmedName.length > 100) {
    return {
      isValid: false,
      error: "Name must be less than 100 characters",
    }
  }

  return { isValid: true }
}

/**
 * Validate text field with custom max length
 */
export function validateMaxLength(
  text: string,
  maxLength: number,
  fieldName: string = "Text"
): ValidationResult {
  if (text.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} must be less than ${maxLength} characters (current: ${text.length})`,
    }
  }
  return { isValid: true }
}

/**
 * Check for duplicate names in existing items
 */
export function validateNoDuplicates(
  name: string,
  existingNames: string[],
  itemType: string = "item"
): ValidationResult {
  const trimmedName = name.trim().toLowerCase()
  const duplicateExists = existingNames.some(
    (existingName) => existingName.trim().toLowerCase() === trimmedName
  )

  if (duplicateExists) {
    return {
      isValid: false,
      error: `A ${itemType} with this name already exists`,
    }
  }

  return { isValid: true }
}

/**
 * Validate that a value is not empty/null/undefined
 */
export function validateRequired(
  value: unknown,
  fieldName: string = "Field"
): ValidationResult {
  if (value === null || value === undefined || value === "") {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    }
  }

  if (typeof value === "string" && value.trim() === "") {
    return {
      isValid: false,
      error: `${fieldName} cannot be empty`,
    }
  }

  return { isValid: true }
}

/**
 * Validate English word (for Word model)
 * Rules:
 * - Required
 * - Max length: 200 characters
 * - Should contain English characters
 */
export function validateEnglishWord(word: string): ValidationResult {
  const trimmedWord = word.trim()

  // Check required
  const requiredCheck = validateRequired(trimmedWord, "English word")
  if (!requiredCheck.isValid) {
    return requiredCheck
  }

  // Check max length
  const lengthCheck = validateMaxLength(trimmedWord, 200, "English word")
  if (!lengthCheck.isValid) {
    return lengthCheck
  }

  return { isValid: true }
}

/**
 * Validate Arabic word (for Word model)
 * Rules:
 * - Required
 * - Max length: 200 characters
 */
export function validateArabicWord(word: string): ValidationResult {
  const trimmedWord = word.trim()

  // Check required
  const requiredCheck = validateRequired(trimmedWord, "Arabic translation")
  if (!requiredCheck.isValid) {
    return requiredCheck
  }

  // Check max length
  const lengthCheck = validateMaxLength(trimmedWord, 200, "Arabic translation")
  if (!lengthCheck.isValid) {
    return lengthCheck
  }

  return { isValid: true }
}

/**
 * Validate part of speech
 * Must be one of: noun, verb, adjective, adverb, other
 */
export function validatePartOfSpeech(part: string): ValidationResult {
  const validParts = ["noun", "verb", "adjective", "adverb", "other"]

  if (!validParts.includes(part)) {
    return {
      isValid: false,
      error: `Part of speech must be one of: ${validParts.join(", ")}`,
    }
  }

  return { isValid: true }
}

/**
 * Validate category (section name)
 * Rules:
 * - Required
 * - Max length: 50 characters
 */
export function validateCategory(category: string): ValidationResult {
  const trimmedCategory = category.trim()

  // Check required
  const requiredCheck = validateRequired(trimmedCategory, "Category")
  if (!requiredCheck.isValid) {
    return requiredCheck
  }

  // Check max length
  const lengthCheck = validateMaxLength(trimmedCategory, 50, "Category")
  if (!lengthCheck.isValid) {
    return lengthCheck
  }

  return { isValid: true }
}

/**
 * Validate a complete word object
 */
export interface WordValidation {
  en: string
  ar: string
  part: string
  category: string
}

export function validateWord(word: WordValidation): ValidationResult {
  // Validate English word
  const enCheck = validateEnglishWord(word.en)
  if (!enCheck.isValid) {
    return enCheck
  }

  // Validate Arabic word
  const arCheck = validateArabicWord(word.ar)
  if (!arCheck.isValid) {
    return arCheck
  }

  // Validate part of speech
  const partCheck = validatePartOfSpeech(word.part)
  if (!partCheck.isValid) {
    return partCheck
  }

  // Validate category
  const categoryCheck = validateCategory(word.category)
  if (!categoryCheck.isValid) {
    return categoryCheck
  }

  return { isValid: true }
}

/**
 * Validate JSON format for bulk word upload
 */
export function validateWordJSON(jsonString: string): ValidationResult {
  try {
    const parsed = JSON.parse(jsonString)

    // Must be an array
    if (!Array.isArray(parsed)) {
      return {
        isValid: false,
        error: "JSON must be an array of words",
      }
    }

    // Check if empty
    if (parsed.length === 0) {
      return {
        isValid: false,
        error: "Word list cannot be empty",
      }
    }

    // Validate each word
    for (let i = 0; i < parsed.length; i++) {
      const word = parsed[i]

      // Check required fields
      if (!word.en || !word.ar || !word.part || !word.category) {
        return {
          isValid: false,
          error: `Word at index ${i} is missing required fields (en, ar, part, category)`,
        }
      }

      // Validate the word
      const wordCheck = validateWord({
        en: word.en,
        ar: word.ar,
        part: word.part,
        category: word.category,
      })

      if (!wordCheck.isValid) {
        return {
          isValid: false,
          error: `Word at index ${i}: ${wordCheck.error}`,
        }
      }
    }

    return { isValid: true }
  } catch {
    return {
      isValid: false,
      error: "Invalid JSON format. Please check your syntax.",
    }
  }
}

/**
 * Sanitize HTML to prevent XSS attacks
 * Removes potentially dangerous characters
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
}

/**
 * Trim and sanitize input
 */
export function cleanInput(input: string): string {
  return sanitizeInput(input.trim())
}

/**
 * Validate section name
 */
export function validateSectionName(name: string): ValidationResult {
  return validateName(name)
}

/**
 * Helper function to show validation error in console (for debugging)
 */
export function logValidationError(
  result: ValidationResult,
  context: string = ""
): void {
  if (!result.isValid) {
    console.error(
      `Validation Error${context ? ` (${context})` : ""}: ${result.error}`
    )
  }
}
