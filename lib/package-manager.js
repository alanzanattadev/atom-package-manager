'use babel';

import PackageManagerView from './package-manager-view';
import { CompositeDisposable, File } from 'atom';
import { ReactDOM, React } from 'react-for-atom';
import InstallPackagePanel from './components/InstallPackagePanel';
import UninstallPackagePanel from './components/UninstallPackagePanel';
import { spawn } from 'child_process';
import store from './redux/store';
import {createPackageFileSelectedAction} from './redux/actions';

export default {

  packageManagerView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.packageManagerView = new PackageManagerView(state.packageManagerViewState);
    this.packageManagerView.getElement().onkeydown = (e) => {
      var ctrlDown = e.ctrlKey || e.metaKey;
      if (e.which == 27) { // esc
        this.hide();
      } else if (e.which == 13) { //enter
        this.hide();
      }
    };
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.packageManagerView.getElement(),
      visible: false
    });


    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'npm:install': () => this.getNpmFunction(true)(),
      'npm:uninstall': () => this.getNpmFunction(false)(),
    }));
  },

  consumeTaskRunner: function(taskRunner) {
    this.taskRunner = taskRunner;
  },

  getNpmFunction: function(install) {
    return () => {
      let PanelComponent = install ? InstallPackagePanel : UninstallPackagePanel;
      this.getPackagePath()
        .then((path) => {
          let file = new File(`${path}/package.json`);
          file.read()
            .then((content) => {
              let config = JSON.parse(content);
              store.dispatch(createPackageFileSelectedAction(path, config));
              let panel = ReactDOM.render(
                <PanelComponent
                  onUninstall={(packages, options) => (this.getNpmExecFunction(false)(packages, options, path))}
                  onInstall={(packages, options) => (this.getNpmExecFunction(true)(packages, options, path))}
                />,
                this.packageManagerView.getElement()
              );
              this.modalPanel.show();
              if (install)
                panel.form.packageNameInput.focus();
              else
                panel.root.focus();
            })
            .catch((e) => {
              console.log(e);
            })
        })
        .catch((e) => {
          console.log(e);
          atom.notifications.addError(`Impossible to find package repo`);
        });

    }
  },

  getNpmExecFunction: function(install) {
    return (packages, options, cwd) => {
      console.log(packages);
      if (install || packages.every(p => p.dependency) || packages.every(p => p.devDependency) || packages.every(p => (!p.dependency && !p.devDependency))) {
        let depOption;
        if (options.packageSaveOption == "local")
          depOption = "";
        else if (!install && options.packageSaveOption == "save")
          depOption = packages[0].dependency ? "--save" : "--save-dev";
        else
          depOption = "--" + options.packageSaveOption;
        this.modalPanel.hide();
        this.execNpmCommand(`${install ? "install" : "uninstall"} ${packages.map(p => p.name).join(' ')} ${depOption}`, cwd)
          .then(() => {

          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        atom.notifications.addError("packages must be selected with same dependency type");
      }
    }
  },

  getPackagePath: function() {
    let parentFolders = [];
    let parentFolder = atom.workspace.getActivePaneItem().buffer.file.getParent();
    while (parentFolder.getBaseName() != "") {
      parentFolders.push(parentFolder);
      parentFolder = parentFolder.getParent();
    }
    let existsPromises = parentFolders.map((path) => new Promise((resolve, reject) => {
      path.getFile("package.json").exists().then((fileExists) => {
        resolve(fileExists);
      });
    }));
    return Promise.all(existsPromises).then((results) => {
      return parentFolders[results.findIndex((exists) => exists)].getPath();
    });
    // return atom.project.getPaths()[0];
  },

  execNpmCommand: function(command, cwd) {
    return new Promise((resolve, reject) => {
      let npmCommand = spawn("npm", command.split(' '), {cwd});
      let dataHandler = () => {};
      let id = this.taskRunner.taskIsStarted({
        package: "npm",
        action: `${command}`
      });
      npmCommand.stdout.on('data', dataHandler);
      npmCommand.stderr.on('data', dataHandler);
      npmCommand.on('exit', (code) => {
        this.taskRunner.taskIsFinished(id);
        if (code == 0)
          resolve();
        else
          reject(code);
      });
    });
  },

  hide: function() {
    this.modalPanel.hide();
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.packageManagerView.destroy();
  },

  serialize() {
    return {
      packageManagerViewState: this.packageManagerView.serialize()
    };
  },
};
