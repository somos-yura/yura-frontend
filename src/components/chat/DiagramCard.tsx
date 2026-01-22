import type React from 'react'
import { useState } from 'react'
import { FileText, ChevronDown, ChevronUp } from 'lucide-react'
import { type Diagram } from '../../services/chatApi'
import { Mermaid } from '../ui/Mermaid'

interface DiagramCardProps {
  diagram: Diagram
  index: number
  total: number
}

export const DiagramCard: React.FC<DiagramCardProps> = ({
  diagram,
  index,
  total,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="group border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-md transition-all duration-200 overflow-hidden bg-white">
      {/* Card Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-100 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-white rounded-md shadow-sm border border-gray-100">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-lg border border-blue-100 uppercase tracking-wide">
              Diagrama {total - index}
            </span>
            <span className="text-xs text-gray-500 mt-1">
              {new Date(diagram.created_at).toLocaleString('es-ES', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {/* Diagram Content - Accordion */}
      {isOpen && (
        <div className="p-3 animate-in slide-in-from-top-2 duration-200">
          <div className="rounded-lg border border-gray-200 overflow-hidden bg-gradient-to-br from-gray-50 to-white">
            <Mermaid chart={diagram.code} />
          </div>
          {/* Description */}
          {diagram.description && (
            <div className="mt-3 px-1">
              <p className="text-xs text-gray-700 leading-relaxed">
                {diagram.description}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
