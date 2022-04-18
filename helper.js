export function filterArray(array, text) {
  const filterUsers = array.filter((user, i) => {
    let isFound = false;
    Object.keys(user).forEach((field) => {
      let index = -1;
      if (typeof user[field] == "string") {
        index = user[field].toLowerCase().indexOf(text);
      }
      console.log({
        field:
          typeof user[field] == "string" ? user[field].toLowerCase() : null,
        index,
        text,
      });
      if (index !== -1) {
        isFound = true;
      }
    });
    console.log({ isFound });
    return isFound && user;
  });

  return filterUsers;
}
