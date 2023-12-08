<template>
  <div class="create-rule">
    <div class="create-rule__content">
      <div class="create-rule__content__step bg-light p-12">
        <h5><span class="m-r-6">1</span> Nom de la règle</h5>
        <BIMDataInput
          v-model="ruleName"
          placeholder="Nom"
          :error="!ruleName"
          errorMessage="your error message here"
          :loading="false"
          margin="0px 0px 6px"
        />
      </div>
      <div class="create-rule__content__step bg-light m-t-12 p-12">
        <h5><span class="m-r-6">2</span> Type de séparateur</h5>
        <div class="create-rule__content__step__separators flex">
          <BIMDataRadio
            text="- (tiret)"
            value="-"
            name="separator"
            v-model="separator"
            :disabled="false"
            :big="false"
          />
          <BIMDataRadio
            text=". (point)"
            value="."
            name="separator"
            v-model="separator"
            :disabled="false"
            :big="false"
          />
          <BIMDataRadio
            text="_ (trait de soulignement)"
            value="_"
            name="separator"
            v-model="separator"
            :disabled="false"
            :big="false"
          />
        </div>
      </div>
      <div class="create-rule__content__step bg-light m-t-12 p-12">
        <h5><span class="m-r-6">3</span> Structure de la règle</h5>
        <p
          v-if="elements.length === 0"
          class="empty-rule-structure color-granite"
        >
          Ajoutez votre premier élement, pour commencer à établir votre règle.
        </p>
        <div v-else :class="{ 'rule-group': elements.length > 1 }">
          <AddElement
            v-for="(element, i) in elements"
            :key="i"
            :element="element"
            :elements="elements"
            @remove="removeElement(i)"
          />
        </div>
        <span class="add-element-text color-granite">Ajouter un élement :</span>
        <div class="flex justify-between">
          <BIMDataButton
            width="100px"
            color="default"
            fill
            radius
            @click="addElement('n characters')"
          >
            <BIMDataIconPlus size="xxxs" margin="0 6px 0 0" />
            <span>N caractères</span>
          </BIMDataButton>
          <BIMDataButton
            width="100px"
            color="default"
            fill
            radius
            @click="addElement('bounded values')"
          >
            <BIMDataIconPlus size="xxxs" margin="0 6px 0 0" />
            <span>Valeurs bornées</span>
          </BIMDataButton>
          <BIMDataButton
            width="100px"
            color="default"
            fill
            radius
            @click="addElement('list')"
          >
            <BIMDataIconPlus size="xxxs" margin="0 6px 0 0" />
            <span>Liste</span>
          </BIMDataButton>
        </div>
      </div>
      <div class="create-rule__content__strict-rule m-t-30">
        <BIMDataCheckbox
          :disabled="false"
          text="Règle stricte"
          v-model="strictRule"
        />
        <p class="color-granite">
          Si vous cochez cette case, vous devrez changer le nom de l’intégralité
          des fichiers qui ne correspondent pas à cette nouvelle règle.
        </p>
      </div>
    </div>
    <div class="create-rule__footer">
      <BIMDataButton color="primary" fill radius width="100%">
        Enregistrer la règle</BIMDataButton
      >
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import AddElement from "./add-element/AddElement.vue";

export default {
  components: {
    AddElement
  },
  setup() {
    const ruleName = ref("");
    const separator = ref("-");
    const elements = ref([]);
    const strictRule = ref(false);

    const addElement = element => {
      elements.value.push(element);
    };
    const removeElement = elementId => {
      elements.value.splice(elementId, 1);
    };
    return {
      elements,
      ruleName,
      separator,
      strictRule,
      // Methods
      addElement,
      removeElement
    };
  }
};
</script>

<style scoped lang="scss" src="./_CreateRule.scss"></style>
