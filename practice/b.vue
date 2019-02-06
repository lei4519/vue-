<script>
import a from './a'
export default {
  extends: a,
  methods: {
    clear() {
      this.text += this.text
    }
  }
}
</script>
