<script>
    import panelAPI from "$lib/api";
    import { onDestroy, onMount } from "svelte";

    import * as _config from "$lib/config";
    const config = _config.default;

    import CpuChart from "../../../components/charts/hardware/CpuChart.svelte";
    import RamChart from "../../../components/charts/hardware/RamChart.svelte";
    import StorageChart from "../../../components/charts/hardware/StorageChart.svelte";
    import NetworkChart from "../../../components/charts/NetworkChart.svelte";
    import PageLoader from "../../../components/PageLoader.svelte";

    import Logger from "$lib/utils/logger";

    const logger = new Logger("routes/server/status");

    const autoRefreshInterval = config.charts.autoRefreshInterval;

    let isLoading = $state(true);

    let serverInfo = $state({});
    let cpuData = $state({});
    let ramData = $state({});
    let storageData = $state({});
    let gpuData = $state({});

    let ramUsage = $state({});

    let cpuChartData = $state({});
    let ramChartData = $state({});

    let uptimeData = $state({});
    let uptimeString = $state("");

    let uptimeInterval;
    let cpuRamInterval;

    async function getServerInfo() {
        const data = await panelAPI.serverInfo("env");
        serverInfo = data;
    }

    async function getStatusData(key) {
        const data = await panelAPI.serverStatus(key);
        return data;
    }

    async function fetchCpuStatus() {
        const data = await panelAPI.serverStatus("hardware/cpu");
        cpuData = data;
    }

    async function fetchRamStatus() {
        const data = await panelAPI.serverStatus("hardware/ram");
        ramData = data;
    }

    async function fetchUptime() {
        uptimeData = await getStatusData("hardware/uptime");
        uptimeString = `${uptimeData.hours} hours, ${uptimeData.minutes} minutes, ${uptimeData.seconds} seconds`;
    }

    onMount(async () => {
        try {
            await getServerInfo();

            cpuData = await getStatusData("hardware/cpu");
            ramData = await getStatusData("hardware/ram");
            storageData = await getStatusData("hardware/storage");
            gpuData = await panelAPI.serverInfo("hardware/gpu");

            // chart data
            cpuChartData = {
                labels: ["CPU usage", "CPU max usage"],
                datasets: [
                    {
                        name: "CPU usage",
                        values: [cpuData.usage, 100],
                    },
                ],
            };

            ramChartData = {
                labels: ["RAM usage", "RAM total"],
                datasets: [
                    {
                        name: "RAM usage",
                        values: [
                            ramData.used?.toFixed(1),
                            ramData.total?.toFixed(1),
                        ],
                    },
                ],
            };

            uptimeInterval = setInterval(async () => {
                await fetchUptime();
            }, 1000);

            // here's updating both CPU and RAM data
            // storage and network are updating by itself
            cpuRamInterval = setInterval(async () => {
                await fetchCpuStatus();
                cpuChartData = {
                    labels: ["CPU usage", "CPU max usage"],
                    datasets: [
                        {
                            name: "CPU usage",
                            values: [cpuData.usage, 100],
                        },
                    ],
                };

                await fetchRamStatus();
                ramChartData = {
                    labels: ["RAM usage", "RAM total"],
                    datasets: [
                        {
                            name: "RAM usage",
                            values: [
                                ramData.used?.toFixed(1),
                                ramData.total?.toFixed(1),
                            ],
                        },
                    ],
                };

                ramUsage = {
                    // gigabytes
                    used: (ramData.used / 1000).toFixed(1),
                    total: (ramData.total / 1024).toFixed(1),
                };
            }, autoRefreshInterval);
        } catch (error) {
            logger.warn(`failed to fetch data: ${error}`);
        } finally {
            isLoading = false;
        }
    });

    onDestroy(async () => {
        clearInterval(cpuRamInterval);
        clearInterval(uptimeInterval);
    });
</script>

<svelte:head>
    <title>Server status - ServmonPanel</title>
</svelte:head>

