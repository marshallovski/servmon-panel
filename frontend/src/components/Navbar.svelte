<script>
    import { onMount } from "svelte";
    import panelAPI from "$lib/api";
    import PageLoader from "./PageLoader.svelte";

    let isLoading = $state(true);
    let title = $state("");
    let distro = $state("unknown");

    async function getEnv() {
        const data = await panelAPI.serverInfo("env");

        return data;
    }

    onMount(async () => {
        try {
            const env = await getEnv();

            distro = env.os;
            title = env.hostname;
        } catch {
        } finally {
            isLoading = false;
        }
    });
</script>

{#if isLoading}
    <nav>
        <ul>
            <li>
                <a href="/" aria-busy="true"></a>
            </li>
        </ul>

        <ul>
            <li>
                <a href="/" class="contrast">
                    <i class="material-icons">dashboard</i>
                    <span>Dashboard</span>
                </a>
            </li>

            <li>
                <a href="/server/status" class="contrast">
                    <i class="material-icons">data_usage</i>
                    <span>Status</span>
                </a>
            </li>

            <li>
                <a href="/server/info" class="contrast">
                    <i class="material-icons">info</i>
                    <span>Server info</span>
                </a>
            </li>
        </ul>
    </nav>
{:else}
    <nav>
        <ul>
            <li>
                <a href="/" class="navbar-distro_title no-background">
                    <h2>
                        <small>
                            <img
                                src={`/assets/images/disto-logos/${distro}.svg`}
                                alt={distro}
                                title={distro}
                                class="navbar-distrologo"
                            />
                        </small>

                        <span>{title}</span>
                    </h2>
                </a>
            </li>
        </ul>

        <ul>
            <li>
                <a href="/" class="contrast">
                    <i class="material-icons">dashboard</i>
                    <span>Dashboard</span>
                </a>
            </li>

            <li>
                <a href="/server/status" class="contrast">
                    <i class="material-icons">data_usage</i>
                    <span>Status</span>
                </a>
            </li>

            <li>
                <a href="/server/info" class="contrast">
                    <i class="material-icons">info</i>
                    <span>Server info</span>
                </a>
            </li>
        </ul>
    </nav>
{/if}

<style scoped>
    .navbar-distrologo {
        width: 36px;
        margin-right: 5px;
    }

    .navbar-distro_title {
        height: 70px;
        padding: 8px;
    }

    nav {
        background-color: var(--pico-card-background-color);
        margin-top: 1em;
        margin-bottom: 1em;
        border-radius: 16px;
        padding: 0 24px;
        height: 75px;
    }

    a {
        margin-left: 1em;
        text-decoration: none;
    }

    a:hover {
        background-color: var(--pico-secondary-focus);
    }

    a span {
        margin-left: 3px;
        vertical-align: -5%;
    }
</style>
