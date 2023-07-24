<template>
  <div>
    <div class="row items-center">
      <div class="col col-4 q-pa-sm">
        Select interval to fetch data:
        <q-select
          outlined
          v-model="interval"
          :options="intervalOptions"
          :option-label="(item) => item.label"
          :option-value="(item) => item.value"
        />
      </div>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      intervalOptions: [
      // {
      //     id: 9,
      //     label: '2 sec',
      //     value: 0.033,
      //   },
      //   {
      //     id: 10,
      //     label: '4 sec',
      //     value: 0.066,
      //   },
      //   {
      //     id: 11,
      //     label: '6 sec',
      //     value: 0.1,
      //   },
        {
          id: 1,
          label: '15 Mins',
          value: 15,
        },
        {
          id: 2,
          label: '30 Mins',
          value: 30
        },
        {
          id: 3,
          label: '45 Mins',
          value: 45
        },
        {
          id: 4,
          label: '1 Hour',
          value: 60
        }
      ]
    }
  },
  computed: {
    ...mapState('settings', ['intervalTime']),
    interval: {
      get() {
        return this.intervalTime? this.intervalTime : null
      },
      set(val) {
        this.$store.commit("settings/SET_INTERVAL_TIME", val)
      }
    }
  }
}
</script>
