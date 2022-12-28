MG._hooks = {};
var globals = {};
globals.nhours = 24+1;    // X軸幅 時単位
//globals.maxhours = 7*24+1;  // X軸幅の最大値　この期間を超えるとスライドしない。
globals.leftdatetime = new Date('2017-01-01T00:00:00Z');    // X軸左端日時
globals.panTime = false; // パン（ドラッグ）によるスクロール中のフラグ
var garg = new Object;
//const gbaselinelabels = ["氾濫危険水位 ","避難判断水位 ","氾濫注意水位 ","水防団待機水位 "];
const gtextids = ["a1text","a2text","a3text","a4text"];
const glineids = ["a1line","a2line","a3line","a4line"];
const glevelids = ["a1level","a2level","a3level","a4level"];

// 引数を取得
// id=観測所記号
// json=jsonファイルパス
// http://https://www.hjcg.net/river/index.html?json="[URI]"
var str = decodeURIComponent(location.search.substring(1));
var pair = str.split('&');
for (var i = 0; pair[i]; i++) {
    var kv = pair[i].split('=');
    garg[kv[0]] = kv[1];
}

// グラフ属性
var graph_params = {
    //show_tooltips: true,
    //width: 600,
    full_width: true,
    height: 220,
    //full_height: true,
    right: 20,
    top: 20,
    show_secondary_x_label: true,
    xax_count: 6,
    yax_count: 5,
    point_size: 3.5,
    x_extended_ticks: true,
    xax_tick_length: 2,
    y_extended_ticks: true,
    yax_tick_length: 0,
    //rollover_align: 'left',
    //x_extended_ticks: true,
    //x_label: "x軸タイトル",
    //inflator: 11/9,
    //axes_not_compact : false,
    //xax_start_at_min: true,
    //european_clock : true, // 24h
    //animate_on_load: true,
    transition_on_update: false, // データ更新時、遷移時のアニメーション
    target: '#suii_graph',
    x_accessor: 'date',
    y_accessor: 'v1',
    //aggregate_rollover: true,
    area: false,
    missing_is_hidden: true,    // 欠損値(==null)を表示させない
    yax_units_append: true,     // 単位を後に表示
    
    data: [{ 'date': new Date('2017-01-01T00:00:00Z'), 'v1': 0.0 }] // dummy
}

// 観測所情報をを取得し、グラフ属性にセット
d3.json("data/station-senosita.json", function (data) {
    var stat = data[0];
    //document.getElementById('st_title').textContent = "観測所: " + stat.id + ", 観測所名: " + stat.name + ", 水系名: " + stat.suikei + ", 河川名: " + stat.kasen;
    //document.getElementById('st_url1').href = stat.url1;
    //document.getElementById('st_url2').href = stat.url2;
    graph_params.min_y = stat.suii_min;
    graph_params.max_y = stat.suii_max;
    graph_params.yax_units = stat.suii_unit;
    graph_params.y_label = stat.suii_title;
    graph_params.mouseover = function(d, i) {
        // マウスオーバー時のテキストを変更
        //console.log(d);
        var pf = d3.timeFormat('%Y/%m/%d %H:%M');
        d3.select('#suii_graph svg .mg-active-datapoint')
            //.text('Day ' + (i + 1) + '   ' + pf(d.value));
            .text('● ' + pf(d.date) + '  ' + d.v1 + stat.suii_unit + ' ');
        }
    var lines = [];
    var asuii = [stat.hanran_kiken_suii, stat.hinan_handan_suii, stat.hanran_tyuui_suii, stat.suiboudan_taiki_suii];
    for(var i = 0 ; i < asuii.length ; i++)
    {
        if (!isNaN(asuii[i]))
        {
            lines.push({ value: asuii[i], label: ""/*gbaselinelabels[i] + asuii[i] + stat.suii_unit*/, lineid:glineids[i], textid:gtextids[i] });
            document.getElementById(glevelids[i]).textContent = asuii[i] + stat.suii_unit;
        }
    }
    graph_params.baselines = lines;
});

