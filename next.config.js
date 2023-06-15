const path = require('path')
 
module.exports = {
  basePath: '/immersive-camera',
  output: 'export',
  distDir: 'docs',
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}