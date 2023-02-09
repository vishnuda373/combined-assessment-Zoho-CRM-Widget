import Vue from "vue";
import Vuex from "vuex";
import { ZOHO } from "../assets/ZohoEmbededAppSDK.min.js";

Vue.use(Vuex);

export default new Vuex.Store({
  // strict: true,
  state: {
    entity: {},
    record: {},
    education: [],
    experience: [],
    ielts: [],
    mode: '',
  },
  getters: {
    getEntity: (state) => {
      return state.entity;
    },
    getRecord: (state) => {
      return state.record;
    },
    getEducation: (state) => {
      return state.education;
    },
    getExperience: (state) => {
      return state.experience;
    },
    getIELTS: (state) => {
      return state.ielts;
    },
    getMode: (state) => {
      return state.mode;
    }
  },
  mutations: {
    SET_ENTITY(state, payload) {
      state.entity = payload;
    },
    SET_RECORD(state, payload) {
      state.record = payload;
    },
    SET_EDUCATION(state, payload) {
      state.education = payload;
    },
    SET_EXPERIENCE(state, payload) {
      state.experience = payload;
    },
    SET_IELTS(state, payload) {
      state.ielts = payload;
    },
    SET_MODE(state, payload) {
      state.mode = payload;
    }
  },
  actions: {
    async setEntity({ commit }) {
      /* Fetch the Module Name (Entity) and record id (EntityId) */
      ZOHO.embeddedApp.on("PageLoad", function(data) {
        commit("SET_ENTITY", data);
      });
    },
    async setRecord({ commit, getters }) {
      /* Fetch all the record fields for the related page */
      let e = getters.getEntity;
      return ZOHO.CRM.API.getRecord({ Entity: e.Entity, RecordID: e.EntityId })
        .then((record) => {
          commit("SET_RECORD", record.data[0]);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async setEducation({ commit, getters }) {
      let e = getters.getEntity;
      return ZOHO.CRM.API.getRelatedRecords({
        Entity: e.Entity,
        RecordID: e.EntityId,
        RelatedList: "Edu_Records",
        approved: "both",
        sort_by: "Year_of_Completion"
      })
        .then((record) => {
          console.log(`Education fetched`);
          commit("SET_EDUCATION", record.data);
        })
        .catch((error) => {
          console.error(`Failed to fetch education`);
          console.log(error);
        });
    },
    async setExperience({ commit, getters }) {
      let e = getters.getEntity;
      return ZOHO.CRM.API.getRelatedRecords({
        Entity: e.Entity,
        RecordID: e.EntityId,
        RelatedList: "Experience_Records",
        approved: "both",
        sort_by: "From",
        sort_order: "desc", 
      })
        .then((record) => {
          console.log(`Experience fetched`);
          commit("SET_EXPERIENCE", record.data);
        })
        .catch((error) => {
          console.error(`Failed to fetch experience`);
          console.log(error);
        });
    },
    async setIELTS( {commit, getters}) {
      let e = getters.getEntity;
      return ZOHO.CRM.API.getRelatedRecords({
        Entity: e.Entity,
        RecordID: e.EntityId,
        RelatedList: "IELTS_Applications",
        approved: "both",
      })
        .then((record) => {
          console.log(`IELTS fetched`);
          commit("SET_IELTS", record.data);
        })
        .catch((error) => {
          console.error(`Failed to fetch IELTS`);
          console.error(error);
        });

    },
  },
});
