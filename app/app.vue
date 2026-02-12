<script setup lang="ts">
  import 'simpledotcss'
  import { provide } from 'vue'

  const route = useRoute()

  const {
    data: people,
    status: peopleStatus,
    error: peopleError,
    refresh: reloadPeople,
  } = useFetch('/api/people')

  provide('people', people)
  provide('reloadPeople', reloadPeople)

  const {
    data: radios,
    status: radiosStatus,
    error: radiosError,
    refresh: reloadRadios,
  } = useFetch('/api/radios')

  provide('radios', radios)
  provide('reloadRadios', reloadRadios)

  const nav = [
    {name: 'Home', to: '/'},
    {name: 'Status', to: '/status'},
    {name: 'Events', to: '/events'},
    {name: 'Setup', to: '/setup'},
  ]
</script>

<template>
  <ul class="nav">
    <li v-for="item in nav">
      <NuxtLink :to="item.to" :class="{here: route.path === item.to}">{{ item.name }}</NuxtLink>
    </li>
  </ul>
  <NuxtPage/>
</template>

<style>
ul.nav {
  display: flex;
  background-color: #c70;
  padding: 0;
}

ul.nav li {
  border-left: 1px solid #fc7;
  border-right: 1px solid #fc7;
  display: block;
  font-weight: bold;
}

ul.nav a {
  padding: 1em;
  font-weight: bold;
  color: #fff;
  display: inline-block;
}

ul.nav a, ul.nav a:visited {
  color: #fff;
}

ul.nav a:hover, ul.nav a:active {
  color: #fca;
}

ul.nav a.here, ul.nav a.here:visited {
  color: #0f0;
}

ul.nav a.here:hover, ul.nav a.here:active {
  color: #7f7;
}
</style>
