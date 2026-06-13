/**
 * Community dictionary pipeline — RETIRED.
 *
 * The hosted submission/missing-term pipeline was removed with the backend.
 * Dictionary improvements happen via pull requests to the repo. This stub
 * keeps the engine modules (bulletTranslator) untouched: missing-term
 * logging is now a no-op.
 */

export async function logMissingTerm(
  _term: string,
  _sourceContext?: string,
  _branch?: string,
): Promise<void> {
  // Intentionally does nothing — there is no backend to report to.
}
