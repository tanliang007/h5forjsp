// 引入依赖配置
var gulp = require('gulp');
var browserSync = require('browser-sync');
// 压缩html
var htmlmin = require('gulp-htmlmin');
// css压缩前缀补全
// var less = require('gulp-less'); // less
var sass = require('gulp-sass');
var cssbeautify = require('gulp-cssbeautify'); 
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');

// 图片无损压缩
var imagemin = require('gulp-imagemin');

// js压缩 es6转es5
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var transformRuntime = require('babel-plugin-transform-runtime');
var reload = browserSync.reload;
//删除del
var del = require('del')

/* html 打包*/
gulp.task('htmlmin', function () {
	var optionsSet = {
		removeComments: false, // 清除HTML注释
		collapseWhitespace: false, // 压缩HTML
		collapseBooleanAttributes: false, // 省略布尔属性的值 <input checked="true"/> ==> <input />
		removeEmptyAttributes: false, // 删除所有空格作属性值 <input id="" /> ==> <input />
		removeScriptTypeAttributes: false, // 删除<script>的type="text/javascript"
		removeStyleLinkTypeAttributes: false, // 删除<style>和<link>的type="text/css"
		minifyJS: false, // 压缩页面JS
		minifyCSS: false // 压缩页面CSS
	};
	
	return gulp
		.src('src/**/*.html')		
		.pipe(gulp.dest('dist'))
		.pipe(reload({stream: true}));
});


// css压缩 less变编译 自动前缀
gulp.task('styles', function() {
	//编译sass
	return gulp.src('src/assets/css/*.scss')
	.pipe(sass())
	//添加前缀
	.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
	.pipe(cssbeautify())
	//保存未压缩文件到我们指定的目录下面
	.pipe(gulp.dest('src/assets/css/'))
	//给文件添加.min后缀
	//压缩样式文件
	//输出压缩文件到指定目录
	.pipe(gulp.dest('dist/assets/css/'))
	.pipe(reload({stream: true}));
});

// js压缩 es6转码
gulp.task('jsmin', () => {
	return gulp.src('src/assets/js/*.js')
		.pipe(babel({
			presets: ['es2015'],
			plugins: ['transform-runtime']
		}))
		.pipe(gulp.dest('dist/assets/js/'))
		.pipe(reload({stream: true}));
});

//图片无损压缩
gulp.task('images', () => {
   gulp.src('src/assets/images/*.{png,jpg,gif,ico}')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/assets/images'))
		.pipe(reload({stream: true}));
})

// lib插件库
gulp.task('libmin', () => {
	// lib 插件
	return gulp
		.src('src/assets/lib/**/*')
		.pipe(gulp.dest('src/assets/lib/'))
		.pipe(reload({stream: true}))
});

// clean任务：
gulp.task('clean',function(cb){
  return del(['./dist']);
})

/* watch 文件 */
gulp.task('watch',function () {
	gulp.watch('src/**/*.html', ['htmlmin'])
	gulp.watch('src/*.html', ['htmlmin'])
	gulp.watch('src/assets/css/*.{scss,css}', ['styles'])
	gulp.watch('src/assets/js/*.js', ['jsmin'])
	gulp.watch('src/assets/images/*.{png,jpg,gif,ico}', ['images'])
});


/* server 服务器 */
gulp.task('dev', function () {
	browserSync.init({ // 初始化 BrowserSync
		injectChanges: true, // 插入更改
		files: [
			'*.html', '*.css', '*.js'
		], // 监听文件类型来自动刷新
		server: {
			baseDir: 'src', // 目录位置
		},
		ghostMode: { // 是否开启多端同步
			click: true, // 同步点击
			scroll: true // 同步滚动
		},
		logPrefix: 'browserSync in gulp', // 再控制台打印前缀
		browser: ["chrome"], //运行后自动打开的；浏览器 （不填默认则是系统设置的默认浏览器）
		open: true, //       自动打开浏览器
		port: 8888   // 使用端口
	});
	
	// 监听watch
	 gulp.start('watch');
});
//直接打包一次
gulp.task('build',['htmlmin','cssmin','jsmin','images'])