function loop_update(){
    console.log("loop_update() " + new Date());
    console.log(garg.json);

    // データ値を取得しグラフのデータにセット
    d3.json(garg.json/*"data/station-senosita_latest.json"*/, function (error, data) {

        if (error)
        {
            graph_params.error = 'Error.';
            graph_params.chart_type = 'missing-data';
            graph_params.missing_text = 'Missing data.';
            my_data_graphic();
        }
        else
        {
            data = MG.convert.datetime(data, 'date');
            /*// test start. ダミーデータを作る //////////////////////////////////////////
            var start = '2017-10-10 13:10:00';
            var now = moment();
            var suii = 3.57;
            for (var mins = 0 ; mins < 144*10*10;  mins += 10)
            {
                var t =  moment(start).add(mins, 'minutes').toDate(); //Dateオブジェクトを返す
                if (t > now) break;
                suii = suii == 1.45 ? 1.48 : 1.45;
                var item1 = {date:t, v1:Math.round(suii*100)/100};
                data[data.length] = item1; // 動的に確保されるみたい
            }
            console.log("length: " + data.length);
            // test end. //////////////////////////////////////////////////////*/
            globals.data = data;
            if (data.length > 288)
            {
                var s = 6;//data.length / 288;
                var mindata = [];
                for (var i = 0 ; i < data.length ; i += s)
                {
                    mindata.push(data[i]);
                }
                globals.mindata = MG.clone(mindata);
            }

            // グラフ属性
            graph_params.chart_type = 'line';
            graph_params.data = data;
            graph_params.min_x = moment(data[data.length-1].date).add(0-globals.nhours, "h").toDate();
            graph_params.max_x = data[data.length-1].date;

            // 最新データのマーカーを作成
            var pf = d3.timeFormat('%Y-%m-%d %H:%M');
            var markers = [{
                'date': graph_params.max_x,
                'label': /*pf(graph_params.max_x) + */"最新時刻"
                /*}, {
                'date': new Date(moment(data[data.length-1].date).add(-0.8, "days").valueOf()),
                'label': '2nd Milestone'*/
            }];
            graph_params.markers = markers;

            // グラフ更新
            my_data_graphic();
        }
    });

    //setTimeout(loop_update, 10*60*1000); // 10*60秒後に再度自身を実行
}
loop_update();

// グラフ描画
function my_data_graphic()
{
    if (graph_params.chart_type != 'missing-data')
    {
        // 横軸のメモリの数を指定
        var w = $(window).width();
        var o = document.getElementById('suii_graph');
        if (o != null)
            w = o.clientWidth;
        if (w > 600)
            graph_params.xax_count = 7;
        else if (w > 300)
            graph_params.xax_count = 5;
        else if (w > 180)
            graph_params.xax_count = 2;
        else
            graph_params.xax_count = 1;

        // グラフ更新 
        MG.data_graphic(graph_params);

        // baselinesのline,textにid属性を設定し、スタイルを変更
        d3.selectAll(".mg-baselines").selectAll("text").attr("id", function (d, i) {
            return d.textid;
        });
        d3.selectAll(".mg-baselines").selectAll("line").attr("id", function (d, i) {
            return d.lineid;
        });
    }
    else{
        // データなしの場合
        // グラフ更新 
        MG.data_graphic(graph_params);
    }
}

// マウス、タッチの操作を割り付ける
d3.select("#suii_graph").each(function (d, i) {
    addHummerEventListener(this, d);
});

// X軸幅変更ボタンクリック時の処理
$('#graph-ax').on('click', 'button', function () {
    var numX = Number($(this).attr("time-period"));
    console.log("button click!  " + numX);
    globals.nhours = numX;
    if (globals.nhours > 0.0)
    {
        graph_params.min_x = new Date(moment(globals.data[globals.data.length-1].date).add(0-globals.nhours, "h").valueOf());
        graph_params.max_x = globals.data[globals.data.length-1].date;
    }
    else
    {
        graph_params.min_x = 0;
        graph_params.max_x = 0;
        //graph_params.min_x = globals.data[0].date;
        //graph_params.max_x = globals.data[data.length-1].date;
    }
    graph_params.data = globals.data;
    my_data_graphic();
});

// リサイズ完了後にグラフを更新
// タイマーを利用し200ミリ秒後に処理
$(function() {
    var resizeTimer = null;
    $(window).on('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // リサイズ完了後の処理
            //var winWidth = $(window).width();
            //var winHeight = $(window).height();
            my_data_graphic();
            //console.log('幅:' + winWidth + '__高さ:' + winHeight);
        }, 200);
    });
});

