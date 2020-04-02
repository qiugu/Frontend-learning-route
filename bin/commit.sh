#! /bin/bash

git add .

if [[ -z $1 && -z $2 ]]
then
  echo "ERROR: 请输入提交信息"
else
  git commit -m "$1 $2"
  git push origin master
fi
