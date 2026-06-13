/**
 * Resolves PDF font files for @react-pdf's Font.register.
 *
 * - Next build: served from /fonts/pdf/ (latin-subset TTFs in public/)
 * - Single-file build: singlefile/src/fonts-embed.ts injects base64 data
 *   URLs into window.__DEBRIEFED_FONTS__ at startup → PDF export works on file://
 */

declare global {
  interface Window {
    __DEBRIEFED_FONTS__?: Record<string, string>
  }
}

export function pdfFontUrl(file: string): string {
  if (typeof window !== 'undefined' && window.__DEBRIEFED_FONTS__?.[file]) {
    return window.__DEBRIEFED_FONTS__[file]
  }
  return `/fonts/pdf/${file}`
}
