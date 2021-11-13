// windowの横幅を取得
function window_load(){
    var sW;
    sW = window.innerWidth;
    return sW;
}

// windowの読み込み
window_width = window_load();
alert(window_width);

// 倍率の計算
ScaleMag = window_width/800;

// 初期値(画面サイズによらない)
var probTrans = []; // 確率を格納
let sumEx = 0; // 実験の合計回数
let sumSw = 0; // スイッチを押した回数(max5)
let sumPh = 0; // 当該事象の起こった回数
let Rball = 0; // 赤玉が出た回数
let Bball = 0; // 青玉
let Yball = 0; // 黄玉
let Wball = 0; // 白玉
let numberBoxL = 0; // 左の箱に入っているボールの数
let numberBoxR = 0; // 右の箱に入っているボールの数
let whichBox = 0; // 0ならば箱L
let shortLec = -1; // 最初の「操作」のレクチャー
let shortLec_b = -1; // 最初の「結果を反映」のレクチャー
let shortLec_c = -1; // 最初の「グラフの見方」のレクチャー
const move_BoxAndPush = 50; // 機械と箱の初期位置をどれだけ上にずらすか(アレンジ用)

// 初期値(画面サイズによる)
const ballrad = 40*ScaleMag; // ボールの半径

// pixi.jsのアプリケーションを作成
const app = new PIXI.Application({
  width: window_width,
  height: 680*ScaleMag,
  backgroundColor: 0x556b2f, // 背景色
});
// stageに追加
document.body.appendChild(app.view);


// 文字(Lに4色入った回数:)を表示
const mesPh = new PIXI.Text("Lに4色入った回数:");
mesPh.x = 520*ScaleMag;
mesPh.y = 10*ScaleMag;
mesPh.width *= ScaleMag;
mesPh.height *= ScaleMag;
mesPh.style.fill = "white";
app.stage.addChild(mesPh);

// 文字(実験を行った回数:)を表示
const mesEx = new PIXI.Text("実験を行った回数:");
mesEx.x = 520*ScaleMag;
mesEx.y = 50*ScaleMag;
mesEx.width *= ScaleMag;
mesEx.height *= ScaleMag;
mesEx.style.fill = "white";
app.stage.addChild(mesEx);

// 文字(実験による確率)を表示
const mesPro = new PIXI.Text("実験による確率:");
mesPro.x = 520*ScaleMag;
mesPro.y = 100*ScaleMag;
mesPro.width *= ScaleMag;
mesPro.height *= ScaleMag;
mesPro.style.fill = "white";
app.stage.addChild(mesPro);

// 線(確率の分数用)を表示
const BunsuLine = new PIXI.Graphics();
BunsuLine.lineStyle(5*ScaleMag,0xffffff).moveTo(550*ScaleMag,200*ScaleMag).lineTo(620*ScaleMag,200*ScaleMag);
app.stage.addChild(BunsuLine);

// ＝(確率)を表示
const BunsuEqual = new PIXI.Text("=");
BunsuEqual.x = 640*ScaleMag;
BunsuEqual.y = 185*ScaleMag;
BunsuEqual.width *= ScaleMag;
BunsuEqual.height *= ScaleMag;
BunsuEqual.style.fill = "white";
app.stage.addChild(BunsuEqual);

// 線(確率を囲う用)を表示
const ProbSquare = new PIXI.Graphics();
ProbSquare.lineStyle(3*ScaleMag,0xffffff).moveTo(525*ScaleMag,140*ScaleMag).lineTo(525*ScaleMag,270*ScaleMag);
ProbSquare.lineStyle(3*ScaleMag,0xffffff).moveTo(525*ScaleMag,270*ScaleMag).lineTo(785*ScaleMag,270*ScaleMag);
ProbSquare.lineStyle(3*ScaleMag,0xffffff).moveTo(785*ScaleMag,270*ScaleMag).lineTo(785*ScaleMag,120*ScaleMag);
ProbSquare.lineStyle(3*ScaleMag,0xffffff).moveTo(785*ScaleMag,120*ScaleMag).lineTo(730*ScaleMag,120*ScaleMag);
app.stage.addChild(ProbSquare);

// 結果(当該事象が起こった測定値)を表示
if(sumPh == 0){
    let mesumPh = new PIXI.Text(sumPh);
    mesumPh.x = 750*ScaleMag;
    mesumPh.y = 10*ScaleMag;
    mesumPh.width *= ScaleMag;
    mesumPh.height *= ScaleMag;
    mesumPh.style.fill = "yellow";
    app.stage.addChild(mesumPh);
}
// 結果(実験を行った回数)を表示
if(sumEx == 0){
    const mesumEx = new PIXI.Text(sumEx);
    mesumEx.x = 750*ScaleMag;
    mesumEx.y = 50*ScaleMag;
    mesumEx.width *= ScaleMag;
    mesumEx.height *= ScaleMag;
    mesumEx.style.fill = "yellow";
    app.stage.addChild(mesumEx);
}

// 合計実験回数を表示
function showsumEx(sumEx){
    sumEx += 1;
    const sumExcover = new PIXI.Graphics(); // その前の数字を塗りつぶし
    sumExcover.x = 750*ScaleMag;
    sumExcover.y = 50*ScaleMag;
    sumExcover.beginFill(0x556b2f);
    sumExcover.drawRect(0,0,100*ScaleMag,30*ScaleMag);
    sumExcover.endFill();
    app.stage.addChild(sumExcover);
    //
    const mesumEx = new PIXI.Text(sumEx); // 新しい数字を表示
    mesumEx.x = 750*ScaleMag;
    mesumEx.y = 50*ScaleMag;
    mesumEx.width *= ScaleMag;
    mesumEx.height *= ScaleMag;
    mesumEx.style.fill = "yellow";
    app.stage.addChild(mesumEx);
    return sumEx;
}

