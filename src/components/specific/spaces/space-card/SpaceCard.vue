<script setup>
import { computed } from "vue";
import routeNames from "../../../../router/route-names.js";
import { useProjects } from "../../../../state/projects.js";
import { useSpaces } from "../../../../state/spaces.js";
import { useUser } from "../../../../state/user.js";
// Components
import AppLink from "../../app/app-link/AppLink.vue";
import FavoriteBadge from "../../../generic/favorite-badge/FavoriteBadge.vue";
import SpaceCardActionMenu from "./space-card-action-menu/SpaceCardActionMenu.vue";
import SpaceCardImage from "./space-card-image/SpaceCardImage.vue";

const props = defineProps({
  space: {
    type: Object,
    required: true
  },
  actionMenu: {
    type: Boolean,
    default: true
  }
});

const { isFavoriteSpace } = useUser();
const { isFreeSpace } = useSpaces();
const { projectsBySpace } = useProjects();

const nbProjects = computed(
  () => projectsBySpace.value[props.space.id]?.length ?? 0
);
</script>

<template>
  <AppLink
    data-test-id="space-card"
    data-testid="space-card"
    :data-test-param="space.id"
    :to="{ name: routeNames.spaceBoard, params: { spaceID: space.id } }"
  >
    <BIMDataCard class="space-card">
      <template #right>
        <SpaceCardActionMenu v-if="actionMenu" :space="space" />
      </template>
      <template #content>
        <div v-if="isFreeSpace(space)" class="free-badge">
          {{ $t("SpaceCard.free") }}
        </div>
        <FavoriteBadge v-if="isFavoriteSpace(space)" />
        <SpaceCardImage :space="space" topStripe />
      </template>
      <template #footer>
        <div class="space-card__title">
          <BIMDataTextbox :text="space.name" />
        </div>
        <div class="space-card__title-underline"></div>
        <div class="space-card__sub-title">
          <div class="space-card__sub-title__text">
            {{ $t("SpaceCard.projects") }}
          </div>
          <div class="space-card__sub-title__number">
            {{ nbProjects }}
          </div>
        </div>
      </template>
    </BIMDataCard>
  </AppLink>
</template>

<style scoped lang="scss" src="./SpaceCard.scss"></style>
