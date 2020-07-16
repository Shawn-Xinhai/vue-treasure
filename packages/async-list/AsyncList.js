export const genAsyncList = fetcher => {
  return {
    data() {
      return {
        asl: {
          url: '',
          query: {},
          items: [],
          total: 0,
          isLoading: false,
          timer: null,
          error: null
        }
      }
    },
    watch: {
      'asl.url': {
        handler: function() {
          this.aslFetchData()
        },
      },
      'asl.query': {
        handler: function() {
          this.aslFetchData()
        },
      }
    },
    async created() {
      this.aslFetchData()
    },
    methods: {
      async aslFetchData() {
        if (this.asl && this.asl.url) {
          this.asl.isLoading = true
          const { items, total, error } = await fetcher(this.asl.url, this.asl.query)
          if (!error) {
            this.asl.error = null
            this.asl.items = items
            this.asl.total = total
          } else {
            this.asl.error = error
          }
          this.asl.isLoading = false
        }
      }
    }
  }
}
