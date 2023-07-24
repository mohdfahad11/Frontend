<template>
  <div>
    <q-markup-table style="height: 250px" class="bg-grey-3" id="order-list">
      <thead class="bg-primary">
        <tr>
          <th class="text-left">Order Id</th>
          <th class="text-left">Order Type</th>
          <th class="text-center">Date</th>
          <th class="text-right">Bill Amount</th>
        </tr>
      </thead>
      <tbody class="text-black" v-if="orders">
        <tr
          v-for="(order, ind) in orders"
          :key="ind"
          @click="selectRow(order)"
          :class="[
            isSelected[ind] ? 'selected-row-class' : '',
            order.discount == null ? 'cursor-pointer' : '',
          ]"
          :style="order.discount == null ? '' : 'background-color: #FEB2B2'"
        >
          <td class="text-left">{{ order.id }}</td>
          <td class="order-table-employee">
            {{ order.order_types.type }}
          </td>
          <td class="text-right">{{ order["created_at"].slice(0, 10) }}</td>
          <td class="text-right">
            ${{ parseFloat(order.total_amount).toFixed(2) }}
          </td>
        </tr>
      </tbody>
      <q-infinite-scroll
        @load="onLoad"
        :offset="170"
        debounce="500"
        scroll-target="#order-list"
      >
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>
      </q-infinite-scroll>
    </q-markup-table>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Vue from "vue";

export default {
  props: ["page"],
  data() {
    return {
      isSelected: Array.from({ length: 1000 }).map((x) => false),
      billList: [],
    };
  },
  computed: {
    ...mapState("storeUser", ["activeTableId", "loggedInStoreUsers"]),
    ...mapState("orders", ["orders", "totalOrders"]),
  },
  methods: {
    ...mapActions("orders", ["getPreviousOrders"]),
    selectRow(orderDetails) {
      for (let i in this.orders) {
        Vue.set(this.isSelected, i, orderDetails.id == this.orders[i].id);
      }
      let bill = [];
      let i = 0;
      let mod = [];
      for (i in orderDetails.order_line_items) {
        for(let item in orderDetails.order_line_items[i].order_modifiers) {
          let modifier = orderDetails.order_line_items[i].order_modifiers[item].restaurant_product_modifiers.modifiers.modifier
          let price = orderDetails.order_line_items[i].order_modifiers[item].price
          mod.push(
            "<div style='width:100%; display:flex; justify-content: space-between;'><span style='flex-grow: 0; flex-shrink: 0'>" + 
            modifier + 
            "</span><span style='style='flex-grow: 0; flex-shrink: 0;'> $" + 
              price + "</span></div>"
          )
        }
        bill.push(
        "<div style='width:100%; max-width: 100%; font-weight: bold; margin-top: 10px; margin-bottom: 5px;'><div style='width: 70%; max-width: 70%; float: left; white-space: normal;'>" +
          orderDetails.order_line_items[i].quantity +
          " X " +
          orderDetails.order_line_items[i].products.name +
          "</div><div style='width: 30%; text-align: right; float: right;'> $" +
          parseFloat(
            orderDetails.order_line_items[i].line_item_total
          ).toFixed(2) +
          "</div></div>" + mod.join('')
        );
        mod = [];
        i++;
      }
      this.billList = bill.join("");
      this.$emit("getOrderDetails", {
        order: orderDetails,
        billList: this.billList,
      });
    },
    onLoad(index, done) {
      this.$emit("callSearch", { page: this.page });
      done();
    },
  },
};
</script>

<style scoped lang="scss">
.selected-row-class {
  color: white;
  background-color: var(--q-color-primary);
}
</style>
