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

  interface Matchup {
    red1: string;
    red2: string;
    blue1: string;
    blue2: string;
  }

  let matchups: Matchup[] = [{red1: '', red2: '', blue1: '', blue2: ''}]

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

  function addMatchup() {
    matchups = [...matchups, {red1: '', red2: '', blue1: '', blue2: ''}];
  }

  function deleteMatchup(index: number) {
    if (matchups.length > 1) {
      matchups = matchups.filter((_, i) => i !== index);
    }
  }

  function updateMatchup(index: number, field: keyof Matchup, value: string) {
    matchups[index][field] = value;
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

      <div class="matchups-section">
        <div class="matchups-header">
          <h3 class="table-title">Matchups</h3>
          <button class="add-matchup-btn" on:click={addMatchup} title="Add Matchup">
            +
          </button>
        </div>

        <div class="matchups-container">
          {#each matchups as matchup, index}
            <div class="matchup-row">
              <div class="matchup-alliance red-alliance">
                <input
                  type="text"
                  value={matchup.red1}
                  on:input={(e) => updateMatchup(index, 'red1', e.currentTarget.value)}
                  class="matchup-input red-input"
                  placeholder="Red 1"
                />
                <input
                  type="text"
                  value={matchup.red2}
                  on:input={(e) => updateMatchup(index, 'red2', e.currentTarget.value)}
                  class="matchup-input red-input"
                  placeholder="Red 2"
                />
                <input
                  type="text"
                  value={matchup.blue1}
                  on:input={(e) => updateMatchup(index, 'blue1', e.currentTarget.value)}
                  class="matchup-input blue-input"
                  placeholder="Blue 1"
                />
                <input
                  type="text"
                  value={matchup.blue2}
                  on:input={(e) => updateMatchup(index, 'blue2', e.currentTarget.value)}
                  class="matchup-input blue-input"
                  placeholder="Blue 2"
                />
              </div>
              {#if matchups.length > 1}
                <button class="delete-matchup-btn" on:click={() => deleteMatchup(index)}>
                  x
                </button>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>