import type { Component, ParentComponent } from 'solid-js'

interface MainProps {
  children?: any
}

const Main: ParentComponent<MainProps> = (props) => {
  return <main class="flex-1 p-6">{props.children}</main>
}

export default Main
