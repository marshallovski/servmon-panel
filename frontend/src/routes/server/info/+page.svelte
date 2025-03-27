<script>
    import panelAPI from "$lib/api";
    import { onDestroy, onMount } from "svelte";

    import Logger from "$lib/utils/logger";
    import PageLoader from "../../../components/PageLoader.svelte";

    const logger = new Logger("routes/server/info");

    let isLoading = $state(true);

    let serverEnv = $state({});
    let serverHost = $state({});

    async function getServerInfo(key) {
        const data = await panelAPI.serverInfo(key);
        return data;
    }

    onMount(async () => {
        try {
            serverEnv = await getServerInfo("env");
            serverHost = await getServerInfo("host");            
        } catch (error) {
            logger.warn(`failed to fetch data: ${error}`);            
        } finally {
            isLoading = false;
        }
    });
</script>

<svelte:head>
    <title>Server info - ServmonPanel</title>
</svelte:head>

{#if isLoading}
    <PageLoader />
{:else}
    <section class="mt-2">
        <article class="card">
            <header class="card-header_special">
                <h3 class="card-title">
                    <i class="material-icons card-icon">info</i>
                    <span class="card-title">Server info</span>
                </h3>
            </header>

            <div class="grid" style="margin: 12px;">
                <h6>
                    Hostname:
                    <br />
                    <small class="text-normal">
                        {serverEnv.hostname}
                    </small>
                </h6>

                <h6>
                    Server ID:
                    <br />
                    <small class="text-normal">{serverEnv.serverId}</small>
                </h6>

                <h6>
                    Temp folder:
                    <br />
                    <small class="text-normal">
                        {serverEnv.tmpdir}
                    </small>
                </h6>

                <h6>
                    Node.js version:
                    <br />
                    <small class="text-normal">
                        {serverEnv.node}
                    </small>
                </h6>

                <h6>
                    OS:
                    <br />
                    <small class="text-normal">
                        {serverEnv.os}
                    </small>
                </h6>

                <h6>
                    Backend RAM usage:
                    <br />
                    <small class="text-normal">
                        {serverEnv.panelRamUsage}
                    </small>
                </h6>
            </div>
        </article>
    </section>

    <section>
        <article class="card">
            <header class="card-header_special">
                <h3 class="card-title">
                    <i class="material-icons card-icon">dns</i>
                    <span class="card-title">Host info</span>
                </h3>
            </header>

            <div class="grid" style="margin: 12px;">
                <h6>
                    Hostname:
                    <br />
                    <small class="text-normal">
                        {serverHost.name}
                    </small>
                </h6>

                <h6>
                    Virtual:
                    <br />
                    <small class="text-normal">{serverHost.virtual}</small>
                </h6>

                <h6>
                    Platform:
                    <br />
                    <small class="text-normal">
                        {serverHost.platform}
                    </small>
                </h6>

                <h6>
                    Release:
                    <br />
                    <small class="text-normal">
                        {serverHost.release}
                    </small>
                </h6>

                <h6>
                    Architecture:
                    <br />
                    <small class="text-normal">
                        {serverHost.arch}
                    </small>
                </h6>

                <h6>
                    OS:
                    <br />
                    <small class="text-normal">
                        {serverHost.os}
                    </small>
                </h6>
            </div>
        </article>
    </section>
{/if}

<style scoped>
    article,
    header {
        border-radius: 16px;
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
