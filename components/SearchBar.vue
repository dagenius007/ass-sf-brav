<template>
  <div>
    <div class="search_container">
      <input name="search" v-model="name" />
      <img src="~/assets/search.svg" @click="handleSearch" />
    </div>
  </div>
</template>

<style>
.search_container {
  position: relative;
}
.search_container input {
  width: 100%;
  background: #fafafa;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.24);
  border-radius: 2px;
  padding: 12px;
  border: transparent;
  font-size: 1.8rem;
  box-sizing: border-box;
  padding-left: 45px;
}
.search_container img {
  position: absolute;
  top: 22px;
  left: 11px;
  width: 21px;
}
</style>

<script>
export default {
  name: "SearchBar",
  props: {
    text: String,
  },
  data() {
    return {
      name: this.text || "",
    };
  },
  watch: {
    name(value) {
      this.$emit("search", value);
    },
  },
  methods: {
    handleSearch(event) {
      this.$emit("search", this.name);
    },
  },
};
</script>
