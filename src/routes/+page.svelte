<!-- FILE: src/routes/+page.svelte -->
<script lang="ts">
  import { fetchEventData, isValidEventCode } from '$lib/services/apiService';
  import type { TeamEventParticipation } from '$lib/services/apiService';
  import { showAlert, promptColumnName } from '$lib/utils';
  import '$lib/styles/page.css';

  let eventCode = '';
  let teams: TeamEventParticipation[] = [];
  let customColumns: string[] = [];
  let customData: Record<number, Record<string, string>> = {};

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
      const data = await fetchEventData(eventCode);
      teams = data.teams;
      teams.forEach(team => {
        if (!customData[team.teamNumber]) {
          customData[team.teamNumber] = {};
        }
      });
    } catch (error) {
      showAlert('Failed to fetch event data. Please try again.');
      console.error(error);
    }
  }

  function addCustomColumn() {
    const name = promptColumnName();
    if (name) {
      customColumns = [...customColumns, name];
      teams.forEach(team => {
        if (!customData[team.teamNumber]) {
          customData[team.teamNumber] = {};
        }
        customData[team.teamNumber][name] = '';
      });
    }
  }

  function deleteCustomColumn(colName: string) {
    customColumns = customColumns.filter(col => col !== colName);
    teams.forEach(team => {
      if (customData[team.teamNumber]) {
        delete customData[team.teamNumber][colName];
      }
    });
  }

  function addCustomRow() {
    const teamNumber = prompt('Enter team number:');
    if (teamNumber) {
      const num = parseInt(teamNumber);
      if (!isNaN(num)) {
        const newTeam: TeamEventParticipation = {
          teamNumber: num,
          season: 2025,
          eventCode: eventCode
        };
        teams = [...teams, newTeam];
        customData[num] = {};
        customColumns.forEach(col => {
          customData[num][col] = '';
        });
      }
    }
  }

  function deleteRow(teamNumber: number) {
    teams = teams.filter(t => t.teamNumber !== teamNumber);
    delete customData[teamNumber];
  }

  function updateCustomData(teamNumber: number, column: string, value: string) {
    if (!customData[teamNumber]) {
      customData[teamNumber] = {};
    }
    customData[teamNumber][column] = value;
  }
</script>

<svelte:head>
  <title>FTCScouter</title>
</svelte:head>

<div class="app-container">
  <div class="header">
    <h1 class="app-title">FTCScouter</h1>
    <p class="app-subtitle">Scout the right way</p>
  </div>

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

    {#if teams.length > 0}
      <div class="table-section">
        <div class="table-header">
          <h3 class="table-title">Teams</h3>
          <div class="table-actions">
            <button class="add-col-btn" on:click={addCustomColumn} title="Add Column">
              +
            </button>
            <button class="add-row-btn-small" on:click={addCustomRow} title="Add Row">
              +
            </button>
          </div>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Number</th>
                {#each customColumns as col}
                  <th>
                    <div class="th-content">
                      <span>{col}</span>
                      <button class="delete-col-btn" on:click={() => deleteCustomColumn(col)}>
                        ×
                      </button>
                    </div>
                  </th>
                {/each}
                <th class="actions-header"></th>
              </tr>
            </thead>
            <tbody>
              {#each teams as team}
                <tr>
                  <td class="number-cell">{team.teamNumber}</td>
                  {#each customColumns as col}
                    <td>
                      <input
                        type="text"
                        value={customData[team.teamNumber]?.[col] || ''}
                        on:input={(e) => updateCustomData(team.teamNumber, col, e.currentTarget.value)}
                        class="cell-input"
                      />
                    </td>
                  {/each}
                  <td class="actions-cell">
                    <button class="delete-row-btn" on:click={() => deleteRow(team.teamNumber)}>
                      Delete
                    </button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    {/if}
  </div>
</div>