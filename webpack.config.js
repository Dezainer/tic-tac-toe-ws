const webpack = require('webpack')
const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
	entry: './api/server.js',
	target: 'node',
	resolve: {
		modules: [
			'node_modules',
			path.resolve(__dirname, 'api/src')
		],
		extensions: ['.js']
	},
	output: {
		path: path.resolve(__dirname, 'public'),
	    filename: 'api.js'
	},
	module: {
		rules: [
			{ 
				test: /\.js$/,
				loader: 'babel-loader',
				options: {
		        	presets: ['env', 'stage-0']
		        },
		        exclude: path.resolve(__dirname, 'node_modules') 
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		}),
		new UglifyJsPlugin({
			sourceMap: true
		})
	]
}