// Dialogue uses a node graph with typed text, then choices.
export class Dialogue {
  constructor() {
    this.tree = null;
    this.nodeId = null;
    this.visibleText = "";
    this.charTimer = 0;
    this.onEnd = null;
  }

  begin(tree, startNode, onEnd) {
    this.tree = tree;
    this.nodeId = startNode;
    this.visibleText = "";
    this.charTimer = 0;
    this.onEnd = onEnd;
  }

  getCurrentNode() {
    if (!this.tree || !this.nodeId) return null;
    return this.tree[this.nodeId] || null;
  }

  update(dt) {
    const node = this.getCurrentNode();
    if (!node) return;

    if (this.visibleText.length < node.text.length) {
      this.charTimer += dt;
      while (this.charTimer > 0.02 && this.visibleText.length < node.text.length) {
        this.charTimer -= 0.02;
        this.visibleText += node.text[this.visibleText.length];
      }
    }
  }

  canAdvance() {
    const node = this.getCurrentNode();
    if (!node) return false;
    return this.visibleText.length >= node.text.length && (!node.options || node.options.length === 0);
  }

  advance() {
    const node = this.getCurrentNode();
    if (!node) return;

    if (this.visibleText.length < node.text.length) {
      this.visibleText = node.text;
      return;
    }

    if (node.next) {
      this.nodeId = node.next;
      this.visibleText = "";
      this.charTimer = 0;
      return;
    }

    this.end();
  }

  pickOption(index) {
    const node = this.getCurrentNode();
    if (!node || this.visibleText.length < node.text.length) {
      return null;
    }
    const option = node.options?.[index];
    if (!option) return null;

    if (option.next) {
      this.nodeId = option.next;
      this.visibleText = "";
      this.charTimer = 0;
    } else {
      this.end();
    }

    return option;
  }

  end() {
    this.tree = null;
    this.nodeId = null;
    this.visibleText = "";
    this.charTimer = 0;

    if (this.onEnd) {
      const callback = this.onEnd;
      this.onEnd = null;
      callback();
    }
  }

  getViewModel() {
    const node = this.getCurrentNode();
    if (!node) return null;

    return {
      speaker: node.speaker,
      fullText: node.text,
      visibleText: this.visibleText,
      options: this.visibleText.length >= node.text.length ? (node.options || []) : []
    };
  }
}
