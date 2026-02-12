<script setup lang="ts">
  import { computed, ref, watch } from 'vue'

  const props = defineProps([
    'rows', 'fields', 'refresh', 'restPath',
  ])

  const editedIds = ref(new Map())
  const newBlankData = () => {
    const ob: Record<string, string> = {}
    for(const field of props.fields)
      if(field !== 'id') ob[field] = ''
    return ob
  }
  const newData = ref(newBlankData())

  const fields = computed(() =>
    props.fields ? props.fields :
      props.rows.length == 0 ? [] :
        Object.keys(props.rows[0]).sort()
  )

  const remove = async (id: number) => {
    if(props.restPath) await $fetch(props.restPath, {
      method: 'DELETE',
      body: {id},
    })
    if(props.refresh) props.refresh()
  }

  const edit = (id: number) => {
    editedIds.value.set(id, Object.assign({}, props.rows.filter((r: {id: number}) => r.id == id)[0]))
  }
  const finishEdit = async (id: number) => {
    if(!editedIds.value.has(id)) return
    if(props.restPath) await $fetch(props.restPath, {
      method: 'PATCH',
      body: editedIds.value.get(id),
    })
    editedIds.value.delete(id)
    if(props.refresh) props.refresh()
  }

  const create = async () => {
    if(props.restPath) await $fetch(props.restPath, {
      method: 'PUT',
      body: newData.value,
    })
    newData.value = newBlankData()
    if(props.refresh) props.refresh()
  }

  const bestInputTypeOf = (v: any) => {
    switch(typeof v) {
      case 'number': return 'number'
      default: return 'text'
    }
  }
  const castToInputType = (v: any, newv: any) => {
    switch(typeof v) {
      case 'number': return Number(newv)
      default: return newv
    }
  }
</script>

<template>
  <div class="datatable">
    <div class="nodata" v-if="!fields && rows.length == 0">There are no data and no schema.</div>
    <table v-else>
      <thead>
        <tr>
          <th v-for="field in fields">{{ field }}</th>
          <th class="actions">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="rows.length == 0" colspan="fields.length" class="nodata">
          There are no data.
        </tr>
        <tr v-else v-for="row in props.rows" :key="row.id">
          <td v-for="field in fields">
            <input
              :type="bestInputTypeOf(editedIds.get(row.id)[field])"
              :value="editedIds.get(row.id)[field]"
              :size="editedIds.get(row.id)[field].length"
              @input="(event) => editedIds.get(row.id)[field] = castToInputType(editedIds.get(row.id)[field], event?.target?.value)"
              @keyup.enter="finishEdit(row.id)"
              v-if="editedIds.has(row.id) && field !== 'id'"
            />
            <template v-else>{{ row[field] }}</template>
          </td>
          <td class="actions">
            <button v-if="editedIds.has(row.id)" class="submit" @click="finishEdit(row.id)">Update</button>
            <template v-else>
              <button class="delete" @click="remove(row.id)" :disabled="restPath ? undefined : true">Delete</button>
              <button class="update" @click="edit(row.id)" :disabled="restPath ? undefined : true">Edit</button>
            </template>
          </td>
        </tr>
      </tbody>
      <tfoot v-if="restPath">
        <tr class="add">
          <td v-for="field in fields">
            <template v-if="field == 'id'"/>  <!-- skip ID field as an input -->
            <!-- TODO: allow arbitrary input types cleanly -->
            <input
              v-else
              type="text"
              v-model="newData[field]"
              @keyup.enter="create"
            />
          </td>
          <td class="actions">
            <button class="create" @click="create" :disabled="restPath ? undefined : true">Add</button>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<style>
.nodata {
  font-style: italic;
}

.datatable {
  font-family: monospace;  /* actually somewhat important due to input.size */
}

.datatable table {
  border: 2px solid #000;
  border-collapse: collapse;
}

.datatable td, .datatable th {
  padding: 0.25em 0.5em;
  border: 1px solid #000;
}

.datatable input {
  font: inherit;
}

button {
  font-weight: bold;
}

button.delete {
  background-color: #700;
  color: #fff;
}

button.update, button.use {
  background-color: #007;
  color: #fff;
}

button.submit {
  background-color: #00f;
  color: #fff;
}

button.create {
  background-color: #070;
  color: #fff;
}
</style>
