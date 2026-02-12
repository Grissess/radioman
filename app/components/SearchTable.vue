<script setup lang="ts">
  import { ref, computed, watch } from 'vue'

  type Action = {
    label: string;
    classes: Record<string, boolean>;
    action: (pid: number) => void;
  }
  type Props = {
    fields: string[];
    restPath: string;
    actions: Action[];
  }

  const props = defineProps<Props>()

  const hasActions = computed(() => props.actions?.length > 0)

  const emptyTerms = () => {
    const ob: Record<string, string> = {}
    for(const field of props.fields)
      ob[field] = ''
    return ob
  }
  const searchTerms = ref(emptyTerms())

  const { data, refresh } = useFetch(props.restPath, {
    query: computed(() => {
      const q: Record<string, string> = {}
      for(const field of Object.keys(searchTerms.value))
        if(searchTerms.value[field] !== '')
          q[field] = `%${searchTerms.value[field]}%`
      return q
    }),
  })
  
  watch(searchTerms, () => refresh())
</script>

<template>
  <div class="searchtable">
    <table>
      <thead>
        <tr>
          <th v-for="field in fields">{{ field }}</th>
          <th v-if="hasActions">Actions</th>
        </tr>
        <tr class="search">
          <td v-for="field in fields">
            <input
              type="text"
              v-model="searchTerms[field]"
            />
          </td>
          <td v-if="hasActions"/>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in data?.rows">
          <td v-for="field in fields">
            {{ row[field] }}
          </td>
          <td v-if="hasActions">
            <button
              v-for="action in actions"
              @click="action.action(row.id)"
              :class="action.classes"
            >{{ action.label }}</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
.searchtable table {
  border: 2px solid #000;
  border-collapse: collapse;
  font-family: monospace;
}
  
.searchtable th, .searchtable td {
  border: 1px solid #000;
  padding: 0.25em 0.5em;
}
</style>