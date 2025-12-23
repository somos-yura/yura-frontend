import type React from 'react'
import type { ChallengeCardProps } from '../types/components'

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onExplore,
}) => {
  const handleExplore = () => {
    onExplore?.(challenge)
  }

  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * challenge.images.length)
    return challenge.images[randomIndex]
  }

  const getCategoryDisplay = () => {
    return challenge.category[0]
  }

  return (
    <div
      onClick={handleExplore}
      className="relative border-2 border-gray-200 rounded-3xl overflow-hidden transition-all duration-300 group hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex flex-col h-[420px] cursor-pointer bg-white hover:-translate-y-2 hover:border-blue-300"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={getRandomImage()}
          alt={challenge.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/95 text-gray-900 px-4 py-2 rounded-full shadow-xl backdrop-blur-md border border-white/60 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
            {getCategoryDisplay()}
          </span>
        </div>

        {/* Decorative gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/10 group-hover:to-purple-600/10 transition-all duration-300"></div>
      </div>

      <div className="relative flex-1 flex flex-col p-6">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 font-montserrat line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
            {challenge.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
            {challenge.description}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation()
            handleExplore()
          }}
          className="w-full bg-gradient-to-r from-sky-500 to-sky-400 text-white font-montserrat font-bold py-4 px-4 rounded-2xl hover:from-sky-600 hover:to-sky-500 hover:shadow-2xl hover:shadow-sky-300 transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
        >
          <span>Explorar reto</span>
        </button>
      </div>
    </div>
  )
}
