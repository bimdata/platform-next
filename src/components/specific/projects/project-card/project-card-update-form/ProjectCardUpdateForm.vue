<template>
  <div class="project-card-update-form">
    <div class="project-card-update-form__title">
      {{ $t("ProjectCardUpdateForm.title") }}
      <BIMDataButton
        data-test-id="btn-close-update"
        ghost
        rounded
        icon
        @click="close"
      >
        <BIMDataIconClose size="xxs" />
      </BIMDataButton>
    </div>
    <BIMDataInput
      ref="nameInput"
      data-test-id="input-update-name"
      data-testid="input-update-name"
      class="project-card-update-form__input"
      :placeholder="$t('t.name')"
      v-model="projectName"
      :error="hasError"
      :errorMessage="$t('t.invalidName')"
      @keyup.esc.stop="close"
      @keyup.enter.stop="renameProject"
    />
    <BIMDataButton
      data-test-id="btn-submit-update"
      data-testid="btn-submit-update"
      class="project-card-update-form__submit-btn"
      color="primary"
      fill
      radius
      @click="renameProject"
    >
      {{ $t("t.rename") }}
    </BIMDataButton>
  </div>
</template>

<script>
import { inject, onMounted, ref } from "vue";
import { useProjects } from "../../../../../state/projects.js";
import { debounce } from "../../../../../utils/async.js";

export default {
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  emits: ["close", "success"],
  setup(props, { emit }) {
    const { updateProject } = useProjects();

    const loading = inject("loading", false);

    const nameInput = ref(null);
    const projectName = ref(props.project.name);
    const hasError = ref(false);

    const renameProject = debounce(async () => {
      if (projectName.value) {
        try {
          loading.value = true;
          await updateProject({
            ...props.project,
            name: projectName.value
          });
          emit("success");
        } finally {
          loading.value = false;
        }
      } else {
        nameInput.value.focus();
        hasError.value = true;
      }
    }, 500);

    const close = () => {
      hasError.value = false;
      emit("close");
    };

    onMounted(() => {
      setTimeout(() => nameInput.value.focus(), 200);
    });

    return {
      // References
      hasError,
      nameInput,
      projectName,
      // Methods
      close,
      renameProject
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectCardUpdateForm.scss"></style>
