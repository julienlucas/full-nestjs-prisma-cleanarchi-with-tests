export default class SingletonMixin {
  static instance = null as SingletonMixin | null;

  static getInstance() {
    if (!this.instance) {
      this.instance = new this();
    }

    return this.instance;
  }
}
