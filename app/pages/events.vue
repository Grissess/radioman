<template>
    <div class="columns">
        <SearchTable
            :fields="['identifier', 'at', 'commenter', 'comment']"
            rest-path="/api/comments"
            :actions="[]"
        />
        <SearchTable
            :fields="['identifier', 'at', 'kind', 'auditor', 'possessor']"
            rest-path="/api/movement"
            :actions="[]"
        />
    </div>
</template>