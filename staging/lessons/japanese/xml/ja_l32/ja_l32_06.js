if (gv_server)
  {
  var vid_js = window.gateway.paths.xml + 'ja_l32/'+ 'videoPlay.js'
  var mediaPath = window.gateway.paths.media
  var imgPath = window.gateway.paths.sharedImages
  }
else
  {
  var vid_js = 'videoPlay.js'
  var mediaPath = '../../media/'             //// not applicable in DLiLearn
  ////var imgPath ='../../IMG/'
  var imgPath ='../../../../templates/common_gloss/IMG/'
  }

var completeCheck = false;
var g_crrtIndex = []
var g_audioPlay = ['act1_1.mp3','act1_2.mp3']
var g_questCat = ['Semantic','Grammar']
var Try = -1

var max_pg = 2
max_quest  = 2
var curr_item = 0

//********************** homework check (2/4) *************//
var hw = true
var txtques         =   [ 'Who has the right to vote?','Who met the boy?' ]
var crrtAnsValue    =   ['choice 1','choice 11','choice 111','choice 1111','choice 2','choice 22','choice 222','choice 2222']             //// the list of corret Answer Values  (such as ['a', 'aa', 'aaa', 'b', 'bb', 'bbb', 'bbbb']    //// 'aaa', and 'bbbb' are the answer in this case

var respItemNo      =   [0,0,0,0,1,1,1,1]
var crrtAnsWhole    =   [0,4]             //// the list of all correct answers from all dbf_responses without considering (each) page number  (such as [2, 6])
var crrtAns         =   new Array(max_pg)            //// the actual correct answer array of each page  (in order to get [2, 3])

var stAns           =   new Array(max_pg)            //// student answers
var finals          =   new Array(max_pg)            //// all false as defined below, but it converts to true when answer is correct. If ture, date collection (logStudentAnswerAttempts, and logStudentAnswer) stops.
////var tranScore       =   new Array(max_pg)

var answerTried = new Array(max_pg)                 //// to get the number of tries in answering the question whether the try is correct or not (and avoid the second time and beyond)
for (var i=0; i<max_pg; i++)
  {
  answerTried[i] = 0
  finals[i] = false
  }
//************************ end of homework check (2/4) **************//


function vidPopUp(fn)
  {
  function non_ie( fn, dh, dw)
    {
    if (gv_pop_win)
      gv_pop_win.close()
    gv_pop_win = null
    var H = dh ? dh : 245
    var W = dw ? dw : 310
    if (window.showModelessDialog)
      {
      var P = spf( 'dialogHeight: ~px; dialogWidth: ~px; help=0; resizable=0; status=0; scroll=0; toolbar=0;', [H, W])
      gv_pop_win = showModelessDialog( 'dummy', '', P)
      }
    else
      {
      var DD = "about:blank"
      var xx = spf( 'toolbar=0, scrollbars=0, menubar=0, resizable=0, status=0, location=0, directories=0, width=~, height=~',[W,H])
      gv_pop_win = open( '', '_blank', xx )
      }
    var d = gv_pop_win.document
    var loname = 'ja_l32/'
    d.open()
    getPlayer(fn, loname)
    d.close()
  
    function getPlayer(fn, loname)
      {
      function ws()
        {
        for (var i=0, n=arguments.length; i<n; i++)
          d.write(arguments[i])
        }
      function wl()
        {
        ws.apply(this, arguments)
        d.writeln('')
        }

      wl( '<html>' )
      wl( '<head>' )

      wl(spf( '<script type="text/javascript" src="~">',[vid_js]))
      wl(     '<\/script>')
      wl( '<script type="text/javascript">')
  
      wl(' function xid( a )')
      wl('  {')
      wl('  return document.getElementById( a )')
      wl('  }')

      wl( spf('var gfn="~"',[fn]))
      wl( spf('var fldn="~"', [loname]))
      wl( spf('var mpath ="~"', [mediaPath]))
      wl( 'function loadFile( file_name )')
      wl( '  {')
      wl( '  var filepath = "" + file_name')
      wl( '  IHTML(xid( "id_media_div" ), loadVid( filepath, false, fldn, mpath ))')
      wl( '  }')

      wl( 'window.onload=function()')
      wl( '{')
      wl( 'loadFile( gfn )' )
      wl( '}')
      wl( '<\/script>' )
      wl( '<\/head>' )
      wl( '<body>' )
      wl( '<div id="id_media_div">')
      wl( '<div id="videoContainer"><video id="videoTag" width="0" height="0"></video></div>')
      wl( '<\/div>')
      wl( '<\/body>' )
      wl( '<\/html>' )
      }
    }

  if (navigator.appName == "Microsoft Internet Explorer")
    PopUp4('', 'Video Clip', fn, '', '', 'ja_l32/')
  else
    non_ie(fn)
  }

