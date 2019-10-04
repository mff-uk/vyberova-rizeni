<template>
  <div>
    <v-list two-line>
      <template v-for="item in jobPositions">
        <v-list-item
          :key="item.code"
        >
          <v-list-item-content>
            <v-list-item-title>
              {{ item["code"] }}
            </v-list-item-title>
            <v-list-item-subtitle>
              Second line text
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-btn
            text
            icon
            color="green darken-2"
            @click.stop="onNavigate(item)"
          >
            <v-icon>edit</v-icon>
          </v-btn>
          <v-btn
            text
            icon
            color="red"
            @click.stop="onDelete(item)"
          >
            <v-icon>delete</v-icon>
          </v-btn>
        </v-list-item>
      </template>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title style="height: 5rem">
            <file-upload
              label="Drag & Drop a file to load it .."
              @upload="onUpload"
            />
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <div class="floating-menu">
      <v-btn
        class="bottom"
        color="blue darken-2"
        fab
        dark
        @click="onDownload"
      >
        <v-icon>cloud_download</v-icon>
      </v-btn>
      <v-btn
        class="bottom"
        color="green darken-2"
        fab
        dark
        @click="onCreate"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
  import {
    CREATE_JOB_POSITION,
    LOAD_JOB_POSITIONS,
    DELETE_JOB_POSITION,
  } from "../job-position-store";
  import FileUpload from "./ui/file-upload";
  import JobDetail from "../detail";
  import {loadPositionsFromString, savePositionsToString} from "./../job-position-api";

  // https://codepen.io/retrofuturistic/pen/tlbHE

  export default {
    "name": "job-position-list",
    "components": {
      "file-upload": FileUpload
    },
    "props": {
      "jobPositions": {"type": Array, "required": true},
    },
    "methods": {
      "onNavigate": function (item) {
        navigateToJobPosition(this.$router, item.code);
      },
      "onDelete": function (item) {
        this.$store.dispatch(DELETE_JOB_POSITION, item.code);
      },
      "onCreate": function () {
        this.$store.dispatch(CREATE_JOB_POSITION, null)
          .then((result) => {
            navigateToJobPosition(this.$router, result["code"]);
          })
      },
      "onDownload": function () {
        const content = savePositionsToString(this.jobPositions);
        download("Seznam inzerátů.jsonld", content);
      },
      "onUpload": function (files) {
        const onLoad = (file, reader) => {
          const content = loadPositionsFromString(JSON.parse(reader.result));
          this.$store.dispatch(LOAD_JOB_POSITIONS, {"payload": content});
        };
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const reader = new FileReader();
          reader.onload = () => onLoad(file, reader);
          reader.readAsText(file);
        }
      }
    }
  };

  function navigateToJobPosition(router, code) {
    router.push({
      "name": JobDetail["route-name"],
      "params": {
        "code": code
      }
    });
  }

  function download(fileName, content) {
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(content));
    element.setAttribute("download", fileName);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

</script>

<style scoped>
  .floating-menu {
    float: right;
  }
</style>