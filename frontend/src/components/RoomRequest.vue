<template>
 <div style="containerListRequest">
   <BackgroundItem
   v-if="this.request.heroId"
   :character="characters[this.request.heroId]" :selectedCharacterId="this.request.heroId" :selectedWeaponId="this.request.weaponId" :noMargin="false" />
   <div class="containerButton" v-if="!isMine">
        <button
          type="button"
          class="buttonFight"
          @click="() =>this.handleFight(this.request.roomId, this.request.id)"
        >
        <span class="titleButtonFight">
          FIGHT
        </span>
        </button>
      </div>
      <div class="containerButton" v-if="!isDone && isMine">
        <button
          type="button"
          class="buttonFight"
          @click="() =>this.cancelRequestFight(this.request.roomId, this.request.id)"
        >
        <span class="titleButtonFight">
          CANCEL FIGHT
        </span>
        </button>
      </div>
      <div v-if="isDone">
        <div class="cost"><div></div> {{this.getResult()}}</div>
      </div>


     <!-- <div class="character-item">
       <div class="art">
         <div class="name-lvl-container">
        <div
          class="name black-outline"
          :title="getCleanCharacterName(this.request.heroId)"
        >
          {{'#'+ this.request.heroId }}
        </div>
      </div>
       </div>
     </div> -->
     </div>
</template>


<script lang="ts">
import Vue from "vue";
import { mapActions, mapState,mapMutations, mapGetters } from "vuex";
import { getCleanName } from "../rename-censor";
// import CharacterRoom from "./CharacterRoom.vue";
// import CharacterRoomArt from "./CharacterRoomArt.vue";
import BackgroundItem from "./BackgroundItem.vue";
// import CharacterRoomArt from "./CharacterRoomArt.vue";

export default Vue.extend({

  data() {
    return {
      waitingResults: false,
      resultsAvailable: false,
      fightResults: null,
      error: null,
      room: null,
      dataRoom: null,
    };
  },
  components: { BackgroundItem },
  props: ["request", "handleFight", "isMine", "isDone", "cancelRequestFight", "isWin"],
  computed: {
    ...mapState(["characters", "careerModeRooms"]),
    ...mapGetters(["getCharacterName"]),
  },

  methods: {
    ...mapActions(["fetchCharacters", "fight", "getRoom"]),
    ...mapMutations(['setIsInCombat']),
    getCleanCharacterName(id: number) {
      return getCleanName(this.getCharacterName(id));
    },
    getResult() {
      if(this.isWin) {
        return 'You win this match!';
      }else {
        return 'You lose this match!';
      }
    }
  },

  async mounted() {
    if (this.request.heroId) {
      await this.fetchCharacters([this.request.heroId]);
    }
    const res = await this.getRoom(this.request.roomId);
    console.log('data room', res);
  },
});
</script>

<style scoped>

.containerListRequest {
  margin-top: 3.5rem;
}
.character-item {
  width: 100%;
  max-width: 340px;
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

.containerButton {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 2rem;
  }
  .buttonFight {
    border: none;
    height: 47px;
    background-image: url('../assets/images/bg-fight-button.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-color: transparent;
  }
.titleButtonFight {
  color: var(--white);
  font-size: 20px;
  padding-left: 23.5px;
  padding-right: 23.5px;
  font-size: 19px;
  font-weight: bold;
  padding-top: 12px;
  padding-bottom: 12px;
}
.cost{
  color: #D858F7;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  font-size: 1.3em;
}
.cost > div{
  /* background-image: url(../assets/v2/icon-crypto.svg); */
  width: 20px;
  height: 19px;
  background-repeat: no-repeat;
  background-size: cover;
  margin-right: 6px;
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