// 当該事象の起こった回数を表示
// ここでスプレッドシートに送る何かを書けば良さそう★
function showsumPh(numberBoxL,sumPh){
    if(numberBoxL == 4){ // 箱Lに入った玉が4個(4色)のときのみ
      sumPh += 1; // 当該事象が起こった回数を追加

      const sumPhcover = new PIXI.Graphics(); // その前の数字を塗りつぶし
      sumPhcover.x = 750*ScaleMag;
      sumPhcover.y = 10*ScaleMag;
      sumPhcover.beginFill(0x556b2f);
      sumPhcover.drawRect(0,0,100*ScaleMag,30*ScaleMag);
      sumPhcover.endFill();
      app.stage.addChild(sumPhcover);
      //
      let mesumPh = new PIXI.Text(sumPh); // 新しい数字を表示
      mesumPh.x = 750*ScaleMag;
      mesumPh.y = 10*ScaleMag;
      mesumPh.width *= ScaleMag;
      mesumPh.height *= ScaleMag;
      mesumPh.style.fill = "yellow";
      app.stage.addChild(mesumPh);
    }
    return sumPh;
}

// 残り玉数を表示
function showrestBall(sumSw,e){
    const resBacover = new PIXI.Graphics(); // その前の数字を塗りつぶし
    resBacover.x = 395*ScaleMag;
    resBacover.y = 70*ScaleMag;
    resBacover.beginFill(0xffffff);
    resBacover.drawRect(0,0,30*ScaleMag,30*ScaleMag);
    resBacover.endFill();
    app.stage.addChild(resBacover);
    
    const meresBa = new PIXI.Text(5-sumSw); // 新しい数字を表示
    meresBa.x = 395*ScaleMag;
    meresBa.y = 70*ScaleMag;
    meresBa.width *= ScaleMag;
    meresBa.height *= ScaleMag;
    meresBa.style.fill = "red";
    app.stage.addChild(meresBa);
}

// 箱Lと箱Rの初期設定
function setBox(){
    // 箱Lの枠
    const leftBoxEdge = new PIXI.Graphics(); // グラフィックオブジェクトの作成
    leftBoxEdge.x = 40*ScaleMag;          // 横座標の設定
    leftBoxEdge.y = 340*ScaleMag;         // 縦座標の設定
    leftBoxEdge.beginFill(0xe6cf8a);
    leftBoxEdge.drawRect(0,0,320*ScaleMag,180*ScaleMag);
    leftBoxEdge.endFill();
    app.stage.addChild(leftBoxEdge); // ステージに追加する

    // 箱L
    const leftBox = new PIXI.Graphics(); // グラフィックオブジェクトの作成
    leftBox.x = 50*ScaleMag;          // 横座標の設定
    leftBox.y = 350*ScaleMag;          // 縦座標の設定
    leftBox.beginFill(0x66500f);
    leftBox.drawRect(0,0,300*ScaleMag,160*ScaleMag);  // 矩形を描写する
    leftBox.endFill();
    app.stage.addChild(leftBox);

    // 箱Lふた
    const BoxLcover = new PIXI.Graphics();
    BoxLcover.lineStyle(10*ScaleMag,0xe6cf8a).moveTo(40*ScaleMag,340*ScaleMag).lineTo(10*ScaleMag,510*ScaleMag);
    BoxLcover.lineStyle(10*ScaleMag,0xe6cf8a).moveTo(360*ScaleMag,340*ScaleMag).lineTo(390*ScaleMag,510*ScaleMag);
    BoxLcover.lineStyle(20*ScaleMag,0x556b2f).moveTo(50*ScaleMag,340*ScaleMag).lineTo(350*ScaleMag,340*ScaleMag);
    app.stage.addChild(BoxLcover);

    // 箱Rの枠
    const rightBoxEdge = new PIXI.Graphics();
    rightBoxEdge.x = 440*ScaleMag;          // 横座標の設定
    rightBoxEdge.y = 340*ScaleMag;          // 縦座標の設定
    rightBoxEdge.beginFill(0xe6cf8a);
    rightBoxEdge.drawRect(0,0,320*ScaleMag,180*ScaleMag);
    rightBoxEdge.endFill();
    app.stage.addChild(rightBoxEdge); // ステージに追加する

    // 箱R
    const rightBox = new PIXI.Graphics();
    rightBox.x = 450*ScaleMag;          // 横座標の設定
    rightBox.y = 350*ScaleMag;          // 縦座標の設定
    rightBox.beginFill(0x66500f);
    rightBox.drawRect(0,0,300*ScaleMag,160*ScaleMag);  // 矩形を描写する
    rightBox.endFill();
    app.stage.addChild(rightBox); // ステージに追加する

    // 箱Rふた
    const BoxRcover = new PIXI.Graphics();
    BoxRcover.lineStyle(10*ScaleMag,0xe6cf8a).moveTo(440*ScaleMag,340*ScaleMag).lineTo(410*ScaleMag,510*ScaleMag);
    BoxRcover.lineStyle(10*ScaleMag,0xe6cf8a).moveTo(760*ScaleMag,340*ScaleMag).lineTo(790*ScaleMag,510*ScaleMag);
    BoxRcover.lineStyle(20*ScaleMag,0x556b2f).moveTo(450*ScaleMag,340*ScaleMag).lineTo(750*ScaleMag,340*ScaleMag);
    app.stage.addChild(BoxRcover);

    // 文字(箱L)を表示
    const nameL = new PIXI.Text("L");
    nameL.x = 60*ScaleMag;
    nameL.y = 350*ScaleMag;
    nameL.width *= ScaleMag;
    nameL.height *= ScaleMag;
    nameL.style.fill = "white";
    app.stage.addChild(nameL);

    // 文字(箱R)を表示
    const nameR = new PIXI.Text("R");
    nameR.x = 460*ScaleMag;
    nameR.y = 350*ScaleMag;
    nameR.width *= ScaleMag;
    nameR.height *= ScaleMag;
    nameR.style.fill = "white";
    app.stage.addChild(nameR);
}

// 箱Lと箱Rを表示
setBox();

// 文字(正しい箱に分類しよう)を表示
function showDivBallMes(){
    const mesDivball = new PIXI.Text("条件に従ってLまたはRの箱に玉を入れよう！");
    mesDivball.x = 120*ScaleMag;
    mesDivball.y = 550*ScaleMag;
    mesDivball.width *= ScaleMag;
    mesDivball.height *= ScaleMag;
    mesDivball.style.fill = "white";
    contaDivball.addChild(mesDivball);
}

// 文字(正しい箱に分類しよう)を非表示
function delDivBallMes(){
    contaDivball.removeChildren();
}

