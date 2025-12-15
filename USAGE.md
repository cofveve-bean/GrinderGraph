# GrinderNode Usage

Include the stylesheet and import the module as an ES module in the browser or bundle it into your app.

```html
<link rel="stylesheet" href="src/GrinderNode.css">
<script type="module">
  import {GrinderNode} from './src/GrinderNode.js'
  const g = new GrinderNode({title:'Coffee Grinder'})
  g.mount('#app')
  g.on('grind', s => console.log('grind', s))
</script>
```

See `demo/index.html` for a live example.
