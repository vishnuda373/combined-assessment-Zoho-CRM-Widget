<template>
  <div class="container mt-2">
    <b-tabs type="is-toggle" expanded @input="tabSwitch">
          <b-tab-item label="Education">
              <EducationList />
          </b-tab-item>
          <b-tab-item label="Experience">
              <ExperienceList />
          </b-tab-item>
          <b-tab-item label="IELTS">
              <IELTSList />
          </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import EducationList from "@/views/EducationList.vue";
import ExperienceList from "@/views/ExperienceList.vue";
import IELTSList from "@/views/IELTSList.vue";

export default {
  name: "App",
  data() {
    return {
      isLoading: false,
    };
  },
  components: {
    EducationList,
    ExperienceList,
    IELTSList
  },
  computed: {
    ...mapGetters(["getEntity", "getRecord"]),
  },
  watch: {
    getEntity() {
      this.$store.dispatch("setRecord");
    },
    getRecord() {
      console.log(`Fetching related records of ${this.getRecord.Full_Name}`);
      this.$store.dispatch("setEducation");
      this.$store.dispatch("setExperience");
      this.$store.dispatch("setIELTS");
    },
  },
  methods: {
    tabSwitch() {
      this.$store.commit("SET_MODE",'');
    }
  }
};
</script>

<style></style>
