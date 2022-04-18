export function filterArray(array, text) {
  const filterUsers = array.filter((user, i) => {
    let isFound = false;
    Object.keys(user).forEach((field) => {
      let index = -1;
      // todo: pass field to exempt as an array
      if (typeof user[field] == "string" && field !== "avatar") {
        index = user[field].toLowerCase().indexOf(text);
      }

      if (index !== -1) {
        isFound = true;
      }
    });
    return isFound && { ...user, index: i };
  });

  return filterUsers;
}
