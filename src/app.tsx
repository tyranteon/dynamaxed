import { Component, Vue, Watch } from "vue-property-decorator";
import { ViewManager } from "@/modules/view-manager";
import { ProjectManager } from "@/modules/project-manager";
import { persistStore, store } from "@/store";
import RecentProjectsView from "@/views/recent-projects-view";
import { MainView } from "@/views/main-view";
import { GameModel } from "@/model/model";
import { DialogManager } from "@/modules/dialog-manager";
import { LayoutManager } from "@/modules/layout-manager";
import layoutState = LayoutManager.layoutState;

@Component({
  name: "App"
})
export default class App extends Vue {
  // Everything in the store is automatically persisted
  store = store;

  // These are not automatically persisted!
  model = GameModel;
  dm = DialogManager;

  @Watch("store", { deep: true })
  onStoreChanged() {
    persistStore();
  }

  render(h: any) {
    let CurView: any;

    if (ProjectManager.enableEditing) {
      CurView = MainView;
    } else {
      CurView = RecentProjectsView;
    }

    return (
      <div id="app">
        {DialogManager.dialogs.map((d, index) => {
          const Dialog: any = d.dialogOpts.component;
          return (
            <v-dialog
              persistent={d.dialogOpts.modal}
              value={d.vmodel}
              key={d.id}
              oninput={() => DialogManager.reject()}
              max-width={d.dialogOpts.maxWidth}
            >
              <Dialog params={d.params} />
            </v-dialog>
          );
        })}
        <CurView />
      </div>
    );
  }
}
