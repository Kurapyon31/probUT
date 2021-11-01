// 「padding: 値;」とすると、上下左右すべての方向にその大きさの余白が追加されます
        // 「padding-top: 値;」などとすると、その方向のみに余白が追加されます
        // padding は border の内側の余白、margin は border の外側の余白
        //<button class="btn">リセット</button> がhead に入っていた元は 


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
        const ballrad = 40; // ボールの半径
        
        let shortLec = -1; // 最初の「操作」のレクチャー
        let shortLec_b = -1; // 最初の「結果を反映」のレクチャー

        const move_BoxAndPush = 50; // 機械と箱の初期位置をどれだけ上にずらすか(アレンジ用)

        // pixi.jsのアプリケーションを作成
        const width = 800;
        const height = 800;
        const widRatio = 0.9;
        const heiRatio = 0.95;

        const app = new PIXI.Application({
          width: width,
          height: height,
          backgroundColor: 0x556b2f, // 背景色
          //view: document.querySelector('canvas'), //スクロール対応★
        });
  
        /*
        // スクロールできるようにする
        app.renderer.plugins.interaction.autoPreventDefault = false;
        app.renderer.view.style.touchAction = 'auto';
        */

        // bodyにpixi.jsのview(ステージ)を追加する
        document.body.appendChild(app.view);

        /*
        // 文字(実験して確かめよう!)を表示
        const message = new PIXI.Text("[Push]を押して球を箱に分け入れよう!");
        message.x = 10;
        message.y = 10;
        message.style.fill = "white";
        app.stage.addChild(message);
        message.interactive = true;
        message.on("pointertap", () => (message.style.fill = "0xF0E68C")); */

        // 文字(Lに4色入った回数:)を表示
        const mesPh = new PIXI.Text("Lに4色入った回数:");
        mesPh.x = 520;
        mesPh.y = 10;
        mesPh.style.fill = "white";
        app.stage.addChild(mesPh);

        // 文字(実験を行った回数:)を表示
        const mesEx = new PIXI.Text("実験を行った回数:");
        mesEx.x = 520;
        mesEx.y = 50;
        mesEx.style.fill = "white";
        app.stage.addChild(mesEx);

        // 文字(実験による確率)を表示
        const mesPro = new PIXI.Text("実験による確率:");
        mesPro.x = 520;
        mesPro.y = 100;
        mesPro.style.fill = "white";
        app.stage.addChild(mesPro);

        // 線(確率の分数用)を表示
        const BunsuLine = new PIXI.Graphics();
        BunsuLine.lineStyle(5,0xffffff).moveTo(550,200).lineTo(620,200);
        app.stage.addChild(BunsuLine);

        // ＝(確率)を表示
        const BunsuEqual = new PIXI.Text("=");
        BunsuEqual.x = 640;
        BunsuEqual.y = 185;
        BunsuEqual.style.fill = "white";
        app.stage.addChild(BunsuEqual);

        // 線(確率を囲う用)を表示
        const ProbSquare = new PIXI.Graphics();
        ProbSquare.lineStyle(3,0xffffff).moveTo(525,140).lineTo(525,270);
        ProbSquare.lineStyle(3,0xffffff).moveTo(525,270).lineTo(785,270);
        ProbSquare.lineStyle(3,0xffffff).moveTo(785,270).lineTo(785,120);
        ProbSquare.lineStyle(3,0xffffff).moveTo(785,120).lineTo(730,120);
        app.stage.addChild(ProbSquare);
        
        // 結果(当該事象が起こった測定値)を表示
        if(sumPh == 0){
          let mesumPh = new PIXI.Text(sumPh);
          mesumPh.x = 750;
          mesumPh.y = 10;
          mesumPh.style.fill = "yellow";
          app.stage.addChild(mesumPh);
        }
        // 結果(実験を行った回数)を表示
        if(sumEx == 0){
          const mesumEx = new PIXI.Text(sumEx);
          mesumEx.x = 750;
          mesumEx.y = 50;
          mesumEx.style.fill = "yellow";
          app.stage.addChild(mesumEx);
        }

        // 合計実験回数を表示
        function showsumEx(sumEx){
          sumEx += 1;
          const sumExcover = new PIXI.Graphics(); // その前の数字を塗りつぶし
          sumExcover.x = 750;
          sumExcover.y = 50;
          sumExcover.beginFill(0x556b2f);
          sumExcover.drawRect(0,0,100,30);
          sumExcover.endFill();
          app.stage.addChild(sumExcover);
          //
          const mesumEx = new PIXI.Text(sumEx); // 新しい数字を表示
          mesumEx.x = 750;
          mesumEx.y = 50;
          mesumEx.style.fill = "yellow";
          app.stage.addChild(mesumEx);
          return sumEx;
        }

        // 当該事象の起こった回数を表示
        function showsumPh(numberBoxL,sumPh){
          if(numberBoxL == 4){ // 箱Lに入った玉が4個(4色)のときのみ
            sumPh += 1; // 当該事象が起こった回数を追加

            const sumPhcover = new PIXI.Graphics(); // その前の数字を塗りつぶし
            sumPhcover.x = 750;
            sumPhcover.y = 10;
            sumPhcover.beginFill(0x556b2f);
            sumPhcover.drawRect(0,0,100,30);
            sumPhcover.endFill();
            app.stage.addChild(sumPhcover);
            //
            let mesumPh = new PIXI.Text(sumPh); // 新しい数字を表示
            mesumPh.x = 750;
            mesumPh.y = 10;
            mesumPh.style.fill = "yellow";
            app.stage.addChild(mesumPh);
          }
          return sumPh;
        }

        
        // 残り玉数を表示
        function showrestBall(sumSw,e){
          const resBacover = new PIXI.Graphics(); // その前の数字を塗りつぶし
          resBacover.x = restBall.x + 75;
          resBacover.y = restBall.y;
          resBacover.beginFill(0xffffff);
          resBacover.drawRect(0,0,30,30);
          resBacover.endFill();
          app.stage.addChild(resBacover);
          
          const meresBa = new PIXI.Text(5-sumSw); // 新しい数字を表示
          meresBa.x = restBall.x + 75;
          meresBa.y = restBall.y;
          meresBa.style.fill = "red";
          app.stage.addChild(meresBa);
        }


        // 箱Lと箱Rの初期設定
        function setBox(){
          // 箱Lの枠
          const leftBoxEdge = new PIXI.Graphics(); // グラフィックオブジェクトの作成
          //
          leftBoxEdge.x = 40;          // 横座標の設定
          leftBoxEdge.y = 390 - move_BoxAndPush;          // 縦座標の設定
          leftBoxEdge.beginFill(0xe6cf8a);    // 指定の色で塗りつぶし開始準備
          //leftBoxEdge.drawRect(0,0,320,270);  // 矩形を描写する
          leftBoxEdge.drawRect(0,0,320,180);  // 矩形を描写する★
          leftBoxEdge.endFill();              // 塗りつぶしを完了する
          app.stage.addChild(leftBoxEdge); // ステージに追加する

          // 箱L
          const leftBox = new PIXI.Graphics(); // グラフィックオブジェクトの作成
          //
          leftBox.x = leftBoxEdge.x + 10;          // 横座標の設定
          leftBox.y = leftBoxEdge.y + 10;          // 縦座標の設定
          leftBox.beginFill(0x66500f);    // 指定の色で塗りつぶし開始準備
          leftBox.drawRect(0,0,leftBoxEdge.width - 20,leftBoxEdge.height - 20);  // 矩形を描写する
          leftBox.endFill();              // 塗りつぶしを完了する
          app.stage.addChild(leftBox); // ステージに追加する
          leftBox.interactive = true;　// インタラクティブをTrueに
          //leftBox.on("pointertap", changecolor); // 色変換

          // 箱Lふた
          const BoxLcover = new PIXI.Graphics();
          BoxLcover.lineStyle(10,0xe6cf8a).moveTo(leftBoxEdge.x,leftBoxEdge.y).lineTo(leftBoxEdge.x-30,leftBoxEdge.y+170);
          BoxLcover.lineStyle(10,0xe6cf8a).moveTo(leftBoxEdge.x+leftBoxEdge.width,leftBoxEdge.y).lineTo(leftBoxEdge.x+leftBoxEdge.width+30,leftBoxEdge.y+170);
          BoxLcover.lineStyle(20,0x556b2f).moveTo(leftBoxEdge.x+10,leftBoxEdge.y).lineTo(leftBoxEdge.x+leftBoxEdge.width-10,leftBoxEdge.y);
          app.stage.addChild(BoxLcover);

          // 箱Rの枠
          const rightBoxEdge = new PIXI.Graphics(); // グラフィックオブジェクトの作成
          //
          rightBoxEdge.x = 440;          // 横座標の設定
          rightBoxEdge.y = 390 - move_BoxAndPush;          // 縦座標の設定
          rightBoxEdge.beginFill(0xe6cf8a);    // 指定の色で塗りつぶし開始準備
          //rightBoxEdge.drawRect(0,0,320,270);  // 矩形を描写する
          rightBoxEdge.drawRect(0,0,320,180);  // 矩形を描写する★
          rightBoxEdge.endFill();              // 塗りつぶしを完了する
          app.stage.addChild(rightBoxEdge); // ステージに追加する

          // 箱R
          const rightBox = new PIXI.Graphics(); // グラフィックオブジェクトの作成
          //
          rightBox.x = rightBoxEdge.x + 10;          // 横座標の設定
          rightBox.y = rightBoxEdge.y + 10;          // 縦座標の設定
          rightBox.beginFill(0x66500f);    // 指定の色で塗りつぶし開始準備
          rightBox.drawRect(0,0,rightBoxEdge.width - 20,rightBoxEdge.height - 20);  // 矩形を描写する
          rightBox.endFill();              // 塗りつぶしを完了する
          app.stage.addChild(rightBox); // ステージに追加する
          rightBox.interactive = true;　// インタラクティブをTrueに

          // 箱Rふた
          const BoxRcover = new PIXI.Graphics();
          BoxRcover.lineStyle(10,0xe6cf8a).moveTo(rightBoxEdge.x,rightBoxEdge.y).lineTo(rightBoxEdge.x-30,rightBoxEdge.y+170);
          BoxRcover.lineStyle(10,0xe6cf8a).moveTo(rightBoxEdge.x+rightBoxEdge.width,rightBoxEdge.y).lineTo(rightBoxEdge.x+rightBoxEdge.width+30,rightBoxEdge.y+170);
          BoxRcover.lineStyle(20,0x556b2f).moveTo(rightBoxEdge.x+10,rightBoxEdge.y).lineTo(rightBoxEdge.x+rightBoxEdge.width-10,rightBoxEdge.y);
          app.stage.addChild(BoxRcover);

          // 文字(箱L)を表示
          const nameL = new PIXI.Text("L");
          nameL.x = 60;
          nameL.y = 400 - move_BoxAndPush;
          nameL.style.fill = "white";
          app.stage.addChild(nameL);

          // 文字(箱R)を表示
          const nameR = new PIXI.Text("R");
          nameR.x = 460;
          nameR.y = 400 - move_BoxAndPush;
          nameR.style.fill = "white";
          app.stage.addChild(nameR);
        }

        setBox(); // 箱Lと箱Rを表示

        // 文字(正しい箱に分類しよう)を表示
        function showDivBallMes(){
          const mesDivball = new PIXI.Text("条件に従ってLまたはRの箱に玉を入れよう！");
          mesDivball.x = 120;
          mesDivball.y = 550;
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
          mesDivball2.x = 50;
          mesDivball2.y = 550;
          mesDivball2.style.fill = "yellow";
          contaDivball2.addChild(mesDivball2);

          const mesDivball3 = new PIXI.Text("または");
          mesDivball3.x = 300;
          mesDivball3.y = 550;
          mesDivball3.style.fill = "white";
          contaDivball2.addChild(mesDivball3);

          const mesDivball4 = new PIXI.Text("箱が間違っている");
          mesDivball4.x = 400;
          mesDivball4.y = 550;
          mesDivball4.style.fill = "yellow";
          contaDivball2.addChild(mesDivball4);

          const mesDivball5 = new PIXI.Text("状態だよ!");
          mesDivball5.x = 630;
          mesDivball5.y = 550;
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
      
        ////////////////////////////////
        // 理論値と比較を押したときに起こる関数
        function showProb(){
          // containerの作成(確率変遷専用)
          const probTranslate = new PIXI.Container();
          app.stage.addChild(probTranslate);
          // 背景
          const probTransBack = new PIXI.Graphics();
          probTransBack.x = 0;          // 横座標の設定
          probTransBack.y = 0;          // 縦座標の設定
          probTransBack.beginFill(0x696969);    // 指定の色で塗りつぶし開始準備
          probTransBack.drawRect(0,0,800,800);  // 矩形を描写する
          probTransBack.endFill();              // 塗りつぶしを完了する
          probTranslate.addChild(probTransBack); // ステージに追加する

          // 戻るボタン
          const testPic = new PIXI.Sprite.from('experiment_backToEx.png');
          testPic.x = 15;          // 横座標の設定
          testPic.y = 15;          // 縦座標の設定
          testPic.width = 210;
          testPic.height = 110;
          probTranslate.addChild(testPic);
          testPic.interactive = true; // アクティブに
          testPic.buttonMode = true; // カーソルを重ねると矢印が手の形に変わる
          testPic.on("pointertap", BackToExperiment); // クリックしたら実験に戻る

          // タイトル
          const testTitle = new PIXI.Sprite.from('experiment_theoryTitle.png');
          testTitle.x = testPic.x + testPic.width + 10;
          testTitle.y = testPic.y;
          testTitle.width = 800 - testPic.x - testPic.width - 10;
          testTitle.height = 150;
          probTranslate.addChild(testTitle);

          // グラフ軸
          const graphBack = new PIXI.Sprite.from('probGraph_2.png'); // どっちにする?
          graphBack.x = 0;
          graphBack.y = testPic.y + testPic.height + 5;
          graphBack.width = 800;
          graphBack.height = 500;
          probTranslate.addChild(graphBack);

          // 実験回数33回ごとにプロットの縮尺を変える
          const plotsize = Math.ceil(probTrans.length/33);

          // 実験回数0回目は確率0
          const zahogime_first = new PIXI.Graphics();
          zahogime_first.x = 30;
          zahogime_first.y = 600;
          zahogime_first.beginFill(0xff9999);
          zahogime_first.drawRect(0,0,(10/plotsize),(10/plotsize));
          zahogime_first.endFill();
          probTranslate.addChild(zahogime_first);

          // 実験回数軸までの線
          const conectPlot_last = new PIXI.Graphics();
          conectPlot_last.lineStyle(2,0xffffff).moveTo(30 + (15/plotsize)*(probTrans.length) + (5/plotsize),600 - 415*probTrans[(probTrans.length)-1] + (5/plotsize)).lineTo(30 + (15/plotsize)*(probTrans.length) + (5/plotsize),600);
          probTranslate.addChild(conectPlot_last);

          // 実験回数を表示
          const messumEx = new PIXI.Text(sumEx);
          messumEx.x = 25 + (15/plotsize)*(probTrans.length) + (5/plotsize);
          messumEx.y = 610;
          messumEx.style.fill = "white";
          probTranslate.addChild(messumEx);

          // 確率を表示
          // 分母を表示
          const Bunbo_trans = new PIXI.Text(sumEx);
          Bunbo_trans.x = 45 + (15/plotsize)*(probTrans.length) + (5/plotsize);
          Bunbo_trans.y = 580 - 415*probTrans[probTrans.length-1];
          Bunbo_trans.style.fill = 0xff9999;
          probTranslate.addChild(Bunbo_trans);

          // 分子を表示
          const Bunshi_trans = new PIXI.Text(sumPh);
          Bunshi_trans.x = 45 + (15/plotsize)*(probTrans.length) + (5/plotsize);
          Bunshi_trans.y = 550 - 415*probTrans[probTrans.length-1];
          Bunshi_trans.style.fill = 0xff9999;
          probTranslate.addChild(Bunshi_trans);

          // 分数の線を表示
          const Bunsuline_trans = new PIXI.Graphics();
          Bunsuline_trans.lineStyle(2,0xff9999).moveTo(45 + (15/plotsize)*(probTrans.length) + (5/plotsize),580 - 415*probTrans[probTrans.length-1]).lineTo(70 + (15/plotsize)*(probTrans.length) + (5/plotsize),580 - 415*probTrans[probTrans.length-1]);
          probTranslate.addChild(Bunsuline_trans);

          // 小数で表示
          const prob_trans = new PIXI.Text("(=" + Math.round((sumPh/sumEx)*100)/100 + ")"); // 小数点第2位で四捨五入
          prob_trans.x = 86 + (15/plotsize)*(probTrans.length) + (5/plotsize);
          prob_trans.y = 565 - 415*probTrans[probTrans.length-1];
          prob_trans.style.fill = 0xff9999;
          probTranslate.addChild(prob_trans);

          // (0,0)と1点目を結ぶ線
          const conectPlot_first = new PIXI.Graphics();
          conectPlot_first.lineStyle(3,0xff9999).moveTo(30 + (5/plotsize),600 + (5/plotsize)).lineTo(30 + (20/plotsize),600 - 415*probTrans[0] + (5/plotsize));
          probTranslate.addChild(conectPlot_first);

          // 確率の推移のプロット
          for(i=0;i<probTrans.length;i++){ // 格納されている確率の個数分プロット
            const zahogime = new PIXI.Graphics();
            zahogime.x = 30 + (15/plotsize)*(i+1);
            zahogime.y = 600 - 415*probTrans[i];
            zahogime.beginFill(0xff9999);
            zahogime.drawRect(0,0,(10/plotsize),(10/plotsize));
            zahogime.endFill();
            probTranslate.addChild(zahogime);

            const conectPlot = new PIXI.Graphics();
            conectPlot.lineStyle(2,0xff9999).moveTo(30 + (15/plotsize)*i + (5/plotsize),600 - 415*probTrans[i-1] + (5/plotsize)).lineTo(30 + (15/plotsize)*(i+1) + (5/plotsize),600 - 415*probTrans[i] + (5/plotsize));
            probTranslate.addChild(conectPlot);
          }
          // 実験に戻る(確率変遷を消す)
          function BackToExperiment(){
            probTranslate.removeChildren();
          }
        }

        //////////////////////////////

        // shortLectureを表示
        function howPlay_easy(){
          if(shortLec==-1){
            const instGreenCover = new PIXI.Graphics();
            instGreenCover.x = mesPh.x;
            instGreenCover.y = mesPh.y;
            instGreenCover.beginFill(0x556b2f);
            instGreenCover.drawRect(0,0,800-mesPh.x,300);
            howPlay.addChild(instGreenCover);

            const instPic1 = new PIXI.Sprite.from('ex_inst1_new.png');
            instPic1.x = 150;          // 横座標の設定
            instPic1.y = 220 - move_BoxAndPush;          // 縦座標の設定
            instPic1.width = 140;
            instPic1.height = 90;
            howPlay.addChild(instPic1);
    
            const instPic2 = new PIXI.Sprite.from('ex_inst2_new.png');
            instPic2.x = 420;          // 横座標の設定
            instPic2.y = 280 - move_BoxAndPush;          // 縦座標の設定
            instPic2.width = 300;
            instPic2.height = 80;
            howPlay.addChild(instPic2);

            const instPic3 = new PIXI.Sprite.from('ex_inst3_new.png');
            instPic3.x = 75;          // 横座標の設定
            instPic3.y = 550 - move_BoxAndPush;          // 縦座標の設定
            instPic3.width = 415;
            instPic3.height = 100;
            howPlay.addChild(instPic3);

            const instPic4 = new PIXI.Sprite.from('ex_inst4_new.png');
            instPic4.x = 500;          // 横座標の設定
            instPic4.y = 510 - move_BoxAndPush;          // 縦座標の設定
            instPic4.width = 260;
            instPic4.height = 120;
            howPlay.addChild(instPic4);

            const instPic5 = new PIXI.Sprite.from('ex_inst5_new.png');
            instPic5.x = 500;          // 横座標の設定
            instPic5.y = 10;          // 縦座標の設定
            instPic5.width = 300;
            instPic5.height = 180;
            howPlay.addChild(instPic5);
          }else{
            howPlay.removeChildren();
          }
        }

        // [結果を反映]のshortLectureを表示
        function howPlay_easy_b(){
          if(shortLec_b==-1){
            const instPic6 = new PIXI.Sprite.from('ex_inst6_new.png');
            instPic6.x = 100;          // 横座標の設定
            instPic6.y = 245 - move_BoxAndPush;          // 縦座標の設定
            instPic6.width = 230;
            instPic6.height = 140;
            howPlay_b.addChild(instPic6);
          }else{
            howPlay_b.removeChildren();
          }
        }

        // 玉を追加する関数
        function addBall(){
          shortLec = 0; // -1でないとshortlectureは表示されない
          howPlay_easy(); // shortlecture非表示に
          if(sumSw == 0){
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
            ballNo1.x = ballexit.x + (ballexit.width/2); // ボールが出てくる場所
            ballNo1.y = ballexit.y + (ballexit.height/2); // 同上
            container.addChild(ballNo1); // ボール専用のコンテナに玉を追加
            ballNo1.interactive = true; // アクティブに
            ballNo1.buttonMode = true; // カーソルを重ねると矢印が手の形に変わる
            // ドラッグ&ドロップの実装
            ballNo1.on('pointerdown',  onBallPointerDownNo1) // 押したとき
                  .on('pointerup',   onBallPointerUpNo1); // 離したとき
            // 
            function onBallPointerDownNo1() { // 押したとき用
              //app.renderer.plugins.interaction.autoPreventDefault = true;
              //app.renderer.view.style.touchAction = 'auto';
              ballNo1.omajinai = true;
              ballNo1.on('pointermove', moveBallNo1);
            }
            function onBallPointerUpNo1(){ // 離したとき用
              //app.renderer.plugins.interaction.autoPreventDefault = false;
              //app.renderer.view.style.touchAction = 'auto';
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
                  if(ballNo1.x > 90 & ballNo1.x < 310 & ballNo1.y > 390 & ballNo1.y < 470){ // 箱Lの位置にあるなら
                    delDivBallMes2(); // まだ分類できてないよ!を非表示
                  }
                }else{ // 箱Rに入るべきときは
                  if(ballNo1.x > 490 & ballNo1.x < 710 & ballNo1.y > 390 & ballNo1.y < 470){ // 箱Rの位置にあるなら
                    delDivBallMes2(); // まだ分類できてないよ!を非表示
                  }
                }  
              }
            }
          // 以下2個目～5個目のボールに対して全く同じ実装を書いている
          }else if(sumSw == 1){
            howPlay_easy(); ////////////////////////////////////////////✧
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
            ballNo2.x = ballexit.x + (ballexit.width/2);
            ballNo2.y = ballexit.y + (ballexit.height/2);
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
                  if(ballNo2.x > 90 & ballNo2.x < 310 & ballNo2.y > 390 & ballNo2.y < 470){
                    delDivBallMes2();
                  }
                }else{
                  if(ballNo2.x > 490 & ballNo2.x < 710 & ballNo2.y > 390 & ballNo2.y < 470){
                    delDivBallMes2();
                  }
                }  
              }
            }
          }else if(sumSw == 2){
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
            ballNo3.x = ballexit.x + (ballexit.width/2);
            ballNo3.y = ballexit.y + (ballexit.height/2);
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
                  if(ballNo3.x > 90 & ballNo3.x < 310 & ballNo3.y > 390 & ballNo3.y < 470){
                    delDivBallMes2();
                  }
                }else{
                  if(ballNo3.x > 490 & ballNo3.x < 710 & ballNo3.y > 390 & ballNo3.y < 470){
                    delDivBallMes2();
                  }
                }  
              }
            }
          }else if(sumSw == 3){
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
            ballNo4.x = ballexit.x + (ballexit.width/2);
            ballNo4.y = ballexit.y + (ballexit.height/2);
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
                  if(ballNo4.x > 90 & ballNo4.x < 310 & ballNo4.y > 390 & ballNo4.y < 470){
                    delDivBallMes2();
                  }
                }else{
                  if(ballNo4.x > 490 & ballNo4.x < 710 & ballNo4.y > 390 & ballNo4.y < 470){
                    delDivBallMes2();
                  }
                }  
              }
            }
          }else if(sumSw == 4){
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
            ballNo5.x = ballexit.x + (ballexit.width/2);
            ballNo5.y = ballexit.y + (ballexit.height/2);
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
                  if(ballNo5.x > 90 & ballNo5.x < 310 & ballNo5.y > 390 & ballNo5.y < 470){
                    delDivBallMes2();
                  }
                }else{
                  if(ballNo5.x > 490 & ballNo5.x < 710 & ballNo5.y > 390 & ballNo5.y < 470){
                    delDivBallMes2();
                  }
                }  
              }
            }
          }
          sumSw = switchCounter(sumSw);
        }
        
        // 玉を出す機械
        const machine = new PIXI.Graphics(); // グラフィックオブジェクトの作成
        //
        machine.x = 100;          // 横座標の設定
        machine.y = 100 - move_BoxAndPush;          // 縦座標の設定
        machine.beginFill(0xffffff);    // 指定の色で塗りつぶし開始準備
        machine.drawRect(0,0,400,250);  // 矩形を描写する
        machine.endFill();              // 塗りつぶしを完了する
        app.stage.addChild(machine); // ステージに追加する
        machine.interactive = true; // インタラクティブをTrueに

        // 反映ボタンからスイッチへ表示を変更する関数
        // 結果を反映ボタンを押したときを記述する関数
        function showBallSwitch(){
          shortLec_b = 0; // 次からは表示されないように
          howPlay_easy_b();
          contaResult.removeChildren();
          const ballswitch = new PIXI.Graphics(); // グラフィックオブジェクトの作成
          ballswitch.x = 120;
          ballswitch.y = 120 - move_BoxAndPush;
          ballswitch.beginFill(0x333333);
          ballswitch.drawRect(0,0,150,150);
          ballswitch.endFill();
          contaSwitch.addChild(ballswitch);
          ballswitch.interactive = true;
          ballswitch.on("pointertap", addBall); // クリックしたら玉が表れる

          // 文字(push)を表示
          const Push = new PIXI.Text("Push");
          Push.x = ballswitch.x + (ballswitch.width/2) -30;
          Push.y = ballswitch.y + (ballswitch.height/2) -15;
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
        function showResultButtun(){
          contaSwitch.removeChildren();
          const showResult = new PIXI.Graphics(); // グラフィックオブジェクトの作成
          //
          showResult.x = 120;
          showResult.y = 120 - move_BoxAndPush;
          showResult.beginFill(0x333333);
          showResult.drawRect(0,0,150,150);
          showResult.endFill();
          contaResult.addChild(showResult);
          showResult.interactive = true;
          //showResult.on("pointertap", addBall); // クリックしたら玉が表れる
          showResult.on("pointertap", showBallSwitch); // クリックしたら再度Pushボタンが表示

          // 文字(結果を反映)を表示
          const reflectResult = new PIXI.Text("結果を反映");
          reflectResult.x = ballswitch.x + (ballswitch.width/2) -65;
          reflectResult.y = ballswitch.y + (ballswitch.height/2) -40;
          reflectResult.style.fill = "white";
          contaResult.addChild(reflectResult);

          // 文字(実験を続ける)を表示
          const reflectResult2 = new PIXI.Text("(実験続行)");
          reflectResult2.x = ballswitch.x + (ballswitch.width/2) -60;
          reflectResult2.y = ballswitch.y + (ballswitch.height/2) +10;
          reflectResult2.style.fill = "white";
          contaResult.addChild(reflectResult2);
        }

        // 実測値を表示するための関数
        function showProbability(sumEx,sumPh){
          contaProbability.removeChildren();
          
          // 分母を表示
          const Bunbo = new PIXI.Text(sumEx);
          Bunbo.x = 560;
          Bunbo.y = 210;
          Bunbo.style.fill = "yellow";
          Bunbo.width *= 1.7;
          Bunbo.height *= 1.7;
          contaProbability.addChild(Bunbo);

          // 分子を表示
          const Bunshi = new PIXI.Text(sumPh);
          Bunshi.x = 560;
          Bunshi.y = 140;
          Bunshi.style.fill = "yellow";
          Bunshi.width *= 1.7;
          Bunshi.height *= 1.7;
          contaProbability.addChild(Bunshi);

          // 小数で表示
          const prob = new PIXI.Text(Math.round((sumPh/sumEx)*100)/100); // 小数点第2位で四捨五入
          prob.x = BunsuEqual.x + 40;
          prob.y = BunsuEqual.y - 12;
          prob.style.fill = 0xff9999;
          prob.width *= 1.7;
          prob.height *= 1.7;
          contaProbability.addChild(prob);

          // 確率を格納
          probTrans.push(Math.round((sumPh/sumEx)*100)/100);
        }

        // スイッチ初期表示
        const ballswitch = new PIXI.Graphics(); // グラフィックオブジェクトの作成
        //
        ballswitch.x = 120;
        ballswitch.y = 120 - move_BoxAndPush;
        ballswitch.beginFill(0x333333);
        ballswitch.drawRect(0,0,150,150);
        ballswitch.endFill();
        app.stage.addChild(ballswitch);
        ballswitch.interactive = true;
        ballswitch.on("pointertap", addBall); // クリックしたら玉が表れる
        
        // ボール取り出し口1
        const ballexit = new PIXI.Graphics(); // グラフィックオブジェクトの作成
        //
        ballexit.x = 320;
        ballexit.y = 270 - move_BoxAndPush;
        ballexit.beginFill(0x333333);
        ballexit.drawRect(0,0,160,80);
        ballexit.endFill();
        app.stage.addChild(ballexit);
        ballexit.interactive = true;

        // ボール取り出し口2
        const ballexit2 = new PIXI.Graphics(); // グラフィックオブジェクトの作成
        //
        ballexit2.beginFill(0x333333);
        ballexit2.drawCircle(ballexit.x + (ballexit.width/2),ballexit.y,(ballexit.width/2)); // (中心x,中心y,半径)
        ballexit2.endFill();
        app.stage.addChild(ballexit2);
        ballexit2.interactive = true;

        // 文字(push)を表示
        const Push = new PIXI.Text("Push");
        Push.x = ballswitch.x + (ballswitch.width/2) -30;
        Push.y = ballswitch.y + (ballswitch.height/2) -15;
        Push.style.fill = "white";
        app.stage.addChild(Push);

        // 残り玉数を表示
        const restBall = new PIXI.Text("残り　   　球");
        restBall.x = ballexit.x;
        restBall.y = ballswitch.y;
        restBall.style.fill = "black";
        app.stage.addChild(restBall);

        // 最初の残り玉数を表示
        const meresBaFirst = new PIXI.Text(5); // 新しい数字を表示
        meresBaFirst.x = restBall.x + 75;
        meresBaFirst.y = restBall.y;
        meresBaFirst.style.fill = "red";
        app.stage.addChild(meresBaFirst);

        // 分類のルール
        //const experiment_rulePic = new PIXI.Sprite.from('experiment_rule.png');
        const experiment_rulePic = new PIXI.Sprite.from('experiment_rule_new.png');
        experiment_rulePic.x = 5;          // 横座標の設定
        experiment_rulePic.y = 600;          // 縦座標の設定
        experiment_rulePic.width = 790;
        experiment_rulePic.height = 100;
        app.stage.addChild(experiment_rulePic);

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

        /*
        // 残り玉数の一番最初だけ表示
        const meresBa_first = new PIXI.Text(0); // 新しい数字を表示
        meresBa_first = restBall.x + 75;
        meresBa_first = restBall.y;
        meresBa_first.fill = "red";
        contaRestBall.addChild(meresBa_first);*/
        
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
