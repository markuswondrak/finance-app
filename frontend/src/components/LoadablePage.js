
export default {
  data() {
    return {
      loaded: false
    }
  },
  methods: {
    fetchData: async function(url) {
      try {
        const response = await fetch(url);
        const result = await response.json();
        this.loaded = true;
        return result;
      } catch (error) {
        this.loaded = 'error';
        throw error;
      }
    }
  }

}