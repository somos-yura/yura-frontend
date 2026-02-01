import React, { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

interface MermaidProps {
  chart: string
}

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  securityLevel: 'loose',
  fontFamily:
    'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  themeVariables: {
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    primaryColor: '#e0e7ff',
    primaryTextColor: '#1f2937',
    primaryBorderColor: '#6366f1',
    lineColor: '#9ca3af',
    secondaryColor: '#f3f4f6',
    tertiaryColor: '#fff',
  },
  flowchart: {
    useMaxWidth: false,
    htmlLabels: true,
    curve: 'basis',
  },
})

export const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const idRef = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`)

  useEffect(() => {
    const renderChart = async () => {
      try {
        setError(null)
        const { svg } = await mermaid.render(idRef.current, chart)
        setSvg(svg)
      } catch (err) {
        console.error('Mermaid render error:', err)
        setError('Error rendering diagram')
        // Mermaid might leave a residual element if it fails
        const element = document.getElementById(idRef.current)
        if (element) {
          element.remove()
        }
      }
    }

    if (chart) {
      renderChart()
    }
  }, [chart])

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-mono">
        {error}
        <pre className="mt-2 text-sm opacity-75 whitespace-pre-wrap">
          {chart}
        </pre>
      </div>
    )
  }

  return (
    <div
      className="mermaid-container my-4 overflow-x-auto bg-white rounded-lg p-4 border border-gray-100 shadow-sm flex justify-center"
      dangerouslySetInnerHTML={{ __html: svg }}
      style={{ minHeight: '100px' }}
    />
  )
}
