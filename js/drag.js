/**
 * Created by 佳锐 on 2017/3/29.
 */
;(function(){
    var transform = getTransform();
    function Drag(selector){
        this.elem = typeof selector == 'object'?selector:document.getElementById(selector);
        this.startX = 0;
        this.startY = 0;
        this.sourceX = 0;
        this.sourceY = 0;

        this.init();
    }
    //原型
    Drag.prototype = {
        constructor:Drag,
        init:function(){
         this.setDrag();
        },

        getStyle:function(property){
            return document.defaultView.getComputedStyle()?document.defaultView.getComputedStyle(elem,false)[property]:this.elem.currentStyle[property];
        },
        //用来获取当前元素的位置信息
        getPosition:function(){
            var pos ={x:0,y:0};
            if(transform){
                var transformVaule = this.getStyle(transform);
                if(transformVaule == 'none'){
                    this.elem.style[transform] = 'translate(0,0)';
                }else{
                    var temp = transformVaule.match(/-?\d+/g);
                    pos = {
                        x:parseInt(temp[4].trim()),
                        y:parseInt(temp[5].trim())
                    }
                }
            }else{
                if(this.getStyle('position') == 'static'){
                    this.elem.style.position = 'relative';
                } else{
                    pos = {
                        x:parseInt(this.getStyle('left')?this.getStyle('left'):0),
                        y:parseInt(this.getStyle('right')?this.getStyle('right'):0)
                    }
                }
            }
            return pos;
        },

        //用来设置当前元素的位置
        setPosition:function(pos){
            if(transform){
                this.elem.style[transform] = "translate('+pos.x+'px,'+pos.y+'px)"
            } else{
                this.elem.style.left = pos.x + 'px';
                this.elem.style.right = pos.y + 'px';
            }
        },
        //该方法用来绑定事件
        setDrag:function(){
            var self = this;
            this.elem.addEventListener('mousedown',start,false);
            function start(event){
                self.startX = event.pageX;
                self.startY = event.pageY;
                var pos = self.getPosition();
                self.sourceX = pos.x;
                self.sourceY = pos.y;

                document.addEventListener('mousemove',move,false);
                document.addEventListener('mouseup',end,false);
            }
            function move(event){
                var currentX = event.pageX;
                var currentY = event.pageY;

                var distanceX = currentX - self.startX;
                var distanceY = currentY - self.startY;

                self.setPosition({
                    x:(self.sourceX + distanceX).toFixed(),
                    y:(self.sourceY + distanceY).toFixed()
                })
            }
            function end(Event){
                document.removeEventListener('mousemove',move);
                document.removeEventListener('mouseup',end);
            }
        }
    };
    // 私有方法，仅仅用来获取transform的兼容写法
    function getTransform() {
        var transform = '',
            divStyle = document.createElement('div').style,
            transformArr = ['transform', 'webkitTransform', 'MozTransform', 'msTransform', 'OTransform'],
            i = 0,
            len = transformArr.length;
        for(; i < len; i++)  {
            if(transformArr[i] in divStyle) {
                return transform = transformArr[i];
            }
        }
        return transform;
    }
    window.Drag = Drag;
})();
