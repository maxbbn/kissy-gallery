KISSY.add("gallery/form/1.1/uploader/auth/base",function(d,n,l){function h(a,b){b=d.merge({uploader:a},b);h.superclass.constructor.call(this,b);this._init()}var i=i||d;d.mix(h,{event:{ERROR:"error"}});d.extend(h,l,{_init:function(){var a=this,b=a.get("uploader"),c=b.get("queue");if(b==""){i.log("[uploader-auth]:uploader不可以为空！");return false}a._setSwfButtonExt();c.on("add",function(f){f=f.file;a.testAllowExt(f);a.testMaxSize(f);a.testRepeat(f)});c.on("remove",function(f){f.file.status=="success"&&
a.testMax()});b.on("success",function(){a.testMax()});b.on("error",function(){b.set("isAllowUpload",true)})},testAll:function(){return this.testRequire()&&this.testMax()},getRule:function(a){return this.get("rules")[a]},isUploaderType:function(a){var b=this.get("uploader").get("type");return a==b},testRequire:function(){var a=this.get("uploader").get("urlsInput").get("urls"),b=this.getRule("require"),c=b?b[0]:false;a=a.length>0;if(!c)return true;if(!a){d.log("[uploader-auth]:"+b[1]);this.fire(h.event.ERROR,
{rule:"require",msg:b[1],value:c})}return a},testAllowExt:function(a){function b(j){j=j.split(".");return j[j.length-1]}if(!d.isObject(a))return false;var c=a.name,f=this.getRule("allowExts"),e=[],g;if(!d.isArray(f))return false;e=this._getExts(f[0].ext);g=function(j){var k=false,m;d.each(e,function(o){m=RegExp("^.+."+o+"$");if(m.test(j))return k=true});return k}(c);if(!g){c=b(c);c=d.substitute(f[1],{ext:c});this._stopUpload(a,c);this.fire(h.event.ERROR,{rule:"allowExts",msg:c,value:f[0]})}return g},
testMax:function(){var a=this.get("uploader"),b=a.get("queue").getFiles("success").length,c=this.getRule("max");if(c){var f=a.get("button");if(b=b<c[0]){f.set("disabled",false);a.set("isAllowUpload",true)}else{f.set("disabled",true);a.set("isAllowUpload",false);this.fire(h.event.ERROR,{rule:"max",msg:c[1],value:c[0]})}return b}},testMaxSize:function(a){var b=a.size,c=this.getRule("maxSize");if(c){var f=Number(c[0])*1E3;b=b<=f;if(!b){f=d.substitute(c[1],{maxSize:d.convertByteSize(f),size:a.textSize});
this._stopUpload(a,f);this.fire(h.event.ERROR,{rule:"maxSize",msg:f,value:c[0]})}return b}},testRepeat:function(a){if(!d.isObject(a))return false;var b=this,c=a.name,f=b.getRule("allowRepeat");if(f){var e=f[0],g=f[1],j=b.get("uploader").get("queue").getFiles("success"),k=false;if(e)return false;d.each(j,function(m){if(m.name==c){b._stopUpload(a,g);b.fire(h.event.ERROR,{rule:"allowRepeat",msg:g,value:f[0]});return k=true}});return k}},_setSwfButtonExt:function(){var a=this.get("uploader"),b=this.getRule("allowExts");
a=a.get("button");if(!this.isUploaderType("flash")||!d.isArray(b))return false;a.set("fileFilters",b[0]);return this},_getExts:function(a){if(!d.isString(a))return false;var b=a.split(";"),c=[],f=/^\*\./;d.each(b,function(e){e=e.replace(f,"");c.push(e.toUpperCase())});d.each(c,function(e){b.push(e)});return b},_stopUpload:function(a,b){d.isString(b)||(b="");var c=this.get("uploader").get("queue"),f=c.getFileIndex(a.id);c.fileStatus(f,c.constructor.status.ERROR,{msg:b})}},{ATTRS:{uploader:{value:""},
rules:{value:{allowExts:[{desc:"JPG,JPEG,PNG,GIF,BMP",ext:"*.jpg;*.jpeg;*.png;*.gif;*.bmp"},"不支持{ext}格式的文件上传！"],require:[false,"必须至少上传一个文件！"],max:[3,"每次最多上传{max}个文件！"],maxSize:[1E3,"文件大小为{size}，文件太大！"],allowRepeat:[false,"该文件已经存在！"]}}}});return h},{requires:["node","base"]});
KISSY.add("gallery/form/1.1/uploader/base",function(d,n,l,h,i,a,b){function c(e){c.superclass.constructor.call(this,e)}var f=l.all;d.mix(c,{type:{AUTO:"auto",IFRAME:"iframe",AJAX:"ajax",FLASH:"flash"},event:{RENDER:"render",SELECT:"select",START:"start",PROGRESS:"progress",COMPLETE:"complete",SUCCESS:"success",UPLOAD_FILES:"uploadFiles",CANCEL:"cancel",ERROR:"error"},status:{WAITING:"waiting",START:"start",PROGRESS:"progress",SUCCESS:"success",CANCEL:"cancel",ERROR:"error",RESTORE:"restore"}});d.extend(c,
n,{render:function(){var e=this.get("serverConfig"),g=this.getUploadType(this.get("type")),j=g.event,k;if(!g)return false;this.set("urlsInput",this._renderUrlsInput());this._renderQueue();k=this._renderButton();this._restore();this.get("type")==c.type.FLASH&&d.mix(e,{swfUploader:k.get("swfUploader")});e=new g(e);e.on(j.SUCCESS,this._uploadCompleteHanlder,this);j.PROGRESS&&e.on(j.PROGRESS,this._uploadProgressHandler,this);e.on(j.STOP,this._uploadStopHanlder,this);this.set("uploadType",e);this.fire(c.event.RENDER);
return this},upload:function(e){if(!d.isNumber(e))return false;var g=this.get("uploadType"),j=this.get("type"),k=this.get("queue"),m=k.get("files")[e],o;if(!d.isPlainObject(m)){d.log("[uploader]:队列中不存在id为"+e+"的文件");return false}if(this.get("curUploadIndex")!=""){alert("第"+this.get("curUploadIndex")+"文件正在上传，请上传完后再操作！");return false}o=m.input.id||m.input;if(j=="ajax")o=m.data;if(m.status==="error")return false;this.fire(c.event.START,{index:e,file:m});if(!this.get("isAllowUpload"))return false;this.set("curUploadIndex",
e);k.fileStatus(e,c.status.START);g.upload(o)},cancel:function(e){var g=this.get("uploadType"),j=this.get("queue"),k=c.status,m=j.fileStatus(e);if(d.isNumber(e)&&m!=k.SUCCESS)j.fileStatus(e,k.CANCEL);else{g.stop();this._continueUpload()}return this},stop:function(){this.set("uploadFilesStatus","");this.cancel();return this},uploadFiles:function(e){if(!d.isString(e))e=c.status.WAITING;this.set("uploadFilesStatus",e);this._uploaderStatusFile(e);return this},_uploaderStatusFile:function(e){e=this.get("queue").getIndexs(e);
if(!e.length){this.set("uploadFilesStatus","");this.fire(c.event.UPLOAD_FILES);return false}this.upload(e[0]);return this},isSupportAjax:function(){var e=false;try{if(FormData)e=true}catch(g){e=false}return e},isSupportFlash:function(){var e=d.UA.fpv();return d.isArray(e)&&e.length>0},getUploadType:function(e){var g=this,j=c.type,k;if(e==j.AUTO)e=[j.AJAX,j.IFRAME];if(d.isArray(e)&&e.length>0)d.each(e,function(m){if(k=g._getType(m))return false});else k=g._getType(e);return k},_getType:function(e){var g=
c.type,j=this.isSupportAjax(),k=this.isSupportFlash();switch(e){case g.IFRAME:g=i;break;case g.AJAX:g=j&&a||false;break;case g.FLASH:g=k&&b||false;break;default:d.log("[uploader]:type参数不合法");return false}g&&d.log("[uploader]:使用"+e+"上传方式");this.set("type",e);return g},_renderButton:function(){var e=this.get("button");if(!d.isObject(e)){d.log("[uploader]:button参数不合法！");return false}e.on("change",this._select,this);e.render();return e},_renderQueue:function(){var e=this.get("queue"),g=this.get("urlsInput");
if(!d.isObject(e)){d.log("[uploader]:queue参数不合法");return false}e.set("uploader",this);e.on("remove",function(j){g.remove(j.file.sUrl)});e.render();return e},_select:function(e){var g=this,j=g.get("autoUpload"),k=g.get("queue"),m=g.get("curUploadIndex"),o=e.files;d.each(o,function(p){if(!p.size)p.size=0;if(!p.name)p.name=p.fileName||"";p.input=e.input||p});g.fire(c.event.SELECT,{files:o});if(!g.get("isAllowUpload"))return false;k.add(o,function(){m==""&&j&&g.uploadFiles()})},_renderUrlsInput:function(){var e=
this.get("button").get("target"),g=this.get("urlsInputName");e=new h(e,{name:g});e.render();return e},_uploadCompleteHanlder:function(e){e=e.result;var g,j=c.event,k=this.get("queue"),m=this.get("curUploadIndex");if(!d.isObject(e))return false;k.updateFile(m,{result:e});g=Number(e.status);if(g===1){k.fileStatus(m,c.status.SUCCESS);this._success(e.data);this.fire(j.SUCCESS,{index:m,file:k.getFile(m),result:e})}else{k.fileStatus(m,c.status.ERROR,{msg:e.msg||e.message||"",result:e});this.fire(j.ERROR,
{status:g,result:e})}this.set("curUploadIndex","");this.fire(j.COMPLETE,{index:m,file:k.getFile(m),result:e});this._continueUpload()},_uploadStopHanlder:function(){var e=this.get("queue"),g=this.get("curUploadIndex");e.fileStatus(g,c.status.CANCEL);this.set("curUploadIndex","");this.fire(c.event.CANCEL,{index:g})},_continueUpload:function(){var e=this.get("uploadFilesStatus");e!=""&&this._uploaderStatusFile(e)},_uploadProgressHandler:function(e){var g=this.get("queue"),j=this.get("curUploadIndex"),
k=g.getFile(j);d.mix(e,{file:k});g.fileStatus(j,c.status.PROGRESS,e);this.fire(c.event.PROGRESS,e)},_success:function(e){if(!d.isObject(e))return false;e=e.url;var g=this.get("urlsInput"),j=this.get("curUploadIndex"),k=this.get("queue");if(!d.isString(e)||!d.isObject(g))return false;k.updateFile(j,{sUrl:e});g.add(e)},_restore:function(){var e=this.get("queue"),g=this.get("restoreHook");g=f(g);var j=[];if(!g.length)return false;j=d.JSON.parse(g.html());if(!j.length)return false;d.each(j,function(k){e.add(k,
function(m,o){e.fileStatus(m,"success",{index:m,id:o.id,file:o})})})}},{ATTRS:{button:{value:{}},queue:{value:{}},type:{value:c.type.AUTO},serverConfig:{value:{action:"",data:{},dataType:"json"}},isAllowUpload:{value:true},autoUpload:{value:true},urlsInputName:{value:""},curUploadIndex:{value:""},uploadType:{value:{}},urlsInput:{value:""},uploadFilesStatus:{value:""},restoreHook:{value:""}}});d.convertByteSize=function(e){var g=-1;do{e/=1024;g++}while(e>99);return Math.max(e,0.1).toFixed(1)+["kB",
"MB","GB","TB","PB","EB"][g]};return c},{requires:["base","node","./urlsInput","./type/iframe","./type/ajax","./type/flash","flash"]});
KISSY.add("gallery/form/1.1/uploader/button/base",function(d,n,l){function h(a,b){b=d.merge({target:i(a)},b);h.superclass.constructor.call(this,b)}var i=n.all;d.mix(h,{event:{beforeShow:"beforeShow",afterShow:"afterShow",beforeHide:"beforeHide",afterHide:"afterHide",beforeRender:"beforeRender",afterRender:"afterRender",CHANGE:"change"},getFileName:function(a){return a.replace(/.*(\/|\\)/,"")}});d.extend(h,l,{render:function(){var a=this.get("target");if(this.fire(h.event.beforeRender)===false){d.log("[Uploader-Button] button render was prevented.");
return false}else{if(a==null){d.log("[Uploader-Button] Cannot find target!");return false}this._createInput();this._setDisabled(this.get("disabled"));this._setMultiple(this.get("multiple"));this.fire(h.event.afterRender);return this}},show:function(){this.get("target").show();this.fire(h.event.afterShow);return h},hide:function(){this.get("target").hide();this.fire(h.event.afterHide);return h},reset:function(){var a=this.get("inputContainer");i(a).remove();this.set("inputContainer","");this.set("fileInput",
"");this._createInput();return this},_createInput:function(){var a=this.get("target"),b=this.get("name"),c=this.get("tpl");if(!d.isString(b)||!d.isString(c)){d.log("[Uploader-Button] No name or tpl specified.");return false}b=d.substitute(c,{name:b});b=i(b);i(b).appendTo(a);a=i(b).children("input");i(a).on("change",this._changeHandler,this);this.set("fileInput",a);this.set("inputContainer",b);return b},_changeHandler:function(a){var b=this.get("fileInput"),c=i(b).val();a=a.target.files;var f=[];if(c==
""){d.log("[Uploader-Button] No file selected.");return false}a?d.each(a,function(e){d.isObject(e)&&f.push({name:e.name,type:e.type,size:e.size,data:e})}):f.push({name:h.getFileName(c)});this.fire(h.event.CHANGE,{files:f,input:b.getDOMNode()});this.reset()},_setDisabled:function(a){var b=this.get("cls").disabled,c=this.get("target"),f=this.get("fileInput");if(!c.length||!d.isBoolean(a))return false;if(a){c.addClass(b);i(f).hide()}else{c.removeClass(b);i(f).show()}return a},_setMultiple:function(a){var b=
this.get("fileInput");if(!b.length)return false;a&&b.attr("multiple","multiple")||b.removeAttr("multiple");return a}},{ATTRS:{target:{value:null},fileInput:{value:""},inputContainer:{value:""},tpl:{value:'<div class="file-input-wrapper"><input type="file" name="{name}" hidefoucs="true" class="file-input" /></div>'},name:{value:"fileInput",setter:function(a){this.get("fileInput")&&i(this.get("fileInput")).attr("name",a);return a}},disabled:{value:false,setter:function(a){this._setDisabled(a);return a}},
multiple:{value:false,setter:function(a){this._setMultiple(a);return a}},cls:{value:{disabled:"uploader-button-disabled"}}}});return h},{requires:["node","base"]});
KISSY.add("gallery/form/1.1/uploader/button/swfButton",function(d,n,l,h){function i(b,c){c=d.merge({target:a(b)},c);i.superclass.constructor.call(this,c)}var a=n.all;d.mix(i,{event:{RENDER:"render",CHANGE:"change",MOUSE_OVER:"mouseOver",MOUSE_DOWN:"mouseDown",MOUSE_UP:"mouseUp",MOUSE_OUT:"mouseOut",CLICK:"click"}});d.extend(i,l,{render:function(){var b=this,c=b.get("target"),f,e=b.get("multiple"),g=b.get("fileFilters");c.css("position","relative");b.set("swfWrapper",b._createSwfWrapper());b._setFlashSizeConfig();
f=b._initSwfUploader();f.on("contentReady",function(){f.browse(e,g);b._bindBtnEvent();f.on("fileSelect",b._changeHandler,b);b._setDisabled(b.get("disabled"));b.fire(i.event.RENDER)},b)},_createSwfWrapper:function(){var b=this.get("target"),c=this.get("tpl"),f=this.get("swfWrapperId")!=""&&this.get("swfWrapperId")||"swf-uploader-wrapper-"+d.guid();c=d.substitute(c,{id:f});this.set("swfWrapperId",f);return a(c).appendTo(b)},_initSwfUploader:function(){var b=this.get("flash"),c=this.get("swfWrapperId"),
f;try{f=new h(c,b);this.set("swfUploader",f)}catch(e){}return f},_bindBtnEvent:function(){var b=this,c=i.event,f=b.get("swfUploader");if(!f)return false;d.each(c,function(e){f.on(e,function(){b.fire(e)},b)});return b},_setFlashSizeConfig:function(){var b=this.get("flash"),c=this.get("target");d.mix(b.attrs,{width:c.width(),height:c.height()});this.set("flash",b)},_changeHandler:function(b){this.fire(i.event.CHANGE,{files:b.fileList})},_setDisabled:function(b){var c=this.get("swfUploader"),f=this.get("cls").disabled,
e=this.get("target"),g=this.get("swfWrapper");if(!c||!d.isBoolean(b))return false;if(b){e.addClass(f);g.hide()}else{e.removeClass(f);g.show()}return b}},{ATTRS:{target:{value:""},swfWrapper:{value:""},swfWrapperId:{value:""},tpl:{value:'<div id="{id}" class="uploader-button-swf" style="position: absolute;top:0;left:0;"></div>'},multiple:{value:true,setter:function(b){var c=this.get("swfUploader");c&&c.multifile(b);return b}},fileFilters:{value:[],setter:function(b){var c=this.get("swfUploader");c&&
d.isArray(b)&&c.filter(b);return b}},disabled:{value:false,setter:function(b){this.get("swfUploader")&&this._setDisabled(b);return b}},cls:{value:{disabled:"uploader-button-disabled"}},flash:{value:{src:"http://a.tbcdn.cn/s/kissy/gallery/form/1.1/uploader/plugins/ajbridge/uploader.swf",id:"swfUploader",params:{bgcolor:"#fff",wmode:"transparent"},attrs:{},hand:true,btn:true}},swfUploader:{value:""}}});return i},{requires:["node","base","../plugins/ajbridge/uploader"]});
KISSY.add("gallery/form/1.1/uploader/index",function(d,n,l,h,i,a,b){function c(g,j,k){k=d.mix(d.form.parseConfig(g),k);c.superclass.constructor.call(this,k);this.set("buttonTarget",g);this.set("queueTarget",j);this.set("uploaderConfig",k);this._init()}var f=l.all,e={CONFIG:"data-config",BUTTON_CONFIG:"data-button-config",THEME_CONFIG:"data-theme-config",AUTH:"data-auth"};d.namespace("form");d.form.parseConfig=function(g,j){var k={},m,o=j||e.CONFIG;m=f(g).attr(o);if(!d.isString(m))return{};try{k=d.JSON.parse(m)}catch(p){d.log("[uploaderRender]:请检查"+
g+"上"+o+"属性内的json格式是否符合规范！")}return k};d.extend(c,n,{_init:function(){var g=this,j=g.get("uploaderConfig"),k=g.get("name"),m=g._initButton(),o;g.set("button",m);g._initThemes(function(p){o=p.get("queue");d.mix(j.serverConfig,{fileDataName:k});d.mix(j,{button:m,queue:o});var q=new h(j);q.render();g.set("uploader",q);p.set("uploader",q);p.set("button",m);var r=g._auth();p.set("auth",r);p.afterUploaderRender&&p.afterUploaderRender(q);g.fire("init",{uploader:q})})},_initButton:function(){var g=this.get("buttonTarget"),
j=d.form.parseConfig(g,e.BUTTON_CONFIG),k=this.get("name"),m=this.get("type");j=d.merge({name:k},j);return m!="flash"&&new i(g,j)||new a(g)},_initThemes:function(g){var j=this,k=j.get("theme"),m=j.get("buttonTarget"),o=d.form.parseConfig(m,e.THEME_CONFIG);/\//.test(k)||(k="gallery/form/1.1/uploader/themes/"+k);k+="/index";j.set("theme",k);d.use(k,function(p,q){var r=j.get("queueTarget");p.mix(o,{queueTarget:r});r=new q(o);g&&g.call(j,r)})},_auth:function(){var g=this.get("buttonTarget"),j=this.get("uploader"),
k="";if(f(g).attr(e.AUTH)){g=d.form.parseConfig(g,e.AUTH);k=new b(j,{rules:g});j.set("auth",k)}return k}},{ATTRS:{theme:{value:"gallery/form/1.1/uploader/themes/default"},buttonTarget:{value:""},queueTarget:{value:""},uploaderConfig:{},button:{value:""},queue:{value:""},uploader:{value:""},auth:{value:""}}});return c},{requires:["base","node","./base","./button/base","./button/swfButton","./auth/base"]});
KISSY.add("gallery/form/1.1/uploader/plugins/ajbridge/ajbridge",function(d,n){function l(c,f,e){c=c.replace(h,"");f=n._normalize(f||{});var g=this;c=h+c;var j=function(k){if(k.status<1)g.fire("failed",{data:k});else{d.mix(g,k);if(!k.dynamic||!f.src)g.activate()}};f.id=f.id||d.guid(i);l.instances[f.id]=g;if(f.src){f.params.allowscriptaccess="always";f.params.flashvars=d.merge(f.params.flashvars,{jsEntry:b,swfID:f.id})}if(e)g.__args=[c,f,j];else d.later(n.add,a,false,n,[c,f,j])}var h="#",i="ks-ajb-",
a=100,b="KISSY.AJBridge.eventHandler";d.app(l,{version:"1.0.15",instances:{},eventHandler:function(c,f){var e=l.instances[c];e&&e.__eventHandler(c,f)},augment:function(c,f){if(d.isString(f))f=[f];d.isArray(f)&&d.each(f,function(e){c.prototype[e]=function(){try{return this.callSWF(e,d.makeArray(arguments))}catch(g){this.fire("error",{message:g})}}})}});d.augment(l,d.EventTarget,{init:function(){if(this.__args){n.add.apply(n,this.__args);this.__args=null;delete this.__args}},__eventHandler:function(c,
f){var e=f.type;f.id=c;switch(e){case "log":d.log(f.message);break;default:this.fire(e,f)}},callSWF:function(c,f){f=f||[];try{if(this.swf[c])return this.swf[c].apply(this.swf,f)}catch(e){var g="";if(f.length!==0)g="'"+f.join("','")+"'";return(new Function("self","return self.swf."+c+"("+g+");"))(this)}}});l.augment(l,["activate","getReady","getCoreVersion"]);return window.AJBridge=d.AJBridge=l},{requires:["flash"]});
KISSY.add("gallery/form/1.1/uploader/plugins/ajbridge/uploader",function(d,n,l){function h(i,a){a=a||{};var b={};d.each(["ds","dsp","btn","hand"],function(c){if(c in a)b[c]=a[c]});a.params=a.params||{};a.params.flashvars=d.merge(a.params.flashvars,b);h.superclass.constructor.call(this,i,a)}d.extend(h,l);l.augment(h,["setFileFilters","filter","setAllowMultipleFiles","multifile","browse","upload","uploadAll","cancel","getFile","removeFile","lock","unlock","setBtnMode","useHand","clear"]);h.version=
"1.0.1";l.Uploader=h;return l.Uploader},{requires:["flash","./ajbridge"]});
KISSY.add("gallery/form/1.1/uploader/plugins/filedrop/filedrop",function(d,n,l){var h=n.all,i=d.UA,a=function(c){a.superclass.constructor.call(this,c);this.set("mode",b())},b=function(){if(i.webkit>=7||i.firefox>=3.6)return"supportDrop";if(i.ie)return"notSupportDropIe";if(i.webkit<7||i.firefox<3.6)return"notSupportDrop"};d.mix(a,{event:{AFTER_DROP:"afterdrop"}});d.extend(a,l,{render:function(){var c=this.get("mode"),f=this.get("uploader");if(c!="supportDrop"){d.log("该浏览器不支持拖拽上传！");return false}if(!f){d.log("缺少Uploader的实例！");
return false}c=this._createDropArea();c.length&&c.on("click",this._clickHandler,this);console.log("after randeer");this.fire("afterRender",{buttonTarget:this.get("buttonWrap")})},show:function(){this.get("dropContainer").show()},hide:function(){this.get("dropContainer").hide()},reset:function(){},_createDropArea:function(){var c=this,f=h(c.get("target")),e=c.get("mode");e=d.substitute(c.get("tpl")[e],{name:c.get("name")});e=h(e);var g=e.all(".J_ButtonWrap");e.appendTo(f);e.on("dragover",function(j){j.stopPropagation();
j.preventDefault()});e.on("drop",function(j){j.stopPropagation();j.preventDefault();c._dropHandler(j)});c.set("dropContainer",e);c.set("buttonWrap",g);c._setStyle();return e},_setStyle:function(){var c=this.get("dropContainer");if(!c.length)return false;c.parent().css("position","relative");c.css({position:"absolute",top:"0",left:"0",width:"100%",height:"100%",zIndex:"1000"})},_clickHandler:function(c){h(c.target);this.get("uploader").get("button").get("fileInput").fire("click")},_dropHandler:function(c){var f=
a.event;c=c.originalEvent.dataTransfer.files;var e=[],g=this.get("uploader");if(!c.length||g=="")return false;d.each(c,function(j){d.isObject(j)&&e.push({name:j.name,type:j.type,size:j.size,data:j})});this.fire(f.AFTER_DROP,{files:e});g._select({files:e})},_setDisabled:function(){}},{ATTRS:{target:{value:""},uploader:{value:""},dropContainer:{value:""},tpl:{value:{supportDrop:'<div class="drop-wrapper"><p>直接拖拽图片到这里，</p><p class="J_ButtonWrap">或者</p></div>',notSupportDropIe:'<div class="drop-wrapper"><p>您的浏览器只支持传统的图片上传，</p><p class="suggest J_ButtonWrap">推荐使用chrome浏览器或firefox浏览器</p></div>',
notSupportDrop:'<div class="drop-wrapper"><p>您的浏览器只支持传统的图片上传，</p><p class="suggest J_ButtonWrap">推荐升级您的浏览器</p></div>'}},name:{value:"",setter:function(){}},disabled:{value:false,setter:function(c){this._setDisabled(c);return c}},cls:{disabled:"drop-area-disabled"}}});return a},{requires:["node","base"]});
KISSY.add("gallery/form/1.1/uploader/plugins/preview/preview",function(d,n){function l(e,g){if(!e)return false;if(b!="filter")e.src=g||f;else{e.src=f;if(g){g=g.replace(/[)'"%]/g,function(j){return escape(escape(j))});e.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale',src='"+g+"')";e.zoom=1}}return true}function h(e){this.config=d.mix({maxWidth:40,maxHeight:40},e);d.log(a+"Preview initialized. The preview mode is "+b)}var i=document,a="[Plugin: Preview] ",b=function(){var e=
"";if(typeof window.FileReader==="undefined")switch(d.UA.shell){case "firefox":e="domfile";break;case "ie":switch(d.UA.ie){case 6:e="simple";break;default:e="filter"}}else e="html5";return e}(),c={check:"check",success:"success",showed:"showed",error:"error"},f=d.UA.ie<8?"http://a.tbcdn.cn/p/fp/2011a/assets/space.gif":"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";d.augment(h,d.EventTarget,{preview:function(e,g){e=n.get(e);g=n.get(g);var j=this,k=function(){j.fire(c.getData,
{data:j.data,mode:b});if(g){l(g,j.data);j.fire(c.showed,{img:g})}};j.data=undefined;if(e){d.log(a+"One file selected. Getting data...");switch(b){case "domfile":j.data=e.files[0].getAsDataURL();break;case "filter":e.select();try{j.data=i.selection.createRange().text}catch(m){d.log(a+"Get image data error, the error is: ");d.log(m,"dir")}finally{i.selection.empty()}if(!j.data)j.data=e.value;break;case "html5":var o=new FileReader;o.onload=function(p){j.data=p.target.result;k()};o.onerror=function(){d.log(a+
"File Reader Error. Your browser may not fully support html5 file api","warning");j.fire(c.error)};e.files&&o.readAsDataURL(e.files[0]);break;default:j.data=e.value}if(j.data)k();else if(b!="html5"){d.log(a+"Retrive Data error.");l(g);j.fire(c.error)}}else d.log(a+"File Input Element does not exists.");return j.data}});return h},{requires:["dom","event"]});
KISSY.add("gallery/form/1.1/uploader/plugins/progressBar/progressBar",function(d,n,l){function h(a,b){b=d.merge({wrapper:i(a)},b);h.superclass.constructor.call(this,b)}var i=n.all;d.mix(h,{tpl:{DEFAULT:'<div class="ks-progress-bar-value" data-value="{value}"></div>'},cls:{PROGRESS_BAR:"ks-progress-bar",VALUE:"ks-progress-bar-value"},event:{RENDER:"render",CHANGE:"change",SHOW:"show",HIDE:"hide"}});d.extend(h,l,{render:function(){var a=this.get("wrapper"),b=this.get("width");if(!a.length)return false;
a.addClass(h.cls.PROGRESS_BAR).width(b);this._addAttr();!this.get("visible")&&this.hide();this.set("bar",this._create());this.fire(h.event.RENDER)},show:function(){var a=this;a.get("wrapper").fadeIn(a.get("duration"),function(){a.set("visible",true);a.fire(h.event.SHOW,{visible:true})})},hide:function(){var a=this;a.get("wrapper").fadeOut(a.get("duration"),function(){a.set("visible",false);a.fire(h.event.HIDE,{visible:false})})},_create:function(){var a=this.get("wrapper"),b=this.get("value"),c=this.get("tpl");
b=d.substitute(c,{value:b});a.html("");return i(b).appendTo(a)},_addAttr:function(){var a=this.get("wrapper"),b=this.get("value");a.attr("role","progressbar");a.attr("aria-valuemin",0);a.attr("aria-valuemax",100);a.attr("aria-valuenow",b);return this}},{ATTRS:{wrapper:{value:""},bar:{value:""},width:{value:100},value:{value:0,setter:function(a){var b=this,c=b.get("wrapper"),f=b.get("bar"),e=b.get("speed"),g;if(a>100)a=100;if(a<0)a=0;g=c.width()*(a/100);f.animate({width:g+"px"},e,"none",function(){c.attr("aria-valuenow",
a);f.attr("data-value",a);b.fire(h.event.CHANGE,{value:a,width:g})});return a}},visible:{value:true},duration:{value:0.3},tpl:{value:h.tpl.DEFAULT},speed:{value:0.2}}});return h},{requires:["node","base"]});
KISSY.add("gallery/form/1.1/uploader/queue",function(d,n,l){function h(a,b){h.superclass.constructor.call(this,b);this.set("target",i(a))}var i=n.all;d.mix(h,{tpl:{DEFAULT:'<li id="queue-file-{id}" class="clearfix" data-name="{name}"><div class="f-l sprite file-icon"></div><div class="f-l">{name}</div><div class="f-l file-status J_FileStatus"></div></li>'},event:{RENDER:"render",ADD_DATA:"addData",ADD:"add",ADD_FILES:"addFiles",REMOVE:"remove",CLEAR:"clear",FILE_STATUS:"statusChange",UPDATE_FILE:"updateFile",
RESTORE:"restore"},status:{WAITING:"waiting",START:"start",PROGRESS:"progress",SUCCESS:"success",CANCEL:"cancel",ERROR:"error",RESTORE:"restore"},cls:{QUEUE:"ks-uploader-queue"},hook:{STATUS:".J_FileStatus"},FILE_ID_PREFIX:"file-"});d.extend(h,l,{render:function(){this.get("target").addClass(h.cls.QUEUE);this.fire(h.event.RENDER);return this},add:function(a,b){var c=this,f=h.event;if(a.length>0){c._addFiles(a,function(){b&&b.call(c);c.fire(f.ADD_FILES,{files:a})});return false}else return c._addFile(a,
function(e,g){b&&b.call(c,e,g)})},_addFile:function(a,b){if(!d.isObject(a)){d.log("[uploader-queue]:_addFile()参数file不合法！");return false}var c=this,f=c.get("duration"),e=c._setAddFileData(a),g=c.getFileIndex(e.id);c.fileStatus(g,h.status.WAITING);e.target.fadeIn(f,function(){c.fire(h.event.ADD,{index:g,file:e,target:e.target,uploader:c.get("uploader")});b&&b.call(c,g,e)});return e},_addFiles:function(a,b){function c(e){if(e===a.length){b&&b.call(this);return false}f._addFile(a[e],function(){e++;c(e)})}
if(!a.length){d.log("[uploader-queue]:_addFiles()参数files不合法！");return false}var f=this;c(0)},remove:function(a,b){var c=this,f=c.get("files"),e,g,j=c.get("duration");if(d.isString(a))a=c.getFileIndex(a);e=f[a];if(!d.isObject(e)){d.log("[uploader-queue]:remove()不存在index为"+a+"的文件数据");return false}g=e.target;g.fadeOut(j,function(){g.remove();c.fire(h.event.REMOVE,{index:a,file:e});b&&b.call(c,a,e)});f=d.filter(f,function(k,m){return m!==a});c.set("files",f);return e},clear:function(){function a(){c=
b.get("files");if(!c.length){b.fire(h.event.CLEAR);return false}b.remove(0,function(){a()})}var b=this,c;a()},fileStatus:function(a,b,c){if(!d.isNumber(a)||!d.isString(b))return false;var f=this.getFile(a),e=this.get("theme"),g;if(!f||!e)return false;if(f.status==b)return this;this.updateFile(a,{status:b});g="_"+b+"Handler";if(d.isFunction(e[g])){c=d.merge({uploader:this.get("uploader"),index:a,file:f,id:f.id},c);e[g].call(e,c)}this.fire(h.event.FILE_STATUS,{index:a,status:b,args:c,file:f});return this},
getFile:function(a){if(!d.isNumber(a))return false;a=this.get("files")[a];d.isPlainObject(a)||(a=false);return a},getFileIndex:function(a){var b=this.get("files"),c=-1;d.each(b,function(f,e){if(f.id==a){c=e;return true}});return c},updateFile:function(a,b){if(!d.isNumber(a))return false;if(!d.isObject(b)){d.log("[uploader-queue]:updateFile()的data参数有误！");return false}var c=this.get("files"),f=this.getFile(a);if(!f)return false;d.mix(f,b);c[a]=f;this.set("files",c);this.fire(h.event.UPDATE_FILE,{index:a,
file:f});return f},getIndexs:function(a){var b=this.get("files"),c,f=[];if(!b.length)return f;d.each(b,function(e,g){if(d.isObject(e)){c=e.status;c==a&&f.push(g)}});return f},getFiles:function(a){var b=this.get("files"),c=[];if(!b.length)return[];d.each(b,function(f){f&&f.status==a&&c.push(f)});return c},_setAddFileData:function(a){var b=this.get("files");if(!d.isObject(a)){d.log("[uploader-queue]:_updateFileData()参数file不合法！");return false}if(!a.id)a.id=d.guid(h.FILE_ID_PREFIX);if(a.size)a.textSize=
d.convertByteSize(a.size);a.target=this._appendFileHtml(a);a.status="";b.push(a);this.fire(h.event.ADD_DATA,{file:a,index:b.length-1});return a},_appendFileHtml:function(a){var b=this.get("target"),c=this.get("tpl");c=d.substitute(c,a);return i(c).hide().appendTo(b).data("data-file",a)}},{ATTRS:{tpl:{value:h.tpl.DEFAULT},duration:{value:0.3},target:{value:""},files:{value:[]},uploader:{value:""},theme:{value:""}}});return h},{requires:["node","base"]});
KISSY.add("gallery/form/1.1/uploader/theme",function(d,n,l,h){function i(b){i.superclass.constructor.call(this,b);this._LoaderCss();this._init()}var a=n.all;d.extend(i,l,{_init:function(){var b=this._initQueue(),c=this.get("name");if(c!=""){b=b.get("target");b.length&&b.addClass(c+"-queue")}},_initQueue:function(){var b=this,c=b.get("queueTarget"),f,e={tpl:b.get("fileTpl")};d.mix(e,d.form.parseConfig(c,"data-queue-config"));f=new h(c,e);f.set("theme",b);b.set("queue",f);f.on("addData",function(g){f.updateFile(g.index,
{statusWrapper:b._getStatusWrapper(g.file.target)})});f.on("add",function(g){b._addFileHandler(g)});f.on("statusChange",function(g){b._setStatusVisibility(g)});return f},_getStatusWrapper:function(b){return b.children(".J_FileStatus")},_LoaderCss:function(){var b=this.get("isUseCss"),c=this.get("cssUrl");b&&d.use(c,function(){d.log(c+"加载成功！")})},afterUploaderRender:function(){},_addFileHandler:function(b){var c=this.get("queue"),f=b.uploader,e=b.index,g=b.file.id,j=a(".J_Upload_"+g),k=a(".J_Cancel_"+
g),m=a(".J_Del_"+g);j.on("click",function(o){o.preventDefault();if(!d.isObject(f))return false;f.upload(e)});k.on("click",function(o){o.preventDefault();f.cancel(e)});m.on("click",function(){b.preventDefault();c.remove(g)})},_setStatusVisibility:function(b){var c=b.file.statusWrapper;b=b.file.status;c.length||d.log("状态容器层不存在！");c.children(".status").hide();c.children("."+b+"-status").show()},_waitingHandler:function(){},_startHandler:function(){},_progressHandler:function(){},_successHandler:function(){},
_errorHandler:function(){},_restoreHandler:function(){}},{ATTRS:{name:{value:""},isUseCss:{value:true},cssUrl:{value:""},fileTpl:{value:""},queueTarget:{value:""},queue:{value:""},auth:{value:""}}});return i},{requires:["node","base","./queue"]});
KISSY.add("gallery/form/1.1/uploader/type/ajax",function(d,n,l){function h(i){h.superclass.constructor.call(this,i);this._setFormData()}d.mix(h,{event:d.merge(l.event,{PROGRESS:"progress"})});d.extend(h,l,{upload:function(i){if(!i){d.log("[uploader-AjaxType]:upload()，fileData参数有误！");return false}this._addFileData(i);this.send();return this},stop:function(){var i=this.get("xhr");if(!d.isObject(i)){d.log("[uploader-AjaxType]:stop()，io值错误！");return false}i.abort();this.fire(h.event.STOP);return this},
send:function(){var i=this,a=i.get("action"),b=i.get("formData"),c=new XMLHttpRequest;c.upload.addEventListener("progress",function(f){i.fire(h.event.PROGRESS,{loaded:f.loaded,total:f.total})});c.onload=function(){var f={};try{f=d.JSON.parse(c.responseText)}catch(e){d.log("[uploader-AjaxType]:ajax返回结果集responseText格式不合法！")}i.fire(h.event.SUCCESS,{result:f})};c.open("POST",a,true);c.send(b);i._setFormData();i.set("xhr",c);return i},_setFormData:function(){try{this.set("formData",new FormData);this._processData()}catch(i){d.log("[uploader-AjaxType]:something error when reset FormData.");
d.log(i,"dir")}},_processData:function(){var i=this.get("data"),a=this.get("formData");d.each(i,function(b,c){a.append(c,b)});this.set("formData",a)},_addFileData:function(i){if(!d.isObject(i)){d.log("[uploader-AjaxType]:_addFileData()，file参数有误！");return false}var a=this.get("formData"),b=this.get("fileDataName");a.append(b,i);this.set("formData",a)}},{ATTRS:{formData:{value:""},ajaxConfig:{value:{type:"post",processData:false,cache:false,dataType:"json",contentType:false}},xhr:{value:""},fileDataName:{value:""},
form:{value:{}},fileInput:{value:""}}});return h},{requires:["node","./base"]});KISSY.add("gallery/form/1.1/uploader/type/base",function(d,n,l){function h(i){h.superclass.constructor.call(this,i)}d.mix(h,{event:{START:"start",STOP:"stop",SUCCESS:"success",ERROR:"error"}});d.extend(h,l,{upload:function(){},stop:function(){}},{ATTRS:{action:{value:""},data:{value:{}}}});return h},{requires:["node","base"]});
KISSY.add("gallery/form/1.1/uploader/type/flash",function(d,n,l){function h(i){h.superclass.constructor.call(this,i);this._init()}d.mix(h,{event:d.merge(l.event,{SWF_READY:"swfReady",PROGRESS:"progress"})});d.extend(h,l,{_init:function(){var i=this,a=i.get("swfUploader");if(!a){d.log("[uploader-FlashType]:swfUploader对象为空！");return false}a.on("contentReady",function(){i.fire(h.event.SWF_READY)},i);a.on("uploadStart",i._uploadStartHandler,i);a.on("uploadProgress",i._uploadProgressHandler,i);a.on("uploadCompleteData",
i._uploadCompleteDataHandler,i);a.on("uploadError",i._uploadErrorHandler,i)},upload:function(i){var a=this.get("swfUploader"),b=this.get("action"),c=this.get("data");this.set("uploadingId",i);a.upload(i,b,"POST",c);return this},stop:function(){var i=this.get("swfUploader"),a=this.get("uploadingId");if(a!=""){i.cancel(a);this.fire(h.event.STOP,{id:a})}return this},_uploadStartHandler:function(i){this.fire(h.event.START,{file:i.file})},_uploadProgressHandler:function(i){d.mix(i,{loaded:i.bytesLoaded,
total:i.bytesTotal});this.fire(h.event.PROGRESS,{loaded:i.loaded,total:i.total})},_uploadCompleteDataHandler:function(i){var a;try{a=JSON.parse(i.data)}catch(b){d.log("[uploader-FlashType]:json数据格式不合法！");this.fire(h.event.ERROR,{msg:"不是合法的json数据"})}this.set("uploadingId","");this.fire(h.event.SUCCESS,{result:a})},_uploadErrorHandler:function(i){this.set("uploadingId","");this.fire(h.event.ERROR,{msg:i.msg})}},{ATTRS:{swfUploader:{value:""},uploadingId:{value:""}}});return h},{requires:["node","./base"]});
KISSY.add("gallery/form/1.1/uploader/type/iframe",function(d,n,l){function h(a){h.superclass.constructor.call(this,a)}var i=n.all;d.mix(h,{tpl:{IFRAME:'<iframe src="javascript:false;" name="{id}" id="{id}" border="no" width="1" height="1" style="display: none;" />',FORM:'<form method="post" enctype="multipart/form-data" action="{action}" target="{target}">{hiddenInputs}</form>',HIDDEN_INPUT:'<input type="hidden" name="{name}" value="{value}" />'},event:d.mix(l.event,{CREATE:"create",REMOVE:"remove"})});
d.extend(h,l,{upload:function(a){a=i(a);if(!a.length)return false;this.fire(h.event.START,{input:a});this.set("fileInput",a);this._create();this.get("form").getDOMNode().submit()},stop:function(){this.get("iframe").attr("src",'javascript:"<html></html>";');this.fire(h.event.STOP);this.fire(h.event.ERROR,{status:"abort",msg:"上传失败，原因：abort"});return this},dataToHidden:function(a){if(!d.isObject(a)||d.isEmptyObject(a)){d.log("[uploader-iframeType]:data参数不是对象或者为空！");return false}var b="",c=this.get("tpl").HIDDEN_INPUT;
if(!d.isString(c))return false;for(var f in a)b+=d.substitute(c,{name:f,value:a[f]});return b},_createIframe:function(){var a=this.get("id"),b=this.get("tpl"),c=b.IFRAME,f=this.get("iframe");if(!d.isEmptyObject(f))return f;if(!d.isString(c)){d.log("[uploader-iframeType]:iframe的模板不合法！");return false}if(!d.isString(a)){d.log("[uploader-iframeType]:id必须存在且为字符串类型！");return false}a=d.substitute(b.IFRAME,{id:a});a=i(a);a.on("load",this._iframeLoadHandler,this);i("body").append(a);this.set("iframe",a);return a},
_iframeLoadHandler:function(a){var b=a.target;a=h.event.ERROR;b=b.contentDocument||window.frames[b.id].document;if(!b||!b.body){this.fire(a,{msg:"服务器端返回数据有问题！"});return false}b=b.body.innerHTML;d.log("[uploader-iframeType]:服务器端输出:"+b);if(b=="")return false;try{b=JSON.parse(b)}catch(c){d.log("[uploader-iframeType]:json数据格式不合法！");this.fire(a,{msg:"数据："+b+"不是合法的json数据"})}this.fire(h.event.SUCCESS,{result:b});this._remove()},_createForm:function(){var a=this.get("id"),b=this.get("tpl").FORM,c=this.get("data"),
f=this.get("action"),e=this.get("fileInput"),g="";if(!d.isString(b)){d.log("[uploader-iframeType]:form模板不合法！");return false}if(!d.isObject(c)){d.log("[uploader-iframeType]:data参数不合法！");return false}if(!d.isString(f)){d.log("[uploader-iframeType]:action参数不合法！");return false}c=this.dataToHidden(c);if(c=="")return false;g=d.substitute(b,{action:f,target:a,hiddenInputs:c});a=i(g).append(e);i("body").append(a);this.set("form",a);return a},_create:function(){var a=this._createIframe(),b=this._createForm();
this.fire(h.event.CREATE,{iframe:a,form:b})},_remove:function(){var a=this.get("form");this.get("iframe");a.remove();this.reset("form");this.fire(h.event.REMOVE,{form:a})}},{ATTRS:{tpl:{value:h.tpl},id:{value:"ks-uploader-iframe-"+d.guid()},iframe:{value:{}},form:{value:{}},fileInput:{value:""}}});return h},{requires:["node","./base"]});
KISSY.add("gallery/form/1.1/uploader/urlsInput",function(d,n,l){function h(a,b){h.superclass.constructor.call(this,b);this.set("wrapper",i(a))}var i=n.all;d.mix(h,{TPL:'<input type="hidden" id="{name}" name="{name}" value="{value}" />'});d.extend(h,l,{render:function(){var a=this.get("wrapper"),b=this.get("name");b=document.getElementsByName(b)[0];if(!d.isObject(a)){d.log("[uploader-urlsInput]:container参数不合法！");return false}if(b){d.log("[uploader-urlsInput]:urls input found");this.set("input",i(b))}else this._create();
return this},add:function(a){if(!d.isString(a)){d.log("[uploader-urlsInput]:add()的url参数不合法！");return false}var b=this.get("urls"),c=this.isExist(a);if(b[0]=="")b=[];if(c){d.log("[uploader-urlsInput]:add()，文件路径已经存在！");return this}b.push(a);this.set("urls",b);this._val();return this},remove:function(a){if(!a)return false;var b=this.get("urls"),c=this.isExist(a),f=RegExp(a);if(!c){d.log("[uploader-urlsInput]:remove()，不存在该文件路径！");return false}b=d.filter(b,function(e){return!f.test(e)});this.set("urls",
b);this._val();return b},parse:function(){var a=this.get("input");if(a){a=i(a).val();var b=this.get("split");a=a.split(b);this.set("urls",a);return a}else{d.log("[uploader-urlsInput]:cannot find urls input.");return[]}},_val:function(){var a=this.get("urls"),b=this.get("input"),c=this.get("split");a=a.join(c);b.val(a);return a},isExist:function(a){var b=false,c=this.get("urls"),f=RegExp(a);if(!c.length)return false;d.each(c,function(e){if(f.test(e))return b=true});return b},_create:function(){var a=
this.get("wrapper"),b=this.get("tpl"),c=this.get("name"),f=this.get("urls");if(!a||a.length<=0){d.log("[uploader-urlsInput]:UrlsInput container not specified!","warn");return false}if(!d.isString(b)||!d.isString("name")){d.log("[uploader-urlsInput]:_create()，tpl和name属性不合法！");return false}b=i(d.substitute(b,{name:c,value:f}));a.append(b);this.set("input",b);d.log("[uploader-urlsInput]:input created.");return b}},{ATTRS:{name:{value:""},urls:{value:[]},tpl:{value:h.TPL},split:{value:",",setter:function(a){this._val();
return a}},input:{value:""},wrapper:{value:""}}});return h},{requires:["node","base"]});