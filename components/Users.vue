<template>
  <div>
    <div class="target" v-for="user in users" :key="user.index">
      <div class="user-container">
        <img :src="user.avatar" />
        <div class="user_info">
          <div class="flex-jc-sb">
            <div>
              <h4 v-html="updateHtml(user.name)" />
              <p v-html="updateHtml(user.title)" class="grey-dark" />
              <p
                v-html="updateHtml(`${user.address}, ${user.city}`)"
                class="grey"
              />
            </div>
            <p v-html="updateHtml(user.email)" class="grey email" />
          </div>

          <button class="btn-action">SKIP SELECTION</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.user-container {
  display: flex;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.24);
  font-family: "Roboto";
  margin-top: 21px;
}

.user-container img {
  background: rgba(0, 0, 0, 0.25);
  width: 25%;
}
.user_info {
  padding: 5px 20px 5px 20px;
  width: 75%;
}

.user_info h4 {
  font-size: 1.8rem;
  margin: 5px 0;
  color: rgba(0, 0, 0, 0.87);
  font-weight: 300;
  background: #fafafa;
}
.grey {
  color: rgba(0, 0, 0, 0.543846);
  margin-bottom: 15px;
  font-size: 0.875rem;
}

.grey-dark {
  font-weight: 700;
  color: rgba(0, 0, 0, 0.543846);
  margin-bottom: 7px;
  font-size: 0.875rem;
}

.btn-action {
  color: #009688;
  text-transform: uppercase;
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 16px;
  background: transparent;
  border: unset;
  cursor: pointer;
}

.select {
  background-color: #fff73b;
}
.flex-jc-sb {
  display: flex;
  justify-content: space-between;
}
.email {
  margin-top: 5px;
}
</style>

<script>
export default {
  name: "Users",
  props: ["users", "text"],
  data() {
    return {
      name: "Vue.js",
    };
  },
  methods: {
    greet(event) {
      // `this` inside methods points to the current active instance
      alert(`Hello ${this.name}!`);
      // `event` is the native DOM event
      if (event) {
        alert(event.target.tagName);
      }
    },

    updateHtml(text) {
      if (this.text && text) {
        const index = text.toLowerCase().indexOf(this.text.toLowerCase());
        let newString = "";
        if (index !== -1) {
          newString =
            text.substring(0, index) +
            "<span class='select'>" +
            text.substring(index, index + this.text.length) +
            "</span>" +
            text.substring(index + this.text.length, text.length);
        }
        return newString || text;
      }
      return text;
    },
  },
};
</script>
