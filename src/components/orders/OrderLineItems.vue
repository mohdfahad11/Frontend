<template>
  <div>
    <q-markup-table style="height: 220px" class="bg-grey-3" id="order-list">
      <thead class="bg-primary">
        <tr>
          <th class="text-left">Product</th>
          <th class="text-left">Quantity</th>
          <th class="text-center">Surcharge</th>
          <th class="text-right">Amount</th>
        </tr>
      </thead>
      <tbody class="text-black" v-if="filteredOrderLineItems">
        <tr
          v-for="(item, ind) in filteredOrderLineItems"
          :key="ind"
          clickable
          @click="selectRow(item)"
          class="cursor-pointer"
          :class="isSelected[ind] ? 'selected-row-class' : ''"
        >
          <td class="text-left">{{ item.products.name }}</td>
          <td class="order-table-employee">
            {{ item.quantity }}
          </td>
          <td class="text-right">{{ surchargeAmount }}</td>
          <td class="text-right">
            ${{ parseFloat(item.line_item_total).toFixed(2) }}
          </td>
        </tr>
      </tbody>
    </q-markup-table>
    <q-btn
      push
      label="Accept"
      class="q-my-sm full-width text-bold text-primary bg-white q-py-sm"
      v-close-popup
    />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Vue from "vue";

export default {
  props: ["orderLineItemList", "surchargeAmount"],
  data() {
    return {
      isSelected: Array.from({ length: 10 }).map((x) => false),
      orderLineItems: [],
    };
  },
  computed: {
    ...mapState("storeUser", ["loggedInStoreUsers"]),
    filteredOrderLineItems() {
      return this.orderLineItems;
    },
  },
  methods: {
    ...mapActions("orders", ["getRefundedOrders"]),
    selectRow(selectedOrderLineItem) {
      for (let i in this.filteredOrderLineItems) {
        Vue.set(
          this.isSelected,
          i,
          selectedOrderLineItem.id == this.filteredOrderLineItems[i].id
        );
      }

      this.$emit("change", {
        orderLineItemId: selectedOrderLineItem.id,
        amount: selectedOrderLineItem.line_item_total,
        orderLineItem: selectedOrderLineItem,
      });
    },
  },
  created() {
    this.orderLineItemList.forEach((v) => {
      this.getRefundedOrders({
        order_line_item_id: v.id,
      }).then((response) => {
        if (response.data.refunded_orders.length == 0) {
          this.orderLineItems.push(v);
        }
      });
    });
  },
};
</script>

<style scoped lang="scss">
.selected-row-class {
  color: white;
  background-color: var(--q-color-primary);
}
</style>
