#!/bin/sh

eslint -c .eslintrc --fix app/main/

for f in $(find app/main/ -name '*.js'); do
  if [ $f != "app/main/constants/config-const.js" ] ; then
    js-beautify -r -k -n -s 2 $f
  fi
done
