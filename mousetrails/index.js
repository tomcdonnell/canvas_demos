/*
 * vim: ts=4 sw=4 et wrap co=104 go-=b
 */

$(document).ready
(
    function (e)
    {
        try
        {
            var f = 'document.onReady()';
            UTILS.checkArgs(f, arguments, ['function']);

            var mousetrails = new Mousetrails(100);
            $(document.body).append(mousetrails.getCanvas());
        }
        catch (e)
        {
            UTILS.printExceptionToConsole(f, e);
        }
    }
);

