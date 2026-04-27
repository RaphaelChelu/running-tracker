<script>
  import dayjs from 'dayjs'
  import WeekView from './lib/WeekView.svelte'
  import Stats from './lib/Stats.svelte'
  import Settings from './lib/Settings.svelte'
  import { requestPersistence } from './lib/db.js'

  let view = $state('week')
  let anchorDate = $state(dayjs())

  $effect(() => {
    requestPersistence()
  })
</script>

<main>
  {#if view === 'week'}
    <WeekView bind:anchorDate />
  {:else if view === 'stats'}
    <Stats />
  {:else if view === 'settings'}
    <Settings />
  {/if}
</main>

<nav class="tabbar">
  <button class:active={view === 'week'} onclick={() => (view = 'week')}>
    <span class="ico">📅</span><span>Semaine</span>
  </button>
  <button class:active={view === 'stats'} onclick={() => (view = 'stats')}>
    <span class="ico">📊</span><span>Stats</span>
  </button>
  <button class:active={view === 'settings'} onclick={() => (view = 'settings')}>
    <span class="ico">⚙️</span><span>Réglages</span>
  </button>
</nav>

<style>
  main {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }

  .tabbar {
    flex-shrink: 0;
    background: var(--bg);
    border-top: 1px solid var(--border);
    display: flex;
    z-index: 20;
    padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
  }

  .tabbar button {
    flex: 1;
    background: none;
    border: none;
    color: var(--text-muted);
    font: inherit;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    cursor: pointer;
    padding: 6px 0;
    min-height: 56px;
  }

  .tabbar button.active {
    color: var(--accent);
  }

  .ico {
    font-size: 20px;
  }
</style>
