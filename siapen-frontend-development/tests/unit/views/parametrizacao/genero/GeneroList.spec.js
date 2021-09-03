/* eslint-disable */

import { shallowMount } from "@vue/test-utils";
import VueRouter from "vue-router";

import i18n from "@/plugins/i18n";
import VTable from "@/components/VTable";
import GeneroList from "@/views/parametrizacao/genero/list";

const router = new VueRouter();

const wrapper = shallowMount(GeneroList, {
  i18n,
  router,
  propsData: {
    router: "genero",
  },
});

describe("GeneroList", () => {
  it("Verifica se o componente de tabela foi carregado", () => {
    const table = wrapper.findComponent(VTable);
    expect(table.exists()).toBe(true);
  });
});
