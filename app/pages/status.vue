<script setup lang="ts">
    const { data } = useFetch('/api/status')
</script>

<template>
    <table class="status">
        <thead>
            <tr>
                <th>Radio</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="row in data?.rows">
                <td>{{ row.identifier }}</td>
                <td :class="row.class">{{ row.status }}</td>
            </tr>
        </tbody>
    </table>
</template>

<style>
.unused {
    color: #777;
    font-style: italic;
}

.available {
    color: #070;
}

.out {
    color: #70a;
}

table.status {
    border: 2px solid #000;
    border-collapse: collapse;
    font-family: monospace;
}

table.status td, table.status th {
    border: 1px solid #000;
    padding: 0.25em 0.5em;
}
</style>