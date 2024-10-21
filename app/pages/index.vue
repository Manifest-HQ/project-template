<template>
  <div class="p-4">
    hola
    <div
      v-for="[tableName, tableContents] in Object.entries(db().tables)"
      :key="tableName">
      <h2>{{ tableName }}</h2>
      <div v-for="record in tableContents" :key="record.id">
        <input
          class="border border-zinc-200"
          type="text"
          v-model="record.name"
          disabled />

        <button @click="updateRecord(tableName, record)">Update</button>

        <button @click="db().deleteRecord(tableName, record)">Delete</button>
      </div>

      <button @click="add(tableName)">Add to {{ tableName }}</button>
    </div>
  </div>
</template>

<script setup>
function randomString() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  )
}

function updateRecord(tableName, record) {
  console.log('updateRecord', tableName, record.id)
  const newRecord = { ...record }
  newRecord.name = randomString()
  db().updateRecord(tableName, newRecord)
}

function add(tableName) {
  console.log('add', tableName)
  db().insertRecord(tableName, { name: randomString() })
}
</script>
