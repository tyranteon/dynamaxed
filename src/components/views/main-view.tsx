import { ViewManager } from "@/modules/view-manager";
import { Menubar } from "@/components/menubar";
import { Navbar } from "@/components/navbar";
import { stylesheet } from "typestyle";
import { Component, Vue } from "vue-property-decorator";

@Component
export class MainView extends Vue {
  title: string = "";

  render() {
    const Content = ViewManager.activeView;

    return [
      <div class={styles.menusplit}>
        <Menubar title={this.title} />
        <div class={styles.navsplit}>
          <Navbar />
          <div class={styles.content}>
            <Content
              ontitle={(v: string) => (this.title = v)}
              args={ViewManager.currentView.params}
            />
          </div>
        </div>
      </div>
    ];
  }
}

const styles = stylesheet({
  navsplit: {
    display: "flex",
    height: "100%"
  },
  menusplit: {
    display: "flex",
    height: "100%",
    flexDirection: "column"
  },
  content: {
    margin: "29px auto",
    height: "calc(100% - 58px)",
    overflow: "auto"
  }
});