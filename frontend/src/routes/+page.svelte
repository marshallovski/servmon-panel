<script>
    import panelAPI from "$lib/api";
    import Logger from "$lib/utils/logger";
    import { onMount } from "svelte";

    import PageLoader from "../components/PageLoader.svelte";
    import CpuChart from "../components/charts/hardware/CpuChart.svelte";
    import RamChart from "../components/charts/hardware/RamChart.svelte";
    import NetworkChart from "../components/charts/NetworkChart.svelte";
    import StorageChart from "../components/charts/hardware/StorageChart.svelte";

    const logger = new Logger("pages/home");

    let isLoading = $state(true);
    let fetchError = $state(false);

    let serverStatusData = $state({});
    let chartData = $state({});
    let ramUsage = $state({});

    async function getData() {
        try {
            serverStatusData = {
                cpu: await panelAPI.serverStatus("hardware/cpu"),
                ram: await panelAPI.serverStatus("hardware/ram"),
                uptime: await panelAPI.serverStatus("hardware/uptime"),
                storage: await panelAPI.serverStatus("hardware/storage"),
                network: await panelAPI.serverStatus("network"),
            };

            const drives = serverStatusData?.storage?.list;

            ramUsage = {
                used: (serverStatusData.ram.used / 1024).toFixed(1),
                total: (serverStatusData.ram.total / 1024).toFixed(1),
            };

            chartData = {
                cpu: {
                    labels: ["CPU usage", "CPU max usage"],
                    datasets: [
                        {
                            name: "CPU usage",
                            values: [serverStatusData?.cpu?.usage, 100],
                        },
                    ],
                },
                ram: {
                    labels: ["RAM usage", "RAM total"],
                    datasets: [
                        {
                            name: "RAM usage",
                            values: [
                                (serverStatusData?.ram?.used / 1000).toFixed(1),
                                (serverStatusData?.ram?.total / 1000).toFixed(
                                    1,
                                ),
                            ],
                        },
                    ],
                },
                network: {
                    labels: ["Download", "Upload"],
                    datasets: [
                        {
                            name: serverStatusData?.network?.stats?.interface,
                            values: [
                                serverStatusData?.network?.stats?.download,
                                serverStatusData?.network?.stats?.upload,
                            ],
                        },
                    ],
                },
                storage: {
                    labels: drives.map((d) => d.drive), // drive names
                    datasets: [
                        {
                            name: "Used space",
                            values: drives.map((d) => d.usedGB), // Used space values
                        },
                        {
                            name: "Free space",
                            values: drives.map((d) => d.freeGB), // Free space values
                        },
                        {
                            name: "Total space",
                            values: drives.map((d) => d.totalGB),
                        },
                    ],
                },
            };
        } catch (error) {
            fetchError = error.message;
            return logger.warn(`failed to fetch data: ${error}`);
        } finally {
            isLoading = false;
        }
    }

    onMount(async () => {
        await getData();
    });
</script>

<svelte:head>
    <title>Home - ServmonPanel</title>
</svelte:head>

<section>
    {#if fetchError}
        <h3>Data fetch failed: {fetchError}</h3>
    {/if}

    {#if isLoading}
        <PageLoader />
        <div class="grid">
            <article>
                <header class="text-bold">
                    <h3 class="card-title">
                        <i class="material-icons card-icon">developer_board</i>
                        <span class="card-title">CPU</span>
                    </h3>
                </header>
                <div aria-busy="true"></div>
                <footer></footer>
            </article>

            <article>
                <header class="text-bold">
                    <h3 class="card-title">
                        <i class="material-icons card-icon">memory</i>
                        <span class="card-title">RAM</span>
                    </h3>
                </header>
                <div aria-busy="true"></div>
                <footer></footer>
            </article>

            <article>
                <header class="text-bold">
                    <h3 class="card-title">
                        <i class="material-icons card-icon">lan</i>

                        <span class="card-title">Network</span>
                    </h3>
                </header>
                <div aria-busy="true"></div>
                <footer></footer>
            </article>

            <article>
                <header class="text-bold">
                    <h3 class="card-title">
                        <i class="material-icons card-icon">storage</i>
                        <span class="card-title">Storage</span>
                    </h3>
                </header>
                <div aria-busy="true"></div>
                <footer>
                    <small>Total <b aria-busy="true"></b> drives</small>
                </footer>
            </article>
        </div>
    {:else}
        <div class="grid">
            <article>
                <header class="text-bold">
                    <h3 class="card-title">
                        <i class="material-icons card-icon">developer_board</i>
                        <span class="card-title">CPU</span>
                    </h3>
                </header>
                <CpuChart
                    title="CPU usage (in %)"
                    chartData={chartData.cpu}
                    serverData={serverStatusData.cpu}
                    autoRefresh={true}
                />
                <footer>
                    <small>{serverStatusData.cpu.name}</small>
                </footer>
            </article>

            <article>
                <header class="text-bold">
                    <h3 class="card-title">
                        <i class="material-icons card-icon">memory</i>
                        <span class="card-title">RAM</span>
                    </h3>
                </header>

                <RamChart
                    title="RAM usage (in GB)"
                    chartData={chartData.ram}
                    serverData={serverStatusData.ram}
                    autoRefresh={true}
                />
                <footer>
                    <small>
                        Usage: {ramUsage?.used} GB/{ramUsage?.total} GB
                    </small>
                </footer>
            </article>

            <article>
                <header class="text-bold">
                    <h3 class="card-title">
                        <i class="material-icons card-icon">lan</i>

                        <span class="card-title">Network</span>
                    </h3>
                </header>
                <NetworkChart
                    title="Network usage (in MB/s)"
                    chartData={chartData.network}
                    serverData={serverStatusData.network}
                    autoRefresh={true}
                />
                <footer>
                    <small>
                        Active interface: {serverStatusData?.network?.stats
                            ?.interface}
                    </small>
                </footer>
            </article>

            <article>
                <header class="text-bold">
                    <h3 class="card-title">
                        <i class="material-icons card-icon">storage</i>

                        <span class="card-title">Storage</span>
                    </h3>
                </header>
                <StorageChart
                    title="Storage usage (in GB)"
                    chartData={chartData.storage}
                    serverData={serverStatusData.storage}
                    autoRefresh={true}
                />
                <footer>
                    <small
                        >Total <b>{serverStatusData?.storage?.list?.length}</b> drives</small
                    >
                </footer>
            </article>
        </div>
    {/if}
</section>

<style scoped>
    .card-icon {
        font-size: 42px;
    }

    .card-title {
        vertical-align: middle;
        margin-bottom: 0;
    }
</style>
