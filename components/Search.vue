<template>
  <div class="wrapper">
    <div class="container" @scroll="onScroll">
      <SearchBar @search="handleInput" :text="keyword" />
      <Users :users="filteredUsers" :text="keyword" />
      <p v-if="isLoading" class="state">Loading....</p>
      <p v-if="emptyState" class="state">No Results Found</p>
    </div>
  </div>
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
  font-family: "Roboto";
}
p {
  margin: 0;
  padding: 0;
}
.wrapper {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eeeeee;
}
.container {
  height: 70vh;
  max-width: 650px;
  width: 100%;
  overflow-y: scroll;
  padding: 25px 15px;
  background: #fff;
}
.container::-webkit-scrollbar {
  width: 12px;
  padding-right: 20px;
}

.container::-webkit-scrollbar-track {
  border: 5px solid rgba(0, 0, 0, 0);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.16);
}

.container::-webkit-scrollbar-thumb {
  border-radius: 10px;
  border: 4px solid rgba(0, 0, 0, 0);
  -webkit-box-shadow: inset 0 0 6px rgba(77, 77, 77, 1);
}

.state {
  margin: 25px auto;
  text-align: center;
  font-size: 1.2rem;
  color: rgba(0, 0, 0, 0.543846);
}
</style>
<script lang="ts">
import Vue from "vue";
import axios from "axios";
import { filterArray } from "../helper";
import { mapMutations, mapGetters } from "vuex";
import { IUser } from "../interface";

interface IData {
  keyword: string;
  filteredUsers: IUser[];
  worker: any;
  perPage: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
}

export default Vue.extend({
  name: "Search",
  props: {
    searchText: String,
  },
  data(): IData {
    return {
      keyword: this.searchText || "",

      filteredUsers: [],
      worker: null,
      perPage: 20,
      currentPage: 0,
      totalPages: 0,
      isLoading: true,
    };
  },
  async created() {
    //@ts-ignore
    if (this.$worker) this.worker = this.$worker.createWorker();
    try {
      const res = await axios.get(
        `https://gist.githubusercontent.com/allaud/093aa499998b7843bb10b44ea6ea02dc/raw/c400744999bf4b308f67807729a6635ced0c8644/users.json`
      );

      if (res && res.data) {
        //take first perPage and save into filterUsers
        this.filteredUsers = res.data.slice(0, this.perPage);
        this.totalPages = res.data.length / this.perPage;
        this.currentPage = 1;
        if (process.client) {
          this.add(res.data);

          // This block is for keyword passed via the route
          if (this.keyword) {
            const filterUsers = filterArray(this.filteredUsers, this.keyword);

            this.filteredUsers = [...filterUsers];

            //Load more data to populate
            if (filterUsers.length < 4) {
              this.loadData();
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.isLoading = false;
    }
  },

  computed: {
    // a computed getter
    emptyState(): boolean {
      // `this` points to the component instance
      return this.filteredUsers.length === 0 && !this.isLoading;
    },
  },

  methods: {
    getBacklogUsers(): IUser[] {
      return this.$store.getters.getUsers || [];
    },
    postMessageToWorker() {
      if (process.client) {
        // Get new set of users in batch of this.perPage
        const backlogUsers = this.getBacklogUsers();

        // Update page number
        const newPage = this.currentPage + 1;

        const nextBatch = backlogUsers.slice(
          this.currentPage * this.perPage,
          newPage * this.perPage
        );

        this.currentPage = newPage;

        this.worker.postMessage({ text: this.keyword, data: nextBatch });
      }
    },
    loadData() {
      // terminate any previous workers to avoid multiple workers running simultaneously
      this.worker.terminate();

      //@ts-ignore
      this.worker = this.$worker.createWorker();

      if (process.client) {
        //Post message to worker
        this.postMessageToWorker();
      }

      this.worker.addEventListener("message", (event: any) => {
        const { filterUsers } = event.data;
        //if filterUsers length <= 4
        // Keep posting to worker until greater than 4. This is to populate as much data on the page to enable scrolling
        // Fetch more from localstorage if the data is not a lot

        if (filterUsers.length < 4 && this.currentPage <= this.totalPages) {
          this.postMessageToWorker();
        }
        //Update filteredUsers
        this.filteredUsers = [...this.filteredUsers, ...filterUsers];
      });
    },
    onScroll(event: any) {
      const { scrollTop, clientHeight, scrollHeight } = event.target;
      if (scrollTop + clientHeight >= scrollHeight) {
        // load more data

        this.loadData();
      }
    },
    async handleInput(value: string) {
      this.currentPage = 1;
      // // `this` inside methods points to the current active instance

      this.keyword = value;

      if (value) {
        value = value.toLowerCase();

        const backlogUsers = this.getBacklogUsers();

        const initialUsers = backlogUsers.slice(0, this.perPage);

        const filterUsers = filterArray(initialUsers, value);

        this.filteredUsers = [...filterUsers];

        //Load more data to populate page
        if (filterUsers.length < 4) {
          this.loadData();
        }
      } else {
        const backlogUsers = this.getBacklogUsers();

        if (backlogUsers.length > 0) {
          this.filteredUsers = backlogUsers.slice(0, this.perPage);
        }
      }
    },
    ...mapMutations({
      add: "add",
    }),
  },
});
</script>
