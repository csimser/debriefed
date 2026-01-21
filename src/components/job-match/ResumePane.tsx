'use client'

import { Card } from '@/components/ui/Card'

interface ResumePaneProps {
  resume: any
  analysis: any
}

export function ResumePane({ resume, analysis }: ResumePaneProps) {
  if (!resume) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <Card className="p-8 text-center">
          <div className="text-4xl mb-4 text-text-dim">◫</div>
          <p className="text-text-muted">Select a resume to preview</p>
        </Card>
      </div>
    )
  }

  const content = resume.content || {}
  const keywordsFound = analysis?.keywordsFound || []
  const keywordsMissing = analysis?.keywordsMissing || []

  // Function to highlight keywords in text
  const highlightText = (text: string) => {
    if (!text || (!keywordsFound.length && !keywordsMissing.length)) return text

    let result = text

    // Highlight found keywords in green
    keywordsFound.forEach((kw: string) => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi')
      result = result.replace(regex, `<span class="bg-status-green/30 text-status-green px-1 rounded">${kw}</span>`)
    })

    return result
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-sm font-bold uppercase tracking-wider">Resume Preview</h2>
        {analysis && (
          <div className="flex gap-2 text-xs">
            <span className="text-status-green">● Found</span>
            <span className="text-status-amber">● Missing</span>
          </div>
        )}
      </div>

      {/* Mini Resume Preview */}
      <Card className="bg-white text-black p-6 text-sm" style={{ fontFamily: 'Georgia, serif' }}>
        {/* Header */}
        <div className="text-center mb-4 pb-2 border-b border-gray-300">
          <h1 className="text-lg font-bold">
            {content.contact?.first_name} {content.contact?.last_name}
          </h1>
          <div className="text-xs text-gray-600">
            {content.contact?.email} • {content.contact?.phone}
          </div>
        </div>

        {/* Summary */}
        {content.summary && (
          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase border-b border-gray-200 pb-1 mb-2">Summary</h2>
            <p
              className="text-xs leading-relaxed"
              dangerouslySetInnerHTML={{ __html: highlightText(content.summary) }}
            />
          </div>
        )}

        {/* Experience */}
        {content.experiences?.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase border-b border-gray-200 pb-1 mb-2">Experience</h2>
            {content.experiences.slice(0, 2).map((exp: any, idx: number) => (
              <div key={idx} className="mb-3">
                <div className="font-bold text-xs">{exp.job_title}</div>
                <div className="text-xs text-gray-600">{exp.organization}</div>
                <ul className="mt-1 space-y-1">
                  {exp.bullets?.slice(0, 3).map((bullet: any, bIdx: number) => (
                    <li key={bIdx} className="text-xs flex">
                      <span className="mr-1">•</span>
                      <span dangerouslySetInnerHTML={{
                        __html: highlightText(bullet.translated_text || bullet.original_text)
                      }} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {content.skills?.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase border-b border-gray-200 pb-1 mb-2">Skills</h2>
            <div className="flex flex-wrap gap-1">
              {content.skills.map((skill: any, idx: number) => {
                const isFound = keywordsFound.some((kw: string) =>
                  skill.name.toLowerCase().includes(kw.toLowerCase())
                )
                return (
                  <span
                    key={idx}
                    className={`text-xs px-2 py-0.5 rounded ${
                      isFound ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                    }`}
                  >
                    {skill.name}
                  </span>
                )
              })}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
