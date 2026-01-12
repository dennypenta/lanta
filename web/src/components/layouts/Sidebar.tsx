import type { Component } from 'solid-js'
import { CircleCheck, ChevronsDownUp, FolderOpen, Inbox, CircleUser, MessageCircleQuestionMark } from 'lucide-solid'

const Sidebar: Component = () => {
    return (
        <aside class="w-64 flex-shrink-0 border-r border-border-dark bg-surface-dark flex flex-col justify-between h-full">
            <div class="flex flex-col gap-1 p-3">
                {/* Workspace Header  */}
                <div class="flex items-center gap-3 px-2 py-3 mb-4 cursor-pointer hover:bg-white/5 rounded-md transition-colors">
                    <div class="bg-center bg-no-repeat bg-cover rounded-md size-8 bg-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-inner" data-alt="Workspace logo abstract gradient" style="background-image: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);">
                        AC
                    </div>
                    <div class="flex flex-col overflow-hidden gap-2">
                        <h1 class="text-white text-sm font-medium leading-tight truncate">Acme Corp</h1>
                        <p class="text-gray-500 text-xs font-normal leading-tight truncate -mt-1">project 1</p>
                    </div>

                    <ChevronsDownUp class="material-symbols-outlined text-primary group-hover:text-white transition-colors size-4" />
                </div>
                {/* Navigation Links */}
                <div class="space-y-0.5">
                    <div class="flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-white/5 text-white cursor-pointer group">
                        <CircleCheck class="material-symbols-outlined text-primary group-hover:text-white transition-colors size-4" />
                        <span class="text-sm font-medium">Issues</span>
                        <span class="ml-auto text-xs text-gray-500 font-mono">34</span>
                    </div>
                    <div class="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-colors">
                        <FolderOpen class="material-symbols-outlined text-primary group-hover:text-white transition-colors size-4" />
                        <span class="text-sm font-medium">Projects</span>
                    </div>
                </div>
                {/* Section Divider  */}
                <div class="h-px bg-border-dark my-2 mx-3"></div>
                {/* Your Work Section  */}
                <div class="space-y-0.5">
                    <div class="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Your Work</div>
                    <div class="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-colors">
                        <Inbox class="material-symbols-outlined size-4" />
                        <span class="text-sm font-medium">Inbox</span>
                    </div>
                    <div class="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-colors">
                        <CircleUser class="material-symbols-outlined size-4" />
                        <span class="text-sm font-medium">My Issues</span>
                    </div>
                </div>
                {/* Section Divider  */}
                <div class="h-px bg-border-dark my-2 mx-3"></div>
                {/* Teams Section  */}
                <div class="space-y-0.5">
                    <div class="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Projects</div>
                    <div class="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-colors">
                        <div class="size-2 rounded-full bg-emerald-500"></div>
                        <span class="text-sm font-medium">Engineering</span>
                    </div>
                    <div class="flex items-center gap-2.5 px-3 py-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-colors">
                        <div class="size-2 rounded-full bg-purple-500"></div>
                        <span class="text-sm font-medium">Design</span>
                    </div>
                </div>
            </div>
            {/* Sidebar Footer  */}
            <div class="p-3 border-t border-border-dark">
                <button class="flex w-full items-center gap-2 px-3 py-2 rounded-md hover:bg-white/5 text-gray-400 hover:text-white text-sm transition-colors">
                    <MessageCircleQuestionMark class="material-symbols-outlined" />
                    <span>Help &amp; Support</span>
                </button>
            </div>
        </aside>
    )
}

export default Sidebar
