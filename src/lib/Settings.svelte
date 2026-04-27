<script>
  import { getAllDays, importDays, clearAll, requestPersistence } from './db.js'

  let status = $state('')
  let persisted = $state(null)

  async function checkPersistence() {
    if (navigator.storage?.persisted) {
      persisted = await navigator.storage.persisted()
    }
  }
  $effect(() => {
    checkPersistence()
  })

  async function askPersistence() {
    const ok = await requestPersistence()
    persisted = ok
    status = ok
      ? 'Stockage persistant activé.'
      : 'Demande refusée par le navigateur.'
  }

  async function exportJson() {
    const days = await getAllDays()
    const blob = new Blob(
      [JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), days }, null, 2)],
      { type: 'application/json' },
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `running-tracker-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    status = 'Export généré.'
  }

  async function importJson(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      const days = Array.isArray(data) ? data : data.days
      if (!Array.isArray(days)) throw new Error('Format invalide')
      await importDays(days)
      status = `Import : ${days.length} jours importés. Recharge la page pour rafraîchir.`
    } catch (err) {
      status = `Erreur d'import : ${err.message}`
    }
    e.target.value = ''
  }

  async function reset() {
    if (!confirm('Effacer toutes les données ? Cette action est irréversible.')) return
    await clearAll()
    status = 'Données effacées. Recharge la page.'
  }
</script>

<div class="settings">
  <h2>Paramètres</h2>

  <section>
    <h3>Stockage</h3>
    <p class="muted">
      {#if persisted === true}
        ✓ Stockage persistant : le navigateur ne videra pas tes données.
      {:else if persisted === false}
        Le stockage n'est pas marqué comme persistant. Active-le pour éviter une suppression
        automatique en cas de pression mémoire.
      {:else}
        Vérification…
      {/if}
    </p>
    {#if persisted === false}
      <button onclick={askPersistence}>Activer le stockage persistant</button>
    {/if}
  </section>

  <section>
    <h3>Sauvegarde</h3>
    <p class="muted">Exporte régulièrement tes données en JSON pour les conserver.</p>
    <button onclick={exportJson}>Exporter (JSON)</button>
    <label class="file-btn">
      Importer (JSON)
      <input type="file" accept="application/json" onchange={importJson} hidden />
    </label>
  </section>

  <section>
    <h3>Zone dangereuse</h3>
    <button class="danger" onclick={reset}>Tout effacer</button>
  </section>

  {#if status}
    <p class="status">{status}</p>
  {/if}
</div>

<style>
  .settings {
    padding: 16px 16px 80px;
  }

  h2 {
    margin: 0 0 20px;
    color: var(--text-h);
    font-size: 22px;
  }

  section {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 14px;
    margin-bottom: 12px;
  }

  h3 {
    margin: 0 0 8px;
    color: var(--text-h);
    font-size: 15px;
  }

  .muted {
    color: var(--text-muted);
    font-size: 14px;
    margin: 0 0 12px;
  }

  button,
  .file-btn {
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text-h);
    padding: 8px 14px;
    border-radius: 8px;
    font: inherit;
    font-size: 14px;
    cursor: pointer;
    margin-right: 8px;
    margin-top: 4px;
    display: inline-block;
  }

  button:active,
  .file-btn:active {
    background: var(--surface-active);
  }

  .danger {
    border-color: #ef4444;
    color: #ef4444;
  }

  .status {
    margin-top: 16px;
    padding: 10px 12px;
    background: var(--accent-bg);
    border-radius: 8px;
    color: var(--text-h);
    font-size: 14px;
  }
</style>
