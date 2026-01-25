/**
 * Capitalizes the first letter of a name and lowercases the rest.
 * Simple approach: just capitalize first letter, lowercase rest.
 * Example: "john" → "John", "SMITH" → "Smith", "jOHN" → "John"
 */
export function capitalizeName(name: string | null | undefined): string {
  if (!name || typeof name !== 'string') return ''

  const trimmed = name.trim()
  if (!trimmed) return ''

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase()
}

/**
 * Formats first and last name with proper capitalization.
 * Returns an object with both formatted names.
 */
export function formatNames(
  firstName: string | null | undefined,
  lastName: string | null | undefined
): { firstName: string; lastName: string } {
  return {
    firstName: capitalizeName(firstName),
    lastName: capitalizeName(lastName),
  }
}
