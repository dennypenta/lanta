import type { Component } from 'solid-js'
import { Header, Sidebar, Main } from './components/layouts'
import { Dashboard } from './components/pages'

const App: Component = () => {
  return (
    <div class="flex flex-col h-screen">
      <Header />
      <div class="flex flex-1">
        <Sidebar />
        <Main>
          <Dashboard />
        </Main>
      </div>
    </div>
  )
}

export default App
