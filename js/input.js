   //変数定義
   var $aitekbn;
   var $aitesaki;
   
   $(function(){
      //相手先区分が変更された
      //$('[name=adv_filter]').on('click',function(){
      $('#aitekbn').on('change',function(){
         console.log("click") ;
         $aitekbn = $(this).val();
         SelectAitesakiCreate();
      });
   });
   // select相手先の作成
   function SelectAitesakiCreate(){
      console.log("getaitesaki") ;
      
      //aitekbn値 を getaitesaki.php へ渡す
      $.ajax({
        url: "gettokui.php",
        type: "POST",
        dataType: 'json',
        data: {
          'aitekbn': $aitekbn
        }
      })
      .done(function(data){
         //selectタグ（子） の option値 を一旦削除
         var $sel = document.getElementById('aitesaki');
         var $len = $sel.length;
         for(j=1; j<=$len; j++)  {  
            $sel.remove(0);
         }
         //$('.aitesaki option').remove();      jQueryの書き方
         //select.php から戻って来た data の値をそれそれ optionタグ として生成し、
         // .car_model に optionタグ を追加する
         $.each(data, function(id, name){
            var opt = document.createElement('option');
            opt.value = id;
            opt.textContent = name;
            if(id == $aitesaki)  {opt.selected = true;}  //変更初期表示のとき、対象の相手先を選択
            $sel.appendChild(opt);
            //$('.aitesaki').append($('<option>').text(name).attr('value', id));　jQueryの書き方
         });
      })
      .fail(function(){
         console.log("失敗");
      })
   }
  
