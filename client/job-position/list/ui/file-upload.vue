<template>
  <div class="upload-drop-zone">
    <div class="vertical-center">
      {{ label }}
    </div>
  </div>
</template>

<script>
  export default {
    "name": "file-upload",
    "props": {
      "label": {"required": true}
    },
    "mounted": function () {
      const dropZone = this.$el;
      const $this = this;

      dropZone.ondrop = function (event) {
        event.preventDefault();
        this.className = "upload-drop-zone";
        $this.$emit("upload", event.dataTransfer.files);
      };

      dropZone.ondragover = function () {
        this.className = "upload-drop-zone drop";
        return false;
      };

      dropZone.ondragleave = function () {
        this.className = "upload-drop-zone";
        return false;
      };

    }
  }
</script>

<style scoped>
  .upload-drop-zone {
    height: 100%;
    color: #ccc;
    border-width: 0.1rem;
    border-style: dashed;
    border-color: #ccc;
  }

  .upload-drop-zone.drop {
    color: #222;
    border-color: #222;
  }

  .vertical-center {
    width: 90%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    text-align: center;
  }

</style>