function next()
  {
  if(curr_item != (max_pg-1) )
    {
    xid('id_prev_foot').src = imgPath + "gloss_buttons/previousBtn.png"
    xid( 'id_Q' + curr_item ).style.display = 'none'
    xid( 'id_Qa' + curr_item ).style.display = 'none'
    curr_item++
    xid( 'id_Q' + curr_item ).style.display = 'inline'
    xid( 'id_Qa' + curr_item ).style.display = 'inline'
    ////nextAddOn()
    }
  if (curr_item == (max_pg-1) )
   {
   xid('id_next_foot').src = imgPath + "gloss_buttons/nextBtn_null.png"
   }
  xid('id_stepNo').innerHTML =  curr_item+1 + '/' + max_pg
  xid('id_feedback').innerHTML = ''
  xid('videoContainer').innerHTML = ''
  xid('video_ok_btn').style.display = 'none'
  }

function back()
  {
  if(curr_item != 0)
    {
    xid('id_next_foot').src = imgPath + "gloss_buttons/nextBtn.png"
    xid( 'id_Q' + curr_item ).style.display = 'none'
    xid( 'id_Qa' + curr_item ).style.display = 'none'
    curr_item--
    xid( 'id_Q' + curr_item ).style.display = 'inline'
    xid( 'id_Qa' + curr_item ).style.display = 'inline'    
    ////backAddOn()
    }
 if(curr_item == 0)
   {
   xid('id_prev_foot').src = imgPath + "gloss_buttons/previousBtn_null.png"
   }
  xid('id_stepNo').innerHTML =  curr_item+1 + '/' + max_pg
  xid('id_feedback').innerHTML = ''
  xid('videoContainer').innerHTML = ''
  xid('video_ok_btn').style.display = 'none'
  }


function gen_ques()
  {
  xid('id_Q'+curr_item).style.display = ''
  xid('id_Qa'+curr_item).style.display = ''
  }

function nextAddOn()
  {
  if (curr_item < max_pg)
    {
    ++curr_item
    gen_ques()
    }
  }

function backAddOn()
  {
  if (curr_item > 0)
    {
    --curr_item
    gen_ques()
    }
  }

