<template>
  <div class="container mt-2">
 <b-table
      :data="getEducation"
      :columns="columns"
      :hoverable="true"
      ></b-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "ListView",
  props: {
    module: {
        type: String,
        default: '',
    },
    columns: {
        type: Array,
        default: [],
    }
  },
  computed: {
    ...mapGetters(["getEntity", "getRecord", "getEducation"]),
  },
};
</script>

<style></style>
