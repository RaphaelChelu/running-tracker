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
    overflow-y: auto;
    padding-bottom: 64px;
  }

  .tabbar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 64px;
    background: var(--bg);
    border-top: 1px solid var(--border);
    display: flex;
    z-index: 20;
    padding-bottom: env(safe-area-inset-bottom);
  }

  .tabbar button {
    flex: 1;
    background: none;
    border: none;
    color: var(--text-muted);
    font: inherit;
    font-size: 11px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    cursor: pointer;
    padding: 6px 0;
  }

  .tabbar button.active {
    color: var(--accent);
  }

  .ico {
    font-size: 20px;
  }
</style>
