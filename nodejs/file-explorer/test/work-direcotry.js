// 访问命令行参数
console.log(process.argv);

// 访问当前工作目录
console.log(process.cwd());
console.log(__dirname);

// 更改工作目录
process.chdir('/');
console.log(process.cwd());
// 只能更改process.cwd方法中的目录
console.log(__dirname);

// 访问环境变量
process.env.NODE_ENV = 'production';
console.log(process.env.NODE_ENV);
console.log(process.env.SHELL);

// 程序退出
process.stdin.resume();
process.exit(1);
