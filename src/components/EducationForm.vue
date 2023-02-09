<template>
  <div class="container mt-2">
    <form @submit.prevent="upsertEdu">
      <b-field label="Qualification" horizontal>
        <b-select v-model.trim="education.Name" placeholder="Select a Qualification">
          <option
              v-for="option in qualifications"
              :value="option"
              :key="option">
              {{ option }}
          </option>
        </b-select>
      </b-field>
      <b-field label="Major in 12th" horizontal v-if="education.Name == 'Plus Two'">
        <b-select v-model.trim="education.Major_in_12th">
          <option 
            v-for="option in twelth_majors"
            :value="option"
            :key="option">
            {{ option }}
          </option>
        </b-select>
      </b-field>
       <b-field  label="Overall %" horizontal class="column">
              <b-input class="percentage" size="sm" v-model.number="education.Overall_Percentage"></b-input>
      </b-field>
        <b-field label="Year of Completion" horizontal>
        <b-select v-model.trim="education.Year_of_Completion" placeholder="Select a Year">
            <option
                v-for="option in options_for_year_of_completion"
                :value="option"
                :key="option">
                {{ option }}
            </option>
        </b-select>
      </b-field>
      <template v-if="education.Type !== 'College'">
        <b-field label="Board" horizontal>
          <b-select v-model="education.Board">
            <option 
              v-for="option in school_boards"
              :value="option"
              :key="option">
              {{ option }}
            </option>
          </b-select>
        </b-field>
      </template>
        <b-field label="University" horizontal v-if="education.Type === 'College'">
          <b-autocomplete
              v-model="education.University"
              :data="list_of_universities"
              placeholder="Enter atleast two character of University"
              icon="magnify"
              :loading="isFetching"
              clearable
              open-on-focus
              @focus="setInitialUniversities"
              @typing="searchUniversity"
              @select="option => selected = option">
              <template #empty>No results found.</template>
          </b-autocomplete>
        </b-field>
        <b-field label="Institution" horizontal>
          <b-autocomplete
              v-model="education.Institution"
              :data="list_of_institutions"
              placeholder="Enter atleast two character of institution"
              icon="magnify"
              :loading="isFetching"
              clearable
              open-on-focus
              @focus="setInitialInstitutions"
              @typing="searchInstitutions"
              @select="option => selected = option">
              <template #empty>No results found.</template>
          </b-autocomplete>
        </b-field>
       <div class="columns">
          <div class="column is-one-quarter">
            <b-field label="State of Institution">
              <b-select v-model="education.State_of_University" placeholder="State">
                    <option
                        v-for="option in india_states"
                        :value="option.state"
                        :key="option.state"
                        >
                        {{ option.state }}
                    </option>
                </b-select>
              </b-field>
          </div>
          <div class="column is-one-quarter">
             <b-field label="District">
                  <!-- TODO: Set to autocomplete -->
                  <b-input v-model.trim="education.District"></b-input>
              </b-field>
          </div>
          <div class="column is-one-quarter">
              <b-field label="Location">
                    <b-input v-model.trim="education.Addresss_Line_1"></b-input>
                </b-field>
          </div>
          <div class="column is-one-quarter">
              <b-field label="City">
                    <b-input v-model.trim="education.Addresss_Line_2"></b-input>
              </b-field>
            </div>
          </div>
          <template v-if="education.Name == 'Plus Two'">
        <div v-if="education.Major_in_12th == 'PCB' || education.Major_in_12th == 'PCMB' " class="columns">
            <div v-if="education.Major_in_12th == 'PCMB'" class="column">
                <b-field label="Maths (%)">
                      <b-input v-model.number="education.Maths_Score" required></b-input>
                  </b-field>
            </div>
            <div class="column">
                <b-field label="Physics (%)">
                      <b-input v-model.number="education.Physics_Score"></b-input>
                </b-field>
            </div>
            <div class="column">
                <b-field label="Chemistry (%)">
                      <b-input v-model.number="education.Chemistry_Score"></b-input>
                  </b-field>
            </div>
            <div class="column">
                <b-field label="Biology (%)">
                      <b-input v-model.number="education.Biology_Score"></b-input> 
                  </b-field>
            </div>
          </div>
      </template>
      <template v-if="education.Name== 'SSLC' ">
       <b-field  label="Maths Score %" horizontal class="column">
              <b-input class="percentage" size="sm" v-model.number="education.th_Maths_Score" required></b-input>
      </b-field>   
      </template>  
      <template v-if="education.Type == 'College'">
        <b-field  label="Stream" horizontal>
          <b-autocomplete required
              v-model="education.Stream"
              :data="list_of_courses"
              placeholder="Enter atleast two character of Course"
              icon="magnify"
              :loading="isFetching"
              clearable
              @typing="searchCourses"
              @select="option => selected = option">
              <template #empty>No results found.</template>
          </b-autocomplete>
        </b-field>
        <b-field label="Number of Backlogs" horizontal>
          <b-numberinput controls-alignment="right" controls-position="compact" min="0" v-model.number="education.Number_of_Backlogs"></b-numberinput>
        </b-field>
        <b-field label="Number of Subjects Below 50%" horizontal>
          <b-numberinput controls-alignment="right" controls-position="compact" min="0" v-model.number="education.Number_of_Subjects_Below_50"></b-numberinput>
        </b-field>
        <b-field v-if="education.Number_of_Backlogs > 0" label="List of Backlogs" horizontal>
          <b-input placeholder="Comma separated list" v-model="education.Backlogs"></b-input>
        </b-field>
      </template>
      <b-switch :value="education.Related_to_Other_Qualification" v-model="education.Related_to_Other_Qualification"
        type="is-info">
             Related to Previous Education
      </b-switch>
        <div class="field is-grouped is-pulled-right">
          <div class="control">
            <button class="button is-link">Submit</button>
          </div>
          <div class="control">
            <button
              class="button is-link is-light"
              @click="$store.commit('SET_MODE', '')"
            >
              Cancel
            </button>
          </div>
        </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { ZOHO } from "@/assets/ZohoEmbededAppSDK.min.js";
