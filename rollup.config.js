import deckyPlugin from "@decky/rollup";

export default deckyPlugin({
  output: {
    assetFileNames: '[name]-[hash][extname]'
  }
})