// 文字(箱が正しくないor箱に入ってない)を表示
function showDivBallMes2(){
    const mesDivball2 = new PIXI.Text("まだ箱に入ってない");
    mesDivball2.x = 50*ScaleMag;
    mesDivball2.y = 550*ScaleMag;
    mesDivball2.width *= ScaleMag;
    mesDivball2.height *= ScaleMag;
    mesDivball2.style.fill = "yellow";
    contaDivball2.addChild(mesDivball2);

    const mesDivball3 = new PIXI.Text("または");
    mesDivball3.x = 300*ScaleMag;
    mesDivball3.y = 550*ScaleMag;
    mesDivball3.width *= ScaleMag;
    mesDivball3.height *= ScaleMag;
    mesDivball3.style.fill = "white";
    contaDivball2.addChild(mesDivball3);

    const mesDivball4 = new PIXI.Text("箱が間違っている");
    mesDivball4.x = 400*ScaleMag;
    mesDivball4.y = 550*ScaleMag;
    mesDivball4.width *= ScaleMag;
    mesDivball4.height *= ScaleMag;
    mesDivball4.style.fill = "yellow";
    contaDivball2.addChild(mesDivball4);

    const mesDivball5 = new PIXI.Text("状態だよ!");
    mesDivball5.x = 630*ScaleMag;
    mesDivball5.y = 550*ScaleMag;
    mesDivball5.width *= ScaleMag;
    mesDivball5.height *= ScaleMag;
    mesDivball5.style.fill = "white";
    contaDivball2.addChild(mesDivball5);
}

// 文字(箱が正しくないor箱に入ってない)を非表示
function delDivBallMes2(){
    contaDivball2.removeChildren();
}

// スイッチを押した回数/実験回数を管理
function switchCounter(sumSw,e){
    if(sumSw < 4){
      sumSw += 1;
      showrestBall(sumSw); // 残り玉数
      return sumSw;
    }else if(sumSw == 4){
      // 各種変数のリセット
      sumSw = 0;
      Rball = 0; // 赤玉が出た回数
      Bball = 0; // 青玉
      Yball = 0; // 黄玉
      Wball = 0; // 白玉
      showrestBall(5); // 残り玉数0を表示
      showResultButtun(); // 結果を反映ボタンを表示
      return sumSw;
    }
}

// 当該玉が箱L,Rのどちらに属すべきか判断する関数
function ballJudge(Colorball){
    if(Colorball == 1){
      whichBox = 0; // 箱L
      numberBoxL += 1; // 箱Lに入っている玉数+1
      return whichBox;
    }else if(Colorball != 1){
      whichBox = 1; // 箱R
      numberBoxR += 1; // 箱Rに入っている玉数+1
      return whichBox;
    }
}

