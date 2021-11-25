<template>
  <div id="__next">
    <div class="disabled-animation-modal"></div>
    <div class="z" id="training">
      <div class="z-body">
        <div class="page-header" id="marketplace">
          <div class="container">
            <div class="row">
              <div class="col-12">
                <h2>1 <span class="text-white">Hero In Career Mode</span></h2>
              </div>
            </div>
          </div>
        </div>
        <div class="page-body">
          <div class="container">
            <div class="justify-content-center row">
              <div class="mb-4 col-sm-12 col-md-12 col-lg-12 col-xl-3">
                <div class="justify-content-center row">
                  <div class="col-sm-4 col-md-4 col-lg-6 col-xl-12">
                    <div
                      class="card-boss__zoan card-boss__pk card"
                      @click="openHeroPicker()"
                      v-if="!characterId"
                    >
                      <div class="card-header">
                        <span
                          variant="primary"
                          class="badge badge-secondary badge-pill"
                          >#pick a Hero to Challenge</span
                        >
                      </div>
                      <img
                        src="@/assets/images/p2pimages/add-zoan.svg"
                        class="img-add-zoan card-img"
                      />
                    </div>
                    <div
                      v-if="characterId"
                      @click="openHeroPicker()"
                      class="character-item"
                    >
                      <div class="art">
                        <CharacterArt :character="selectedCharacter" />
                      </div>
                    </div>

                    <div
                      class="card-boss__zoan card-boss__pk card"
                      @click="openWeaponPicker()"
                      v-if="!selectedWeapon"
                    >
                      <div class="card-header">
                        <span
                          variant="primary"
                          class="badge badge-secondary badge-pill"
                          >#pick a Weapon to Challenge</span
                        >
                      </div>
                      <img
                        src="@/assets/images/p2pimages/add-zoan.svg"
                        class="img-add-zoan card-img"
                      />
                    </div>
                    <div class="weapon">
                      <div
                        class="weapon-icon-wrapper"
                        v-if="selectedWeapon"
                        @click="openWeaponPicker()"
                      >
                        <weapon-icon
                          :weapon="selectedWeapon"
                          class="weapon-icon"
                        />
                      </div>
                    </div>
                    <div>Match reward</div>
                    <input v-model="matchReward" placeholder="Match reward" />
                    <div>Total reward</div>
                    <input v-model="totalDeposit" placeholder="Total reward" />

                    <button
                      type="button"
                      class="search-suggest__btn ml-1 btn btn-buy btn-sm"
                      @click="handleCreateRoom()"
                    >
                      Create Room
                    </button>
                  </div>
                </div>
              </div>
              <div class="col-lg-12 col-xl-9">
                <div class="justify-content-center row">
                  <div class="text-center col-12">
                    <ul class="tab-categories nav nav-tabs">
                      <li class="nav-item">
                        <a
                          :class="`nav-link ${
                            currentTab === 'career_mode' ? 'active' : ''
                          }`"
                          @click="currentTab = 'career_mode'"
                          >Career Mode
                          <span class="badge badge-secondary badge-pill">{{
                            careerModeRooms.length
                          }}</span></a
                        >
                      </li>
                      <li class="nav-item">
                        <a
                          :class="`nav-link ${
                            currentTab === 'request' ? 'active' : ''
                          }`"
                          @click="currentTab = 'request'"
                          >Requests
                          <span class="badge badge-success badge-pill">
                            {{ careerModeRequest.length }}</span
                          ></a
                        >
                      </li>
                    </ul>
                  </div>
                </div>
                <div v-if="currentTab === 'career_mode'">
                  <div
                    v-for="r in careerModeRooms"
                    :key="r.characterId"
                    class="justify-content-center row"
                  >
                    <CharacterRoom
                      :characterId="r.characterId"
                      :room="r"
                      :selectedCharacterId="characterId"
                      :selectedWeaponId="weaponId"
                    />
                  </div>
                </div>

                <div v-if="currentTab === 'request'">
                  <div
                    v-for="r in careerModeRequest"
                    :key="r.requester"
                    class="justify-content-center row"
                  >
                    <RoomRequest :request="r" />
                  </div>
                </div>

                <div class="justify-content-center row">
                  <div class="market-footer col-12">
                    <hr />
                    <div class="paging">
                      <div class="total-page">1/45</div>
                      <button type="button" class="mr-1 btn btn-secondary">
                        <img
                          src="@/assets/images/p2pimages/img3.svg"
                          class="svg-inline--fa fa-chevron-right fa-w-10"
                          alt=""
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="Toastify"></div>
    <b-modal
      class="centered-modal"
      ref="hero-career-mode-selector"
      @ok="openHeroPicker"
      size="large"
    >
      <template #modal-title> Select hero for career mode </template>
      <character-list :value="currentCharacterId" v-model="characterId" />
    </b-modal>

    <b-modal
      class="centered-modal"
      ref="weapon-career-mode-selector"
      @ok="openWeaponPicker"
      size="large"
    >
      <template #modal-title> Select weapon for career mode </template>
      <weapon-grid v-model="weaponId" />
    </b-modal>
  </div>
</template>
<script lang="ts">
import { BModal } from "bootstrap-vue";
import Vue from "vue";
import { mapGetters, mapState, mapActions } from "vuex";
import CharacterList from "../components/smart/CharacterList.vue";
import CharacterArt from "../components/CharacterArt.vue";
import WeaponGrid from "@/components/smart/WeaponGrid.vue";
import WeaponIcon from "@/components/WeaponIcon.vue";
import CharacterRoom from "@/components/CharacterRoom.vue";
import RoomRequest from "@/components/RoomRequest.vue";

interface IData {
  characterId?: number;
  weaponId?: number;
  selectedCharacter?: any;
  selectedWeapon?: any;
  currentTab: "career_mode" | "request";
  matchReward: number;
  totalDeposit: number;
  fetchRoomInterval: any;
  fetchRequestInterval: any;
}


export default Vue.extend({
  components: {
    CharacterList,
    CharacterArt,
    WeaponGrid,
    CharacterRoom,
    WeaponIcon,
    RoomRequest,
  },
  data() {
    return {
      characterId: undefined,
      weaponId: undefined,
      selectedCharacter: null,
      selectedWeapon: null,
      currentTab: "career_mode",
      matchReward: 0,
      totalDeposit: 0,
      fetchRoomInterval: null,
      fetchRequestInterval: null,
    } as IData;
  },
  watch: {
    characterId(val) {
      this.selectedCharacter = this.characters[val];
    },
    weaponId(val) {
      this.selectedWeapon = this.ownWeapons.find(
        (w: any) => !!w && w.id === val
      );
    },
  },
  methods: {
    ...mapActions(["createCareerRoom", "getCareerRooms", "getRequests"]),
    openHeroPicker() {
      (this.$refs["hero-career-mode-selector"] as BModal).show();
    },
    openWeaponPicker() {
      (this.$refs["weapon-career-mode-selector"] as BModal).show();
    },
    handleCreateRoom() {
      this.createCareerRoom({
        character: this.characterId,
        weapon: this.weaponId,
        matchReward: this.matchReward,
        totalDeposit: this.totalDeposit,
      });
    },
  },
  computed: {
    ...mapState([
      "characters",
      "currentCharacterId",
      "careerModeRooms",
      "careerModeRequest",
    ]),
    ...mapGetters(["currentCharacter", "getCharacterName", "ownWeapons"]),

    character(): any {
      if (!this.currentCharacter) {
        return {
          id: null,
          name: "???",
          level: -1,
          experience: -1,
        };
      }

      const c = this.currentCharacter;

      return {
        id: c.id,
        name: this.getCharacterName(c.id),
        level: c.level,
        experience: c.xp,
      };
    },
  },
  async mounted() {
    // @ts-ignore
    this.fetchRoomInterval = setInterval(async () => {
      await this.getCareerRooms();
    }, 3000);
    // @ts-ignore
    this.fetchRequestInterval = setInterval(async () => {
      await this.getRequests({ roomId: "0" });
    }, 3000);
  },
});
</script>
