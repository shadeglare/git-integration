window.onload = async () => {
  let client: GitHubApi = null;
  let reference: GitHubReference = null;
  let commit: GitHubCommit = null;
  let tree: GitHubTree = null;
  let selected: GitHubTreeItem = null; 

  let tokenInput = input().attr({ placeholder: "api token" }).val(localStorage.getItem("token") || "");
  let repositoryInput = input().attr({ placeholder: "username/reponame" }).val(localStorage.getItem("repository") || "");
  let text = textarea().css({ width: "100%", minHeight: "300px" });
  let files = select().css({ width: "200px" }).on("change", e => {
    let native = <HTMLSelectElement>files.native;
    let sha = native.options[native.selectedIndex].value;
    selected = tree.tree.filter(x => x.sha === sha)[0];
    loadFile();
  });
  let save = button().text("Save").on("click", async () => {
    try {
      files.attr("disabled", "true");
      text.attr("disabled", "true");
      save.attr("disabled", "true");

      let data = text.val();
      let content = btoa(data);
      let encoding = "base64";
      let entry = await client.createBlob(content, encoding);

      let newFile: GitHubTreeInputItem = {
        sha: entry.sha,
        mode: selected.mode,
        path: selected.path,
        type: selected.type
      };
      let treeInput: GitHubTreeInput = {
        base_tree: tree.sha,
        tree: [newFile]
      };

      tree = await client.createTree(treeInput);

      let commitInput: GitHubCommitInput = {
        message: "A basic test",
        tree: tree.sha,
        parents: [commit.sha]
      };
      commit = await client.createCommit(commitInput);

      let newReference = await client.updateReference("refs/heads/master", commit.sha);
      let oldFile = selected.path;
      await renderFiles(tree, oldFile);

      files.removeAttr("disabled");
      text.removeAttr("disabled");
      save.removeAttr("disabled");
    } catch (e) {
      alert(`Critical error: ${e}. Reload page.`);
    }
  });
  let content = div(text, save).css({ width: "500px" });
  let master = div(files, content).css({ display: "none" });

  async function renderFiles(tree: GitHubTree, oldSelectedFile?: string) {
    let { tree: items } = tree;
    files.native.innerHTML = "";
    files.append(items.map(x => {
      let opt = option().val(x.sha).text(x.path);
      if (x.path === oldSelectedFile) opt.attr("selected", "true");
      return opt;
    })).attr("size", items.length.toString());
    if (oldSelectedFile) return;
    if (items.length === 0) {
      selected = null;
    } else {
      selected = items[0];
      await loadFile();
    }
  }

  async function loadFile() {
    try {
      files.attr("disabled", "true");
      text.attr("disabled", "true");
      save.attr("disabled", "true");

      let blob = await client.getBlob(selected.sha);
      let data = blob.encoding === "base64" ? atob(blob.content) : blob.content;

      text.val(data);

      files.removeAttr("disabled");
      text.removeAttr("disabled");
      save.removeAttr("disabled");
    } catch (e) {
      alert(`Critical error: ${e}. Reload page.`);
    }
  }

  let loadRepo = button("load repository").on("click", async () => {
    try {
      loadRepo.attr("disabled", "true");
      master.css("display", "none");

      let token = tokenInput.val();
      let repository = repositoryInput.val();
      client = new GitHubApi(token, repository);

      localStorage.setItem("token", token);
      localStorage.setItem("repository", repository);

      reference = await client.getReference("refs/heads/master");
      commit = await client.getCommit(reference.object.sha);
      tree = await client.getTree(commit.tree.sha);

      await renderFiles(tree);

      loadRepo.removeAttr("disabled");
      master.css("display", "flex");
    } catch (e) {
      alert(`Critical error: ${e}. Reload page.`);
    }
  });
  let root = div([
    div(tokenInput, repositoryInput, loadRepo),
    master
  ]);

  root.appendTo(document.body);
};