// 理論値と比較を押したときに起こる関数
function showProb(){
    // containerの作成
    const probTranslate = new PIXI.Container();
    app.stage.addChild(probTranslate);

    // 背景
    const probTransBack = new PIXI.Graphics();
    probTransBack.x = 0;          // 横座標の設定
    probTransBack.y = 0;          // 縦座標の設定
    probTransBack.beginFill(0x696969);
    probTransBack.drawRect(0,0,window_width,680*ScaleMag);  // 矩形を描写する
    probTransBack.endFill();
    probTranslate.addChild(probTransBack); // ステージに追加する

    // 戻るボタン
    const testPic = new PIXI.Sprite.from('experiment_backToEx.png');
    testPic.x = 15*ScaleMag;          // 横座標の設定
    testPic.y = 15*ScaleMag;          // 縦座標の設定
    testPic.width = 210*ScaleMag;
    testPic.height = 110*ScaleMag;
    probTranslate.addChild(testPic);
    testPic.interactive = true; // アクティブに
    testPic.buttonMode = true; // カーソルを重ねると矢印が手の形に変わる
    testPic.on("pointertap", BackToExperiment); // クリックしたら実験に戻る

    // タイトル
    const testTitle = new PIXI.Sprite.from('experiment_theoryTitle.png');
    testTitle.x = 235*ScaleMag;
    testTitle.y = 15*ScaleMag;
    testTitle.width = 565*ScaleMag;
    testTitle.height = 150*ScaleMag;
    probTranslate.addChild(testTitle);

    // グラフ軸
    const graphBack = new PIXI.Sprite.from('probGraph_2.png');
    graphBack.x = 0;
    graphBack.y = 130*ScaleMag;
    graphBack.width = window_width;
    graphBack.height = 500*ScaleMag;
    probTranslate.addChild(graphBack);

    // 実験回数33回ごとにプロットの縮尺を変える
    const plotsize = Math.ceil(probTrans.length/33);

    // 実験回数0回目は確率0 ★★★
    const zahogime_first = new PIXI.Graphics();
    zahogime_first.x = 30*ScaleMag;
    zahogime_first.y = 600*ScaleMag;
    zahogime_first.beginFill(0xff9999);
    zahogime_first.drawRect(0,0,(10/plotsize)*ScaleMag,(10/plotsize)*ScaleMag);
    zahogime_first.endFill();
    probTranslate.addChild(zahogime_first);

    // 実験回数軸までの線 ★★★
    const conectPlot_last = new PIXI.Graphics();
    conectPlot_last.lineStyle(2*ScaleMag,0xffffff).moveTo((30+(15/plotsize)*(probTrans.length)+(5/plotsize))*ScaleMag,(600-415*probTrans[(probTrans.length)-1]+(5/plotsize))*ScaleMag).lineTo((30+(15/plotsize)*(probTrans.length)+(5/plotsize))*ScaleMag,600*ScaleMag);
    probTranslate.addChild(conectPlot_last);

    // 実験回数を表示 ★★★
    const messumEx = new PIXI.Text(sumEx);
    messumEx.x = (25 + (15/plotsize)*(probTrans.length) + (5/plotsize))*ScaleMag;
    messumEx.y = 610*ScaleMag;
    messumEx.width *= ScaleMag;
    messumEx.height *= ScaleMag;
    messumEx.style.fill = "white";
    probTranslate.addChild(messumEx);

    // 確率を表示
    // 分母を表示 ★★★
    const Bunbo_trans = new PIXI.Text(sumEx);
    Bunbo_trans.x = (45 + (15/plotsize)*(probTrans.length) + (5/plotsize))*ScaleMag;
    Bunbo_trans.y = (580 - 415*probTrans[probTrans.length-1])*ScaleMag;
    Bunbo_trans.width *= ScaleMag;
    Bunbo_trans.height *= ScaleMag;
    Bunbo_trans.style.fill = 0xff9999;
    probTranslate.addChild(Bunbo_trans);

    // 分子を表示 ★★★
    const Bunshi_trans = new PIXI.Text(sumPh);
    Bunshi_trans.x = (45 + (15/plotsize)*(probTrans.length) + (5/plotsize))*ScaleMag;
    Bunshi_trans.y = (550 - 415*probTrans[probTrans.length-1])*ScaleMag;
    Bunshi_trans.width *= ScaleMag;
    Bunshi_trans.height *= ScaleMag;
    Bunshi_trans.style.fill = 0xff9999;
    probTranslate.addChild(Bunshi_trans);

    // 分数の線を表示 ★★★
    const Bunsuline_trans = new PIXI.Graphics();
    Bunsuline_trans.lineStyle(2*ScaleMag,0xff9999).moveTo((45 + (15/plotsize)*(probTrans.length) + (5/plotsize))*ScaleMag,(580 - 415*probTrans[probTrans.length-1])*ScaleMag).lineTo((70 + (15/plotsize)*(probTrans.length) + (5/plotsize))*ScaleMag,(580 - 415*probTrans[probTrans.length-1])*ScaleMag);
    probTranslate.addChild(Bunsuline_trans);

    // 小数で表示 ★★★
    const prob_trans = new PIXI.Text("(=" + Math.round((sumPh/sumEx)*100)/100 + ")"); // 小数点第2位で四捨五入
    prob_trans.x = (86 + (15/plotsize)*(probTrans.length) + (5/plotsize))*ScaleMag;
    prob_trans.y = (565 - 415*probTrans[probTrans.length-1])*ScaleMag;
    prob_trans.width *= ScaleMag;
    prob_trans.height *= ScaleMag;
    prob_trans.style.fill = 0xff9999;
    probTranslate.addChild(prob_trans);

    // (0,0)と1点目を結ぶ線 ★★★
    const conectPlot_first = new PIXI.Graphics();
    conectPlot_first.lineStyle(3*ScaleMag,0xff9999).moveTo((30 + (5/plotsize))*ScaleMag,(600 + (5/plotsize))*ScaleMag).lineTo((30 + (20/plotsize))*ScaleMag,(600 - 415*probTrans[0] + (5/plotsize))*ScaleMag);
    probTranslate.addChild(conectPlot_first);

    // 確率の推移のプロット ★★★
    for(i=0;i<probTrans.length;i++){ // 格納されている確率の個数分プロット
      const zahogime = new PIXI.Graphics();
      zahogime.x = (30 + (15/plotsize)*(i+1))*ScaleMag;
      zahogime.y = (600 - 415*probTrans[i])*ScaleMag;
      zahogime.beginFill(0xff9999);
      zahogime.drawRect(0,0,(10/plotsize)*ScaleMag,(10/plotsize)*ScaleMag);
      zahogime.endFill();
      probTranslate.addChild(zahogime);

      const conectPlot = new PIXI.Graphics();
      conectPlot.lineStyle(2*ScaleMag,0xff9999).moveTo((30 + (15/plotsize)*i + (5/plotsize))*ScaleMag,(600 - 415*probTrans[i-1] + (5/plotsize))*ScaleMag).lineTo((30 + (15/plotsize)*(i+1) + (5/plotsize))*ScaleMag,(600 - 415*probTrans[i] + (5/plotsize))*ScaleMag);
      probTranslate.addChild(conectPlot);
    }

    // [グラフ]のshortLectureを表示
    if(sumEx<2){ // 最初の一回だけ
      const instPic7 = new PIXI.Sprite.from('ex_inst7_new.png');
      instPic7.x = 200*ScaleMag;
      instPic7.y = 200*ScaleMag;
      instPic7.width = 510*ScaleMag;
      instPic7.height = 250*ScaleMag;
      probTranslate.addChild(instPic7);
    }

    // 実験に戻る(確率変遷を消す)
    function BackToExperiment(){
      probTranslate.removeChildren();
    }
    
    // [以降はグラフは手動]を表示
    howPlay_easy_d();
}

// shortLectureを表示
function howPlay_easy(){
    if(shortLec==-1){
      const instGreenCover = new PIXI.Graphics();
      instGreenCover.x = mesPh.x;
      instGreenCover.y = mesPh.y;
      instGreenCover.beginFill(0x556b2f);
      instGreenCover.drawRect(0,0,window_width-mesPh.x,300*ScaleMag);
      howPlay.addChild(instGreenCover);

      const instPic1 = new PIXI.Sprite.from('ex_inst1_new.png');
      instPic1.x = 150*ScaleMag;          // 横座標の設定
      instPic1.y = 170*ScaleMag;          // 縦座標の設定
      instPic1.width = 140*ScaleMag;
      instPic1.height = 90*ScaleMag;
      howPlay.addChild(instPic1);

      const instPic2 = new PIXI.Sprite.from('ex_inst2_new.png');
      instPic2.x = 420*ScaleMag;          // 横座標の設定
      instPic2.y = 230*ScaleMag;          // 縦座標の設定
      instPic2.width = 300*ScaleMag;
      instPic2.height = 80*ScaleMag;
      howPlay.addChild(instPic2);

      const instPic3 = new PIXI.Sprite.from('ex_inst3_new.png');
      instPic3.x = 75*ScaleMag;          // 横座標の設定
      instPic3.y = 500*ScaleMag;          // 縦座標の設定
      instPic3.width = 415*ScaleMag;
      instPic3.height = 100*ScaleMag;
      howPlay.addChild(instPic3);

      const instPic4 = new PIXI.Sprite.from('ex_inst4_new.png');
      instPic4.x = 500*ScaleMag;          // 横座標の設定
      instPic4.y = 460*ScaleMag;          // 縦座標の設定
      instPic4.width = 260*ScaleMag;
      instPic4.height = 120*ScaleMag;
      howPlay.addChild(instPic4);

      const instPic5 = new PIXI.Sprite.from('ex_inst5_new.png');
      instPic5.x = 500*ScaleMag;          // 横座標の設定
      instPic5.y = 10*ScaleMag;          // 縦座標の設定
      instPic5.width = 300*ScaleMag;
      instPic5.height = 180*ScaleMag;
      howPlay.addChild(instPic5);
    }else{
      howPlay.removeChildren();
    }
}

