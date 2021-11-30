<template>
  <div
    style="
      border-radius: 6px;
      border: 1px solid #f76d00;
      padding: 12px;
      margin: 12px;
    "
  >
    <div>
      <div>Hero ID {{ this.request.heroId }}</div>
      <div>Requester {{ this.request.requester }}</div>
      <div>
        <button type="button" class="btn btn-buy btn-sm" @click="handleFight()">
          Fight
        </button>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import { mapActions, mapState } from "vuex";

export default Vue.extend({
  props: ["request"],
  methods: {
    ...mapActions(["fetchCharacters", "fight"]),
    handleFight() {
      this.fight({ roomId: this.request.roomId, requestId: this.request.id });
    },
  },
  computed: {
    ...mapState(["characters"]),
  },
  async mounted() {
    if (this.request.heroId) {
      await this.fetchCharacters([this.request.heroId]);
    }
  },
});
</script>

<style scoped>
.character-item {
  width: 340px;
  max-width: 100%;
  background-image: url("../assets/images/bg-item-top.png");
  background-position: 50% 50%;
  background-repeat: no-repeat;
  margin-top: 50px;
  background-size: cover;
  position: relative;
}

.character-item .art {
  width: 100%;
  min-height: 0;
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
.character-list {
  list-style: none;
  flex-wrap: wrap;
  justify-content: center;
  padding-left: 0px;
}

@media (max-width: 576px) {
  .character-item img {
    object-fit: contain;
  }

  .character-item.selected {
    background-image: url("../assets/images/bg-item-top-select.png");
  }
  .character-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .clear-filters-button {
    width: 100%;
    text-align: center;
    justify-content: center;
  }
}
</style>
