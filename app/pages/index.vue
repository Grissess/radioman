<script setup lang="ts">
  import { ref } from 'vue'

  const loginUid: Ref<number | null> = ref(null)

  const loginActions = [
    {
      label: "Log In",
      action: (uid: number) => loginUid.value = uid,
      classes: {create: true},
    },
  ]
</script>

<template>
  <div v-if="!loginUid">
    <h1>Log In</h1>
    <SearchTable
      rest-path="/api/people"
      :fields="['dispName', 'realName']"
      :actions="loginActions"
    />
  </div>
  <div v-else>
    <MovementFlow :loginUid="loginUid" @logout="loginUid = null"/>
  </div>
</template>
