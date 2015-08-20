import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';  
import config from '../config/webpack.config.dev';

var server = new WebpackDevServer(webpack(config), {  
    publicPath: config.output.publicPath,
    hot: true,
    stats: { colors: true }
});

server.listen(8080, 'localhost', function() {});