<template>
  <div class="managing-naming-convention p-12">
    <div
      class="managing-naming-convention__header flex items-center justify-between"
    >
      <span class="color-primary">Gestion des conventions de nommage </span>
      <BIMDataButton ghost rounded icon @click="$emit('close')">
        <BIMDataIconClose size="xxs" fill color="granite-light" />
      </BIMDataButton>
    </div>
    <div class="managing-naming-convention__content m-t-12">
      <div class="flex items-center justify-between">
        <span class="managing-naming-convention__content--title color-primary"
          >Liste des règles</span
        >
        <BIMDataButton color="primary" fill radius>
          <BIMDataIconPlus size="xxxs" margin="0 12px 0 0" />
          <span>Ajouter une règle</span>
        </BIMDataButton>
      </div>
      <BIMDataSearch
        placeholder="Search"
        color="primary"
        radius
        width="100%"
        height="32px"
        class="m-t-12"
      />
      <div
        class="managing-naming-convention__content__empty flex flex-col items-center justify-center m-t-12"
      >
        IMG
        <h5>Pas de règle ajoutée</h5>
        <p>
          Vous n’avez aucune règle pour l’instant, commencez par en ajouter une.
        </p>
        <BIMDataButton color="primary" fill radius>
          <BIMDataIconPlus size="xxxs" margin="0 12px 0 0" />
          <span>Ajouter une règle</span>
        </BIMDataButton>
      </div>
      <div class="managing-naming-convention__content__rules">rules here</div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["close"]
};
</script>

<style scoped lang="scss" src="./ManagingNamingConvention.scss"></style>