function _qs(s)
  {
  s = s.replace( /\r/g, '\\r' )
  s = s.replace( /\n/g, '\\n' )
  s = s.replace( /\"/g, '\\"' )
  return '"' + s + '"'
  }
function xid(item)
  {
  return document.getElementById(item)
  }
function grad_it(indexNo, cnt)
  {
  if (indexNo == g_crrtIndex[curr_item])
     {
     ////PopUp(xid('id_FB').rows[curr_item].cells[0].innerHTML)
     xid('videoContainer').innerHTML = ''
     xid('video_ok_btn').style.display = 'none'
     xid('id_feedback').innerHTML = '<p class="center"><img src="../../../../templates/common/img/feedback_correct.png"  width="120px" height:24px" alt="Correct"></p>' + (xid('id_FB').rows[curr_item].cells[0].innerHTML)
     var fbH = 0
     if(xid('id_feedback').offsetHeight < 320)
        {
        fbH =  320 - xid('id_feedback').offsetHeight
        xid('id_feedback').innerHTML +=  '<button class="btn btn_bottom_right2 pull-right"  style="top:' + fbH +'px;" onclick="closefb()">OK</button>'
        }
     else
        xid('id_feedback').innerHTML +=  '<br /><br /> <button class="btn btn_bottom_right pull-right"  style="" onclick="closefb()">OK</button>'

     }
  else
     {
     ////xid('id_feedback').innerHTML = '<p class="center"><img src="../../../../templates/common/img/feedback_incorrect.png"  width="120px" height:24px"  alt="Incorrect"></p>'
     ////xid('video_ok_btn').style.display='inline'
     /*
     if(document.all)
       var fb_flv = xid('id_FB').rows[curr_item].cells[1].innerText
     else
       var fb_flv = xid('id_FB').rows[curr_item].cells[1].textContent

     ////vidPopUp_test(fb_flv)   //audD
      loadVideo('../../media/ja_l32/', removeFileExt (fb_flv), '', false, true)
      */

     xid('id_feedback').innerHTML = '<p class="center"><img src="../../../../templates/common/img/feedback_incorrect.png"  width="120px" height:24px" alt="Correct"></p>' + (xid('id_FB').rows[curr_item].cells[1].innerHTML)
     var fbH = 0
     if(xid('id_feedback').offsetHeight < 320)
        {
        fbH =  320 - xid('id_feedback').offsetHeight
        xid('id_feedback').innerHTML +=  '<button class="btn btn_bottom_right2 pull-right"  style="top:' + fbH +'px;" onclick="closefb()">OK</button>'
        }
     else
        xid('id_feedback').innerHTML +=  '<br /><br /> <button class="btn btn_bottom_right pull-right"  style="" onclick="closefb()">OK</button>'


      
      

     }

  Try ++
  var ok = -1
  if (indexNo == g_crrtIndex[curr_item])
    ok ++

  if (window.DSW)
    {
    var myScore =  ok >= 0 ? 100 : 0
    DSW.score_item( Try, myScore )
    DSW.set_score_exists ( myScore )
    }
  }

var questCompleteArray = []
var tranScore = []

function install_handlers()
  {
  xid('id_playBtn').onclick = function()
    {
    var mPath = '../../media/ja_l32/'
    ////IHTML( xid('id_mp3_player'), HTML_mp3_player_1( g_audioPlay[curr_item], true, 'ja_l32/' ) )
   audio_play_file( removeFileExt(g_audioPlay[curr_item]), mPath, true )
    }

  xid('id_hintBtn').onclick = function()
    {
    ////PopUp(xid('id_HINT').rows[curr_item].cells[0].innerHTML, "Hint")
    xid('videoContainer').innerHTML = ''
    xid('video_ok_btn').style.display='none'
    xid('id_feedback').innerHTML =  xid('id_HINT').rows[curr_item].cells[0].innerHTML
    var fbH = 0

    if(xid('id_feedback').offsetHeight < 320)
        {
        fbH =  320 - xid('id_feedback').offsetHeight
        xid('id_feedback').innerHTML +=  '<button class="btn btn_bottom_right2 pull-right"  style="top:' + fbH +'px;" onclick="closefb()">OK</button>'
        }
    else
        xid('id_feedback').innerHTML +=  '<br /> <button class="btn btn_bottom_right pull-right"  style="" onclick="closefb()">OK</button>'

    }
  xid('id_checkBtn').onclick = function()
    {
    //********************** homework check (3/4)  ******************************//

    var accArrPos  = 0                       ////  accurate Array position
    var L =parseInt (respItemNo.length+1)
    for (var j=0; j<L; j++)
       {
        for (var k=0; k<curr_item; k++)
          {
          if(respItemNo[j]   == k)
               accArrPos++
          }
       }
    crrtAns[curr_item] = crrtAnsWhole[curr_item]-accArrPos
    
   //*********************  end of homework check (3/4) *************************//
    var ri = classify(xid('id_Q'+curr_item), 'input', 'radio_items')
    var rv = classify(xid('id_Q'+curr_item), 'span', 'activity_p_lrg_2')      /// checked value   homework
    var checkedIndex = -1

    for(var y=0; y<ri.length ; y++)
      {
      if (ri[y].checked)
        {
        checkedIndex = y
        stAns[curr_item] = y
        }
      }
    if (checkedIndex != -1)
     {
      grad_it(checkedIndex)
   //************************* homework check (4/4)*************************//
     answerTried[curr_item]++
     var questionID = curr_item
     ////var answer =  stAns[curr_item] == crrtAns[curr_item] ? "correct": "incorrect"
     ////var answer =  stAns[curr_item]                                              //// checked rb number
     var answer =  rv[stAns[curr_item]].innerHTML.Trim()                             //// checked rb value
     ////var context = txtques[curr_item].Trim()
     ////var context =  crrtAns[curr_item] + ':' +  txtques[curr_item].Trim()                        //// correct answer: rb number
     var context = crrtAnsValue[crrtAnsWhole[curr_item]].Trim()  + ':' +  txtques[curr_item].Trim()  //// correct answer: rb value
     var attemtpCount = answerTried[curr_item]
           ////if(answer == crrtAnsValue[crrtAnsWhole[curr_item]].Trim())
              ////alert('hurray')
    if(hw && (answerTried[curr_item] < 6 ) && (finals[curr_item] == false))
      {
          logStudentAnswer(questionID, answer, context)
          logStudentAnswerAttempts(questionID, attemtpCount)
          ////if(answer =="correct")
          if(stAns[curr_item] == crrtAns[curr_item])          
                finals[curr_item] = true
      }
  //******************** end of homework check  (4/4) **********************//
  
  //******************** preparing score calculation ***********************//
    if(answerTried[curr_item] == 1)
      {
       if(stAns[curr_item] == crrtAns[curr_item])
          tranScore[curr_item] = 1
       else
          tranScore[curr_item] = 0
      }
  //********************* end of preparing score calculation ***************//
      if(stAns[curr_item] == crrtAns[curr_item])
         questCompleteArray[curr_item] = 1
      checkcomplete()
     }
    else
      alert("Please choose an answer first.")
    }
  }

function closefb()
  {
  xid('id_feedback').innerHTML = ''
  if(completeCheck)
      activityCompleted()
  }

  function close_vid()
  {
  xid('id_feedback').innerHTML = ''
  xid('videoContainer').innerHTML = ''
  xid('video_ok_btn').style.display = 'none'

  }
  
function checkcomplete()
  {
  var completed = true
  for (var i=0;i<max_quest; i++)
    {
    if (questCompleteArray[i] == 0)
      {
      completed = false
      return
      }
    }
  if (completed == true)   
   {
// ***********************  scores **********************************//
   var checkCrr = 0
   for (var i=0; i<max_quest; i++ )
    if(tranScore[i] == 1)
      checkCrr++
      
   var stScore = (checkCrr/max_quest)*100   + "%"
      ////alert(stScore)
      
   alert('In your first attempt, you had ' + checkCrr + ' correct answer(s), and ' + (max_quest-checkCrr) + ' incorrect Answer(s).' )
//************************* end of scores ****************************//
    ////activityCompleted()
    completeCheck = true
   }
  }
function activityCompleted()
  {
   //todo:write the progress
  ////alert("activity completed.", "Activity Completed");
  xid('id_feedback').innerHTML = "Activity completed."
  xid('clickGuard').style.display = 'inline'
  }


function initActy()
  {
  install_handlers()
  gen_ques()
  }

function initializeActivity()
  {
  var w                = window
  w.gv_pop_win         = null
  audioInit();
  testVideoSupport();

  ////xid('topBar').innerHTML = mk_topBar(true)
  ////globalize_id('id_mp3_player')
  ////IHTML(id_mp3_player, HTML_mp3_player_1('_MxP3_', false, 'ja_l32/'))
  ////audio_play_file(removeFileExt('act1_1.mp3'), 'ja_l32/',false)
  w.pop_manager = new popup_class()
    g_crrtIndex[0] = 0
  g_crrtIndex[1] = 0

  initActy()
  for (var i=0;i<max_quest; i++)
     questCompleteArray.push(0)  //in order to make the array to check the complete the step

  xid('id_stepNo').innerHTML = (max_pg == 0) ? '1/1' : '1/' + max_pg
  if (max_pg > 1)
        xid('container_setDiv').style.display = 'inline'
  ////xid('id_prev_foot').style.visibility = 'hidden'
  xid('id_prev_foot').src = imgPath + "gloss_buttons/previousBtn_null.png"
  }