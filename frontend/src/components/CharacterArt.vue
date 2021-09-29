<template>
  <div class="character-art" v-tooltip="tooltipHtml(character)" ref="el">
    <div class="trait" v-if="!portrait">
      <span
        :class="characterTrait.toLowerCase() + '-icon circle-element'"
      ></span>
    </div>

    <div class="placeholder d-flex align-items-start justify-content-center">
      <div
        :style="{
          'background-image': 'url(' + getCharacterArt(character) + ')',
        }"
        :class="{
          'w-100': portrait,
          'h-100': !isMarket,
          'h-75': isMarket,
        }"
      ></div>
      <!--<small-button class="button" :text="`Purchase`" v-if="isMarket"/>-->
    </div>
    <div class="loading-container" v-if="!allLoaded">
      <i class="fas fa-spinner fa-spin"></i>
    </div>
    <div :class="{ 'market-bot': !portrait }">
      <div class="name-lvl-container">
        <div class="name black-outline" v-if="!portrait">
          {{ getCleanCharacterName(character.id) }}
        </div>
        <div class="lv" v-if="!portrait">
          Lv.<span class="">{{ character.level + 1 }}</span>
        </div>
      </div>
      <div class="score-id-container">
        <div class="black-outline" v-if="!portrait">
          ID <span class="white">{{ character.id }}</span>
        </div>
        <div class="black-outline score" v-if="!portrait">
          Score <span class="">{{ heroScore.toLocaleString() }}</span>
          <!-- <b-icon-question-circle
          class="centered-icon"
          scale="0.8"
          v-tooltip.bottom="
            `Hero score is a measure of your hero's combat prowess so far.
        It goes up when you win and down when you lose. It is also temporarily disabled!`
          "
        /> -->
        </div>
      </div>

      <div
        v-if="!portrait && isMarket"
        class="small-stamina-char"
        :style="`--staminaReady: ${
          (timestampToStamina(character.staminaTimestamp) / maxStamina) * 100
        }%;`"
        v-tooltip.bottom="
          staminaToolTipHtml(timeUntilCharacterHasMaxStamina(character.id))
        "
      >
        <div class="stamina-text black-outline">
          STA {{ timestampToStamina(character.staminaTimestamp) }} / 200
        </div>
      </div>

      <div class="xp" v-if="!portrait">
        <b-progress
          :max="RequiredXp(character.level)"
          variant="success"
          v-tooltip.bottom="
            `Claimable XP ${this.getCharacterUnclaimedXp(character.id)}`
          "
        >
          <strong class="xp-text"
            >{{ character.xp || 0 }} /
            {{ RequiredXp(character.level) }} XP</strong
          >
          <b-progress-bar :value="character.xp || 0"></b-progress-bar>
        </b-progress>
      </div>
    </div>
  </div>
</template>

<script>
import { getCharacterArt } from "../character-arts-placeholder";
import { CharacterTrait, RequiredXp } from "../interfaces";
import { mapGetters, mapState } from "vuex";
import { getCleanName } from "../rename-censor";

export default {
  props: ["character", "portrait", "isMarket"],
  components: {
    //SmallButton,
  },
  watch: {
    character() {
      this.clearScene();
    },
  },

  data() {
    return {
      allLoaded: false,
      allLoadStarted: false,
      camera: null,
      scene: null,
      renderer: null,
      baseMaterial: null,
      loadCount: 0,
      loadCountTotal: 0,
      modelLoader: null,
      textureLoader: null,
      body: null,
      trait: this.characterTrait,
      showPlaceholder: false,
      heroScore: 0,
    };
  },

  computed: {
    ...mapState(["maxStamina"]),
    ...mapGetters([
      "getCharacterName",
      "transferCooldownOfCharacterId",
      "getCharacterUnclaimedXp",
      "timeUntilCharacterHasMaxStamina",
      "charactersWithIds",
    ]),

    characterTrait() {
      const characterWithId =
        this.charactersWithIds && this.charactersWithIds([this.character.id]);
      return (
        (characterWithId && CharacterTrait[characterWithId[0].trait]) ||
        CharacterTrait[this.character.trait]
      );
    },
  },

  methods: {
    RequiredXp,

    tooltipHtml(character) {
      if (!character) return "";

      const cooldown = this.transferCooldownOfCharacterId(this.character.id);
      if (cooldown) {
        if (cooldown === 86400)
          // edge case for when it's exactly 1 day and the iso string cant display
          return "May not be traded for: 1 day";
        else
          return `May not be traded for: ${new Date(cooldown * 1000)
            .toISOString()
            .substr(11, 8)}`;
      }

      return "";
    },

    getCleanCharacterName(id) {
      return getCleanName(this.getCharacterName(id));
    },

    staminaToolTipHtml(time) {
      return (
        "Regenerates 1 point every 5 minutes, stamina bar will be full at: " +
        time
      );
    },

    timestampToStamina(timestamp) {
      if (timestamp > Math.floor(Date.now() / 1000)) return 0;
      return +Math.min(
        (Math.floor(Date.now() / 1000) - timestamp) / 300,
        200
      ).toFixed(0);
    },

    getCharacterArt,
    async fetchScore() {},
  },
  mounted() {
    this.fetchScore();
    this.allLoaded = true;
    this.showPlaceholder = true;
    return;
  },
};
</script>

<style scoped>
.character-art {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.character-portrait .character-art {
  height: 100%;
}

.character-portrait .placeholder {
  height: 100%;
  margin-top: 0px;
}

.thumb-art {
  background-image: url("../assets/images/bg-item-top.png");
  background-repeat: no-repeat;
  background-position: 0 0;
  background-size: contain;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.character-info {
  background-image: url("../assets/images/bg-item-bot.png");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: 0 0;
}

.xp {
  position: absolute;
}

.trait {
  top: -25px;
  justify-self: center;
  margin: 0 auto;
  position: relative;
  display: flex;
}

.id {
  top: 5px;
  right: 5px;
  font-style: italic;
}

.hero-score {
  top: 25px;
  right: 5px;
  font-style: italic;
}

.name {
  font-weight: 900;
  overflow: hidden;
  max-height: 24px;
  max-width: 170px;
  white-space: nowrap;
}

.xp {
  left: 30px;
  width: 238px;
  right: 0;

  background-image: url("../assets/images/bg-process-box.png");
  background-repeat: no-repeat;
  background-position: 0 0;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 14px;
}

.xp .bg-success {
  background-position: 0 0;
  background-image: url("../assets/images/chara-process.png");
  background-repeat: no-repeat;
  width: 218px;
  height: 27px;
  background-color: transparent !important;
}

.xp-text {
  width: 100%;
  text-align: center;
  position: absolute;
  color: #fff;
}

.xp .progress{
  background-color: initial;
  width: 100%;
  height: 24px;
  align-items: center;
}

.placeholder {
  max-width: 100%;
  position: relative;
  padding-top: 0;
  -o-object-fit: contain;
  object-fit: contain;
  height: 300px;
  margin-top: -30px;
}

.market-bot {
  height: 160px;
  overflow: hidden;
  background-position: 0 0;
  background-repeat: no-repeat;
  /* background-image: url("../assets/images/bg-item-bot.png"); */
  /* border-top: 2px solid #f48757; */
  margin-right: 17px;
}

.market-bot .name {
  font-size: 1.3rem;
}

.market-bot .lv {
  font-size: 1.3rem;
  color: #dabf75;
  font-weight: bold;
}

.market-bot .score {
  color: #d858f7;
}

.placeholder div {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  height: 100%;
}

.circle-element {
  width: 4.5rem;
  height: 4.5rem;
  border: 1px solid #f48757;
  border-radius: 50%;
  padding: 0.5rem;
  background-color: #15052e;
}

.name-lvl-container,
.score-id-container {
  display: flex;
  justify-content: space-between;
  position: relative;
  padding: 0 2rem;
}

.market-bot .name-lvl-container {
  margin-top: 1.5rem;
}

.market-bot .score-id-container {
  font-size: 1.3rem;
  font-weight: bold;
}

.white {
  color: rgb(204, 204, 204);
}

.small-stamina-char {
  position: relative;
  margin-top: -10px;
  top: 7px;
  align-self: center;
  height: 14px;
  width: 180px;
  border-radius: 2px;
  border: 0.5px solid rgb(216, 215, 215);
  background: linear-gradient(
    to right,
    rgb(236, 75, 75) var(--staminaReady),
    rgba(255, 255, 255, 0.1) 0
  );
}

.stamina-text {
  position: relative;
  top: -3px;
  font-size: 75%;
  left: 0;
  right: 0;
  text-align: center;
  color: #fff;
}
</style>
