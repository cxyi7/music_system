import { LoadingPlugin } from 'tdesign-vue-next';

export default (options, delay = 0) => {
  return {
    loading: null,
    timer: null,
    delay,
    options,
    start() {
      if (!this.options) return;
      this.timer = setTimeout(() => {
        this.loading = LoadingPlugin(this.options);
      }, this.delay);
    },
    close() {
      if (!this.options) return;
      if (this.timer) {
        clearTimeout(this.timer);
      } else {
        this.loading.hide();
      }
    },
  };
};
