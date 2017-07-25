var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('che', function() {
  //'./node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js',
  return gulp.src(['./node_modules/jsonforms/lib/native-shim.js', './dist/jsonforms_ecore.js', './src/che.integration.js'])
    .pipe(sourcemaps.init())
      .pipe(concat('che_jsonforms_ecore.js'))
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});
