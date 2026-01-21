import type React from 'react'
import { User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Mermaid } from '../ui/Mermaid'
import { type Message } from '../../types/chat'
import { type Challenge } from '../../types/challenge'
import { formatTime } from '../../utils/chatHelpers'

interface MessageListProps {
  messages: Message[]
  challenge: Challenge | null
  getAvatarInitials: (challenge: Challenge | null) => string
  hasMoreMessages: boolean
  onLoadMore: () => void
  isTyping: boolean
  messagesEndRef: React.RefObject<HTMLDivElement | null>
  cleanDiagramDescriptions: (content: string) => string
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  challenge,
  getAvatarInitials,
  hasMoreMessages,
  onLoadMore,
  isTyping,
  messagesEndRef,
  cleanDiagramDescriptions,
}) => {
  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50/50 to-white">
      <div className="w-full max-w-4xl mx-auto px-6 py-6">
        <div className="space-y-6">
          {messages.length > 0 && (
            <div className="space-y-4">
              {hasMoreMessages && (
                <div className="flex justify-center py-2">
                  <button
                    onClick={onLoadMore}
                    className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Cargar más
                  </button>
                </div>
              )}
              {messages.map((message, index) => {
                const isUser = message.role === 'user'
                const isConsecutive =
                  index > 0 && messages[index - 1].role === message.role

                return (
                  <div
                    key={message.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}
                  >
                    <div
                      className={`flex max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}
                    >
                      {/* Avatar */}
                      {!isUser && !isConsecutive ? (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center text-blue-700 font-bold text-xs shadow-sm flex-shrink-0 mb-1 ring-2 ring-white border border-blue-100">
                          {getAvatarInitials(challenge)}
                        </div>
                      ) : isUser && !isConsecutive ? (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-xs shadow-sm flex-shrink-0 mb-1">
                          <User className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-8 flex-shrink-0" />
                      )}

                      <div
                        className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                      >
                        {/* Message Bubble */}
                        <div
                          className={`relative px-4 py-2.5 shadow-sm w-fit ${
                            isUser
                              ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm'
                              : 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm'
                          }`}
                        >
                          <div className="text-sm leading-relaxed break-words markdown-content">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                code: ({
                                  inline,
                                  className,
                                  children,
                                  ...props
                                }: React.ComponentPropsWithoutRef<'code'> & {
                                  inline?: boolean
                                }) => {
                                  const match = /language-(\w+)/.exec(
                                    className || ''
                                  )
                                  if (
                                    !inline &&
                                    match &&
                                    match[1] === 'mermaid'
                                  ) {
                                    return (
                                      <div className="my-4 overflow-hidden rounded-lg bg-white p-2 shadow-sm border border-gray-100">
                                        <Mermaid
                                          chart={String(children).replace(
                                            /\n$/,
                                            ''
                                          )}
                                        />
                                      </div>
                                    )
                                  }

                                  return !inline && match ? (
                                    <div className="rounded-lg bg-gray-900 p-3 my-2 overflow-x-auto">
                                      <code className={className} {...props}>
                                        {children}
                                      </code>
                                    </div>
                                  ) : (
                                    <code
                                      className={`${className} ${
                                        isUser
                                          ? 'bg-blue-700/30 text-white'
                                          : 'bg-gray-100 text-gray-800'
                                      } px-1.5 py-0.5 rounded text-xs font-mono`}
                                      {...props}
                                    >
                                      {children}
                                    </code>
                                  )
                                },
                                p: ({ children }) => (
                                  <p className="mb-1 last:mb-0">{children}</p>
                                ),
                                ul: ({ children }) => (
                                  <ul className="list-disc ml-4 mb-2">
                                    {children}
                                  </ul>
                                ),
                                ol: ({ children }) => (
                                  <ol className="list-decimal ml-4 mb-2">
                                    {children}
                                  </ol>
                                ),
                                li: ({ children }) => (
                                  <li className="mb-1">{children}</li>
                                ),
                                a: ({ href, children }) => (
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`underline ${isUser ? 'text-white' : 'text-blue-600'} hover:opacity-80`}
                                  >
                                    {children}
                                  </a>
                                ),
                              }}
                            >
                              {cleanDiagramDescriptions(message.content)}
                            </ReactMarkdown>
                          </div>
                        </div>

                        {/* Timestamp below bubble */}
                        <div
                          className={`text-[10px] text-gray-400 mt-1 ${isUser ? 'mr-1' : 'ml-1'}`}
                        >
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center text-blue-700 font-bold text-xs shadow-sm flex-shrink-0 border border-blue-100">
                    {getAvatarInitials(challenge)}
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-md px-5 py-3.5 shadow-sm">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
