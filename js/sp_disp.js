//変数定義
var $date_from;
var $date_to;
var $tokui_from;
var $tokui_to;
var $tanto_from;
var $tanto_to;
var $start_page=1;
var $page_id=1;     
$(function(){
   //ページ選択ボタンが押された
   //$(document).on("click", "#page1", function(){
   //   console.log("page1click");   
   //}); 
   $(document).on("click", ".pageno", function(){
      // ページ選択ボタンクリック
      var $id =  $(this).attr("id");    //何番目のボタンが押されたか？
      console.log($id + "click"); 
      $page_id = $id.substr(4);
      getDataFromServer(); 
      getPageFromServer();
   });
   $(document).on('click',".pageafter", function(){
      // ページ選択≫ボタンクリック
      console.log("pageafterclick");
      $start_page++;
      $page_id=($start_page - 1) * 5 + 1;
      getDataFromServer(); 
      getPageFromServer();
   });
   $(document).on('click',".pagebefore", function(){
      // ページ選択≪ボタンクリック
      console.log("pageafterclick");
      $page_id=($start_page - 1) * 5;
      $start_page--;
      getDataFromServer(); 
      getPageFromServer();
   });
   
   $(document).on('click','tr',function(){
      var table = document.getElementById('datagrid');
      var i = $(this).index('tr');
      console.log('click'+i+'行目');
      
      //強制的に変更ボタンを押す
      btn = document.getElementById('sub'+i);
      btn.click();

      //document.formdisp.sub1.click();
      //window.location.href = 'input.php?renban=' + renban; // 通常の遷移
      //window.open('input.php?renban=' + renban); // 新しいタブを開き、ページを表示
      
   });
   
});
//-------------------------------------------------------------------------------
//    サーバーから対象データを取得する
//-------------------------------------------------------------------------------
function getDataFromServer(){
   $.ajax({
      url: "getdata.php",
      type: "POST",
      dataType: "json",
      data: {
         'date_from': $date_from,
         'date_to': $date_to,
         'tokui_from': $tokui_from,
         'tokui_to': $tokui_to,
         'tanto_from': $tanto_from,
         'tanto_to': $tanto_to,
         'page_id':  $page_id
      }
   })
   .done(function(data){
      // tableの中身を削除
      // table要素を取得
      var table = document.getElementById('datagrid');
      var tsiz=table.rows.length;
      for(var j=1; j<tsiz; j++) {
         // tbody要素にある最後の行（tr要素）を削除
         table.tBodies[0].deleteRow(-1);
      }
      var $gyo=0;
      $.each(data,function(id,tdata){
         for(var j=1; j<10; j++) {
            if(tdata[j] == '') {tdata[j]="<br>"}
         }
         $gyo++;
         var $item;
         $item = "<tr>";
         $item = $item + "<td>" + tdata[0] + " " + tdata[1].substr(0,5) + "( " + tdata[2] + ")" + " " + tdata[3] + "</td>";
         $item = $item + "<td><input type='hidden' name='renban" + $gyo + "' value='" + tdata[2] + "'>";
         $item = $item + "<input type='submit' id='sub" + $gyo + "' name='sub" + $gyo + "'></td>";
         $item = $item + "<td data-label='相手先'>" + "(" + tdata[5] + ")" + tdata[6] + "</td>";
         $item = $item + "<td data-label='相手担当'>" + tdata[7] + "</td>";
         $item = $item + "<td data-label='業務区分'>" + tdata[8] + "</td>";
         $item = $item + "<td data-label='メモ'> " + tdata[9] + "</td>";
         $item = $item + "/tr>";   
         $('#datagrid').append($item);
      });
   })
   .fail(function(){
      console.log("失敗1");
   })
}
//-------------------------------------------------------------------------------
//    サーバーから対象件数を取得してページ番号を表示する
//-------------------------------------------------------------------------------
function getPageFromServer(){
   //ページ数を取得してページ選択ボタンを表示する         
   $.ajax({
      url: "getcount.php",
      type: "POST",
      dataType: "json",
      data: {
         'date_from': $date_from,
         'date_to': $date_to,
         'tokui_from': $tokui_from,
         'tokui_to': $tokui_to,
         'tanto_from': $tanto_from,
         'tanto_to': $tanto_to
      }
   })
   .done(function(data){
      console.log(data);
      //現在のページを削除   
      var table = document.getElementById('pageid');
      var tsiz=table.rows.length;
      if (tsiz > 0) {
         console.log("pagedelete")
         table.tBodies[0].deleteRow(0);
      }   
         
      var $recordmax = Number(data);
      console.log($recordmax);
      var $pagemax = $recordmax / 15;     //最大ページ数
      var $pagemax = Math.floor($pagemax);     //最大ページ数
      if(($pagemax * 15) != $recordmax) $pagemax++;
      if($pagemax <= 1) exit;

      var $item = '';
      if($pagemax > 5) {
         //5ページ以上ある場合
         if($start_page > 1)  {
            $item = $item + "<input type='button' class='pagebefore' id='pagebefore' style='font-size:50pt' value='≪前へ'>"; 
         }
      }
      var $cnt1=1;
      for(var $cnt = ($start_page -1) * 5 + 1; $cnt <= $pagemax; $cnt++) {
         //$('#pageid').append("&nbsp;<a name=page1 >" + $cnt + "</a>");
         //$('#pageid').append("<button class=pageno id=page" + $cnt +  ">" + $cnt + "</button>");
         $item = $item + "<input type='button' class=pageno style='font-size:50pt' id=page" + $cnt + " value=" + $cnt + ""; 
         if(Number($page_id) == $cnt)  {$item = $item + " disabled"}
         $item = $item + ">";
         if(++$cnt1 >5 ) break;
      }
      if($cnt < $pagemax)  {
         $item = $item + "<input type='button' class='pageafter' id='pageafter' name='pageafter' style='font-size:50pt' value='次へ≫'>"; 
      }

      $('#pageid').append("<tr><td>" + $item + "</td></tr>"); 
   })
   .fail(function(){
      console.log("失敗2");
   })
}
