<template>
  <FlippableCard
    v-if="visible"
    class="project-card"
    data-test-id="project-card"
    data-testid="project-card"
    :data-test-param="project.id"
    :flipped="showMenu"
    v-click-away="closeMenu"
  >
    <template #front-face>
      <AppLink
        data-guide="dashboard-project"
        :data-guide-param="project.id"
        :data-guide-click="
          isSpaceAdmin(project.cloud) && displayedModels.length > 0
            ? 'dashboard-project'
            : ''
        "
        :to="{
          name: routeNames.projectBoard,
          params: {
            spaceID: project.cloud.id,
            projectID: project.id
          }
        }"
      >
        <BIMDataCard>
          <template #content>
            <ProjectCardActionBar
              class="project-card__action-bar"
              :actionMenu="actionMenu"
              :viewerButton="viewerButton"
              :project="project"
              :models="displayedModels"
              @open-viewer="goToModelViewer"
              @open-menu="openMenu"
            />
            <div
              class="project-card__left-stripe"
              :class="`project-card__left-stripe--${projectStatus(project)}`"
            ></div>
            <FavoriteBadge v-if="isFavoriteProject(project)" />
            <ProjectStatusBadge :status="projectStatus(project)" />
            <ProjectCardModelPreview
              :project="project"
              :models="displayedModels"
              @model-changed="onModelChange"
            />
          </template>
          <template #footer>
            <div class="project-card__title">
              <BIMDataTextbox :text="project.name" />
            </div>
          </template>
        </BIMDataCard>
      </AppLink>
    </template>

    <template #back-face>
      <ProjectCardActionMenu :project="project" @close="closeMenu" />
    </template>
  </FlippableCard>

  <div v-else ref="placeholder" class="project-card-placeholder">
    <BIMDataSpinner v-if="loading" />
  </div>
</template>

<script>
import { inject, onMounted, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useToggle } from "../../../../composables/toggle.js";
import { MODEL_TYPE } from "../../../../config/models.js";
import routeNames from "../../../../router/route-names.js";
import ModelService from "../../../../services/ModelService.js";
import { useUser } from "../../../../state/user.js";
import { openInViewer } from "../../../../utils/models.js";
import { projectStatus } from "../../../../utils/projects.js"

// Components
import AppLink from "../../app/app-link/AppLink.vue";
import FavoriteBadge from "../../../generic/favorite-badge/FavoriteBadge.vue";
import FlippableCard from "../../../generic/flippable-card/FlippableCard.vue";
import ProjectCardActionBar from "./project-card-action-bar/ProjectCardActionBar.vue";
import ProjectCardActionMenu from "./project-card-action-menu/ProjectCardActionMenu.vue";
import ProjectCardModelPreview from "./project-card-model-preview/ProjectCardModelPreview.vue";
import ProjectStatusBadge from "../project-status-badge/ProjectStatusBadge.vue";

export default {
  components: {
    AppLink,
    FavoriteBadge,
    FlippableCard,
    ProjectCardActionBar,
    ProjectCardActionMenu,
    ProjectCardModelPreview,
    ProjectStatusBadge
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    actionMenu: {
      type: Boolean,
      default: true
    },
    viewerButton: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const router = useRouter();
    const { isSpaceAdmin, isFavoriteProject } = useUser();
    const { isOpen: showMenu, open: openMenu, close: closeMenu } = useToggle();
    const viewContainer = inject("viewContainer");

    const visible = ref(false);
    const loading = ref(false);
    const placeholder = ref(null);
    const displayedModels = ref([]);
    const currentModel = ref(null);

    const onModelChange = model => {
      currentModel.value = model;
    };

    const goToModelViewer = () => {
      openInViewer(router, props.project, currentModel.value);
    };

    let unwatchProject, unwatchModels;

    onMounted(() => {
      const observer = new IntersectionObserver(
        ([{ isIntersecting }]) => {
          if (!isIntersecting) return;

          unwatchProject = watch(
            () => props.project,
            async () => {
              loading.value = true;
              const models = await ModelService.fetchModels(props.project);
              displayedModels.value = models
                .filter(
                  model =>
                    !model.archived && model.type !== MODEL_TYPE.META_BUILDING
                )
                .reduce(
                  (acc, model) =>
                    model.id === props.project.main_model_id
                      ? [model, ...acc]
                      : [...acc, model],
                  []
                );
              loading.value = false;
              visible.value = true;
            },
            { immediate: true }
          );

          unwatchModels = watch(
            displayedModels,
            () => {
              currentModel.value = displayedModels.value[0];
            },
            { immediate: true }
          );

          observer.disconnect();
        },
        {
          root: viewContainer.value,
          rootMargin: `${viewContainer.value.clientHeight}px`
        }
      );

      observer.observe(placeholder.value);
    });

    onUnmounted(() => {
      unwatchProject?.();
      unwatchModels?.();
    });

    return {
      // References
      currentModel,
      displayedModels,
      loading,
      placeholder,
      routeNames,
      showMenu,
      visible,
      // Methods
      closeMenu,
      goToModelViewer,
      isFavoriteProject,
      isSpaceAdmin,
      onModelChange,
      openMenu,
      projectStatus,
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectCard.scss"></style>
