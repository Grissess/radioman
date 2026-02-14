<template>
    <div>
        <h1>Comments</h1>
        <SearchTable
            :fields="['identifier', 'at', 'commenter', 'comment']"
            rest-path="/api/comments"
            :actions="[]"
        />
        <h1>Movement</h1>
        <SearchTable
            :fields="['identifier', 'at', 'kind', 'auditor', 'possessor']"
            rest-path="/api/movement"
            :actions="[]"
        />
    </div>
</template>