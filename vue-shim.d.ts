// I have no idea how this code works, but I found it on the internet

// For some odd reason, TypeScript wasn't able to locate *.vue files such as '@/App.vue' in the index.ts file
// So I found this on Stackoverflow https://stackoverflow.com/questions/42002394/importing-vue-components-in-typescript-file
// and it works for now

declare module "*.vue" {
	import Vue from "vue";
	export default Vue;
}
