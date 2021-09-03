/* eslint-disable */

import { shallowMount } from "@vue/test-utils";
import VueRouter from "vue-router";

import i18n from "@/plugins/i18n";
import VTable from "@/components/VTable";
import SistemaPenalList from "@/views/prisional/sistema-penal/list";

const router = new VueRouter();

const wrapper = shallowMount(SistemaPenalList, {
  i18n,
  router,
  propsData: {
    router: "sistema-penal",
  },
});

describe("SistemaPenalList", () => {
  it("Verifica se o componente de tabela foi carregado", () => {
    const table = wrapper.findComponent(VTable);
    expect(table.exists()).toBe(true);
  });
});
