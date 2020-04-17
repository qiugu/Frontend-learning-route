## 初始化git仓库

`git init`

## 添加追踪文件

`git add <file>`

## 取消暂存文件
`git reset HEAD <file>`

## 查看文件暂存情况

`git status` 
-  `-s -short` 缩短状态输出

## 撤销文件修改
`git checkout -- <file>`

## 删除文件

`git rm` 移除文件，会从跟踪清单中移除文件，并且在工作目录中也会删除此文件

- `-f` 删除之前修改过或者是已经放到暂存区的文件

- `--cached` 删除git仓库中的文件，会从暂存区移除，但是会在本地工作目录中保存

## 移动和重命名文件
`git mv <from> <to>` 第一个参数为from，第二个参数是to

## 比较文件差异

`git diff` 显示尚未暂存的文件和暂存区快照之间的差异，已暂存的文件则不会显示不同

- `--cached` 查看已经暂存起来的变化

- `--staged` 同上命令

## 提交

`git commit` 显示提交信息的编辑器，#开头为注释，起始行为提交信息，如果没有提交信息，则会取消此次提交

- `-v` 详细显示此次提交的信息

- `-m` 提交信息和命令放在同一行，不需要进入编辑页面

- `-a` 跳过暂存过程，也是 git add，直接将跟踪的文件全部暂存提交

- `--amend` 撤销上次的提交，将暂存区的文件提交

## 提交日志
`git log` 按时间先后顺序列出所有的提交信息

- `-p --patch` 每次提交的差异

- `-[num]` 显示输出日志的数量

- `--stat` 显示简略提交信息

- `--shortstat` 只显示`--stat`最后的行数修改添加移除统计

- `--pretty` 使用不同于默认格式展示日志信息

- `--pretty=oneline` short full fuller 日志展示详尽程序

- `--pretty=format` 使用指定格式展示信息

- `--graph` 以ACSII图形显示分支与合并历史

- `--name-only` 仅在提交信息后显示已修改的文件清单

- `--name-status` 显示新增、修改、删除的文件清单

- `--abbrev-commit` 仅显示SHA-1校验和所有40个字符串中的前几个字符

- `--relative-date` 使用较短的相对时间而不是完整格式显示日期

- `--oneline --pretty=oneline --abbrev-commit` 合用的简写

- `--since --until` 按照时间限制展示日志

- `--author` 显示指定作者的提交

- `--grep` 搜索提交说明中的关键字

- `-S` 搜索了添加或删除的该字符串的提交

## 远程仓库

### 查看
`git remote`
- `-v` 显示远程仓库的简写及其url 
### 查看远程仓库更多信息
`git remote show <remote>`

### 添加
`git remote add <shortname> <url>`

### 拉取抓取远程仓库中本地没有的数据，包括所有的分支
`git fetch <shortname>`

### 自动抓取合并远程分支到当前分支
`git pull`

### 推送到远程仓库
`git push <remote> <branch>`

### 远程仓库的重命名
`git remote rename <old-shortname> <new-shortname>`

### 移除远程仓库
`git remote remove <shortname>` 或 `git remote rm <shortname>`

## 标签

## 查看标签
`git tag`
- `-l`或`--list`
