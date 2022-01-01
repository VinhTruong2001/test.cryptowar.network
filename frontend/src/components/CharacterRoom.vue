<template>
  <div class="character-item">
    <div class="art">
      <CharacterRoomArtPvp
        v-if="characters[this.characterId]"
        :character="characters[this.characterId]"
        :room="this.room"
        :matchReward="this.matchReward"
        :selectedWeaponId="this.selectedWeaponId"
        :selectedCharacterId="this.selectedCharacterId"
      />
    </div>
    <div v-if="this.isRequest == true" class="containerButton">
        <button
          type="button"
          class="btn-request-fight"
          @click="() => handleRequestFight()"
        >
        <span class="titleButtonFight">
          REQUEST FIGHT
        </span>
        </button>
      </div>
      <div v-if="this.isCancel == true" class="containerButton">
        <button
          type="button"
          class="btn-request-fight"
          @click="() => handleCancelFight()"
        >
        <span class="titleButtonFight">
          CANCEL FIGHT
        </span>
        </button>
      </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CharacterRoomArtPvp from "../components/CharacterRoomArtPvp.vue";
import { mapActions, mapState } from "vuex";
import Web3 from "web3";

export default Vue.extend({
  props: ["characterId", "room", "selectedWeaponId", "selectedCharacterId", "isRequest", "handleRequestFight","handleCancelFight", "isCancel"],
  components: {
    CharacterRoomArtPvp,
  },
  methods: {
    ...mapActions(["fetchCharacters", "requestFight"]),
    // handleRequestFight() {
    //   //@ts-ignore
    //   this.requestFight({
    //     roomId: this.room.id,
    //     weaponId: this.selectedWeaponId,
    //     characterId: this.selectedCharacterId,
    //   });
    // },
  },
  computed: {
    ...mapState(["characters"]),
    matchReward() {
      return Web3.utils.fromWei(this.room.matchReward, "ether");
    },
  },
  async mounted() {
    //@ts-ignore
    await this.fetchCharacters([this.characterId]);
  },
});
</script>

<style scoped>
.character-item {
  width: 299px;
  max-width: 100%;
  background-repeat: no-repeat;
  background-size: 100% 100%;;
  margin-top: 1rem;
  margin-bottom: 2.7rem;
  margin-left: 1.25rem;
  margin-right: 1.25rem;
  align-items: center;
  justify-items: center;
  max-height: 432px;
}

.character-item .art {
  width: 100%;
  min-height: 0;
  height: 100%;
  /* background-position: center; */
  background-repeat: no-repeat;
  background-size: contain;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: transparent;
  /* background-color: red; */
}
.character-list {
  list-style: none;
  flex-wrap: wrap;
  justify-content: center;
  padding-left: 0px;
}

  .containerButton {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 2rem;
  }
  .btn-request-fight{
  margin: 0 auto;
  display: block;
  background-color: transparent;
  border: none;
  background-image:  url(../assets/v2/btn-fight-big.svg);
  width: 190px;
  height: 42px;
  background-size: cover;
  background-repeat: no-repeat;
  color: #fff;
  font-weight: 600;
  font-size: 1em;
  margin-top: 20px;
  margin-bottom: 10px;
}
.titleButtonFight {
  color: var(--white);
  font-size: 20px;
  font-size: 19px;
  font-weight: bold;
  padding-top: 12px;
  padding-bottom: 12px;
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
