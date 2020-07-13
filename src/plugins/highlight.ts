
import Hljs from "highlight.js";
// 代码高亮风格，选择更多风格需导入 node_modules/hightlight.js/styles/ 目录下其它css文件
import "highlight.js/styles/github.css"; 
// 自定义插件
export default {
  install(Vue: any) {
    // 自定义指令 v-highlight
    Vue.directive("highlight",(el: HTMLElement) => {
      // el.innerHTML = Hljs.highlight("typescript", el.innerHTML).value;
      Hljs.highlightBlock(el);
    });
  }
};
