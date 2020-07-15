declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

declare module 'iview' {
  const iview: any;
  export default iview;
  export const Message: any;
}

declare module 'vuejs-storage' {
  const vuejsStorage: any;
  export default vuejsStorage;
}
