<script lang="ts">
  import '$lib/styles/page.css';
  import { onMount } from 'svelte';

  interface SavedScout {
    id: string;
    name: string;
    eventCode: string;
    savedAt: number;
  }

  let saves: SavedScout[] = [];
  let showSaves = false;

  onMount(() => {
    loadSaves();
  });

  function loadSaves() {
    const savedData = localStorage.getItem('ftc-scouts');
    if (savedData) {
      saves = JSON.parse(savedData);
    }
  }

  function handleNewScout() {
    window.location.href = '/scout';
  }

  function handleLoadScout(id: string) {
    window.location.href = `/scout?load=${id}`;
  }

  function handleDeleteScout(id: string, event: Event) {
    event.stopPropagation();
    if (confirm('Delete this scout? This cannot be undone.')) {
      saves = saves.filter(s => s.id !== id);
      localStorage.setItem('ftc-scouts', JSON.stringify(saves));
      
      // Also delete the actual scout data
      localStorage.removeItem(`ftc-scout-${id}`);
    }
  }

  function formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  }
</script>

<svelte:head>
  <title>FTCScouter</title>
</svelte:head>

<div class="landing">
  <div class="landing-content">
    <h1>FTCScouter</h1>
    <p class="tagline">Simple scouting for FTC competitions</p>
    
    {#if saves.length === 0}
      <div class="features">
        <div class="feature">
          <h3>Track Teams</h3>
          <p>Add custom columns and track any data you need</p>
        </div>
        <div class="feature">
          <h3>Plan Matchups</h3>
          <p>Drag and drop teams to plan alliance selections</p>
        </div>
        <div class="feature">
          <h3>Event Integration</h3>
          <p>Pull team lists directly from FTC Scout API</p>
        </div>
      </div>

      <button class="start-btn" on:click={handleNewScout}>
        Get Started
      </button>
    {:else}
      <div class="saves-section">
        <h2>Your Scouts</h2>
        <div class="saves-list">
          {#each saves as save}
            <div class="save-card" on:click={() => handleLoadScout(save.id)}>
              <div class="save-info">
                <h3>{save.name}</h3>
                <p class="save-event">{save.eventCode}</p>
                <p class="save-time">{formatDate(save.savedAt)}</p>
              </div>
              <button 
                class="delete-save-btn"
                on:click={(e) => handleDeleteScout(save.id, e)}
                title="Delete scout"
              >
                ×
              </button>
            </div>
          {/each}
        </div>
        
        <button class="new-scout-btn" on:click={handleNewScout}>
          + New Scout
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  .landing {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    background: var(--base);
  }

  .landing-content {
    max-width: 800px;
    width: 100%;
    text-align: center;
  }

  h1 {
    font-size: clamp(3rem, 8vw, 5rem);
    font-weight: 900;
    margin: 0 0 20px 0;
    color: var(--text);
    letter-spacing: -0.03em;
  }

  .tagline {
    font-size: 1.25rem;
    color: var(--subtext0);
    margin: 0 0 60px 0;
  }

  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 30px;
    margin-bottom: 60px;
  }

  .feature {
    text-align: left;
    padding: 20px;
    background: var(--surface0);
    border-radius: 8px;
    border: 1px solid var(--surface1);
  }

  .feature h3 {
    margin: 0 0 10px 0;
    color: var(--text);
    font-size: 1.1rem;
    font-weight: 700;
  }

  .feature p {
    margin: 0;
    color: var(--subtext0);
    font-size: 0.95rem;
    line-height: 1.5;
  }

  .start-btn {
    padding: 16px 48px;
    background: var(--blue);
    color: var(--base);
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.15s ease, background 0.15s ease;
  }

  .start-btn:hover {
    background: var(--sapphire);
    transform: translateY(-2px);
  }

  .start-btn:active {
    transform: translateY(0);
  }

  /* Saves Section */
  .saves-section {
    width: 100%;
  }

  .saves-section h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text);
    margin: 0 0 24px 0;
  }

  .saves-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
  }

  .save-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    background: var(--surface0);
    border: 1px solid var(--surface1);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s ease;
    text-align: left;
  }

  .save-card:hover {
    background: var(--surface1);
    transform: translateX(4px);
  }

  .save-info {
    flex: 1;
  }

  .save-info h3 {
    margin: 0 0 4px 0;
    color: var(--text);
    font-size: 1.1rem;
    font-weight: 700;
  }

  .save-event {
    margin: 0 0 4px 0;
    color: var(--blue);
    font-size: 0.9rem;
    font-family: monospace;
  }

  .save-time {
    margin: 0;
    color: var(--subtext0);
    font-size: 0.85rem;
  }

  .delete-save-btn {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    border: none;
    background: transparent;
    color: var(--subtext0);
    font-size: 1.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
    line-height: 1;
    flex-shrink: 0;
  }

  .delete-save-btn:hover {
    background: #f38ba8;
    color: var(--crust);
  }

  .new-scout-btn {
    width: 100%;
    padding: 16px;
    background: transparent;
    color: var(--blue);
    border: 2px dashed var(--surface2);
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .new-scout-btn:hover {
    border-color: var(--blue);
    background: var(--surface0);
  }

  @media (max-width: 640px) {
    .features {
      grid-template-columns: 1fr;
    }

    .save-card {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .delete-save-btn {
      align-self: flex-end;
    }
  }
</style>