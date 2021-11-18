<template>
  <div class="character-item">
    <div class="art">
      <CharacterRoomArt
        v-if="characters[this.characterId]"
        :character="characters[this.characterId]"
        :matchReward="this.matchReward"
        :room="this.room"
        :selectedWeaponId="this.selectedWeaponId"
        :selectedCharacterId="this.selectedCharacterId"
      />
    </div>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import CharacterRoomArt from "../components/CharacterRoomArt.vue";
import { mapActions, mapState } from "vuex";
import Web3 from "web3";

export default Vue.extend({
  props: ["characterId", "room", "selectedWeaponId", "selectedCharacterId"],
  components: {
    CharacterRoomArt,
  },
  methods: {
    ...mapActions(["fetchCharacters"]),
  },
  computed: {
    ...mapState(["characters"]),
    matchReward() {
      return Web3.utils.fromWei(this.room.matchReward, "ether");
    },
  },
  async mounted() {
    // console.log(this.room);
    await this.fetchCharacters([this.characterId]);
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
