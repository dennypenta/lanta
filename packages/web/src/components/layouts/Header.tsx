import type { Component } from 'solid-js'
import { Search, Bell, Plus } from 'lucide-solid'

const Header: Component = () => {
    return (
        <header class="flex-shrink-0 h-14 border-b border-border-dark flex items-center justify-between px-6 bg-surface-dark/50 backdrop-blur-sm z-10">
            {/* Center: Search */}
            <div class="flex-1 max-w-lg px-8">
                <div class="relative group">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search class="material-symbols-outlined text-gray-500 group-focus-within:text-primary transition-colors size-4" />
                    </div>
                    <input
                        class="block w-full pl-10 pr-3 py-1.5 border-none rounded-md leading-5 bg-card-dark text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-dark transition-all sm:text-sm h-9"
                        placeholder="Search tasks..."
                        type="text"
                    />
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span class="text-gray-600 text-xs border border-gray-700 rounded px-1.5 py-0.5">
                            ⌘F
                        </span>
                    </div>
                </div>
            </div>

            {/* Right Side: Actions */}
            <div class="flex items-center gap-3">
                <button class="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-white/5 transition-colors">
                    <Bell class="material-symbols-outlined size-4" />
                </button>
                <button class="flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white text-xs font-medium h-8 px-3 rounded-md transition-colors shadow-lg shadow-blue-500/20">
                    <Plus class="material-symbols-outlined size-4" />
                    Create Task
                </button>
            </div>
        </header>
    )
}

export default Header