{#if isLoading}
    <PageLoader />
{:else}
    <section class="mt-2 mb-2">
        <h2 class="text-normal">
            Server "{serverInfo.hostname}"
            <small>({serverInfo.serverId})</small>
        </h2>

        {#if uptimeString}
            <small>Uptime: {uptimeString}</small>
        {:else}
            <small>Uptime: <span aria-busy="true"></span></small>
        {/if}
    </section>

    <section>
        <article class="grid">
            <article class="card">
                <header>
                    <h3 class="card-title">
                        <i class="material-icons card-icon">developer_board</i>
                        <span class="card-title">CPU</span>
                    </h3>
                </header>

                <section class="mb-2">
                    <div class="grid">
                        <div>
                            <h6>CPU model:</h6>
                            <small>{cpuData.name}</small>
                        </div>

                        <div>
                            <h6>CPU cores:</h6>
                            <small>{cpuData.cores}</small>
                        </div>

                        <div>
                            <h6>CPU speed (average):</h6>
                            <small>
                                {cpuData.speed} GHz/{cpuData.speedMax} GHz
                            </small>
                        </div>

                        <div>
                            <h6>CPU temp.:</h6>
                            <small>{cpuData.temp}C</small>
                        </div>
                    </div>
                </section>

                <details open>
                    <summary>Chart</summary>
                    <CpuChart
                        title="CPU usage (in %)"
                        chartData={cpuChartData}
                    />
                </details>
            </article>

            <article class="card">
                <header>
                    <h3 class="card-title">
                        <i class="material-icons card-icon">memory</i>
                        <span class="card-title">RAM</span>
                    </h3>
                </header>

                <div class="grid">
                    {#if ramData.type}
                        <div>
                            <h6>RAM type:</h6>
                            <small>{ramData.type}</small>
                        </div>
                    {/if}

                    <div>
                        <h6>
                            Current usage:
                            {#if !ramUsage.used || !ramUsage.total}
                                <small aria-busy="true"></small>
                            {:else}
                                <small class="text-normal">
                                    {ramUsage?.used} GB/{ramUsage?.total} GB
                                </small>
                            {/if}
                        </h6>
                    </div>
                </div>

                <details open>
                    <summary>Chart</summary>
                    <RamChart
                        title="RAM usage (in MB)"
                        chartData={ramChartData}
                    />
                </details>
            </article>
        </article>
    </section>

    <section class="mt-2">
        <article class="card">
            <header class="card-header_special">
                <h3 class="card-title">
                    <i class="material-icons card-icon">lan</i>
                    <span class="card-title">Network</span>
                </h3>
            </header>

            <details open>
                <summary>Chart</summary>
                <NetworkChart autoRefresh={true} />
            </details>
        </article>
    </section>

    <section>
        <article class="card">
            <header class="card-header_special">
                <h3 class="card-title">
                    <i class="material-icons card-icon">storage</i>
                    <span class="card-title">Storage</span>
                </h3>
            </header>

            <details open>
                <summary>Chart</summary>
                <StorageChart autoRefresh={true} />
            </details>
        </article>
    </section>

    <section>
        <article class="card">
            <header class="card-header_special">
                <h3 class="card-title">
                    <i class="material-icons card-icon">monitor</i>
                    <span class="card-title">GPU</span>
                </h3>
            </header>

            <div class="grid" style="margin: 12px;">
                <div>
                    <h6>
                        GPU vendor:
                        <small class="text-normal">
                            {gpuData.main.vendor}
                        </small>
                    </h6>

                    <br />

                    <h6>
                        GPU model:
                        <small class="text-normal">
                            {gpuData.main.model}
                        </small>
                    </h6>

                    <br />

                    <h6>
                        GPU VRAM:
                        <small class="text-normal">
                            {gpuData.main.vram} MB
                        </small>
                    </h6>
                </div>

                <br />

                <div class="grid" style="margin: 12px;">
                    <div>
                        <h6>
                            Display vendor:
                            <small class="text-normal">
                                {gpuData.display.vendor || "unknown"}
                            </small>
                        </h6>

                        <h6>
                            Display model:
                            <small class="text-normal">
                                {gpuData.display.model || "unknown"}
                            </small>
                        </h6>
                        <h6>
                            Display resolution:
                            <small class="text-normal">
                                {gpuData.display.resolution}
                            </small>
                        </h6>

                        <h6>
                            Display refresh rate:
                            <small class="text-normal">
                                {gpuData.display.refreshRate} Hz
                            </small>
                        </h6>
                    </div>
                </div>
            </div>
        </article>
    </section>
{/if}

<style scoped>
    article,
    header {
        border-radius: 16px;
    }

    article details {
        margin: 12px;
    }

    .card-header_special {
        margin: 1px;
        margin-bottom: 1em;
    }

    .card-icon {
        font-size: 42px;
    }

    .card-title {
        vertical-align: middle;
        margin-bottom: 0;
    }
</style>
