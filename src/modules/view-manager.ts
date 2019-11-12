import ProjectSettingsView from "@/views/project-settings-view";
import { TrainersView } from "@/views/trainers-view";

export const Views = {
  Project: ProjectSettingsView,
  Trainers: TrainersView
};

export const ViewManager = new (class {
  _activeView: keyof typeof Views = "Project";

  setActiveView(view: keyof typeof Views) {
    this._activeView = view;
  }

  get activeView() {
    return Views[this._activeView];
  }
})();