// [結果を反映]のshortLectureを表示
function howPlay_easy_b(){
    if(shortLec_b==-1){
      const instPic6 = new PIXI.Sprite.from('ex_inst6_new.png');
      instPic6.x = 100*ScaleMag;          // 横座標の設定
      instPic6.y = 195*ScaleMag;          // 縦座標の設定
      instPic6.width = 230*ScaleMag;
      instPic6.height = 140*ScaleMag;
      howPlay_b.addChild(instPic6);
    }else{
      howPlay_b.removeChildren();
    }
}

// [これ以降はグラフは手動表示]を表示
function howPlay_easy_d(){
    if(sumSw==0 & sumEx==3){
      const instPic8 = new PIXI.Sprite.from('ex_inst8_new.png');
      instPic8.x = 50*ScaleMag;          // 横座標の設定
      instPic8.y = 250*ScaleMag;          // 縦座標の設定
      instPic8.width = 690*ScaleMag;
      instPic8.height = 230*ScaleMag;
      howPlay.addChild(instPic8);
    }else{
      howPlay.removeChildren();
    }
}

// 玉を出す機械
const machine = new PIXI.Graphics(); // グラフィックオブジェクトの作成
machine.x = 100*ScaleMag;         // 横座標の設定
machine.y = 50*ScaleMag;          // 縦座標の設定
machine.beginFill(0xffffff);
machine.drawRect(0,0,400*ScaleMag,250*ScaleMag);
machine.endFill();
app.stage.addChild(machine); // ステージに追加する

// 反映ボタンからスイッチへ表示を変更する関数
// [結果を反映]を押したときに実行
function showBallSwitch(){
  shortLec_b = 0; // 次からは表示されないように
  howPlay_easy_b();

  // ボタンを表示
  contaResult.removeChildren();
  const ballswitch = new PIXI.Graphics(); // グラフィックオブジェクトの作成
  ballswitch.x = 120*ScaleMag;
  ballswitch.y = 70*ScaleMag;
  ballswitch.beginFill(0x333333);
  ballswitch.drawRect(0,0,150*ScaleMag,150*ScaleMag);
  ballswitch.endFill();
  contaSwitch.addChild(ballswitch);
  ballswitch.interactive = true;
  ballswitch.on("pointertap", addBall); // クリックしたら玉が表れる

  // 文字(push)を表示
  const Push = new PIXI.Text("Push");
  Push.x = 165*ScaleMag;
  Push.y = 130*ScaleMag;
  Push.width *= ScaleMag;
  Push.height *= ScaleMag;
  Push.style.fill = "white";
  contaSwitch.addChild(Push);

  showrestBall(0); // 残り玉数を「5個」に戻す
  container.removeChildren(); // 5個の玉を消す
  sumEx = showsumEx(sumEx); // 実験回数を表示・積算
  sumPh = showsumPh(numberBoxL,sumPh); // 当該事象の起こった回数を表示・積算
  showProbability(sumEx,sumPh); // 確率を表示
  numberBoxL = 0; // 左の箱の玉の数を初期化
  numberBoxR = 0; // 
  
  if(sumEx<4){
    showProb(); // 3回目の実験までは理論値と比較を表示
  }
}

// スイッチを消して結果を反映ボタンを表示する関数
// [5球目を出した時]に実行?
function showResultButtun(){
  contaSwitch.removeChildren();

　// グラフィックオブジェクトの作成
  const showResult = new PIXI.Graphics();
  showResult.x = 120*ScaleMag;
  showResult.y = 70*ScaleMag;
  showResult.beginFill(0x333333);
  showResult.drawRect(0,0,150*ScaleMag,150*ScaleMag);
  showResult.endFill();
  contaResult.addChild(showResult);
  showResult.interactive = true;
  showResult.on("pointertap", showBallSwitch); // クリックしたら再度Pushボタンが表示

  // 文字(結果を反映)を表示 ★★
  const reflectResult = new PIXI.Text("結果を反映");
  reflectResult.x = 130*ScaleMag;
  reflectResult.y = 105*ScaleMag;
  reflectResult.width *= ScaleMag;
  reflectResult.height *= ScaleMag;
  reflectResult.style.fill = "white";
  contaResult.addChild(reflectResult);

  // 文字(実験を続ける)を表示 ★★
  const reflectResult2 = new PIXI.Text("(実験続行)");
  reflectResult2.x = 135*ScaleMag;
  reflectResult2.y = 155*ScaleMag;
  reflectResult2.width *= ScaleMag;
  reflectResult2.height *= ScaleMag;
  reflectResult2.style.fill = "white";
  contaResult.addChild(reflectResult2);
}

// 実測値を表示するための関数
function showProbability(sumEx,sumPh){
  contaProbability.removeChildren();
  
  // 分母を表示
  const Bunbo = new PIXI.Text(sumEx);
  Bunbo.x = 560*ScaleMag;
  Bunbo.y = 210*ScaleMag;
  Bunbo.style.fill = "yellow";
  Bunbo.width *= 1.7*ScaleMag;
  Bunbo.height *= 1.7*ScaleMag;
  contaProbability.addChild(Bunbo);

  // 分子を表示
  const Bunshi = new PIXI.Text(sumPh);
  Bunshi.x = 560*ScaleMag;
  Bunshi.y = 140*ScaleMag;
  Bunshi.style.fill = "yellow";
  Bunshi.width *= 1.7*ScaleMag;
  Bunshi.height *= 1.7*ScaleMag;
  contaProbability.addChild(Bunshi);

  // 小数で表示
  const prob = new PIXI.Text(Math.round((sumPh/sumEx)*100)/100); // 小数点第2位で四捨五入
  prob.x = 680*ScaleMag;
  prob.y = 173*ScaleMag;
  prob.style.fill = 0xff9999;
  prob.width *= 1.7*ScaleMag;
  prob.height *= 1.7*ScaleMag;
  contaProbability.addChild(prob);

  // 確率を格納
  probTrans.push(Math.round((sumPh/sumEx)*100)/100);
}

