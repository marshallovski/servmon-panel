<script>
    let { chartData, autoFetchData, autoRefresh, title } = $props();
    import * as _config from "$lib/config";
    const config = _config.default;
    const autoRefreshInterval = config.charts.autoRefreshInterval;

    import Chart from "svelte-frappe-charts";

    import panelAPI from "$lib/api";
    import Logger from "$lib/utils/logger";
    import { onDestroy } from "svelte";

    const logger = new Logger("components/charts/network");

    async function fetchData() {
        const data = await panelAPI.serverStatus("network");

        chartData = {
            labels: ["Download", "Upload"],
            datasets: [
                {
                    name: data?.stats?.interface,
                    values: [data?.stats?.download, data?.stats?.upload],
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
    <Chart {title} type="bar" colors={["#00bdff"]} data={chartData} />
{/if}
