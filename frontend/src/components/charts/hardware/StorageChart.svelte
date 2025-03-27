<script>
    let { chartData, autoFetchData, autoRefresh, title } = $props();
    import * as _config from "$lib/config";
    const config = _config.default;
    const autoRefreshInterval = config.charts.autoRefreshInterval;

    import Chart from "svelte-frappe-charts";

    import panelAPI from "$lib/api";
    import Logger from "$lib/utils/logger";
    import { onDestroy } from "svelte";

    const logger = new Logger("components/charts/hardware/storage");

    async function fetchData() {
        const data = await panelAPI.serverStatus("hardware/storage");
        const drives = data?.list;

        chartData = {
            labels: drives?.map((d) => d.drive), // drive names
            datasets: [
                {
                    name: "Used space",
                    values: drives?.map((d) => d.usedGB), // Used space values
                },
                {
                    name: "Free space",
                    values: drives?.map((d) => d.freeGB), // Free space values
                },
                {
                    name: "Total space",
                    values: drives?.map((d) => d.totalGB),
                },
            ],
        };
    }

    let updateInterval;

    (async () => {
        if (autoFetchData) {
            await fetchData();
        }

        if (autoRefresh && !autoFetchData) {
            await fetchData();

            updateInterval = setInterval(async () => {
                await fetchData();
            }, autoRefreshInterval);
        }
    })();

    onDestroy(async () => {
        if (updateInterval) clearInterval(updateInterval);
    });
</script>

{#if !chartData}
    <div aria-busy="true" class="is-centered"></div>
{:else}
    <Chart
        {title}
        type="bar"
        animation={false}
        colors={["#65ff00"]}
        data={chartData}
    />
{/if}
