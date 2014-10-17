requirejs.config({
    baseUrl: '/',
    shim: {
        'jquery' : {
            exports : 'jQuery'
        },
        'farbtastic' : ['jquery'],
//        'fillter'    : ['jquery'],
        'underscore' : ['jquery'],
        'backbone'   : ['underscore']
    },
    paths: {
        "jquery"      : "source/jquery-2.1.1.min",
        "modernizr"   : "source/lib/modernizr",
        "farbtastic"  : "source/farbtastic",
        "underscore"  : "source/underscore",
        "backbone"    : "source/backbone"
    }
});
requirejs(["source/paint"]);