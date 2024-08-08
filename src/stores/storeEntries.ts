import { defineStore } from 'pinia';
import { ref } from 'vue';
import { uid } from 'quasar';
import axios from 'axios';

interface Entry {
  id: string;
  name: string;
  age: number;
}

interface newEntry {
  name: string;
  age: number;
}

export const useStoreEntries = defineStore('entries', () => {
  /* 
    state 
  */
  const entries: { value: Entry[] } = ref([]);

  /* 
    actions 
  */
  const getEntry = async () => {
    try {
      const res = await axios('https://dahua.metcfire.com.tw/api/CRUDTest/a');

      if (res.status !== 200) {
        throw new Error('Failed to fetch data');
      }
      entries.value = res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const addEntry = async (payload: newEntry) => {
    try {
      const paramData = Object.assign({}, payload, { id: uid() });

      const res = await axios.post(
        'https://dahua.metcfire.com.tw/api/CRUDTest',
        paramData
      );

      if (res.status !== 200) {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const res = await axios.delete(
        `https://dahua.metcfire.com.tw/api/CRUDTest/${id}`
      );

      if (res.status !== 200) {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateEntry = async (payload: newEntry) => {
    try {
      const res = await axios.patch(
        'https://dahua.metcfire.com.tw/api/CRUDTest',
        payload
      );

      if (res.status !== 200) {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      console.error(error);
    }
  };

  /* 
    return 
  */
  return {
    // store
    entries,
    // actions
    getEntry,
    addEntry,
    deleteEntry,
    updateEntry,
  };
});
