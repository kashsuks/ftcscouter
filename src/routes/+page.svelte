<script lang="ts">
  import '$lib/styles/page.css';

  function handleGetStarted() {
    window.location.href = '/scout';
  }
</script>

<svelte:head>
  <title>FTCScouter</title>
</svelte:head>

<div class="landing">
  <div class="landing-content">
    <h1>FTCScouter</h1>
    <p class="tagline">Simple scouting for FTC teams</p>

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

    <button class="start-btn" on:click={handleGetStarted}>
      Get Started
    </button>
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

  @media (max-width: 640px) {
    .features {
      grid-template-columns: 1fr;
    }
  }
</style>