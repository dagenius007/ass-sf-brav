onmessage = async () => {
  //get data from localstorage and filter here
};

const msg = "world!";

self.addEventListener("message", (event) => {
  //   console.log(event.data);
  const { text: value, data } = event.data;

  if (!data) {
    return;
  }
  const filterUsers = data.filter((user) => {
    let isFound = false;
    Object.keys(user).forEach((field) => {
      let index = -1;
      if (typeof user[field] == "string") {
        index = user[field].toLowerCase().indexOf(value);
      }

      if (index !== -1) {
        isFound = true;
      }
    });

    return isFound && user;
  });
  console.log({ filterUsers });
  self.postMessage({ filterUsers });
});

// self.postMessage({ hello: "from web worker" });
// postMessage({
//   loaded: true,
// });
