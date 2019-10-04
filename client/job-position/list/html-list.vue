<template>
  <div>
    <div
      v-for="(item, index) in jobPositions"
      :key="index"
    >
      <job-position-html
        :value="item"
        :language="language"
      />
      <hr>
    </div>
  </div>
</template>

<script>
  import JobPositionHtml from "../job-position-html";

  export default {
    "name": "job-position-list-html",
    "components": {
      [JobPositionHtml.name]: JobPositionHtml
    },
    "props": {
      "jobPositions": {"type": Array, "required": true},
      "language": {"required": true}
    },
  }
</script>