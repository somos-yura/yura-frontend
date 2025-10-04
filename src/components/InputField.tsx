import type React from "react"

interface InputFieldProps {
    id: string
    type: string
    value: string
    onChange: (value: string) => void
    placeholder: string
    label: string
    icon: React.ReactNode
    focusColor?: string
}

export const InputField: React.FC<InputFieldProps> = ({
    id,
    type,
    value,
    onChange,
    placeholder,
    label,
    icon,
    focusColor = 'electricBlue'
}) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-darkGray mb-2 font-montserrat">
            {label}
        </label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {icon}
            </div>
            <input
                id={id}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-${focusColor} focus:border-transparent transition-all placeholder-gray-400`}
            />
        </div>
    </div>
)
