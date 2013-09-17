function loadVid(FN, B, LOname, mediaPath)
{
    var fldn = LOname
    function w_tool()
    {
        function F()
        {
            var wr = ''
            function ws()
            {
                wr += ''.concat.apply('', arguments)
            }
            function wl()
            {
                wr += ''.concat.apply('', arguments) + '\r\n'
            }
            function w_get_str()
            {
                return wr
            }
            function w_init_str()
            {
                wr = ''
            }
            function wx(A, B)
            {
                wl(spf(A, B))
            }
        }
        var S = F.toString()
        S = S.substr(S.indexOf('{') + 1)
        S = S.substr(0, S.lastIndexOf('}'))
        return S
    }

    eval(w_tool())
    var S = B ? mediaPath + fldn + '/flv/videoTest.swf?theFile=' + FN + '&autoStart=true' : mediaPath + fldn + '/flv/videoTest.swf?theFile=' + FN + '&autoStart=false'

    ws('<object')
    ws(' type="application/x-shockwave-flash"')
    ws(' style="width: 270px; height: 232px; margin-left: 15px;"')
    wl(' data="', S, '">')
    wl('   <param name="movie" value="', S, '" \/>')
    wl('   <param name="wmode" value="transparent" \/> ')
    wl('<\/object>')

    return wr
}

function IHTML(A, B)
{
    A.innerHTML = B
}

function xid(a)
{
    return document.getElementById(a)
}