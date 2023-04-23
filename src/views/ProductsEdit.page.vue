<template>
  <v-container>
    <h1>Lista produktów</h1>
    <h2>CF.06 Ekran do zarządzania listą produktów</h2>
    <v-data-table :headers="tableProducts.headers" :items="products" :items-per-page="10" class="elevation-1">
      <template v-slot:item.image="{ item }">
        <div class="p-2">
          <v-img :src="item.image_url" :alt="item.name" width="50px" height="50px"></v-img>
        </div>
      </template>
      <template v-slot:item.edit="{ item }">
        <v-btn @click="openDialog(item)" icon class="ma-2">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog.show" width="auto">
      <v-card>
        <v-card-actions>
          <v-form ref="form">
            <v-row>
              <v-col lg="6">
                <v-text-field
                  v-model="dialog.selectedProduct.name"
                  :rules="form.rules.name"
                  counter="20"
                  hint="This field uses counter prop"
                  label="Produkt"
                ></v-text-field>
              </v-col>
              <v-col lg="6">
                <v-text-field
                  v-model="dialog.selectedProduct.cost"
                  :rules="form.rules.cost"
                  type="number"
                  counter="6"
                  hint="This field uses counter prop"
                  label="Сena"
                ></v-text-field
              ></v-col>
            </v-row>
          </v-form>
        </v-card-actions>
        <v-card-actions>
          <v-row>
            <v-col lg="12">
              <v-btn color="success" block @click="closeDialog(true)">Zapisać</v-btn>
            </v-col>
            <v-col lg="12">
              <v-btn color="error" block @click="closeDialog(false)">Anulować</v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex"

export default {
  name: "ProductsEditPage",
  mounted() {
    if (this.products.length === 0) {
      this.fetchProducts()
    }
  },
  data() {
    return {
      form: {
        rules: {
          name: [(v) => v.length <= 20 || "Max 20 characters"],
          cost: [
            (v) => {
              return new String(v).length <= 6 || "Max 6 characters"
            },
            (v) => {
              return this.isValidNumber(v)
            },
          ],
        },
      },
      dialog: {
        selectedProduct: {
          name: "",
          cost: 0,
        },
        show: false,
      },
      tableProducts: {
        headers: [
          {
            text: "ID",
            align: "start",
            sortable: true,
            value: "id",
          },
          { text: "Produkt", value: "name", sortable: true },
          { text: "Сena", value: "cost", sortable: true },
          { text: "Portret", value: "image", sortable: false },
          { text: "Edytuj", value: "edit", sortable: false },
        ],
      },
    }
  },
  methods: {
    ...mapActions("products", ["fetchProducts"]),
    ...mapMutations("products", ["UPDATE_PRODUCT"]),
    openDialog(item) {
      // deep copy
      this.dialog.selectedProduct = JSON.parse(JSON.stringify(item))
      this.dialog.show = true
    },
    closeDialog(saveBtn) {
      if (!saveBtn) {
        this.setDefaultDialogValues()
        return
      }

      if (this.$refs.form.validate()) {
        this.UPDATE_PRODUCT(this.dialog.selectedProduct)
        this.setDefaultDialogValues()
        this.$notify({
          title: "Zaktualizowane",
          text: "Produkt zaktualizowany",
          type: "success",
        })
      } else {
        this.$notify({
          title: "Błąd",
          text: "Sprawdź Formularz",
          type: "error",
        })
      }
    },
    setDefaultDialogValues() {
      this.dialog.show = false
      this.dialog.selectedProduct = {
        name: "",
        cost: 1,
      }
    },
    isValidNumber(cost) {
      const numberString = new String(cost)

      if (numberString.length === 0) return false
      if (numberString.indexOf("0") === 0) return false

      const commaIndex = numberString.indexOf(".")

      if (commaIndex === 0) return false

      if (commaIndex === -1 && numberString.length) {
        return true
      }

      const lengthAfterComma = numberString.length - (commaIndex + 1)

      return lengthAfterComma <= 2
    },
  },
  computed: {
    ...mapState("products", ["products"]),
  },
}
</script>
