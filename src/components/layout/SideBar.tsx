import { navigationItems } from "./navigationItems"

export function AppSidebar() {
    return (
        <div className="flex h-full w-64 flex-col border-r border-gray-200 bg-lightGray">
            <div className="border-b border-gray-200 p-4 h-16 flex items-center">
                <div className="flex items-center gap-3">
                    <div className="flex w-10 h-10 items-center justify-center rounded-lg bg-blue-500 text-white">
                        <span className="text-lg font-bold" style={{ fontFamily: "var(--font-montserrat)" }}>
                            M
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span
                            className="text-sm font-bold text-gray-900"
                            style={{ fontFamily: "var(--font-montserrat)" }}
                        >
                            MiniWorker
                        </span>
                        <span className="text-xs text-gray-500">Academy</span>
                    </div>
                </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-auto p-2">
                <div className="p-2">
                    <div className="text-xs text-gray-500 px-3 py-2">
                        Navegación Principal
                    </div>
                    <div>
                        <ul className="space-y-1">
                            {navigationItems.map((item) => (
                                <li key={item.title}>
                                    <a 
                                        href={item.url} 
                                        className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                            item.isActive 
                                                ? 'bg-blue-50 text-blue-700' 
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                        title={item.title}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span>{item.title}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}