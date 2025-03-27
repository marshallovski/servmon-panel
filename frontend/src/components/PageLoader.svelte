<div class="page-loader_overlay">
    <div aria-busy="true"></div>
</div>

<style scoped>
    .page-loader_overlay {
        position: fixed; /* Fixed positioning to overlay */
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
        display: flex;
        justify-content: center; /* Center horizontally */
        align-items: center; /* Center vertically */
        z-index: 50;

        user-select: none;
    }
</style>
