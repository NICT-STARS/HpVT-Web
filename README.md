# HpVT-Web
映像IoTの蓄積画像・映像を閲覧するためのWebサービス

```
１．サーバアプリーション（管理者用）

（１）インストール方法

　　※インストール先はWebサーバになります。
　　※予めNode.js（およびnpm）をインストールしておいて下さい。
　　　（「６．（１）」参照。動作確認済みVer：node v6.17.0 / v8.15.1 / v10.15.3）
　　※予めFFmpegをインストールしておいて下さい。
　　　（「６．（６）」参照）

　　①server/adminフォルダ一式を適当な場所にコピーします。

　　②カレントディレクトリをadminに移動します。
　　　例：cd admin

　　③アプリケーションに必要なNode.jsパッケージをインストールします。成功すると
　　　adminフォルダ配下にnode_modulesフォルダが作成され依存関係のあるパッケージ
　　　が一括インストールされます。
　　　例：npm install

（２）各種設定

　　①admin/config/default.jsonを開き以下の設定をして下さい。
　　　・ポート番号
　　　　例："port" : 8080,
　　　　※アプリケーションがバインドするポート番号を設定して下さい。

　　　・静止画像および動画像の保存ファイル数取得コマンド
　　　　例："getFileCountCommand" : "find %path -type f | wc -l",
　　　　※静止画像および動画像の保存先ファイルパスに対しfindコマンドで保存ファイ
　　　　　ル数を取得します。導入環境に合わせ適時コマンドを調整して下さい。（シン
　　　　　ボリックリンクの場合は「-follow」オプションを追加する等）

　　　・ディスクスペース取得コマンド
　　　　例："checkDiskSpaceCommand" : "df %path/public/data | grep -v Filesystem | sed -E -e 's/^[^ ]+[ ]+([0-9]+)[^0-9]+([0-9]+)[^0-9]+([0-9]+).+$/total=\\1,used=\\2,available=\\3/g'",
　　　　※静止画像および動画像の保存先ファイルパスに対しdfコマンドでディスクスペ
　　　　　ース情報を取得します。導入環境に合わせ適時コマンドを調整して下さい。
　　　　　（grepコマンドで不要な行を除去しsedコマンドで「total」「used」
　　　　　「available」が取得出来るよう正規表現を調整する等）

　　②admin/public/js/raspberry-pi.jsを開き以下の設定をして下さい。
　　　・アプリケーション名
　　　　例：appName : "myapp",
　　　　※「２．（２）②」の一般用にも同じ値を設定して下さい。
　　　　※同一サーバ上で複数のアプリケーションを運用する場合は、それぞれ異なる値
　　　　　を設定して下さい。

　　　・RTMP動画配信WebサイトURL
　　　　例：videoPath : "http://xxx.xxxxx.xx.xx/xxxxx.html",
　　　　※solutionType（「３．２．（２）③」参照）が"image_video_rtmp"の場合のみ
　　　　　有効です。

　　　・サムネイル一覧表示列数
　　　　例：countThumbnail : 5,
　　　　※2～5の値で指定して下さい。

　　　・サムネイル一覧表示有無
　　　　例：showThumbnail : true
　　　　※送信RPが1台しか無い場合はサムネイル一覧を表示する必要が無い為、falseを
　　　　　指定して下さい。

（３）起動方法

　　①カレントディレクトリをadminに移動します。
　　　例：cd admin

　　②アプリケーションを起動します。
　　　例：node app.js

（４）アクセス方法

　　各種デバイスのブラウザからアプリケーションにアクセスして下さい。
　　　例：http://xxx.xxxxx.xx.xx:8080
　　　※ポート番号は「１．（２）①」で指定した値となります。
　　　※Webサーバ（Nginx等）でリバースプロキシ設定した場合、設定に合わせたURLで
　　　　アクセスして下さい。

（５）終了方法

　　キーボードよりCtrl+Cを入力しプロセスに対しSIGINTシグナルを送信する事で終了し
　　ます。


２．サーバアプリーション（一般用）

（１）インストール方法

　　※インストール先は受信RPもしくは他のサーバになります。
　　※予めNode.js（およびnpm）をインストールしておいて下さい。
　　　（「６．（１）」参照。動作確認済みVer：node v6.17.0 / v8.15.1 / v10.15.3）

　　①server/userフォルダ一式を適当な場所にコピーします。

　　②カレントディレクトリをuserに移動します。
　　　例：cd user

　　③アプリケーションに必要なNode.jsパッケージをインストールします。成功すると
　　　userフォルダ配下にnode_modulesフォルダが作成され依存関係のあるパッケージが
　　　一括インストールされます。
　　　例：npm install

（２）各種設定

　　①user/config/default.jsonを開き以下の設定をして下さい。
　　　・ポート番号
　　　　例："port" : 8081,
　　　　※アプリケーションがバインドするポート番号を設定して下さい。

　　　・サーバアプリケーション（管理者用）のURL
　　　　例："server" : { "url":"http://xxx.xxxxx.xx.xx/ui", "folder":"/hpvt/project/admin", "authorization":"user:password" }
　　　　※"url"の末尾は必ず/uiとして下さい。
　　　　※各値はWebサーバ（Nginx等）のリバースプロキシ設定に合わせ調整して下さい。
　　　　　（「６．（５）」参照）

　　②user/public/js/index-env.jsを開き以下の設定をして下さい。
　　　・アプリケーション名
　　　　例：appName : "myapp",
　　　　※「１．（２）②」の管理用と同じ値を設定して下さい。

　　　・RTMP動画配信WebサイトURL
　　　　例：videoPath : "http://xxx.xxxxx.xx.xx/xxxxx.html",
　　　　※solutionType（「３．２．（２）③」参照）が"image_video_rtmp"の場合のみ
　　　　　有効です。

　　　・サムネイル一覧表示列数
　　　　例：countThumbnail : 5,
　　　　※2～5の値で指定して下さい。

　　　・サムネイル一覧表示有無
　　　　例：showThumbnail : true
　　　　※送信RPが1台しか無い場合はサムネイル一覧を表示する必要が無い為、falseを
　　　　　指定して下さい。

　　③user/public/dataディレクトリ（またはシンボリックリンク）を作り、その配下で
　　　サーバに保存された静止画像および動画像が閲覧出来るよう設定して下さい。通常、
　　　各フォルダのパスは下記の様になります。
　　　・静止画像
　　　　user/public/data/picture/[%filename]　　←オリジナル版
　　　　user/public/data/picture_m/[%filename]　←中サイズ版
　　　　user/public/data/picture_s/[%filename]　←小サイズ版
　　　　user/public/data/cutMovie/[%filename]　 ←動画像切出版
　　　・動画像
　　　　user/public/data/movie/[%filename]
　　　・一日毎動画像
　　　　user/public/data/oneDayMovie/[%filename]

（３）起動方法

　　①カレントディレクトリをuserに移動します。
　　　例：cd user

　　②アプリケーションを起動します。
　　　例：node app.js

（４）アクセス方法

　　各種デバイスのブラウザからアプリケーションにアクセスして下さい。
　　　例：http://xxx.xxxxx.xx.xx:8081
　　　※ポート番号は「２．（２）①」で指定した値となります。
　　　※Webサーバ（Nginx等）でリバースプロキシ設定した場合、設定に合わせたURLで
　　　　アクセスして下さい。

（５）終了方法

　　キーボードよりCtrl+Cを入力しプロセスに対しSIGINTシグナルを送信する事で終了し
　　ます。


３．送信RP側アプリケーション

３．１．HpVT拡張プラグイン

（１）インストール方法

　　※インストール先は送信RPになります。
　　※予めHpVT Ver2をインストールしておいて下さい。（動作確認済みVer：2.255.24）

　　①ライブラリファイルhpvtTransmitterExtension/Release/hpvtTransmitterExtension.so
　　　を/opt/ssc/binにコピーします。
　　　例：cp hpvtTransmitterExtension/Release/hpvtTransmitterExtension.so /opt/ssc/bin/
　　　※コピー先はSSCサーバ管理者の指示を仰いで下さい。

　　②ライブラリファイルhpvtTransmitterExtension.soに実行権限を付与します。
　　　例：chmod +x /opt/ssc/bin/hpvtTransmitterExtension.so

　　③設定ファイルhpvtTransmitterExtension/Release/hpvtTransmitterExtension.conf
　　　を/var/opt/ssc/cacheにコピーします。
　　　例：cp hpvtTransmitterExtension/Release/hpvtTransmitterExtension.conf /var/opt/ssc/cache/
　　　※コピー先はHpVT Ver2の設定ファイル「hpvt.conf」と同じ場所になります。SSC
　　　　サーバ管理者の指示を仰いで下さい。

（２）各種設定

　　hpvtTransmitterExtensionの設定ファイル/var/opt/ssc/cache/hpvtTransmitterExtension.conf
　　を開き以下の設定をして下さい。

　　①SSCサーバ情報
　　　例："SSC" :
          {
            "Url"      : "https://ssc2.clealink.jp",
            "Id"       : "DEVICE000000000X",
            "Receiver" : "DEVICE000000000Y"
          },
　　　※"Url"はSSCサーバのURLになります。
　　　※"Id"は当該送信RPのデバイスIDになります。/etc/opt/ssc/.deviceに記載のudid
　　　　と同じ値を設定して下さい。
　　　※"Receiver"は受信RPのデバイスIDになります。SSCサーバ管理者へご確認下さい。
　　　　（映像伝送しない場合は空文字列「""」にして下さい）

　　②静止画像生成情報
　　　例："CreateImage" : { "Interval" : 10, "Quality" : 100, "TimeStamp" : 1 },
　　　※"Interval"は画像出力間隔（秒）になります。
　　　※"Quality"は画像品質（0-100）になります。JPEG生成時の圧縮オプションです。
　　　　100が最も高品質になります。
　　　※"TimeStamp"は以下のいずれかになります。
　　　　・1 … 静止画像に日時表示を埋め込む。
　　　　・0 … 静止画像に日時表示を埋め込まない。

　　③動画像ファイル保存情報
　　　例："SaveVideo"   : 0,
　　　・2 … 動画像ファイルを保存する。
　　　・1 … 動画像ファイルを保存する（自動的にサーバへアップロード）。
　　　・0 … 動画像ファイルを保存しない。

　　④ポート番号
　　　例："Port" : 6000,
　　　※アプリケーションがバインドするポート番号を設定して下さい。

（３）起動方法

　　SSC管理サービス（ssc_sscm）、IPカメラ管理サービス（ssc_camm）、HpVTサービス
　　（ssc_hpvt）を実行して下さい。HpVT拡張プラグインはHpVTサービスにより読み込ま
　　れ実行されます。各サービスの起動方法等は各サービスのマニュアル等をご確認下さ
　　い。


３．２．Webアプリケーション

（１）インストール方法

　　※インストール先は送信RPになります。
　　※予めNode.js（およびnpm）をインストールしておいて下さい。
　　　（「６．（１）」参照。動作確認済みVer：node v6.17.0 / v8.15.1 / v10.15.1）

　　①transmitterフォルダ一式を適当な場所にコピーします。

　　②カレントディレクトリをtransmitterに移動します。
　　　例：cd transmitter

　　③アプリケーションに必要なNode.jsパッケージをインストールします。成功すると
　　　transmitterフォルダ配下にnode_modulesフォルダが作成され依存関係のあるパッ
　　　ケージが一括インストールされます。
　　　例：npm install

（２）各種設定

　　transmitter/config/default.jsonを開き以下の設定をして下さい。

　　①送信RPの名前
　　　例："caption" : "Camera 99",
　　　※サーバ側アプリケーション（Webアプリケーション）のサムネイル一覧画面等で
　　　　各画像に並記される名称になります。

　　②静止画像および動画像のファイル名
　　　例："saveFileName" : "Camera_99",
　　　※送信した静止画像および動画像をサーバ上で保存する際のファイル名になります。
　　　※ファイル名として使用可能な文字のみで指定して下さい。

　　③ソリューション範囲
　　　例："solutionType" : "image_video_rtmp",
　　　※"image_video_rtmp" … 静止画像、動画像、RTMP動画配信の全て
　　　※"image_video"      … 静止画像、動画像のみ
　　　※"image"            … 静止画像のみ

　　④Webサーバ情報
　　　例："webServer" :
          {
            "url"           : "http://xxx.xxxxx.xx.xx/transmitter",
            "folder"        : "/hpvt/project/admin",
            "authorization" : "user:password",
            "ssh"           :
            {
              "host"         : "xxx.xxxxx.xx.xx",
              "port"         : 22,
              "user"         : "xxxxx",
              "identityFile" : "~/.ssh/xxxxx_rsa",
              "proxy"        :
              {
              //"host"         : "xxx.xxxxx.xx.xx",
              //"port"         : 22,
              //"user"         : "xxxxx",
              //"identityFile" : "~/.ssh/xxxxx_rsa"
              }
            }
          },
　　　※"url"はサーバアプリーション（管理者用）のURLになります。末尾は必ず
　　　　/transmitterとして下さい。
　　　※"url"、"folder"、"authorization"はWebサーバ（Nginx等）のリバースプロキシ
　　　　設定に合わせ調整して下さい。（「６．（５）」参照）
　　　※"ssh"はサーバへのssh接続情報になります。"identityFile"に鍵認証を行うため
　　　　の秘密鍵ファイルのパスを指定して下さい。予めサーバ側に公開鍵を設置してお
　　　　く必要があります。また秘密鍵はパスフレーズ無しで作成して下さい。ssh接続
　　　　がゲートウェイ経由での多段接続の場合は"proxy"にゲートウェイホストへのssh
　　　　接続情報を設定して下さい。（鍵認証の設定は「６．（７）」参照）

　　⑤動画像ファイルアップロード先パス
　　　例："videoFileServerPath" : "/home/xxxxx/RaspberryPi/HpVT/project/admin/public/data/h264/%saveFileName/%y/%mm/%dd/%saveFileName_%y%mm%dd%H%M%S.h264",
　　　※動画像ファイルをアップロードする際のサーバ側の保存先パスを指定して下さい。
　　　※動画像ファイルのアップロードはサーバへssh接続して行われます。
　　　※パスには以下の書式が使用可能です。
　　　　・%saveFileName　「３．２．（２）②」で指定した値
　　　　・%y 　　　　　　年（西暦4桁）
　　　　・%m 　　　　　　月（ 1～12）
　　　　・%mm　　　　　　月（01～12）
　　　　・%d 　　　　　　日（ 1～31）
　　　　・%dd　　　　　　日（01～31）
　　　　・%H 　　　　　　時（00～24）
　　　　・%M 　　　　　　分（00～59）
　　　　・%S 　　　　　　秒（00～59）
　　　　・%N 　　　　　　ミリ秒（000～999）

　　⑥動画像ファイルパス
　　　例："videoFilePath" : "/var/opt/ssc/hpvt/storage",
　　　※HpVTの動画像保存先パスを指定して下さい。

　　⑦動画像ファイルアップロード時の通信帯域
　　　例："videoFileTransferLimit" : 8000,
　　　※動画像ファイルをアップロードする際の帯域を指定して下さい。アップロード処
　　　　理で帯域を取り過ぎ、Webアプリケーション（WebSocket)等、他の通信が維持出
　　　　来ない場合は、この値を下げて下さい。単位はキロビット/秒（kbps）です。

　　⑧HpVT拡張プラグイン接続情報
　　　例："hpvtExtentionServer" : { "host" : "localhost", "port" : 6000 },
　　　※"host"は通常同一マシン上のため"localhost"になります。
　　　※"port"は「３．１．（２）④」で指定した値となります。

（３）起動方法

　　①カレントディレクトリをtransmitterに移動します。
　　　例：cd transmitter

　　②アプリケーションを起動します。
　　　例：node app.js

　　※正常に動作するとサーバ側アプリケーション（Webアプリケーション）のサムネイ
　　　ル一覧に表示されます。

（４）終了方法

　　キーボードよりCtrl+Cを入力しプロセスに対しSIGINTシグナルを送信する事で終了し
　　ます。


４．受信RP側アプリケーション

（１）インストール方法

　　※インストール先は受信RPになります。
　　※予めHpVT Ver2をインストールしておいて下さい。（動作確認済みVer：2.255.24）
　　※予めNode.js（およびnpm）をインストールしておいて下さい。
　　　（「６．（１）」参照。動作確認済みVer：node v6.17.0 / v8.15.1 / v10.15.1）

　　①receiverフォルダ一式を適当な場所にコピーします。

　　②カレントディレクトリをreceiverに移動します。
　　　例：cd receiver

　　③アプリケーションに必要なNode.jsパッケージをインストールします。成功すると
　　　receiverフォルダ配下にnode_modulesフォルダが作成され依存関係のあるパッケー
　　　ジが一括インストールされます。
　　　例：npm install

（２）各種設定

　　receiver/config/default.jsonを開き以下の設定をして下さい。

　　①サーバアプリケーション（管理者用）のURL
　　　例："server" : { "url":"http://xxx.xxxxx.xx.xx/receiver", "folder":"/hpvt/project/admin", "authorization":"user:password" },
　　　※"url"の末尾は必ず/receiverとして下さい。
　　　※各値はWebサーバ（Nginx等）のリバースプロキシ設定に合わせ調整して下さい。
　　　　（「６．（５）」参照）

（３）起動方法

　　①カレントディレクトリをreceiverに移動します。
　　　例：cd receiver

　　②アプリケーションを起動します。
　　　例：node app.js

（４）終了方法

　　キーボードよりCtrl+Cを入力しプロセスに対しSIGINTシグナルを送信する事で終了し
　　ます。


５．クライアントアプリーション（コマンドライン用アプリ）

（１）インストール方法

　　※インストール先は各種RPもしくは他のサーバ等になります。
　　※予めNode.js（およびnpm）をインストールしておいて下さい。
　　　（「６．（１）」参照。動作確認済みVer：node v6.17.0 / v8.15.1 / v10.15.3）

　　①clientフォルダ一式を適当な場所にコピーします。

　　②カレントディレクトリをclientに移動します。
　　　例：cd client

　　③アプリケーションに必要なNode.jsパッケージをインストールします。成功すると
　　　clientフォルダ配下にnode_modulesフォルダが作成され依存関係のあるパッケージ
　　　が一括インストールされます。
　　　例：npm install

（２）各種設定

　　client/config/default.jsonを開き以下の設定をして下さい。

　　①サーバアプリケーション（管理者用）のURL
　　　例："server" : { "url":"http://xxx.xxxxx.xx.xx/ui", "folder":"/hpvt/project/admin", "authorization":"user:password" }
　　　※"url"の末尾は必ず/uiとして下さい。
　　　※各値はWebサーバ（Nginx等）のリバースプロキシ設定に合わせ調整して下さい。
　　　　（「６．（５）」参照）

　　②タイムアウト時間
　　　例："timeOut" : 20000
　　　※単位はミリ秒です。
　　　※指定した時間内に処理が完了しなかった場合、強制終了します。

（３）実行方法

　　①カレントディレクトリをclientに移動します。
　　　例：cd client

　　②以下のコマンドを実行します。
　　　例：node app.js [name] [key1=value1] [key2=value2] ...
　　　※[name]にはパラメータを変更したい送信RPの名前（saveFileName）を指定して下
　　　　さい。（「３．２．（２）②」参照）
　　　※[key1=value1]には変更したいパラメータ名（key）とその値（value）を指定し
　　　　て下さい。パラメータ名には以下が指定出来ます。
　　　　・createImageInterval
　　　　・createImageQuality
　　　　・createImageTimeStamp
　　　　・saveImage
　　　　・saveVideoInterval
　　　　・saveVideoDuration
　　　　・saveVideo
　　　　・adaptiveControl
　　　　・fecLevel
　　　　・heartBeat
　　　　・connect
　　　　・width　　　　　　　※スタンダードカメラとIPカメラのみ。heightとセット。
　　　　・height　　　　　　 ※スタンダードカメラとIPカメラのみ。width とセット。
　　　　・bps　　　　　　　　※スタンダードカメラとIPカメラのみ。
　　　　・fps　　　　　　　　※スタンダードカメラとIPカメラのみ。
　　　　・contrast　　　　　 ※スタンダードカメラとIPカメラのみ。
　　　　・brightness　　　　 ※スタンダードカメラとIPカメラのみ。
　　　　・saturation　　　　 ※スタンダードカメラとIPカメラのみ。
　　　　・sharpness　　　　　※スタンダードカメラのみ。
　　　　・iso　　　　　　　　※スタンダードカメラのみ。
　　　　・exposureMode　　　 ※スタンダードカメラのみ。
　　　　・whiteBalance　　　 ※スタンダードカメラのみ。
　　　　・meteringMode　　　 ※スタンダードカメラのみ。
　　　　・rotation　　　　　 ※スタンダードカメラのみ。
　　　　・flip　　　　　　　 ※スタンダードカメラのみ。
　　　　・zoom　　　　　　　 ※SDIカメラのみ。
　　　　・quality　　　　　　※IPカメラのみ。
　　　　・focusMode　　　　　※IPカメラのみ。
　　　　・focusSpeed　　　　 ※IPカメラのみ。
　　　　・focusNearLimit　　 ※IPカメラのみ。
　　　　・focusFarLimit　　　※IPカメラのみ。
　　　　・tiltUp　　　　　　 ※IPカメラのみ。ptzTimeとセット。
　　　　・tiltDown　　　　　 ※IPカメラのみ。ptzTimeとセット。
　　　　・panLeft　　　　　　※IPカメラのみ。ptzTimeとセット。
　　　　・panRight　　　　　 ※IPカメラのみ。ptzTimeとセット。
　　　　・zoomIn　　　　　　 ※IPカメラのみ。ptzTimeとセット。
　　　　・zoomOut　　　　　　※IPカメラのみ。ptzTimeとセット。
　　　　・ptzTime　　　　　　※IPカメラのみ。
　　　　・reboot　　　　　　 ※IPカメラのみ。


６．補足資料

（１）Node.jsのインストール例

　　①nvmをインストールします。
　　　curl -o- https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
　　　exit
　　　※インストール後、必ず一旦exitして下さい

　　②インストール可能なNode.jsのバージョン確認します。
　　　nvm ls-remote

　　③バージョンを指定してNode.jsをインストールします。
　　　nvm install x.xx.x

（２）Node.jsアプリケーションをデーモン化する方法

　　foreverというNode.jsパッケージを使うことでNode.jsアプリケーションをデーモン
　　化する事が出来ます。foreverはNode.jsアプリケーションの死活監視ツールです。

　　foreverはNode.jsパッケージですのでnpmを使ってインストールします。
　　例：npm install forever -g

　　Node.jsアプリケーションをデーモン化して起動する場合は、foreverコマンドを
　　startオプションで実行します。
　　例：cd admin
　　　　forever start -m 0 -a -l `pwd`/log/app.log --sourceDir `pwd` --killSignal SIGINT app.js
　　　※各アプリケーションフォルダにあるforever_start.shをご利用下さい

　　デーモン化して起動したNode.jsアプリケーションを停止する場合は、foreverコマン
　　ドのstopオプションで実行します。
　　例：forever stop xxxxx

（３）OS起動時にNode.jsアプリケーションを自動起動する方法

　　crontabでreboot時のスケジュールにNode.jsアプリケーションの起動スクリプトを登
　　録します。
　　例：crontab -e
　　　　@reboot cd /home/pi/transmitter/ ; /bin/bash --login -i -c 'sh ./forever_start.sh 1> cron.log 2> cron_err.log'

（４）各種ログをローテーションする方法

　　logrotateでNode.jsアプリケーションのログローテーションを設定します。

　　①/etc/logrotate.dディレクトリに適当なファイル名で下記内容を保存します。
　　　例：vi /etc/logrotate.d/transmitter
          /home/pi/transmitter/log/app.log {
            daily
            rotate 7
            copytruncate
            missingok
            notifempty
            dateext
          }

　　②デバッグ実行して動作確認します。
　　　例：logrotate -dv /etc/logrotate.d/transmitter

　　③スケジュールされた日時にローテーションが行われなかった場合、1度だけ強制実
　　　行する事で以降、実行されるようになる場合があります。
　　　例：logrotate -fv /etc/logrotate.d/transmitter

（５）NginxをNode.jsアプリケーションのリバースプロキシとして設定する方法

　　サーバ側アプリーション（Webアプリケーション）を80番ポート以外にバインドする
　　場合（80番ポートにバインドするにはroot権限が必要）、エンドユーザはブラウザで
　　URLにポート番号も合わせて指定する必要があります。また、サブフォルダに分けた
　　URL（http://xxx.xxxxxx.xx/appname/ 等）でサーバ側アプリケーションを公開したい
　　場合もあるかと思います。その様な場合は、NginxをNode.jsアプリケーションのリバ
　　ースプロキシとして設定をする事で回避出来ます。

　　リクエスト「http://xxx.xxxxxx.xx/appname/」をlocalhost（127.0.0.1）の8080ポー
　　トで稼働中のサーバ側アプリーションへ転送する場合のNginx設定ファイルの例
    http {
        ...

        client_max_body_size 1k;
        client_body_timeout 30s;
        client_header_timeout 10s;

        server {
          ...

          set $check_request_uri $request_uri;

          if ($check_request_uri ~ ^(.*)\?(.*)$) {
              set $check_request_uri $1;
          }

          if ($check_request_uri ~ \./) {
              return 403;
          }

          ...

          location /appname/ {
            add_header X-Frame-Options sameorigin;
            add_header X-Content-Type-Options "no sniff";
            proxy_pass http://127.0.0.1:8080/;
            proxy_connect_timeout 60s;
            proxy_read_timeout 60s;
            proxy_send_timeout 60s;
            proxy_http_version 1.1; 
            proxy_set_header Origin http://xxx.xxxxxx.xx;
            proxy_set_header Upgrade $http_upgrade; 
            proxy_set_header Connection "upgrade"; 
          }

          ...
        }

        ...
    }

（６）FFmpegのインストール例（CentOS系）

　　①EPELリポジトリをインストールします。
　　　sudo yum install epel-release

　　②FFmpegをインストールします。
　　　sudo yum --enablerepo=epel install ffmpeg ffmpeg-devel

（７）ssh鍵認証設定例

　　※鍵認証ファイルはパスフレーズ無しで作成して下さい。

　　※必ずターミナル上等でsshの接続確認を行って下さい。初回接続時の(yes/no)?の対
　　　話確認を済ませておく必要があります。

　　①Raspberry Pi側作業
　　　例：mkdir .ssh
　　　　　chmod 700 .ssh
　　　　　cd .ssh/
　　　　　ssh-keygen -t rsa -f hoge_rsa

　　②公開鍵ファイル「hoge_rsa.pub」をサーバへコピー

　　③サーバ側作業
　　　例：cat hoge_rsa.pub >> .ssh/authorized_keys
　　　　　rm -f hoge_rsa.pub
　　　※ゲートウェイ経由での多段接続の場合はゲートウェイホストも同様の作業が必要

　　④Raspberry Pi側でssh接続確認
　　　例：ssh -i .ssh/hoge_rsa user@server
　　　※ゲートウェイ経由での多段接続の場合は以下で確認
　　　例：ssh -o ProxyCommand='ssh -i .ssh/hoge_rsa -W %h:%p user@gateway' -i .ssh/hoge_rsa user@server
