import type { Component } from 'solid-js'
import { Header, Sidebar, Main } from './components/layouts'
import { Dashboard } from './components/pages'


const App: Component = () => {
    return (
        <div class="flex h-screen">
            <Sidebar />
            <div class="flex flex-1 flex-col">
                <Header />
                <Main>
                    <Dashboard />
                </Main>
            </div>
        </div>
    )
}

export default App
