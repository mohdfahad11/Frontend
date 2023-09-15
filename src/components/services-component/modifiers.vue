<template>
  <div class="col-13">
    <div class="q-mt-sm border-container">
      <q-card style="max-width: 9899px; min-width: 850px; max-height: 892px">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab
            v-for="(categoryKey, index) in sortedCategoryKeys"
            :key="index"
            :name="categoryKey"
          >
            <div class="col col-10 text-h5 text-primary">
              {{ allModifiers[categoryKey].modifier_category }}
              <span class="text-grey text-overline">
                {{
                  allModifiers[categoryKey].elements[0].modifiers.modifier_categories
                    .is_mandatory
                    ? "Mandatory "
                    : "Optional"
                }}
              </span>
            </div>
          </q-tab>
        </q-tabs>

        <q-separator />
        <q-tab-panels v-model="tab" animated >
          <q-tab-panel 
            v-for="(categoryKey, index) in sortedCategoryKeys"
            :key="index"
            :name="categoryKey"
          >
          
            <div class="row " >
              <div class="col col-12 text-right ">
                <q-btn
                  flat
                  color="primary"
                  icon="mdi-close-circle"
                  @click="onClear(allModifiers[categoryKey].elements)"
                />
              </div>
              <div 
                class="col col-2  "
                 v-for="(mod, modIndex) in sortedModifiers[categoryKey]"
                :key="modIndex"
              >
              
                <div class="row " 
                v-if="mod.modifiers.modifier_categories.is_single_select">
                  <div class="col-2 col-4 " >
                    <q-radio 
                      v-model="selectedRadio[index]"
                      :val="mod.id"
                      @input="acceptSelectedRadio(mod, index, $event)"
                      size="lg"
                      style="font-size: 16px"
                    >
                      {{ mod.modifiers.modifier }}
                      <span class="text-primary">( ${{ mod.price }} )</span>
                    </q-radio>
                  </div>
                </div>
                
                <div class="row " v-else >
                  <div class="col col-12 " >
                  
                    <q-checkbox
                      v-model="selectedCheckbox"
                      :val="mod.id"
                      @input="acceptSelectedCheckbox(mod, $event)"
                      size="46px"
                      style="font-size: 16px"
                    >
                      {{ mod.modifiers.modifier }}
                      <span class="text-primary">( ${{ mod.price }} ) </span> 
                      
                    </q-checkbox>
                    <div class="row grid justify-center " >
                      <div class=" justify-self-end" >
                        <q-btn
                          flat
                          size="lg"
                          color="primary"
                          icon="mdi-minus-circle" 
                          @click="decrementModifier(categoryKey, mod.id, mod.price)"
                        />
                      </div>
                      <div class="text-primary text-bold" style="font-size: 20px;">
                        {{ modifierCounts[categoryKey] && modifierCounts[categoryKey][mod.id] ? modifierCounts[categoryKey][mod.id] : 0 }}
                      </div>
                      <div class="" >
                        <q-btn
                          flat
                          color="primary"
                          icon="mdi-plus-circle"
                          @click="incrementModifier(categoryKey, mod.id, mod.price)"
                        />
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              <div class="col col-12">
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
    <div class="row items-center q-py-md">
      <div class="col col-3">
        <q-btn
          color="primary"
          label="Accept"
          @click="acceptModifiers()"
          class="q-pa-sm"
        />
      </div>
      <div class="price col col-16 text-right text-primary text-h6">
        Price: ${{ modifierPrice }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import _ from "lodash";
import notifications from "src/boot/notifications";

export default {
  props: ["productDetails"],
  data() {
    return {
      tab: "",
      selectedCheckbox: [],
      selectedRadio: [],
      productPrice: 0,
      checkboxPrice: 0,
      radioPrice: 0,
      modifierCounts: {},
    };
  },
  computed: {
    ...mapState("products", ["restaurantProductModifiers"]),
    allModifiers() {
      const groupedModifiers = _.groupBy(
        [...this.restaurantProductModifiers],
        (v) => v.modifiers.modifier_categories.modifier_category
      );
      return Object.keys(groupedModifiers).reduce((obj, categoryKey) => {
        obj[categoryKey] = {
          elements: [...groupedModifiers[categoryKey]],
          modifier_category:
            groupedModifiers[categoryKey][0].modifiers.modifier_categories
              .modifier_category,
        };
        return obj;
      }, {});
    },
       sortedCategoryKeys() {
      return Object.keys(this.allModifiers).sort((a, b) =>
        this.allModifiers[a].modifier_category
          .toLowerCase()
          .localeCompare(this.allModifiers[b].modifier_category.toLowerCase())
      );
    },
    sortedModifiers() {
      return Object.keys(this.allModifiers).reduce((sortedObj, categoryKey) => {
        sortedObj[categoryKey] = this.allModifiers[categoryKey].elements
          .slice()
          .sort((a, b) =>
            a.modifiers.modifier
              .toLowerCase()
              .localeCompare(b.modifiers.modifier.toLowerCase())
          );
        return sortedObj;
      }, {});
    },
    modifierPrice() {
      return parseFloat(
        (this.productPrice + this.checkboxPrice + this.radioPrice).toFixed(2)
      );
    },
  },
  created() {
    this.productPrice = parseFloat(
      this.productDetails.price || this.productDetails.products.price
    );
    this.tab = this.sortedCategoryKeys[0] || "";
  },
  methods: {
    onClear(item) {
      for (const v of item) {
        this.selectedCheckbox = this.selectedCheckbox.filter((id) => {
          if (id === v.id) {
            this.checkboxPrice -= parseFloat(v.price);
          }
          return id !== v.id;
        });
        Object.keys(this.selectedRadio).forEach((k) => {
          if (this.selectedRadio[k] === v.id) {
            this.selectedRadio[k] = "";
            this.radioPrice -= parseFloat(v.price);
          }
        });
      }

      this.checkboxPrice = 0;
      this.radioPrice = 0;
    },
    acceptSelectedCheckbox(mod) {
      this.checkboxPrice = 0;
      for (const id of this.selectedCheckbox) {
        for (const v of this.restaurantProductModifiers) {
          if (v.id === id) {
            this.checkboxPrice += parseFloat(v.price);
          }
        }
      }
      for (const categoryKey of this.sortedCategoryKeys) {
        for (const mod of this.allModifiers[categoryKey].elements) {
          if (!this.selectedCheckbox.includes(mod.id)) {
            this.modifierCounts[categoryKey][mod.id] = 0;
          }
        }
      }
    },
    acceptSelectedRadio(mod, i, e) {
      this.radioPrice = 0;
      for (let i in this.selectedRadio) {
        this.restaurantProductModifiers.map((v) => {
          if (v.id == this.selectedRadio[i]) {
            this.radioPrice = parseFloat(this.radioPrice) + parseFloat(v.price);
          }
        });
      }
    },
    acceptModifiers() {
      for (const categoryKey of this.sortedCategoryKeys) {
        if (
          this.allModifiers[categoryKey].elements[0].modifiers.modifier_categories
            .is_mandatory
        ) {
          const checkboxSelected = this.selectedCheckbox.some((obj) =>
            this.allModifiers[categoryKey].elements.map((e) => e.id).includes(obj)
          );
          const radioSelected = this.selectedRadio[categoryKey].length > 0;
          if (!checkboxSelected && !radioSelected) {
            notifications.warningNotify(
              "Select at least one modifier from the mandatory group!"
            );
            return;
          }
        }
      }
      const selectedModifiers = [];
      const selectedModifierIds = [
        ...this.selectedRadio.flat(),
        ...this.selectedCheckbox,
      ];
      for (const id of selectedModifierIds) {
        for (const v of this.restaurantProductModifiers) {
          if (v.id === id) {
            selectedModifiers.push(v);
          }
        }
      }
      this.$emit("updatePrice", {
        price: this.modifierPrice,
        item: this.productDetails,
        selectedModifiers: _.uniqBy(selectedModifiers, "id"),
        selectedModifierIds,
      });
    },
    incrementModifier(categoryKey, modifierId, price) {
      if (!this.modifierCounts[categoryKey]) {
        this.$set(this.modifierCounts, categoryKey, {});
      }
      if (!this.modifierCounts[categoryKey][modifierId]) {
        this.$set(this.modifierCounts[categoryKey], modifierId, 1);
      } else {
        this.modifierCounts[categoryKey][modifierId]++;
      }
      if (this.isModifierSelected(categoryKey, modifierId)) {
        this.checkboxPrice += parseFloat(price);
      }
    },
    decrementModifier(categoryKey, modifierId, price) {
      if (
        this.modifierCounts[categoryKey] &&
        this.modifierCounts[categoryKey][modifierId]
      ) {
        if (this.isModifierSelected(categoryKey, modifierId)) {
          this.modifierCounts[categoryKey][modifierId]--;
          if (this.modifierCounts[categoryKey][modifierId] < 0) {
            this.modifierCounts[categoryKey][modifierId] = 0;
          }
          this.checkboxPrice -= parseFloat(price);
        } else {
          this.modifierCounts[categoryKey][modifierId] = 0;
        }
      }
    },
    isModifierSelected(categoryKey, modifierId) {
      if (
        this.selectedRadio[categoryKey] &&
        this.selectedRadio[categoryKey].includes(modifierId)
      ) {
        return true;
      }
      return this.selectedCheckbox.includes(modifierId);
    },
  },
};
</script>
