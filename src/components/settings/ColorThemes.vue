<template>
  <div>
    <div class="row items-center">
      <div class="col col-4 q-pa-sm">
        Select Theme:
        <q-select
          outlined
          v-model="theme"
          :options="themeOptions"
        >
          <template v-slot:option="scope">
            <q-item
              v-bind="scope.itemProps"
              v-on="scope.itemEvents"
            >
              <q-item-section avatar>
                <q-icon name="format_color_fill" :color="scope.opt.value" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ scope.opt.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>

          <template v-slot:selected-item="scope">
            <q-item-section avatar>
              <q-icon name="format_color_fill" :color="scope.opt.value" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ scope.opt.label }}</q-item-label>
            </q-item-section>
          </template>
        </q-select>
      </div>
      <div class="col col-8 text-center q-pt-md">
        <q-btn push icon="check" label="Apply" @click="setTheme" class="bg-white text-primary text-bold q-py-sm" />
      </div>
    </div>

  </div>
</template>

<script>
import { colors } from 'quasar'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      themeOptions: [
        {
          id: 1,
          label: 'Rose Red',
          value: 'pink-8',
          hex: '#C2185B'
        },
        {
          id: 2,
          label: 'Violet Blue',
          value: 'indigo-7',
          hex: '#3949AB'
        },
        {
          id: 3,
          label: 'Button Blue (Default)',
          value: 'blue-6',
          hex: '#2196F3'
        },
        {
          id: 4,
          label: 'Munsell Blue',
          value: 'cyan-8',
          hex: '#0097A7'
        },
        {
          id: 5,
          label: 'Teal Green',
          value: 'teal-7',
          hex: '#00897B'
        },
        {
          id: 6,
          label: 'Cal Poly Pomona Green',
          value: 'green-10',
          hex: '#1B5E20'
        },
        {
          id: 7,
          label: 'Vivid Cerulean',
          value: 'light-blue',
          hex: '#03A9F4'
        },
        {
          id: 8,
          label: 'Palm Leaf',
          value: 'light-green-8',
          hex: '#689F38'
        },
        {
          id: 9,
          label: 'Liver',
          value: 'brown-7',
          hex: '#6D4C41'
        },
        {
          id: 10,
          label: 'Granite Gray',
          value: 'grey-8',
          hex: '#616161'
        },
        {
          id: 11,
          label: 'Deep Space Sparkle',
          value: 'blue-grey-8',
          hex: '#455A64'
        },
      ]
    }
  },
  computed: {
    ...mapState('settings', ['selectedTheme']),
    theme: {
      get() {
        return this.selectedTheme? this.selectedTheme : null
      },
      set(val) {
        this.$store.commit("settings/SET_THEME_COLOR", val)
      }
    }
  },
  methods: {
    setTheme() {
      colors.setBrand('primary', this.selectedTheme.hex)
    }
  }
}
</script>
