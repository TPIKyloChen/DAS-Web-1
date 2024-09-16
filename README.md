# 安裝環境
1. 安裝 nvm
    > https://qizhanming.com/blog/2020/07/29/how-to-install-node-using-nvm-on-macos-with-brew
2. 安裝 nodejs
    ```shell
    nvm install 20
    ```
3. 裝 angular/cli
    ```shell
    sudo npm install -g @angular/cli
    ```
# 專案啟動
```shell
sudo npm install
npm run start
```

# 編譯 (包版時使用)
```shell
# 編譯
ng build --configuration=<env>
# ex. 編譯 sit 環境
ng build --configuration=sit
```

# 補充 nvm 常用語法
```shell
# 查看已安裝的版本
nvm ls

# 安裝版本
nvm install <version>
# ex. 安裝 node 10
nvm install 10

# 解除安裝版本
nvm uninstall <version>
# ex. 解除安裝 node 10
nvm uninstall 10

# 切換版本
nvm use <version>
# ex. 切換到 node 10
nvm use 10
```
