import type { Component } from 'solid-js'

const Dashboard: Component = () => {
  return (
    <div class="space-y-6">
      <div class="bg-card text-card-foreground rounded-lg shadow p-6">
        <h2 class="text-2xl font-bold mb-4">Welcome to Lanta</h2>
        <p class="text-muted-foreground">Manage your tasks and projects efficiently.</p>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div class="bg-primary-100 dark:bg-primary-900 rounded-lg shadow p-4">
          <h3 class="font-bold text-primary-900 dark:text-primary-100">Total Projects</h3>
          <p class="text-3xl font-bold text-primary-600 dark:text-primary-400 mt-2">0</p>
        </div>
        <div class="bg-primary-100 dark:bg-primary-900 rounded-lg shadow p-4">
          <h3 class="font-bold text-primary-900 dark:text-primary-100">Active Tasks</h3>
          <p class="text-3xl font-bold text-primary-600 dark:text-primary-400 mt-2">0</p>
        </div>
        <div class="bg-primary-100 dark:bg-primary-900 rounded-lg shadow p-4">
          <h3 class="font-bold text-primary-900 dark:text-primary-100">Completed</h3>
          <p class="text-3xl font-bold text-primary-600 dark:text-primary-400 mt-2">0</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
