<!-- FILE: src/routes/+page.svelte -->
<script lang="ts">
  import { fetchEventData, isValidEventCode } from '$lib/services/apiService';
  import { showAlert } from '$lib/utils';
  import '$lib/styles/page.css';

  let eventCode = '';

  async function handleFetchEventData() {
    if (!eventCode.trim()) {
      showAlert('Please enter an event code');
      return;
    }

    if (!isValidEventCode(eventCode)) {
      showAlert('Invalid event code format');
      return;
    }

    try {
      showAlert(`Fetching data for event: ${eventCode}`);
      const data = await fetchEventData(eventCode);
      console.log('Event data:', data);
      // TODO: Process and display event data
    } catch (error) {
      showAlert('Failed to fetch event data. Please try again.');
      console.error(error);
    }
  }
</script>

<svelte:head>
  <title>FTCScouter</title>
</svelte:head>

<div class="app-container">
  <!-- Header -->
  <div class="header">
    <h1 class="app-title">FTCScouter</h1>
    <p class="app-subtitle">Scout the right way</p>
  </div>

  <!-- Content Area -->
  <div class="content-area">
    <h2 class="section-title">Enter Event Code</h2>
    <div class="input-group">
      <input
        type="text"
        bind:value={eventCode}
        placeholder="e.g., USMIDET"
        class="event-input"
      />
      <button class="fetch-btn" on:click={handleFetchEventData}>
        Fetch Event Data
      </button>
    </div>
  </div>
</div>