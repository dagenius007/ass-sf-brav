<template>
  <div class="wrapper">
    <div class="container" @scroll="onScroll">
      <SearchBar @search="handleInput" :text="text" />
      <Users :users="filters" :text="text" />
    </div>
  </div>
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
}
p {
  margin: 0;
  padding: 0;
}
.wrapper {
  height: 100vh;
  width: 100vw;
  border: 1px solid red;
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
</style>
<script lang="ts">
import Vue from "vue";
import axios from "axios";
import { filterArray } from "../helper";

export default Vue.extend({
  name: "Search",
  props: {
    searchText: String,
  },
  data() {
    return {
      text: this.searchText || "",
      searchedIndex: [],
      users: [],
      filteredUsers: [],
      //@ts-ignore
      worker: null,
      perPage: 10,
      currentPage: 0,
      totalPages: 0,
    };
  },
  async created() {
    //   console.log({text })
    //@ts-ignore
    this.worker = this.$worker.createWorker();
    try {
      const res = await axios.get(
        `https://gist.githubusercontent.com/allaud/093aa499998b7843bb10b44ea6ea02dc/raw/c400744999bf4b308f67807729a6635ced0c8644/users.json`
      );
      // console.log({ user: res.data });

      if (res && res.data) {
        //take first 10 and save into user and remaining into storage
        this.users = res.data.slice(0, this.perPage + 1);
        this.totalPages = res.data.length / this.perPage;
        this.currentPage = 1;
        if (process.client) {
          localStorage.setItem(
            "backlog",
            JSON.stringify(res.data.slice(this.perPage + 1, res.data.length))
          );
          if (this.text) {
            filterArray(this.users, this.text);
            const filterUsers = filterArray(this.users, this.text);

            this.filteredUsers = [...filterUsers] as any;

            //Load more data to populate
            if (filterUsers.length < 4) {
              console.log("lll");
              this.loadData();
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  },
  beforeMount() {
    // this.loadData();
  },
  computed: {
    filters() {
      // @ts-ignore
      return this.filteredUsers.length === 0 ? this.users : this.filteredUsers;
    },
  },
  watch: {
    // // whenever question changes, this function will run
    // text(newT, oldQuestion) {
    //   this.loadData();
    // },
  },
  methods: {
    postMessageToWorker() {
      if (process.client) {
        const t =
          localStorage && localStorage.backlog
            ? JSON.parse(localStorage.getItem("backlog") as string)
            : [];

        const newPage = this.currentPage + 1;

        const nextBatch = t.slice(
          this.currentPage * this.perPage,
          newPage * this.perPage
        );

        this.currentPage = newPage;
        //@ts-ignore
        this.worker.postMessage({ text: this.text, data: nextBatch });
      }
    },
    loadData() {
      console.log("worker", this.worker);
      //@ts-ignore
      this.worker.terminate();

      console.log("worker terminated", this.worker);

      //@ts-ignore
      this.worker = this.$worker.createWorker();

      if (process.client) {
        const t =
          localStorage && localStorage.backlog
            ? JSON.parse(localStorage.getItem("backlog") as string)
            : [];

        const newPage = this.currentPage + 1;

        const nextBatch = t.slice(
          this.currentPage * this.perPage,
          newPage * this.perPage
        );

        this.currentPage = newPage;
        //@ts-ignore
        this.worker.postMessage({ text: this.text, data: nextBatch });
      }

      //@ts-ignore
      this.worker.addEventListener("message", (event: any) => {
        console.log(event.data, "filtered");
        const { filterUsers } = event.data;
        //if filterUsers length === 0 // send another message until the last page
        // Fetch more from localstorage if the data is not a lot
        console.log({ total: this.totalPages });
        if (filterUsers.length < 4 && this.currentPage !== this.totalPages) {
          this.postMessageToWorker();
        }
        this.filteredUsers = [...this.filteredUsers, ...filterUsers] as any;
      });
    },
    onScroll(event: any) {
      console.log("jiiii");
      const { scrollTop, clientHeight, scrollHeight } = event.target;
      if (scrollTop + clientHeight >= scrollHeight) {
        // load more data
        this.loadData();
      }
    },
    async handleInput(value: string) {
      console.log("======== STARTING ==========");
      // // `this` inside methods points to the current active instance

      this.text = value;

      if (value) {
        value = value.toLowerCase();

        const filterUsers = filterArray(this.users, value);

        this.filteredUsers = [...filterUsers] as any;

        //Load more data to populate
        if (filterUsers.length < 4) {
          console.log("lll");
          this.loadData();
        }
      }
    },
  },
});
</script>
