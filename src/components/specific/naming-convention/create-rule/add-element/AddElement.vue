<template>
  <div class="add-element">
    <div class="add-element__text flex items-center">
      <BIMDataIconGrid
        v-if="elements.length > 1"
        fill
        color="granite-light"
        size="xxs"
      />
      <span class="m-l-12">{{ element }}</span>
    </div>
    <div class="add-element__values flex items-center justify-start">
      <div
        v-if="element === 'list'"
        class="add-element__values__list flex items-center"
      >
        <BIMDataDropdownMenu
          :disabled="!list.length"
          :header="true"
          width="150px"
        >
          <template #header="{ isOpen }">
            <span>Choisir une liste</span>
            <BIMDataIconChevron :rotate="isOpen ? 90 : 0" size="xxs" />
          </template>
          <template #element>
            <ul class="bimdata-list">
              <li v-for="element of list" :key="element">{{ element }}</li>
            </ul>
          </template>
        </BIMDataDropdownMenu>
        <BIMDataTooltip text="Créer une liste" maxWidth="240px" class="m-l-6">
          <BIMDataButton color="default" ghost rounded icon>
            <BIMDataIconPlus fill color="default" size="xxs" />
          </BIMDataButton>
        </BIMDataTooltip>
      </div>
      <div v-else class="add-element__values__input flex items-center">
        <input type="text" />
        <div class="separator"></div>
        <input type="text" />
      </div>
    </div>
    <div class="add-element__actions flex items-center justify-end">
      <BIMDataButton
        color="high"
        ghost
        rounded
        icon
        @click="removeClick(element)"
      >
        <BIMDataIconDelete fill color="high" size="xxs" />
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  props: {
    elements: {
      type: Array,
      default: () => []
    },
    element: {
      type: String,
      default: "n characters",
      validator: value =>
        ["n characters", "bounded values", "list"].includes(value)
    }
  },
  emits: ["remove"],
  setup(props, { emit }) {
    const list = ref([]);
    const removeClick = element => {
      emit("remove", element);
    };
    return {
      list,
      // Methods
      removeClick
    };
  }
};
</script>

<style scoped lang="scss" src="./_AddElement.scss"></style>