// スイッチ初期表示
function setSwitch(){
    // 機械本体
    const ballswitch = new PIXI.Graphics(); // グラフィックオブジェクトの作成
    ballswitch.x = 120*ScaleMag;
    ballswitch.y = 70*ScaleMag;
    ballswitch.beginFill(0x333333);
    ballswitch.drawRect(0,0,150*ScaleMag,150*ScaleMag);
    ballswitch.endFill();
    app.stage.addChild(ballswitch);
    ballswitch.interactive = true;
    ballswitch.on("pointertap", addBall); // クリックしたら玉が表れる

    // ボール取り出し口1
    const ballexit = new PIXI.Graphics(); // グラフィックオブジェクトの作成
    ballexit.x = 320*ScaleMag;
    ballexit.y = 220*ScaleMag;
    ballexit.beginFill(0x333333);
    ballexit.drawRect(0,0,160*ScaleMag,80*ScaleMag);
    ballexit.endFill();
    app.stage.addChild(ballexit);

    // ボール取り出し口2
    const ballexit2 = new PIXI.Graphics(); // グラフィックオブジェクトの作成
    ballexit2.beginFill(0x333333);
    ballexit2.drawCircle(400*ScaleMag,ballexit.y,(ballexit.width/2)); // (中心x,中心y,半径)
    ballexit2.endFill();
    app.stage.addChild(ballexit2);

    // 文字(push)を表示
    const Push = new PIXI.Text("Push");
    Push.x = 165*ScaleMag;
    Push.y = 130*ScaleMag;
    Push.width *= ScaleMag;
    Push.height *= ScaleMag;
    Push.style.fill = "white";
    app.stage.addChild(Push);

    // 残り玉数を表示
    const restBall = new PIXI.Text("残り　   　球");
    restBall.x = ballexit.x;
    restBall.y = ballswitch.y;
    restBall.width *= ScaleMag;
    restBall.height *= ScaleMag;
    restBall.style.fill = "black";
    app.stage.addChild(restBall);

    // 最初の残り玉数を表示
    const meresBaFirst = new PIXI.Text(5); // 新しい数字を表示
    meresBaFirst.x = 395*ScaleMag;
    meresBaFirst.y = restBall.y;
    meresBaFirst.width *= ScaleMag;
    meresBaFirst.height *= ScaleMag;
    meresBaFirst.style.fill = "red";
    app.stage.addChild(meresBaFirst);
}

setSwitch(); // スイッチ初期表示

// containerの作成(ボール専用)
const container = new PIXI.Container();
app.stage.addChild(container);

// containerの作成(玉の分類メッセージ専用)
const contaDivball = new PIXI.Container();
app.stage.addChild(contaDivball);

// containerの作成(玉の分類メッセージ専用2)
const contaDivball2 = new PIXI.Container();
app.stage.addChild(contaDivball2);

// containerの作成(実験結果と確率専用)
const contaProbability = new PIXI.Container();
app.stage.addChild(contaProbability);

// containerの作成(残り玉数専用)
const contaRestBall = new PIXI.Container();
app.stage.addChild(contaRestBall);

//  containerの作成(結果を反映ボタン専用)
const contaResult = new PIXI.Container();
app.stage.addChild(contaResult);

//  containerの作成(スイッチ専用)
const contaSwitch = new PIXI.Container();
app.stage.addChild(contaSwitch);

// containerの作成(操作a)
const howPlay = new PIXI.Container();
app.stage.addChild(howPlay);

howPlay_easy(); // shortLectureを表示

// containerの作成(操作b)
const howPlay_b = new PIXI.Container();
app.stage.addChild(howPlay_b);