import { debounce, uniq } from 'lodash'
import { states, courses } from "@/data/data.json";

export default {
  name: "EducationForm",
  props: {
    mode : {
      type: String,
      default: 'edit'
    },
    current_data: {
      type: Object,
    }
  },
  data() {
    return {
      isLoading: false,
      isFetching: false,
      education: {},
      list_of_institutions: [],
      list_of_universities: [],
      list_of_courses: [],
      options_for_year_of_completion: [],
      qualifications: ['SSLC', 'Plus Two', 'Bachelor Degree', 'Masters Degree', 'PhD'],
      twelth_majors: ["PCMB","PCM and Computer science","PCB and IP","PCB and Biotechnology","PCB - Without maths","Commerce","Commerce with CS","Commerce with Maths","Humanities","Home Science","VHSE - Business with Maths","VHSE - Business without Maths","VHSE - PCMB and any technical Subject","VHSE - PCB and any Technical","VHSE - Technical without Maths & Biology"],
      school_boards: ["CBSE", "ICSE", "Cambridge", "Kerala", "Other State Boards", "Open School"],
      districts: [],
      india_states: states,
    }
  },
  computed: {
    ...mapGetters(["getRecord", "getMode"]),
    District() {
       this.india_states.filter((item) => {
        if(item.state == education.State_of_University) {
          this.districts = item.districts;
        }
      });
    },
    filteredCourses() {
      console.log(`checking matches for ${this.education.Stream}`)
      return uniq(this.courses.filter((option) => {
        return option.Type == this.education.Name && option.Course_Name.toString().toLowerCase().indexOf(this.education.Stream.toLowerCase()) >= 0
      }))
    },
  },
  watch: {
    'education.Name': function(newValue) {
      this.setType();
    },
  },
  mounted() {
    if(this.getMode == 'edit' && this.current_data) {
      this.education = this.current_data;
    } else {
      this.education.Related_to_Other_Qualification = true;
    }
    this.generateYearOfCompletion();
  },
  methods: {
    setType() {
      if(this.education.Name == 'SSLC' || this.education.Name == 'Plus Two') {
        this.education.Type = 'School';
      } else if (this.education.Name) {
        this.education.Type = 'College';
       }
      // console.log(`Type of ${this.education.Name} is ${this.education.Type}`);
    },
    upsertEdu() {
      console.log(`Creating Education Record`);
      if(this.mode === 'create') {
        this.education.Lead = this.getRecord.id;
      }
      this.isLoading=true;
      this.education.Year_of_Completion = this.education?.Year_of_Completion.toString() 
      console.log(this.education);
      ZOHO.CRM.API.upsertRecord({
        Entity: "Education",
        APIData: this.education,
        duplicate_check_fields: ["id"]
      })
      .then((response) => {
        console.log("Success");
        console.log(response);
        this.$store.dispatch("setEducation");
      })
      .catch((error) => {
        console.error("Failed");
        console.error(error);
      })
      .finally(() => {
        this.isLoading=false;
        this.$store.commit("SET_MODE", '');
      })
    },
    generateYearOfCompletion() {
      let today = new Date();
      let current_year = today.getFullYear();
      this.options_for_year_of_completion.push(current_year);
      for (let i = 0; i < 30; i++) {
        current_year -= 1;
        this.options_for_year_of_completion.push(current_year);
      }
    },
    setInitialUniversities() {
      let search_query
      if(this.education.University) {
        search_query=`(Type:equals:University)and(Name:starts_with:${this.education.University}`
      }else {
        search_query="(Type:equals:University)"
      }
      ZOHO.CRM.API.searchRecord({
        Entity:"Educational_Institutions",
        Type:"criteria",
        Query:search_query,
      })
      .then((response) => {
        if(response.status != 204) {
            response.data.forEach( (item) => {
              this.list_of_universities.push(item.Name);
            })
          } else {
            console.log("No results found");
            this.list_of_universities = [];
          }
          this.list_of_universities.sort()
      })
    },
    setInitialInstitutions() {
      this.list_of_institutions = [];
      let search_query
      if(this.education.Type === 'College') {
        if(this.education.University){
         search_query=`((Type:equals:College)and(University:equals:${this.education.University}))`;
        } else {
          search_query=`(Type:equals:College)`
        }
      } else {
        if(this.education.Board) {
          search_query=`((Type:equals:School)and(Board:equals:${this.education.Board}))`;
        } else {
          search_query=`(Type:equals:School)`
        }
      }
      ZOHO.CRM.API.searchRecord({
        Entity:"Educational_Institutions",
        Type:"criteria",
        Query:`${search_query}`,
      })
      .then((response) => {
        if(response.status != 204) {
            response.data.forEach( (item) => {
              this.list_of_institutions.push(item.Name);
            })
          } else {
            console.log("No results found");
            this.list_of_institutions = [];
          }
          this.list_of_institutions.sort()
      })
    },
    searchInstitutions: debounce(function () {
      this.list_of_institutions = [];
      let text=this.education.Institution;
      let search_query
      let query_name=`(Name:starts_with:${text})`
      if(text.length < 2) {
        return
      }
      if(this.education.Type === 'School'){
        if(this.education.Board){
          let query_board=`(Board:equals:${this.education.Board})`
          search_query=`${query_name}and${query_board}`
        }
        search_query=`(Type:equals:School)and${search_query}`;
      } else if(this.education.Type === 'College') {
        search_query=`(Type:equals:College)and${query_name}`;
      }
      this.isFetching = true;
      ZOHO.CRM.API.searchRecord({
        Entity: "Educational_Institutions",
        Type:"criteria",
        Query:`(${search_query})`
      })
        .then((response) => {
          if(response.status != 204) {
            response.data.forEach( (item) => {
              this.list_of_institutions.push(item.Name);
            })
          } else {
            console.log("No results found");
            this.list_of_institutions = [];
          }
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          this.isFetching = false;
        });
    }, 500),
    searchUniversity: debounce(function () {
      this.list_of_universities = [];
      let text=this.education.University;
      if(text.length < 2) {
        return
      }
      this.isFetching = true;
      ZOHO.CRM.API.searchRecord({
        Entity: "Educational_Institutions",
        Type:"word",
        Query:text
      })
        .then((response) => {
          if(response.status != 204) {
            response.data.forEach( (item) => {
              if(item.Type == "University") {
                this.list_of_universities.push(item.Name);
              } 
            })
          }
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          this.isFetching = false;
        });
    }, 500),
    searchCourses: debounce(function () {
      this.list_of_courses = [];
      let text=this.education.Stream;
      if(text.length < 2) {
        return
      }
      console.log(`Searching for ${text}`);
      this.isFetching = true;
      ZOHO.CRM.API.searchRecord({ Entity: "Qualifications", Type:"word",Query:text})
        .then((response) => {
          if(response.status != 204) {
            response.data.forEach( (item) => {
              this.list_of_courses.push(item.Name);
            })
          } else {
            console.log("No results found");
            this.list_of_courses = [];
          }
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          this.isFetching = false;
        });
    }, 500)
  }
};
</script>

<style>
.percentage{
  width: 200px;
}
</style>
