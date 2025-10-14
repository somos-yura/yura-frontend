import type React from "react"
import type { ChallengeCardProps } from "../types/components"

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onExplore }) => {
    const handleExplore = () => {
        onExplore?.(challenge)
    }

    return (
        <div className="bg-white border border-border rounded-xl overflow-hidden transition-all duration-300 group hover:shadow-[0_0_30px_rgba(59,130,246,0.4),0_0_60px_rgba(59,130,246,0.4)] shadow-[0_1px_3px_rgba(0,0,0,0.1)] flex flex-col h-[480px]">
            <div className="relative h-80 overflow-hidden">
                <img
                    src={challenge.image || "/placeholder.svg"}
                    alt={challenge.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                    <span className="text-xs font-medium bg-white/90 text-foreground px-3 py-1 rounded-full backdrop-blur-sm">
                        {challenge.category}
                    </span>
                </div>
            </div>
            <div className="bg-white p-4 border-b border-border flex-shrink-0">
                <h3 className="text-lg font-bold text-electricBlue font-montserrat line-clamp-2">
                    {challenge.title}
                </h3>
            </div>
            <div className="p-4 bg-white flex-1 flex flex-col">
                <div className="flex-1 min-h-[100px] max-h-[140px] overflow-hidden">
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-5">
                        {challenge.description}
                    </p>
                </div>
                <button
                    onClick={handleExplore}
                    className="w-full bg-electricBlue text-white font-montserrat font-semibold py-3 px-4 rounded-lg hover:bg-[#1873CC] hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 mt-4"
                >
                    Explorar reto
                </button>
            </div>
        </div>
    )
}
