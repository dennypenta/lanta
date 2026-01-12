import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'

interface MenuItemProps {
    /** Left icon component */
    icon?: JSX.Element
    /** Label text */
    text: string
    /** Right content (text or icon) */
    rightContent?: JSX.Element | string
    /** Whether the item is active/selected */
    active?: boolean
    /** Click handler */
    onClick?: () => void
    /** Additional CSS classes */
    class?: string
}

const MenuItem: Component<MenuItemProps> = (props) => {
    const [local, others] = splitProps(props, ['icon', 'text', 'rightContent', 'active', 'onClick', 'class'])

    return (
        <div
            class={`flex items-center gap-2.5 px-3 py-1.5 rounded-md cursor-pointer transition-colors group ${
                local.active
                    ? 'bg-white/5 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
            } ${local.class || ''}`}
            onClick={local.onClick}
            {...others}
        >
            {local.icon && (
                <div class="text-gray-400 group-hover:text-primary transition-colors size-4 flex items-center justify-center">
                    {local.icon}
                </div>
            )}
            <span class="text-sm font-medium">{local.text}</span>
            {local.rightContent && (
                <span class="ml-auto text-xs text-gray-500 font-mono">
                    {local.rightContent}
                </span>
            )}
        </div>
    )
}

export default MenuItem
