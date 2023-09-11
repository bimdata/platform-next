<template>
  <div
    class="project-creation-card"
    data-test-id="project-creation-card"
    data-testid="project-creation-card"
    v-click-away="closeCreationForm"
  >
    <transition name="fade" mode="out-in">
      <div v-if="loading" class="project-creation-card__loader">
        <BIMDataSpinner />
      </div>

      <div v-else-if="showCreationForm" class="project-creation-card__form">
        <div class="project-creation-card__form__title">
          {{ $t("ProjectCreationCard.title") }}
          <BIMDataButton
            data-test-id="btn-close-create"
            ghost
            rounded
            icon
            @click.stop="closeCreationForm"
          >
            <BIMDataIconClose size="xxs" />
          </BIMDataButton>
        </div>
        <BIMDataInput
          ref="nameInput"
          data-test-id="input-create-name"
          data-testid="input-create-name"
          class="project-creation-card__form__input"
          :placeholder="$t('t.name')"
          v-model="newProject.name"
          :error="hasError"
          :errorMessage="$t('t.invalidName')"
          @keyup.esc.stop="closeCreationForm"
          @keyup.enter.stop="submit"
        />
        <BIMDataButton
          data-test-id="btn-submit-create"
          data-testid="btn-submit-create"
          class="project-creation-card__form__btn-submit"
          fill
          radius
          color="primary"
          @click="submit"
        >
          {{ $t("t.create") }}
        </BIMDataButton>
      </div>

      <div
        v-else
        data-guide="btn-create-project"
        data-test-id="btn-open-create"
        data-testid="btn-open-create"
        class="project-creation-card__btn-open"
        @click="openCreationForm"
      >
        <div class="project-creation-card__btn-open__icon">
          <BIMDataIconPlus size="l" />
        </div>
        <div class="project-creation-card__btn-open__text">
          {{ $t("ProjectCreationCard.text") }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import { useProjects } from "../../../../state/projects.js";
import { debounce } from "../../../../utils/async.js";

export default {
  props: {
    space: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { createProject } = useProjects();

    const loading = ref(false);
    const nameInput = ref(null);
    const newProject = reactive({ name: "" });
    const hasError = ref(false);

    const submit = debounce(async () => {
      if (newProject.name) {
        try {
          loading.value = true;
          await createProject(props.space, newProject);
          closeCreationForm();
        } finally {
          loading.value = false;
        }
      } else {
        nameInput.value.focus();
        hasError.value = true;
      }
    }, 500);

    const showCreationForm = ref(false);
    const openCreationForm = () => {
      showCreationForm.value = true;
      setTimeout(() => nameInput.value.focus(), 200);
    };
    const closeCreationForm = () => {
      newProject.name = "";
      hasError.value = false;
      showCreationForm.value = false;
    };

    return {
      // References
      hasError,
      loading,
      nameInput,
      newProject,
      showCreationForm,
      // Methods
      closeCreationForm,
      openCreationForm,
      submit
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectCreationCard.scss"></style>
