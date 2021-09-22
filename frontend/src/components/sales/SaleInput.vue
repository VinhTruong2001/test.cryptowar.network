<template>
  <div>
    <div
      v-if="availableToClaim"
      class="exchange-token p-32 has-shadow text-center"
    >
      <div>
        <h4>{{ $t("sale.i_want_to_buy") }}</h4>
      </div>
      <div class="mt-32">
        <div class="flex-row flex-center">
          <input
            v-model="ethPurchaseAmount"
            autofocus
            class="sale-input"
            type="number"
            :min="minBidAmount"
            :max="maxBidAmount"
          />
          <div class="currency">BNB</div>
        </div>
        <div class="mt-16">
          <h2>~ {{ displayedSaleRate }} xBlade</h2>
        </div>
        <div class="mt-16">
          <span style="font-size: 14px"
            >{{ $t("sale.you_can_buy") }} {{ $t("max") }}:
            <strong>17 BNB</strong>
          </span>
        </div>
      </div>
      <!--          :disabled="submitted === true"-->
      <c-button
        color="primary"
        wide-mobile
        @click="handlePurchase"
      >
        {{ $t("buy.buy_with_BNB") }}
      </c-button>

      <div style="margin-top: 57px">
        <hr />
        <h5>
          💕 Love xBlade? 💕<br />
          💸 Make Money with xBlade 💸
        </h5>
        Get 2% xBlade bonus when helping your friends acquire xBlade using link below
      </div>
      <p>
        <input v-model="ref_link" class="ref-box" onclick="select()" />
      </p>
      <p class="share-box">
        <a
          class="btn-floating btn-tw"
          role="button"
          title="Share on twitter"
          :href="'https://twitter.com/intent/tweet?url=' + ref_link"
          rel="noopener"
          target="_blank"
          style="text-align: center"
        >
          Share to Twitter <br />
          <img
            :src="require('@/assets/images/twitter-icon.svg')"
            style="width: 37px; display: inline-block"
          />
        </a>

        <vue-goodshare-facebook
          :quote="pageTitle"
          :page_title="pageTitle"
          :page_url="ref_link"
          has_icon
          has_counter
          title_social="Facebook"
        />
      </p>
    </div>

    <div v-else class="exchange-token p-32 has-shadow text-center">
      <h4>{{ $t("sale.your_next_available_purchase") }}</h4>
      <p>{{ nextAvailableClaimDate }}</p>
    </div>
  </div>
</template>

<script>
import CButton from "@/components/elements/Button.vue";
import VueGoodshareFacebook from "vue-goodshare/src/providers/Facebook.vue";
import * as numeral from "numeral";

export default {
  name: "SaleInput",
  components: {
    CButton,
    VueGoodshareFacebook,
  },
  props: {
    saleRate: {
      type: Number,
      default: 0,
    },
    userAccount: {
      type: String,
      default: "0x0000000000000000000000000000000000000000",
    },
    minBidAmount: {
      type: Number,
      default: 0,
    },
    maxBidAmount: {
      type: Number,
      default: 0,
    },

    saleSupply: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    actualMaxBid() {
      const actualMaxBid = this.saleSupply / this.saleRate;
      return this.maxBidAmount < actualMaxBid
        ? this.maxBidAmount
        : actualMaxBid;
    },
    displayedSaleRate() {
      return numeral(this.saleRate * this.ethPurchaseAmount).format("0,0.00");
    },
    // displayedMaxBidAmount() {
    //   return numeral(this.actualMaxBid).format('0,0.000')
    // },
    // displayedMinBidAmount() {
    //   return numeral(this.minBidAmount).format('0,0.00')
    // },
    // validInput() {
    //   return this.ethPurchaseAmount <= this.actualMaxBid && this.ethPurchaseAmount >= this.minBidAmount;
    // },

    availableToClaim() {
      return true;
    },
    pageTitle() {
      return this.$t("sale.page_title");
    },
  },
  data() {
    return {
      ethPurchaseAmount: 1,
      submitted: false,
      ref_link: "https://cryptowar.network/sales/?r=" + this.userAccount,
    };
  },
  methods: {
    handlePurchase() {
      this.submitted = true;
      this.$emit("on-purchase", this.ethPurchaseAmount);
      setTimeout(() => {
        this.submitted = false;
      }, 10000);
    },
  },
};
</script>

<style scoped>
div.exchange-token {
  max-width: 50%;
  margin: 0 auto;
}

@media (max-width: 640px) {
  div.exchange-token {
    max-width: 100%;
  }
}

div.currency {
  margin-left: -52px;
}

.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.bg-white {
  background-color: #fff;
}

.sale-input {
  border-radius: 8px;
  border: 1px solid #768db2;
}

input.sale-input {
  border-radius: 4px;
  border: 1px solid #d2dde9;
  max-width: 200px;
  line-height: 20px;
  font-size: 0.9em;
  color: rgba(73, 84, 99, 0.7);
  transition: all 0.4s;
  padding: 15px 15px;
  padding-right: 60px;
}

input.sale-input:focus {
  box-shadow: none;
  outline: none;
  border-color: #b1becc;
}

.share-box{
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-bottom: 50px;
}
.btn-tw{
  margin: 0 20px;
}
</style>
