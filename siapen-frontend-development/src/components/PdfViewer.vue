<template>
  <div class="wrapper">
    <pdf
      v-for="i in numPages"
      :key="i"
      :src="src"
      :page="i"
      style="height: auto"
    />
  </div>
</template>

<script>

import pdf from 'vue-pdf'

export default {
	components: {
		pdf
	},
  props: {
    file: String
  },
	data() {
		return {
      src: null,
			numPages: undefined,
		}
	},
	mounted() {
    this.src = pdf.createLoadingTask(this.file)
		this.src.promise.then(res => {
			this.numPages = res.numPages
		})
	}
}
</script>

<style scoped>
.wrapper {
  height: 30vh;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  -moz-overflow-scrolling: touch;
  -ms-overflow-scrolling: touch;
}
</style>