<script>
    let { chartData, autoFetchData, autoRefresh, title } = $props();
    import * as _config from "$lib/config";
    const config = _config.default;
    const autoRefreshInterval = config.charts.autoRefreshInterval;

    import Chart from "svelte-frappe-charts";

    import panelAPI from "$lib/api";
    import Logger from "$lib/utils/logger";
    import { onDestroy } from "svelte";

    const logger = new Logger("components/charts/hardware/ram");

    async function fetchData() {
        const data = await panelAPI.serverStatus("hardware/ram");

        chartData = {
            labels: ["RAM usage", "RAM total"],
            datasets: [
                {
                    name: "RAM usage",
                    values: [data?.used?.toFixed(1), data?.total?.toFixed(1)],
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
        type="donut"
        colors={["#00c30e", "#191f28"]}
        data={chartData}
    />
{/if}
