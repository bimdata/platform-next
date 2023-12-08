<template>
  <div class="naming-convention p-b-18">
    <CreateRule v-if="isCreateRuleView" />
    <NamingConventionEmpty @next="goToCreateRule" v-else />
  </div>
</template>

<script>
import { ref } from "vue";
import NamingConventionEmpty from "./naming-convention-empty/NamingConventionEmpty.vue";
import CreateRule from "./create-rule/CreateRule.vue";

export default {
  components: {
    NamingConventionEmpty,
    CreateRule
  },
  setup() {
    const isCreateRuleView = ref(false);
    const goToCreateRule = () => {
      isCreateRuleView.value = true;
    };

    return {
      isCreateRuleView,
      goToCreateRule
    };
  }
};
</script>

<style scoped lang="scss" src="./_NamingConvention.scss"></style>
