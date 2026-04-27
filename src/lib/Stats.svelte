<script>
  import { getAllDays } from './db.js'
  import dayjs from 'dayjs'
  import { weekKey } from './dateUtils.js'

  let allDays = $state([])
  let loading = $state(true)

  $effect(() => {
    getAllDays().then((d) => {
      allDays = d
      loading = false
    })
  })

  const totalKm = $derived(allDays.reduce((s, d) => s + (Number(d.km) || 0), 0))
  const sessionsDone = $derived(allDays.filter((d) => d.done).length)
  const sessionsPlanned = $derived(allDays.filter((d) => d.description?.trim()).length)

  const byMonth = $derived.by(() => {
    const m = new Map()
    for (const d of allDays) {
      if (!d.km) continue
      const key = dayjs(d.date).format('YYYY-MM')
      m.set(key, (m.get(key) ?? 0) + Number(d.km))
    }
    return [...m.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .slice(0, 12)
      .map(([month, km]) => ({
        month: dayjs(month + '-01').format('MMM YYYY'),
        km,
      }))
  })

  const byWeek = $derived.by(() => {
    const m = new Map()
    for (const d of allDays) {
      if (!d.km) continue
      const key = weekKey(d.date)
      m.set(key, (m.get(key) ?? 0) + Number(d.km))
    }
    return [...m.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .slice(0, 8)
  })

  const maxMonthKm = $derived(Math.max(1, ...byMonth.map((m) => m.km)))
</script>

<div class="stats">
  <h2>Statistiques</h2>

  {#if loading}
    <p class="muted">Chargement…</p>
  {:else}
    <div class="kpis">
      <div class="kpi">
        <div class="value">{totalKm.toFixed(1)}</div>
        <div class="label">km au total</div>
      </div>
      <div class="kpi">
        <div class="value">{sessionsDone}</div>
        <div class="label">séances faites</div>
      </div>
      <div class="kpi">
        <div class="value">{sessionsPlanned}</div>
        <div class="label">prévues</div>
      </div>
    </div>

    <h3>Km par mois</h3>
    {#if byMonth.length === 0}
      <p class="muted">Aucune donnée.</p>
    {:else}
      <ul class="bars">
        {#each byMonth as m}
          <li>
            <span class="bar-label">{m.month}</span>
            <div class="bar-bg">
              <div class="bar-fill" style="width: {(m.km / maxMonthKm) * 100}%"></div>
            </div>
            <span class="bar-val">{m.km.toFixed(1)}</span>
          </li>
        {/each}
      </ul>
    {/if}

    <h3>Km par semaine (récentes)</h3>
    {#if byWeek.length === 0}
      <p class="muted">Aucune donnée.</p>
    {:else}
      <ul class="weeks">
        {#each byWeek as [wk, km]}
          <li><span>{wk}</span><strong>{km.toFixed(1)} km</strong></li>
        {/each}
      </ul>
    {/if}
  {/if}
</div>

<style>
  .stats {
    padding: 16px 16px 80px;
  }

  h2 {
    margin: 0 0 16px;
    color: var(--text-h);
    font-size: 22px;
  }

  h3 {
    color: var(--text-h);
    font-size: 16px;
    margin: 24px 0 12px;
  }

  .muted {
    color: var(--text-muted);
  }

  .kpis {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .kpi {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 12px;
    text-align: center;
  }

  .value {
    font-size: 22px;
    font-weight: 700;
    color: var(--accent);
  }

  .label {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 4px;
  }

  .bars {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .bars li {
    display: grid;
    grid-template-columns: 80px 1fr 60px;
    align-items: center;
    gap: 8px;
    font-size: 13px;
  }

  .bar-label {
    color: var(--text-muted);
  }

  .bar-bg {
    height: 8px;
    background: var(--surface);
    border-radius: 4px;
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    background: var(--accent);
    border-radius: 4px;
  }

  .bar-val {
    text-align: right;
    color: var(--text-h);
    font-weight: 600;
  }

  .weeks {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .weeks li {
    display: flex;
    justify-content: space-between;
    padding: 8px 12px;
    background: var(--surface);
    border-radius: 8px;
    font-size: 14px;
  }

  .weeks strong {
    color: var(--accent);
  }
</style>
