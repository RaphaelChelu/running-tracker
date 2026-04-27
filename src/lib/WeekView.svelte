<script>
  import dayjs from 'dayjs'
  import { weekDays, formatRange, formatDate } from './dateUtils.js'
  import { getDaysBetween } from './db.js'
  import DayCard from './DayCard.svelte'

  let { anchorDate = $bindable() } = $props()

  let days = $state([])
  let loading = $state(true)

  const dates = $derived(weekDays(anchorDate))
  const range = $derived(formatRange(anchorDate))
  const total = $derived(days.reduce((s, d) => s + (Number(d.km) || 0), 0))

  $effect(() => {
    const start = formatDate(dates[0])
    const end = formatDate(dates[6])
    loading = true
    getDaysBetween(start, end).then((stored) => {
      const byDate = new Map(stored.map((d) => [d.date, d]))
      days = dates.map((dateObj) => {
        const key = formatDate(dateObj)
        return (
          byDate.get(key) ?? {
            date: key,
            description: '',
            done: false,
            km: 0,
          }
        )
      })
      loading = false
    })
  })

  function prevWeek() {
    anchorDate = dayjs(anchorDate).subtract(1, 'week')
  }
  function nextWeek() {
    anchorDate = dayjs(anchorDate).add(1, 'week')
  }
  function today() {
    anchorDate = dayjs()
  }
</script>

<header class="week-header">
  <button class="nav" onclick={prevWeek} aria-label="Semaine précédente">←</button>
  <div class="title">
    <div class="range">{range}</div>
    <div class="total">{total.toFixed(1)} km</div>
  </div>
  <button class="nav" onclick={nextWeek} aria-label="Semaine suivante">→</button>
</header>

<div class="today-row">
  <button class="today-btn" onclick={today}>Aujourd'hui</button>
</div>

{#if loading}
  <p class="loading">Chargement…</p>
{:else}
  <div class="days">
    {#each days as day, i (day.date)}
      <DayCard bind:day={days[i]} dateObj={dates[i]} />
    {/each}
  </div>
{/if}

<style>
  .week-header {
    position: sticky;
    top: 0;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 10;
  }

  .title {
    flex: 1;
    text-align: center;
  }

  .range {
    font-weight: 600;
    color: var(--text-h);
    font-size: 15px;
  }

  .total {
    color: var(--accent);
    font-weight: 600;
    font-size: 18px;
    margin-top: 2px;
  }

  .nav {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text-h);
    font-size: 20px;
    cursor: pointer;
    flex-shrink: 0;
  }

  .nav:active {
    background: var(--surface-active);
  }

  .today-row {
    padding: 8px 16px 0;
    display: flex;
    justify-content: center;
  }

  .today-btn {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-muted);
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 13px;
    cursor: pointer;
  }

  .today-btn:active {
    background: var(--surface);
  }

  .days {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px 16px 80px;
  }

  .loading {
    text-align: center;
    color: var(--text-muted);
    padding: 40px;
  }
</style>