/* 時間軸方向の遷移 */
function move(movex)
{
    if (graph_params.max_x != null)
    {
        var from = moment(graph_params.min_x);
        var to = moment(graph_params.max_x);
        var sah = to.diff(from, 'h', true);
        var w = graph_params.width;
        var mx = movex * sah / w;
        var mxhours = Math.round((0.0 - mx)*100)/100;
        graph_params.min_x = new Date(from.add(mxhours, "h").valueOf());
        graph_params.max_x = new Date(to.add(mxhours, "h").valueOf());
        //console.log("axisx min " + graph_params.min_x);
        my_data_graphic();
    }   
}

/* 最大範囲を超えてスライドしている場合に、戻す */
function modosu()
{
    if (graph_params.max_x != null)
    {
        var from = moment(graph_params.min_x);
        var to = moment(graph_params.max_x);
        var latest = moment(globals.data[globals.data.length-1].date);
        //var min = moment(globals.data[globals.data.length-1].date).add(0 - globals.maxhours, 'h'); 指定してある期間の最大値
        var min = moment(globals.data[0].date); // データの一番古い日時
        if (latest < to)
        {
            // 最新日時　＜　Ｘ軸右端　のときは右端を最新日時に。
            graph_params.max_x = latest.toDate();
            graph_params.min_x = moment(graph_params.max_x).add(0-globals.nhours, 'h').toDate();
        }
        else if (from < min)
        {
            // Ｘ軸左端　＜　データの一番古い日時　のときは左端をデータの一番古い日時に。
            graph_params.min_x = min.toDate();
            graph_params.max_x = moment(graph_params.min_x).add(globals.nhours, 'h').toDate();
            // 最新日時　＜　Ｘ軸右端　のときは右端を最新日時に。
            if (latest < graph_params.max_x)
            {
                graph_params.max_x = latest.toDate();
                graph_params.min_x = moment(graph_params.max_x).add(0-globals.nhours, 'h').toDate();
            }
        }
        my_data_graphic();
    }
}

// Hummer.jsのイベントのリスナー
// スワイプの操作処理
function addHummerEventListener(that, d) {

	// tap (click) event.tapCount = 1
	// double tap (double click) event.tapCount = 2
    Hammer(that).on("tap", function (event) {
        if (event.tapCount == 2)
        {
        	// ダブルクリック、ダブルタップの処理
        	console.log("double tap:zoomin");
			//suii_zoomin();
        }
    });
    // pan (drag) スクロール
    Hammer(that).on("pan",function(event) {
    	//console.log(event);
        if(event.isFinal) { //end
            globals.panTime = false;
            globals.tmp = 0;
            //$jqTgPanPinchArea.data("down", false);
            //パンが終わったときの操作
            modosu();
        } else {
            if(!globals.panTime)
            {   
                //start ンを始めたときの動作
                globals.panTime = true;
                globals.tmp = 0;
            }
            else
            {
                //move
                //パンしている途中の動作
                if (globals.nhours > 0.0)
                {
                	//console.log("deltaX:" + event.deltaX + ",tmp:" + globals.tmp);
                    if (event.deltaX - globals.tmp > 3 || event.deltaX - globals.tmp < -3)
                    {
                        move(event.deltaX - globals.tmp);
                        globals.tmp = event.deltaX;
                    }
                }
            }
        }
    });
    /*
    // pinchin　拡大縮小
    Hammer(that).on("pinchin",function(event) {
        cosole.log("pinchin");
    });
    Hammer(that).on("pinchout",function(event) {
        cosole.log("pinchout");
    });
    // pinch
    pinchTime = false,
    $pinchTimer = {};
    Hammer(that).on("pinch",function(event) {
        event.preventDefault ? event.preventDefault() : (event.returnValue = false);
        if(!pinchTime) { //start
            pinchTime = event.timeStamp;
            //ピンチを始めたときの動作
        }
        else { //move
            if($pinchTimer)
                clearTimeout($pinchTimer);
            //ピンチをしている途中の動作
            $pinchTimer = setTimeout(function() { //end
                pinchTime = false;
                //ピンチが終わったときの動作
            }, 100);
        }
    });
    // swipe　削除やページ移動
    Hammer(that).on("swipeleft", function (event) {
        console.log("swipeleft");
        //alert("Swipe Left! " + d.lable);
        suii_next();
    });
    Hammer(that).on("swiperight", function (event) {
        console.log("swiperight");
        //alert("Swipe Right! " + d.lable);
        suii_previous();
    });
    Hammer(that).on("swipeup", function (event) {
        //console.log(event);
        //alert("Swipe UP! " + d.label);
    });
    Hammer(that).on("swipedown", function (event) {
        //console.log(event);
        //alert("Swipe Down! " + d.label);
    });
	*/
}

