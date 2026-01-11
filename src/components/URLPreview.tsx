import type React from 'react'
import { ExternalLink, Link as LinkIcon } from 'lucide-react'

interface URLPreviewProps {
  url: string
}

export const URLPreview: React.FC<URLPreviewProps> = ({ url }) => {
  const getDomain = (url: string): string => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname.replace('www.', '')
    } catch {
      return 'URL'
    }
  }

  const getFavicon = (url: string): string => {
    try {
      const urlObj = new URL(url)
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`
    } catch {
      return ''
    }
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border border-gray-200 rounded-lg p-3 bg-white hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
      title="Abrir enlace en nueva pestaña"
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          {getFavicon(url) ? (
            <img
              src={getFavicon(url)}
              alt={getDomain(url)}
              className="w-6 h-6 rounded"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <LinkIcon className="w-6 h-6 text-gray-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
              {getDomain(url)}
            </p>
            <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
          </div>
          <p className="text-xs text-gray-500 truncate mt-0.5">{url}</p>
        </div>
      </div>
    </a>
  )
}
