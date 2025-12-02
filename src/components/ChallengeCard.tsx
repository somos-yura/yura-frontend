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
      className="relative border border-border rounded-xl overflow-hidden transition-all duration-300 group hover:shadow-[0_0_30px_rgba(59,130,246,0.4),0_0_60px_rgba(59,130,246,0.4)] shadow-[0_1px_3px_rgba(0,0,0,0.1)] flex flex-col h-[480px] cursor-pointer"
    >
      <img
        src={getRandomImage()}
        alt={challenge.title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 z-0"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/95 z-[1]" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex-1 flex flex-col justify-end p-4">
          <div className="absolute top-4 right-4">
            <span className="text-xs font-medium bg-white/90 text-foreground px-3 py-1 rounded-full backdrop-blur-sm">
              {getCategoryDisplay()}
            </span>
          </div>

          <div className="mt-auto">
            <h3 className="text-lg font-bold text-white font-montserrat line-clamp-2 overflow-hidden text-ellipsis mb-2">
              {challenge.title}
            </h3>
            <p className="text-white/90 text-sm leading-relaxed line-clamp-2 overflow-hidden text-ellipsis mb-4">
              {challenge.description}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleExplore()
              }}
              className="w-full bg-electricBlue text-white font-montserrat font-semibold py-3 px-4 rounded-lg hover:bg-[#1873CC] hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Explorar reto
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
