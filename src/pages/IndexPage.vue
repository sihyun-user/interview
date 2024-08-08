<template>
  <q-page class="row q-pt-xl">
    <div class="full-width q-px-xl">
      <q-form @submit="addEntryFormSubmit" class="q-mb-xl">
        <q-input v-model="tempData.name" label="姓名" />
        <q-input
          type="number"
          step="1"
          v-model.number="tempData.age"
          label="年齡"
        />
        <q-btn type="submit" color="primary" class="q-mt-md">新增</q-btn>
      </q-form>

      <q-table
        flat
        bordered
        ref="tableRef"
        :rows="storeEntries.entries"
        :columns="(tableConfig as QTableProps['columns'])"
        row-key="id"
        hide-pagination
        separator="cell"
        :rows-per-page-options="[0]"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
            <q-th></q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              style="min-width: 120px"
            >
              <div>{{ col.value }}</div>
            </q-td>
            <q-td class="text-right" auto-width v-if="tableButtons.length > 0">
              <q-btn
                @click="handleClickOption(btn, props.row)"
                v-for="(btn, index) in tableButtons"
                :key="index"
                size="sm"
                color="grey-6"
                round
                dense
                :icon="btn.icon"
                class="q-ml-md"
                padding="5px 5px"
              >
                <q-tooltip
                  transition-show="scale"
                  transition-hide="scale"
                  anchor="top middle"
                  self="bottom middle"
                  :offset="[10, 10]"
                >
                  {{ btn.label }}
                </q-tooltip>
              </q-btn>
            </q-td>
          </q-tr>
        </template>
        <template v-slot:no-data="{ icon }">
          <div
            class="full-width row flex-center items-center text-primary q-gutter-sm"
            style="font-size: 18px"
          >
            <q-icon size="2em" :name="icon" />
            <span> 無相關資料 </span>
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar';
import { ref, reactive } from 'vue';
import { useStoreEntries } from 'src/stores/storeEntries';

interface Entry {
  id: string;
  name: string;
  age: number;
}

interface btnType {
  label: string;
  icon: string;
  status: string;
}

const tableConfig = ref([
  {
    label: '姓名',
    name: 'name',
    field: 'name',
    align: 'left',
  },
  {
    label: '年齡',
    name: 'age',
    field: 'age',
    align: 'left',
  },
]);
const tableButtons = ref([
  {
    label: '編輯',
    icon: 'edit',
    status: 'edit',
  },
  {
    label: '刪除',
    icon: 'delete',
    status: 'delete',
  },
]);

const tempDataDefault = reactive({
  name: '',
  age: '',
});

const tempData = reactive({
  ...tempDataDefault,
});

/*
  store
*/
const storeEntries = useStoreEntries();

storeEntries.getEntry();

/*
  handle entry
*/
const addEntryReset = () => {
  Object.assign(tempData, tempDataDefault);
};

const addEntryFormSubmit = async () => {
  if (!tempData.name || !tempData.age) {
    return alert('請輸入姓名與年齡');
  }

  const entry = {
    name: tempData.name,
    age: parseInt(tempData.age),
  };

  await storeEntries.addEntry(entry);
  await storeEntries.getEntry();
  addEntryReset();
};

const handleClickOption = async (btn: btnType, data: Entry) => {
  if (btn.status === 'edit') {
    // await storeEntries.updateEntry(data);
  } else if (btn.status === 'delete') {
    await storeEntries.deleteEntry(data.id);
  }
  storeEntries.getEntry();
};
</script>

<style lang="scss" scoped>
.q-table th {
  font-size: 20px;
  font-weight: bold;
}

.q-table tbody td {
  font-size: 18px;
}
</style>
