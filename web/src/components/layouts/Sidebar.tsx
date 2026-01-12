import type { Component } from 'solid-js'
import { CircleCheck, ChevronsDownUp, FolderOpen, Inbox, CircleUser, MessageCircleQuestionMark } from 'lucide-solid'
import MenuItem from '../ui/MenuItem'

const Sidebar: Component = () => {
    return (
        <aside class="w-64 flex-shrink-0 border-r border-border-dark bg-surface-dark flex flex-col justify-between h-full">
            <div class="flex flex-col gap-1 p-3">
                {/* Workspace Header  */}
                <div class="group flex items-center gap-3 px-2 py-3 mb-4 cursor-pointer hover:bg-white/5 rounded-md transition-colors">
                    <div class="bg-center bg-no-repeat bg-cover rounded-md size-8 bg-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-inner" data-alt="Workspace logo abstract gradient" style="background-image: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);">
                        AC
                    </div>
                    <div class="flex flex-col overflow-hidden gap-2">
                        <h1 class="text-white text-sm font-medium leading-tight truncate">Acme Corp</h1>
                        <p class="text-gray-500 text-xs font-normal leading-tight truncate -mt-1">Project 1</p>
                    </div>
                    <ChevronsDownUp class="ml-auto text-gray-400 group-hover:text-primary transition-colors size-4" />
                </div>
                {/* Navigation Links */}
                <div class="space-y-0.5">
                    <MenuItem
                        icon={<CircleCheck class="size-4" />}
                        text="Issues"
                        rightContent="34"
                        active={true}
                    />
                    <MenuItem
                        icon={<FolderOpen class="size-4" />}
                        text="Projects"
                    />
                </div>
                {/* Section Divider  */}
                <div class="h-px bg-border-dark my-2 mx-3"></div>
                {/* Your Work Section  */}
                <div class="space-y-0.5">
                    <div class="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Your Work</div>
                    <MenuItem
                        icon={<Inbox class="size-4" />}
                        text="Inbox"
                    />
                    <MenuItem
                        icon={<CircleUser class="size-4" />}
                        text="My Issues"
                    />
                </div>
                {/* Section Divider  */}
                <div class="h-px bg-border-dark my-2 mx-3"></div>
                {/* Teams Section  */}
                <div class="space-y-0.5">
                    <div class="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Projects</div>
                    <MenuItem
                        icon={<div class="size-2 rounded-full bg-emerald-500"></div>}
                        text="Engineering"
                    />
                    <MenuItem
                        icon={<div class="size-2 rounded-full bg-purple-500"></div>}
                        text="Design"
                    />
                </div>
            </div>
            {/* Sidebar Footer  */}
            <div class="p-3 border-t border-border-dark">
                <MenuItem
                    icon={<MessageCircleQuestionMark class="size-4" />}
                    text="Help & Support"
                />
            </div>
        </aside>
    )
}

export default Sidebar
