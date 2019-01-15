class GitHubApi {
  private baseUrl = "https://api.github.com/repos/";

  public constructor(private token: string, private repository: string) { }

  public async getReference(ref: string): Promise<GitHubReference> {
    let response = await fetch(`${this.baseUrl}${this.repository}/git/${ref}`, {
      method: "GET",
      headers: { Authorization: `token ${this.token}` }
    });
    return await response.json();
  }

  public async updateReference(ref: string, sha: string, force: boolean = false): Promise<GitHubReference> {
    let response = await fetch(`${this.baseUrl}${this.repository}/git/${ref}`, { 
      method: "POST",
      body: JSON.stringify({ sha, force }),
      headers: { Authorization: `token ${this.token}` }
    });
    return await response.json();
  }

  public async getCommit(sha: string): Promise<GitHubCommit> {
    let response = await fetch(`${this.baseUrl}${this.repository}/git/commits/${sha}`, {
      method: "GET",
      headers: { Authorization: `token ${this.token}` }
    });
    return await response.json();
  }

  public async createCommit(commit: GitHubCommitInput): Promise<GitHubCommit> {
    let response = await fetch(`${this.baseUrl}${this.repository}/git/commits`, { 
      method: "POST",
      body: JSON.stringify(commit),
      headers: { Authorization: `token ${this.token}` }
    });
    return await response.json();
  }

  public async getTree(sha: string): Promise<GitHubTree> {
    let response = await fetch(`${this.baseUrl}${this.repository}/git/trees/${sha}`, {
      method: "GET",
      headers: { Authorization: `token ${this.token}` }
    });
    return await response.json();
  }

  public async createTree(tree: GitHubTreeInput): Promise<GitHubTree> {
    let response = await fetch(`${this.baseUrl}${this.repository}/git/trees`, { 
      method: "POST",
      body: JSON.stringify(tree),
      headers: { Authorization: `token ${this.token}` }
    });
    return await response.json();
  }

  public async getBlob(sha: string): Promise<GitHubBlob> {
    let response = await fetch(`${this.baseUrl}${this.repository}/git/blobs/${sha}`, {
      method: "GET",
      headers: { Authorization: `token ${this.token}` }
    });
    return await response.json();
  }

  public async createBlob(content: string, encoding: string): Promise<GitHubBlobEntry> {
    let body = { content, encoding };
    let response = await fetch(`${this.baseUrl}${this.repository}/git/blobs`, { 
      method: "POST",
      body: JSON.stringify(body),
      headers: { Authorization: `token ${this.token}` }
    });
    return await response.json();
  }
}

interface GitHubReference {
  ref: string;
  url: string;
  object: {
    type: string;
    sha: string;
    url: string;
  }
}

interface GitHubTreeEntry {
  url: string;
  sha: string;
}

interface GitHubCommit {
  sha: string;
  url: string;
  author: {
    date: string;
    name: string;
    email: string;
  },
  committer: {
    date: string;
    name: string;
    email: string;
  }
  message: string;
  tree: GitHubTreeEntry;
  parents: GitHubTreeEntry[];
}

interface GitHubCommitInput {
  message: string;
  tree: string;
  parents: string[];
}

interface GitHubTreeItem {
  path: string;
  mode: string;
  type: string;
  size: number;
  sha: string;
  url: string;
}

interface GitHubTree {
  sha: string;
  url: string;
  tree: GitHubTreeItem[];
  truncated: boolean;
}

interface GitHubBlob {
  content: string;
  encoding: string;
  url: string;
  sha: string;
  size: number;
}

interface GitHubBlobEntry {
  url: string;
  sha: string;
}

interface GitHubTreeInputItem {
  path: string;
  mode: string;
  type: string;
  sha?: string;
  content?: string;
}

interface GitHubTreeInput {
  base_tree?: string;
  tree: GitHubTreeInputItem[];
}
