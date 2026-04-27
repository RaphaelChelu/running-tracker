<script>
  import { DAY_NAMES_LONG, isToday } from './dateUtils.js'
  import { saveDay } from './db.js'

  let { day = $bindable(), dateObj } = $props()

  const dayName = $derived(DAY_NAMES_LONG[dateObj.isoWeekday() - 1])
  const dayNum = $derived(dateObj.format('DD/MM'))
  const today = $derived(isToday(dateObj))

  let saveTimeout
  function persist() {
    clearTimeout(saveTimeout)
    saveTimeout = setTimeout(() => {
      saveDay({ ...day })
    }, 300)
  }

  function onDescriptionInput(e) {
    day.description = e.target.value
    persist()
  }

  function onKmInput(e) {
    const val = e.target.value
    day.km = val === '' ? 0 : Number(val)
    persist()
  }

  function toggleDone() {
    day.done = !day.done
    persist()
  }
</script>

<article class="day-card" class:today class:done={day.done}>
  <header>
    <div class="day-label">
      <span class="name">{dayName}</span>
      <span class="num">{dayNum}</span>
      {#if today}<span class="badge">Aujourd'hui</span>{/if}
    </div>
    <button
      type="button"
      class="check"
      class:checked={day.done}
      onclick={toggleDone}
      aria-label="Séance réalisée"
    >
      {day.done ? '✓' : ''}
    </button>
  </header>

  <textarea
    class="description"
    placeholder="Décris ta séance…"
    rows="2"
    value={day.description}
    oninput={onDescriptionInput}
  ></textarea>

  <div class="km-row">
    <input
      type="number"
      inputmode="decimal"
      min="0"
      step="0.1"
      class="km"
      value={day.km || ''}
      placeholder="0"
      oninput={onKmInput}
    />
    <span class="unit">km</span>
  </div>
</article>

<style>
  .day-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: border-color 0.15s, background 0.15s;
  }

  .day-card.today {
    border-color: var(--accent);
    box-shadow: 0 0 0 1px var(--accent);
  }

  .day-card.done {
    background: var(--surface-done);
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }

  .day-label {
    display: flex;
    align-items: baseline;
    gap: 8px;
    flex-wrap: wrap;
  }

  .name {
    font-weight: 600;
    color: var(--text-h);
    font-size: 15px;
  }

  .num {
    color: var(--text-muted);
    font-size: 13px;
  }

  .badge {
    background: var(--accent);
    color: white;
    font-size: 11px;
    font-weight: 600;
    padding: 2px 7px;
    border-radius: 999px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }

  .check {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 1.5px solid var(--border);
    background: var(--bg);
    color: var(--text);
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
    flex-shrink: 0;
  }

  .check.checked {
    background: var(--accent);
    border-color: var(--accent);
    color: white;
  }

  .description {
    width: 100%;
    border: 1px solid var(--border);
    background: var(--bg);
    border-radius: 8px;
    padding: 8px 10px;
    font: inherit;
    color: var(--text-h);
    resize: vertical;
    min-height: 40px;
    box-sizing: border-box;
  }

  .description:focus {
    outline: 2px solid var(--accent);
    outline-offset: -1px;
    border-color: var(--accent);
  }

  .km-row {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .km {
    width: 90px;
    padding: 6px 8px;
    border: 1px solid var(--border);
    background: var(--bg);
    border-radius: 8px;
    font: inherit;
    font-size: 16px;
    color: var(--text-h);
    text-align: right;
  }

  .km:focus {
    outline: 2px solid var(--accent);
    outline-offset: -1px;
    border-color: var(--accent);
  }

  .unit {
    color: var(--text-muted);
    font-size: 14px;
  }
</style>
