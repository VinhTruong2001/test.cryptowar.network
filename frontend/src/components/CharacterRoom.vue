<template>
  <CharacterArt
    v-if="!characters[this.id]"
    :character="characters[this.id]"
    :portrait="true"
  />
</template>


<script lang="ts">
import Vue from "vue";
import CharacterArt from "../components/CharacterArt.vue";
import { mapActions, mapState } from "vuex";

export default Vue.extend({
  props: ["id"],
  components: {
    CharacterArt,
  },
  methods: {
    ...mapActions(["fetchCharacters"]),
  },
  computed:{
    ...mapState(["characters"]),
  },
  mounted() {
    console.log(this.id);
    this.fetchCharacters([this.id]);
  },
});
</script>
