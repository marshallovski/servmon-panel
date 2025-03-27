<script>
    let { chartData, autoFetchData, autoRefresh, title } = $props();
    import * as _config from "$lib/config";
    const config = _config.default;

    import Chart from "svelte-frappe-charts";

    import panelAPI from "$lib/api";
    import Logger from "$lib/utils/logger";
    import { onDestroy } from "svelte";

    const logger = new Logger("components/status/hardware/cpu");

    const autoRefreshInterval = config.charts.autoRefreshInterval;

    async function fetchData() {
        const data = await panelAPI.serverStatus("hardware/cpu");

        chartData = {
            labels: ["CPU usage", "CPU max usage"],
            datasets: [
                {
                    name: "CPU usage",
                    values: [data?.usage, 100],
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
        colors={["#1b3bff", "#191f28"]}
        data={chartData}
    />
{/if}
