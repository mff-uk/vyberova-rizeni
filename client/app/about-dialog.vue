<template>
  <v-dialog
    v-model="aboutDialog"
    max-width="60rem"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>help</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">
        Dokumentace
      </v-card-title>
      <v-card-text>
        <ul>
          <li>
            <a
              href="https://data.mff.cuni.cz/dokumentace/pracovní-místa-mff-uk/"
              rel="nofollow noopener noreferrer"
              target="_blank"
            >
              Dokumentace datového formátu
            </a>
          </li>
          <li>
            <a
              href="https://github.com/mff-uk/vyberova-rizeni"
              rel="nofollow noopener noreferrer"
              target="_blank"
            >
              Zdrojový kód aplikace
            </a>
          </li>
        </ul>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="green darken-1"
          text
          @click="aboutDialog = false"
        >
          Zavřít
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  "name": "about-dialog",
  "data": () => ({
    "aboutDialog": false,
  }),
}
</script>