<template>
  <div class="naming-convention-empty flex flex-col items-center">
    <h1>Créer des règles</h1>
    <span>IMG Here</span>
    <p class="text-center color-granite">
      Une planification minutieuse de la convention de nommage contribue
      grandement à l'efficacité et à la réussite globale du projet BIM en
      favorisant la collaboration et la gestion efficace des données.
    </p>
    <BIMDataButton color="primary" fill radius @click="$emit('next')">
      Commencer
    </BIMDataButton>
  </div>
</template>
