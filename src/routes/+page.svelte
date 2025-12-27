<script lang="ts">
    import { modeStore } from '$lib/stores/modeStore';
    import { tableStore } from '$lib/stores/tableStore';
    import { fetchEventData, isValidEventCode } from '$lib/services/apiService';
    import { promptColumnName, showAlert } from '$lib/utils';
    import type { Mode } from '$lib/types';
    import '$lib/styles/page.css';

    let hoveredBtn: string | null = null;
    let eventCode = '';

    //subscribing to stores
    let mode: Mode;
    let tableData: typeof $tableStore;

    $: mode = $modeStore;
    $: tableData = $tableStore;

    function handleAddColumn() {
        const name = promptColumnName();
        if (name) {
            tableStore.addColumn(name);
        }
    }

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
            showAlert(`Fetching data for event: ${eventCode}`)
            const data = await fetchEventData(eventCode);
            console.log('Event data:', data);
            //TODO: process and display event data
        } catch (error) {
            showAlert('Failed to fetch event data. Please try again.')
            console.error(error);
        }
    }
</script>

<svelte:head>
    <title>FTCScouter</title>
</svelte:head>

<div class="app-container">
    <div class="header">
        <h1 class="app-title">FTCScouter</h1>

        <div class="mode-buttons">
            {#each ['auto', 'manual'] as m}
                <div class="btn-wrapper">
                    <button
                        class="mode-btn"
                        class:active={mode === m}
                        on:click={() => modeStore.setMode(m)}
                        on:mouseenter={() => hoveredBtn = m}
                        on:mouseleave={() => hoveredBtn = null}
                    >
                        {m}
                    </button>

                    {#if hoveredBtn === m}
                        <div class="tooltip">
                            {m === 'auto' ? 'Pull team info + stats' : 'Enter team details yourself'}
                            <div class="tooltip-arrow" />
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>

    <div class="content-area">
        {#if !mode}
        <div class="placeholder">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
            <h2>Select a mode</h2>
            <p>Choose Auto or Manual to get started</p>
        </div>
    {/if}

    {#if mode === 'auto'}
        <div class="auto-mode">
            <h2 class="section-title">Enter event code</h2>
            <div class="input-group">
                <input
                    type="text"
                    bind:value={eventCode}
                    placeholder="e.g., USMIDET"
                    class="event-input"
                />
                <button class="fetch-btn" on:click={handleFetchEventData}>
                    Fetch event data
                </button>
            </div>
        </div>
    {/if}

    {#if mode === 'manual'}
        <div class="manual-mode">
            <div class="table-header">
                <h2 class="section-title">Team Data</h2>
                <button class="add-col-btn" on:click={handleAddColumn} title="Add column">
                    +
                </button>
            </div>

            <div class="table-wrapper">
                <table class="data-table">
                    <thead>
                        <tr>
                            {#each tableData.columns as col, idx}
                                <th>
                                    {col}
                                    {#if tableData.columns.length > 1}
                                        <button class="delete-col-btn" on:click={() => tableStore.deleteColumn(idx)}>
                                            +
                                        </button>
                                    {/if}
                                </th>
                            {/each}
                            <th class="actions-col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each tableData.rows as row, rowIdx}
                            <tr>
                                {#each row as cell, colIdx}
                                    <td>
                                        <input
                                            type="text"
                                            value={cell}
                                            on:input={(e) => tableStore.updateCell(rowIdx, colIdx, e.currentTarget.value)}
                                            class="cell-input"
                                        />
                                    </td>
                                {/each}
                                <td class="actions-col">
                                    {#if tableData.rows.length > 1}
                                        <button class="delete-row-btn" on:click={() => tableStore.deleteRow(rowIdx)}>
                                            Delete
                                        </button>
                                    {/if}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>

            <button class="add-row-btn" on:click={() => tableStore.addRow()}>
                <span class="plus-icon">+</span> Add Row
            </button>
        </div>
    {/if}
    </div>
</div>