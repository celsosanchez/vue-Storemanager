<template>
  <v-container >
    <v-card
    v-if="active"
      :loading="false"
      class="mx-auto my-12"
      max-width="700"
      elevation="6"
    >
      <template slot="progress">
        <v-progress-linear
          color="deep-purple"
          height="10"
          indeterminate
        ></v-progress-linear>
      </template>

      <v-img height="250" src="https://picsum.photos/800/1600"></v-img>

      <v-card-title>Hi {{ activeUser.name }}!</v-card-title>

      <v-card-text>
        <v-row align="center" class="mx-0">
          <v-rating
            :value="4.5"
            color="amber"
            dense
            half-increments
            readonly
            size="14"
          ></v-rating>

          <div class="grey--text ms-4">
            4.5 (413)
          </div>
        </v-row>

        <div class="my-4 text-subtitle-1">Email @ • {{ activeUser.email }}</div>

        <div></div>
      </v-card-text>

      <v-divider class="mx-4"></v-divider>

      <v-card-title>Your Secure Data</v-card-title>

      <v-card-text>
        <v-row align="center">
          <v-col>
            <v-img max-width="100" src="@/assets/paypal-logo.png" />
          </v-col>
          <v-col>
            <v-icon>mdi-asterisk</v-icon>
            <v-icon>mdi-asterisk</v-icon>
            <v-icon>mdi-asterisk</v-icon>
            <v-icon>mdi-asterisk</v-icon>
            <v-icon>mdi-asterisk</v-icon>
            <v-icon>mdi-asterisk</v-icon>
            <v-icon>mdi-asterisk</v-icon>
            <v-icon>mdi-asterisk</v-icon>
            <v-icon>mdi-asterisk</v-icon>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col>
            <v-img max-width="100" src="@/assets/credit_card.png" />
          </v-col>
          <v-col>
            <v-icon>mdi-asterisk</v-icon>
            <v-icon>mdi-asterisk</v-icon>
            <v-icon>mdi-asterisk</v-icon>
            <v-icon>mdi-asterisk</v-icon>
            <v-icon>mdi-asterisk</v-icon>
            <v-icon>mdi-asterisk</v-icon>
            <v-icon>mdi-asterisk</v-icon>
            <v-icon>mdi-asterisk</v-icon>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-btn color="deep-purple lighten-2" text>
          Change
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="deep-purple lighten-2" text @click="logout"><v-icon>mdi-logout</v-icon>
          Logout
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog persistent v-model="dialog" width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Terms and Conditions</span>
        </v-card-title>
        <v-card-text>
          <strong
            >Hi {{ activeUser.name }}, in order to use our services, you must
            accept our terms and conditions:</strong
          >
          <br />
          <br />

          The Termination clause will inform that users' accounts on your
          website and mobile app or users' access to your website and mobile (if
          users can't have an account with you) can be terminated in case of
          abuses or at your sole discretion. <br /><br />A Governing Law will
          inform users which laws govern the agreement. <br /><br />This should
          the country in which your company is headquartered or the country from
          which you operate your website and mobile app. <br />A Links To Other
          Web Sites clause will inform users that you are not responsible for
          any third party websites that you link to. <br /><br />This kind of
          clause will generally inform users that they are responsible for
          reading <br />and agreeing (or disagreeing) with the Terms and
          Conditions or Privacy Policies of these third parties.<br /><br />
          If your website or mobile app allows users to create content and make
          that content public to other users, a Content section will inform
          users that they own the rights to the content they have created.
          <br />The "Content" clause usually mentions that users must give you
          (the website or mobile app developer) a license so that you can share
          this content on your website/mobile app and to make it available to
          other users.<br />
          Because the content created by users is public to other users, a DMCA
          notice clause (or Copyright Infringement ) section is helpful to
          inform users and copyright authors that, if any content is found to be
          a copyright infringement, you will respond to any DMCA takedown
          notices received and you will take down the content.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="exit">
            Disagree
          </v-btn>
          <v-btn color="green darken-1" text @click="accept">
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import axios from "axios";
import config from "../../config";
export default {
  components: {},
  data: () => ({
    dialog: false,
    activeUser: {},
    active: false,
  }),
  methods: {
    showActiveUser(){},
    logout(){
      // console.log(this.$cookies.keys())
      this.$cookies.remove("sessid")
       window.location.href = "https://www.google.com";
    },
    accept() {
      axios.post(`http://${config.server.address}/users`, {
        userMail: this.activeUser.email,
      });
      this.dialog = false;
      console.log(this.user);
    },
    exit() {
      window.location.href = "https://www.google.com";
    },
  },
  computed: {
    user() {
      return this.$cookies.get("sessid").match(/"(.*)"/m)[1];
    },
  },
  created() {
    axios.get(`http://${config.server.address}/users`).then((res) => {
      res.data.found.forEach((element) => {
        if (element._id == this.user) {
          this.activeUser = element;
          this.active = true;
        }
      });
      console.log(this.activeUser);
      if (this.activeUser.acceptConditions != true) this.dialog = true;
    });
  },
  mounted() {},
};
</script>
