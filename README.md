# diyblog-fe-v5

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).



### diyblog
###### 修改vue.config.js 中 publicPath 为 '/'
###### 修改src/components/PostCreate.vue中的externalLink变量里 './static...'路径为'/static...'
###### 执行 npm run build
###### 复制html文件到diyblog的templates目录下，
###### 覆盖static下的文件到diyblog中的static下。