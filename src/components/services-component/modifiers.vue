<template>
<div class="col-13">
    <div class="q-mt-sm border-container" style="height: 60vh">
        <q-scroll-area style="width: 539%; height: 98%">
            <div class="row" v-for="(item, index) in Object.keys(allModifiers).length" :key="index">
                <div class="col col-10 text-h5 text-primary">
                    {{ allModifiers[Object.keys(allModifiers)[index]].modifier_category }}
                    <span class="text-grey text-overline">
                        ({{
            allModifiers[Object.keys(allModifiers)[index]].elements[0].modifiers
              .modifier_categories.is_mandatory
              ? "Mandatory"
              : "Optional"
          }})

                    </span>

                </div>
                <div class="col col-12 text-right">
                    <q-btn flat color="primary" icon="mdi-close-circle" @click="
            onClear(allModifiers[Object.keys(allModifiers)[index]].elements)
          " />
                </div>
                <div class="col col-3" v-for="(mod, modIndex) in allModifiers[Object.keys(allModifiers)[index]]
          .elements" :key="modIndex">
                    <div class="row" v-if="mod.modifiers.modifier_categories.is_single_select">
                        <div class="col col-12">
                            <q-radio v-model="selectedRadio[index]" :val="mod.id" @input="acceptSelectedRadio(mod, index, $event)" size="lg" style="font-size: 16px">
                                {{ mod.modifiers.modifier }}
                                <span class="text-primary">( ${{ mod.price }} )</span>
                            </q-radio>
                        </div>
                    </div>

                    <div class="row" v-else>
                        <div class="col col-12">
                            <q-checkbox v-model="selectedCheckbox" :val="mod.id" @input="acceptSelectedCheckbox(mod, $event)" size="lg" style="font-size: 16px">
                                {{ mod.modifiers.modifier }}
                                <span class="text-primary">( ${{ mod.price }} )</span>
                            </q-checkbox>
                        </div>
                    </div>
                </div>
                <div class="col col-12">
                    <hr />
                </div>
            </div>

        </q-scroll-area>
    </div>
    <!-- <q-card-actions
          class="bg-primary row items-center q-mx-none sticky-header"
          style=""
        > -->
    <div class="row items-center q-py-md">
        <div class="col col-3">
            <q-btn color="primary" label="Accept" @click="acceptModifiers()" class="q-pa-sm" />
        </div>

        <div class="col col-16 text-right text-primary text-h6">
            Price: ${{ modifierPrice }}
        </div>

    </div>
    <!-- </q-card-actions> -->

</div>
</template>

<script>
import {
    mapState
} from "vuex";
import _ from "lodash";
import notifications from "src/boot/notifications";
export default {
    props: ["productDetails"],
    data() {
        return {
            selectedCheckbox: [],
            selectedRadio: [],
            allRadio: [],
            productPrice: 0,
            checkboxPrice: 0,
            radioPrice: 0,
        };
    },
    computed: {
        ...mapState("products", ["restaurantProductModifiers"]),
        allModifiers() {
            let allMod,
                obj = {};
            allMod = _.groupBy([...this.restaurantProductModifiers], function (v) {
                return v.modifiers.modifier_categories.modifier_category;
            });
            for (let item in allMod) {
                obj[allMod[item][0].modifiers.modifier_categories.seq_no] = {
                    elements: [...allMod[item]],
                    modifier_category: allMod[item][0].modifiers.modifier_categories.modifier_category,
                };
            }
            return obj;
        },
        modifierPrice() {
            return parseFloat(
                (
                    parseFloat(this.productPrice) +
                    parseFloat(this.checkboxPrice) +
                    parseFloat(this.radioPrice)
                ).toFixed(2)
            );
        },
    },
    created() {
        this.productPrice = this.productDetails.price ?
            parseFloat(this.productDetails.price) :
            parseFloat(this.productDetails.products.price);
    },
    methods: {
        onClear(item) {
            for (let i in item) {
                this.selectedCheckbox = this.selectedCheckbox.filter((v) => {
                    if (v == item[i].id) {
                        this.checkboxPrice =
                            parseFloat(this.checkboxPrice) - parseFloat(item[i].price);
                    }
                    return v != item[i].id;
                });
                for (let k in this.selectedRadio) {
                    if (this.selectedRadio[k] == item[i].id) {
                        this.selectedRadio[k] = "";
                        this.radioPrice =
                            parseFloat(this.radioPrice) - parseFloat(item[i].price);
                    }
                }
                // this.selectedRadio = this.selectedRadio.filter(v => v != item[i].id)
            }
        },
        acceptSelectedCheckbox(mod, e) {
            this.checkboxPrice = 0;
            for (let i in this.selectedCheckbox) {
                this.restaurantProductModifiers.map((v) => {
                    if (v.id == this.selectedCheckbox[i]) {
                        this.checkboxPrice =
                            parseFloat(this.checkboxPrice) + parseFloat(v.price);
                    }
                });
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
            for (let mod in this.allModifiers) {
                if (
                    this.allModifiers[mod].elements[0].modifiers.modifier_categories
                    .is_mandatory
                ) {
                    if (
                        !this.allModifiers[mod].elements.some((obj) =>
                            this.selectedCheckbox.includes(obj.id)
                        ) &&
                        !this.allModifiers[mod].elements.some((obj) =>
                            this.selectedRadio.includes(obj.id)
                        )
                    ) {
                        notifications.warningNotify(
                            "Select atleast one modifier from group which is mandatory!"
                        );
                        return;
                    }
                }
            }

            const selectedModifiers = [];
            const selectedModifierIds = [
                ...this.selectedRadio,
                ...this.selectedCheckbox,
            ];

            for (let i in selectedModifierIds) {
                this.restaurantProductModifiers.forEach((v) => {
                    if (
                        v.id == this.selectedCheckbox[i] ||
                        v.id == this.selectedRadio[i]
                    ) {
                        selectedModifiers.push(v);
                    }
                });
            }

            this.$emit("updatePrice", {
                price: this.modifierPrice,
                item: this.productDetails,
                selectedModifiers: _.uniqBy(selectedModifiers, "id"),
                selectedModifierIds,
            });
        },
    },
};
</script>
