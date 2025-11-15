import type React from "react"
import { Loader2 } from "lucide-react"

interface ContactLoadingModalProps {
    isOpen: boolean
    personName: string
}

export const ContactLoadingModal: React.FC<ContactLoadingModalProps> = ({
    isOpen,
    personName,
}) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 border border-border p-8">
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="mb-6">
                        <Loader2 className="w-12 h-12 text-electricBlue animate-spin" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3 font-montserrat">
                        Estamos trabajando en ponerte en contacto con...
                    </h3>
                    <p className="text-lg font-semibold text-electricBlue mb-2">
                        {personName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Por favor espera un momento
                    </p>
                </div>
            </div>
        </div>
    )
}