// 玉を追加する関数
function addBall(){
    shortLec = 0; // -1でないとshortlectureは表示されない
    howPlay_easy(); // shortlecture非表示にする

    if(sumSw == 0){ // 1個目の球
      showDivBallMes(); // 分類しよう!を表示
      let ballNo1 = new PIXI.Graphics(); // ボールを一つ作成
      let color = Math.floor(Math.random() * 4); // 0, 1, 2, 3の乱数で4色分け
      switch(color){ // 色によって場合分け
        case 0:
          Wball += 1; // 白色が出た回数を+1
          ballNo1.beginFill(0xffffff); // 白
          ballNo1.drawCircle(0,0,ballrad); // (中心x,中心y,半径)
          ballNo1.endFill();
          whichBoxNo1 = ballJudge(Wball); // この玉がL,Rのどちらの箱に入るべきかを判断
          break;
        case 1:
          Rball += 1; // 赤色が出た回数を+1
          ballNo1.beginFill(0xff9999); // 赤
          ballNo1.drawCircle(0,0,ballrad); // (中心x,中心y,半径)
          ballNo1.endFill();
          whichBoxNo1 = ballJudge(Rball);
          break;
        case 2:
          Yball += 1; // 黄色が出た回数を+1
          ballNo1.beginFill(0xffff00); // 黄
          ballNo1.drawCircle(0,0,ballrad); // (中心x,中心y,半径)
          ballNo1.endFill();
          whichBoxNo1 = ballJudge(Yball);
          break;
        case 3:
          Bball += 1; // 青色が出た回数を+1
          ballNo1.beginFill(0x00bfff); // 青
          ballNo1.drawCircle(0,0,ballrad); // (中心x,中心y,半径)
          ballNo1.endFill();
          whichBoxNo1 = ballJudge(Bball);
          break;
      }
      ballNo1.x = 400*ScaleMag; // ボールが出てくる場所
      ballNo1.y = 260*ScaleMag; // 同上
      container.addChild(ballNo1); // ボール専用のコンテナに玉を追加
      ballNo1.interactive = true; // アクティブに
      ballNo1.buttonMode = true; // カーソルを重ねると矢印が手の形に変わる
      // ドラッグ&ドロップの実装
      ballNo1.on('pointerdown',  onBallPointerDownNo1) // 押したとき
            .on('pointerup',   onBallPointerUpNo1); // 離したとき
      // 押したとき
      function onBallPointerDownNo1() {
        ballNo1.omajinai = true;
        ballNo1.on('pointermove', moveBallNo1);
      }
      // 話したとき
      function onBallPointerUpNo1(){
        ballNo1.omajinai = false;
        ballNo1.on('pointermove', moveBallNo1);
      }
      // ボールを動かす
      function moveBallNo1(e) {
        if(ballNo1.omajinai){ // 押しているときだけ
          let position = e.data.getLocalPosition(app.stage); // カーソルの位置を玉の位置と連動
          // 位置変更
          ballNo1.x = position.x;
          ballNo1.y = position.y;
          delDivBallMes(); // 分類しよう!の文字を非表示に
          showDivBallMes2(); // まだ分類ができてないよ!を表示
          if(whichBoxNo1 == 0){ // 箱Lに入るべきときは
            if(ballNo1.x > 90*ScaleMag & ballNo1.x < 310*ScaleMag & ballNo1.y > 390*ScaleMag & ballNo1.y < 470*ScaleMag){ // 箱Lの位置にあるなら
              delDivBallMes2(); // まだ分類できてないよ!を非表示
            }
          }else{ // 箱Rに入るべきときは
            if(ballNo1.x > 490*ScaleMag & ballNo1.x < 710*ScaleMag & ballNo1.y > 390*ScaleMag & ballNo1.y < 470*ScaleMag){ // 箱Rの位置にあるなら
              delDivBallMes2(); // まだ分類できてないよ!を非表示
            }
          }  
        }
      }
    }else if(sumSw == 1){ // 2個目の球
      showDivBallMes();
      let ballNo2 = new PIXI.Graphics();
      let color = Math.floor(Math.random() * 4); // 0, 1, 2, 3の乱数
      switch(color){
        case 0:
          Wball += 1;
          ballNo2.beginFill(0xffffff); // 白
          ballNo2.drawCircle(0,0,ballrad); // (中心x,中心y,半径)
          ballNo2.endFill();
          whichBoxNo2 = ballJudge(Wball);
          break;
        case 1:
          Rball += 1;
          ballNo2.beginFill(0xff9999); // 赤
          ballNo2.drawCircle(0,0,ballrad); // (中心x,中心y,半径)
          ballNo2.endFill();
          whichBoxNo2 = ballJudge(Rball);
          break;
        case 2:
          Yball += 1;
          ballNo2.beginFill(0xffff00); // 黄
          ballNo2.drawCircle(0,0,ballrad); // (中心x,中心y,半径)
          ballNo2.endFill();
          whichBoxNo2 = ballJudge(Yball);
          break;
        case 3:
          Bball += 1;
          ballNo2.beginFill(0x00bfff); // 青
          ballNo2.drawCircle(0,0,ballrad); // (中心x,中心y,半径)
          ballNo2.endFill();
          whichBoxNo2 = ballJudge(Bball);
          break;
      }
      ballNo2.x = 400*ScaleMag;
      ballNo2.y = 260*ScaleMag;
      container.addChild(ballNo2);
      ballNo2.interactive = true;
      ballNo2.buttonMode = true;
      ballNo2.on('pointerdown',  onBallPointerDownNo2) // 押したとき
            .on('pointerup',   onBallPointerUpNo2); // 離したとき
      function onBallPointerDownNo2() {
        ballNo2.omajinai = true;
        ballNo2.on('pointermove', moveBallNo2);
      }
      function onBallPointerUpNo2(){
        ballNo2.omajinai = false;
        ballNo2.on('pointermove', moveBallNo2);
      }
      function moveBallNo2(e) {
        if(ballNo2.omajinai){
          let position = e.data.getLocalPosition(app.stage);
          ballNo2.x = position.x;
          ballNo2.y = position.y;
          delDivBallMes();
          showDivBallMes2();
          if(whichBoxNo2 == 0){
            if(ballNo2.x > 90*ScaleMag & ballNo2.x < 310*ScaleMag & ballNo2.y > 390*ScaleMag & ballNo2.y < 470*ScaleMag){
              delDivBallMes2();
            }
          }else{
            if(ballNo2.x > 490*ScaleMag & ballNo2.x < 710*ScaleMag & ballNo2.y > 390*ScaleMag & ballNo2.y < 470*ScaleMag){
              delDivBallMes2();
            }
          }  
        }
      }
    }else if(sumSw == 2){ // 3個目の球
      showDivBallMes();
      let ballNo3 = new PIXI.Graphics();
      let color = Math.floor(Math.random() * 4); // 0, 1, 2, 3の乱数
      switch(color){
        case 0:
          Wball += 1;
          ballNo3.beginFill(0xffffff); // 白
          ballNo3.drawCircle(0,0,ballrad); // (中心x,中心y,半径)
          ballNo3.endFill();
          whichBoxNo3 = ballJudge(Wball);
          break;
        case 1:
          Rball += 1;
          ballNo3.beginFill(0xff9999); // 赤
          ballNo3.drawCircle(0,0,ballrad); // (中心x,中心y,半径)
          ballNo3.endFill();
          whichBoxNo3 = ballJudge(Rball);
          break;
        case 2:
          Yball += 1;
          ballNo3.beginFill(0xffff00); // 黄
          ballNo3.drawCircle(0,0,ballrad); // (中心x,中心y,半径)
          ballNo3.endFill();
          whichBoxNo3 = ballJudge(Yball);
          break;
        case 3:
          Bball += 1;
          ballNo3.beginFill(0x00bfff); // 青
          ballNo3.drawCircle(0,0,ballrad); // (中心x,中心y,半径)
          ballNo3.endFill();
          whichBoxNo3 = ballJudge(Bball);
          break;
      }
      ballNo3.x = 400*ScaleMag;
      ballNo3.y = 260*ScaleMag;
      container.addChild(ballNo3);
      ballNo3.interactive = true;
      ballNo3.buttonMode = true;
      ballNo3.on('pointerdown',  onBallPointerDownNo3) // 押したとき
            .on('pointerup',   onBallPointerUpNo3); // 離したとき
      function onBallPointerDownNo3() {
        ballNo3.omajinai = true;
        ballNo3.on('pointermove', moveBallNo3);
      }
      function onBallPointerUpNo3(){
        ballNo3.omajinai = false;
        ballNo3.on('pointermove', moveBallNo3);
      }
      function moveBallNo3(e) {
        if(ballNo3.omajinai){
          let position = e.data.getLocalPosition(app.stage);
          ballNo3.x = position.x;
          ballNo3.y = position.y;
          delDivBallMes();
          showDivBallMes2();
          if(whichBoxNo3 == 0){
            if(ballNo3.x > 90*ScaleMag & ballNo3.x < 310*ScaleMag & ballNo3.y > 390*ScaleMag & ballNo3.y < 470*ScaleMag){
              delDivBallMes2();
            }
          }else{
            if(ballNo3.x > 490*ScaleMag & ballNo3.x < 710*ScaleMag & ballNo3.y > 390*ScaleMag & ballNo3.y < 470*ScaleMag){
              delDivBallMes2();
            }
          }  
        }
      }
    }else if(sumSw == 3){ // 4個目の球
      showDivBallMes();
      let ballNo4 = new PIXI.Graphics();
      let color = Math.floor(Math.random() * 4); // 0, 1, 2, 3の乱数
      switch(color){
        case 0:
          Wball += 1;
          ballNo4.beginFill(0xffffff); // 白
          ballNo4.drawCircle(0,0,ballrad); // (中心x,中心y,半径)
          ballNo4.endFill();
          whichBoxNo4 = ballJudge(Wball);
          break;
        case 1:
          Rball += 1;
          ballNo4.beginFill(0xff9999); // 赤
          ballNo4.drawCircle(0,0,ballrad); // (中心x,中心y,半径)
          ballNo4.endFill();
          whichBoxNo4 = ballJudge(Rball);
          break;
        case 2:
          Yball += 1;
          ballNo4.beginFill(0xffff00); // 黄
          ballNo4.drawCircle(0,0,ballrad); // (中心x,中心y,半径)
          ballNo4.endFill();
          whichBoxNo4 = ballJudge(Yball);
          break;
        case 3:
          Bball += 1;
          ballNo4.beginFill(0x00bfff); // 青
          ballNo4.drawCircle(0,0,ballrad); // (中心x,中心y,半径)
          ballNo4.endFill();
          whichBoxNo4 = ballJudge(Bball);
          break;
      }
      ballNo4.x = 400*ScaleMag;
      ballNo4.y = 260*ScaleMag;
      container.addChild(ballNo4);
      ballNo4.interactive = true;
      ballNo4.buttonMode = true;
      ballNo4.on('pointerdown',  onBallPointerDownNo4) // 押したとき
            .on('pointerup',   onBallPointerUpNo4); // 離したとき
      function onBallPointerDownNo4() {
        ballNo4.omajinai = true;
        ballNo4.on('pointermove', moveBallNo4);
      }
      function onBallPointerUpNo4(){
        ballNo4.omajinai = false;
        ballNo4.on('pointermove', moveBallNo4);
      }
      function moveBallNo4(e) {
        if(ballNo4.omajinai){
          let position = e.data.getLocalPosition(app.stage);
          ballNo4.x = position.x;
          ballNo4.y = position.y;
          delDivBallMes();
          showDivBallMes2();
          if(whichBoxNo4 == 0){
            if(ballNo4.x > 90*ScaleMag & ballNo4.x < 310*ScaleMag & ballNo4.y > 390*ScaleMag & ballNo4.y < 470*ScaleMag){
              delDivBallMes2();
            }
          }else{
            if(ballNo4.x > 490*ScaleMag & ballNo4.x < 710*ScaleMag & ballNo4.y > 390*ScaleMag & ballNo4.y < 470*ScaleMag){
              delDivBallMes2();
            }
          }  
        }
      }
    }else if(sumSw == 4){ // 5個目の球
      howPlay_easy_b(); // [結果を反映]のレクチャーを表示
      showDivBallMes();
      let ballNo5 = new PIXI.Graphics();
      let color = Math.floor(Math.random() * 4); // 0, 1, 2, 3の乱数
      switch(color){
        case 0:
          Wball += 1;
          ballNo5.beginFill(0xffffff); // 白
          ballNo5.drawCircle(0,0,ballrad); // (中心x,中心y,半径)
          ballNo5.endFill();
          whichBoxNo5 = ballJudge(Wball);
          break;
        case 1:
          Rball += 1;
          ballNo5.beginFill(0xff9999); // 赤
          ballNo5.drawCircle(0,0,ballrad); // (中心x,中心y,半径)
          ballNo5.endFill();
          whichBoxNo5 = ballJudge(Rball);
          break;
        case 2:
          Yball += 1;
          ballNo5.beginFill(0xffff00); // 黄
          ballNo5.drawCircle(0,0,ballrad); // (中心x,中心y,半径)
          ballNo5.endFill();
          whichBoxNo5 = ballJudge(Yball);
          break;
        case 3:
          Bball += 1;
          ballNo5.beginFill(0x00bfff); // 青
          ballNo5.drawCircle(0,0,ballrad); // (中心x,中心y,半径)
          ballNo5.endFill();
          whichBoxNo5 = ballJudge(Bball);
          break;
      }
      ballNo5.x = 400*ScaleMag;
      ballNo5.y = 260*ScaleMag;
      container.addChild(ballNo5);
      ballNo5.interactive = true;
      ballNo5.buttonMode = true;
      ballNo5.on('pointerdown',  onBallPointerDownNo5) // 押したとき
            .on('pointerup',   onBallPointerUpNo5); // 離したとき
      function onBallPointerDownNo5() {
        ballNo5.omajinai = true;
        ballNo5.on('pointermove', moveBallNo5);
      }
      function onBallPointerUpNo5(){
        ballNo5.omajinai = false;
        ballNo5.on('pointermove', moveBallNo5);
      }
      function moveBallNo5(e) {
        if(ballNo5.omajinai){
          let position = e.data.getLocalPosition(app.stage);
          ballNo5.x = position.x;
          ballNo5.y = position.y;
          delDivBallMes();
          showDivBallMes2();
          if(whichBoxNo5 == 0){
            if(ballNo5.x > 90*ScaleMag & ballNo5.x < 310*ScaleMag & ballNo5.y > 390*ScaleMag & ballNo5.y < 470*ScaleMag){
              delDivBallMes2();
            }
          }else{
            if(ballNo5.x > 490*ScaleMag & ballNo5.x < 710*ScaleMag & ballNo5.y > 390*ScaleMag & ballNo5.y < 470*ScaleMag){
              delDivBallMes2();
            }
          }  
        }
      }
    }
    sumSw = switchCounter(sumSw);
}
