<template>
  <div class="project-card-delete-guard">
    <div class="project-card-delete-guard__title">
      {{ $t("ProjectCardDeleteGuard.title") }}
      <BIMDataButton
        data-test-id="btn-close-delete"
        ghost
        rounded
        icon
        @click="close"
      >
        <BIMDataIconClose size="xxs" />
      </BIMDataButton>
    </div>
    <div class="project-card-delete-guard__message">
      {{ $t("ProjectCardDeleteGuard.message") }}
    </div>
    <BIMDataButton
      data-test-id="btn-submit-delete"
      data-testid="btn-submit-delete"
      class="project-card-delete-guard__submit-btn"
      color="high"
      fill
      radius
      @click="submit"
    >
      {{ $t("t.delete") }}
    </BIMDataButton>
  </div>
</template>

<script>
import { inject } from "vue";
import { useProjects } from "../../../../../state/projects.js";

export default {
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  emits: ["close", "success"],
  setup(props, { emit }) {
    const { deleteProject } = useProjects();

    const loading = inject("loading", false);

    const submit = async () => {
      try {
        loading.value = true;
        await deleteProject(props.project);
        emit("success");
      } finally {
        loading.value = false;
      }
    };

    const close = () => {
      emit("close");
    };

    return {
      // Methods
      close,
      submit
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectCardDeleteGuard.scss"></style>
