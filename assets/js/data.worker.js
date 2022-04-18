import { filterArray } from "../../helper";

self.addEventListener("message", (event) => {
  const { text: value, data } = event.data;

  if (!data || data.length === 0) {
    self.postMessage({ filterUsers: [] });
  }
  const filterUsers = filterArray(data, value);

  self.postMessage({ filterUsers });
});
