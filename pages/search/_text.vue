<template>
  <Search :searchText="text" />
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

export default Vue.extend({
  name: "SearchUrl",
  data() {
    return {
      text: this.$route.params.text || "",
    };
  },
  created() {
    // console.log({ route: this.$route });
  },
});
</script>
