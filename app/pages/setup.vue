<script setup lang="ts">
  import { inject } from 'vue'

  const
    [people, reloadPeople, radios, reloadRadios] =
    ['people', 'reloadPeople', 'radios', 'reloadRadios'].map(inject)

</script>

<template>
  <h1>People</h1>
  <DataTable
    :rows="people.rows"
    :fields="['id', 'dispName', 'realName', 'phone', 'email', 'discord']"
    :refresh="reloadPeople"
    rest-path="/api/people"
  />

  <h1>Radios</h1>
  <DataTable
    :rows="radios.rows"
    :fields="['id', 'identifier']"
    :refresh="reloadRadios"
    rest-path="/api/radios"
  />
</template>
