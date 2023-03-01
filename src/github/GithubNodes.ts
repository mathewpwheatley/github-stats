export abstract class GithubNodes<T> {
  protected readonly nodes: Set<T> | Set<T>;

  constructor(nodes?: T[]) {
    this.nodes = new Set(nodes);
  }

  public add(node: T): void {
    this.nodes.add(node);
  }

  public clear(): void {
    this.nodes.clear();
  }

  public get size(): number {
    return this.nodes.size;
  }
}
