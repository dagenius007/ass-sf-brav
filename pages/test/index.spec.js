import { mount } from "@vue/test-utils";
import Index from "../index.vue";
import Users from "../../components/Users.vue";

describe("Index", () => {
  test("is a Vue instance", () => {
    const wrapper = mount(Index);
    expect(wrapper.vm).toBeTruthy();
  });
});
