#### 重置浏览器样式

在不同的浏览器中有些标签的默认样式是不一样的。 统一清除了一些默认样式后方便我们统一设计
这些重置样式在网上一搜就可以看到。<a href="http://cssreset.com/">这里</a>是目前比较流行的一些重置方案。一般项目中我比较常用的是<a href="https://github.com/necolas/normalize.css/">normalize.css</a>

#### IE 兼容模式

IE 支持通过特定的 <code>&lt;meta&gt;</code>标签来确定绘制当前页面所应该采用的 IE 版本。除非有强烈的特殊需求，否则最好是设置为 edge mode，从而通知 IE 采用其所支持的最新的模式。
chrome=1是chrome为IE浏览器用户写的一个外挂，它的意思是如果用户安装了这个外挂，那么在IE浏览器可以用谷歌内盒渲染。。
```html
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">

```

#### <a href="clearfix.html">清除浮动</a>

**子元素浮动后出现的问题**
1. ie7以下版本模块浮动后不会脱离文档流，后面的块元素不会被它覆盖掉。但是后面的块元素也会紧跟浮动显示在其内容的后面
2. 其他浏览器版本浮动后，会从当前文档流脱离出来。后面如果紧跟的是块元素的换会被其覆盖。
3. 父级元素高度不能自适应 所以为了元素浮动带来的问题需要清除浮动

* 方式1：在浮动元素的后面加上一个空的div 然后添加clear:both;
* 方式2：父级元素用overflow:hidden;
* 方式3：设置一个父级的块级伪元素，添加clear:both;
```
/* Clear float */
.clearfix {
    *zoom: 1;/*给IE7以下版本识别的清楚浮动的（因为它们不识别after 这个伪类），这些版本的IE触发haslayout便可以清除浮动*/
}
.clearfix:before,
.clearfix:after {
    display: table;
    line-height: 0;
    content: "";/*必要*/
    /* .clearfix:before 是为了防止当前元素和上外边距和它上面的上外边距的 
    叠加这里我们称为空白崩溃如果没有这个需求不加也是可以的。*/
}
.clearfix::after {
    clear: both;/*必要*/
}

/* 另外：触发父级元素的BFC 来清除浮动,下面的属性都可以触发父级元素的BFC*/
```

#### 图片或行内块（inline-block）元素并列空隙bug

当多个img或inline-block标签并列显示时周围元素周围有空白空隙

<a href="img-space.html">demo</a>

#### chrome浏览器font-size问题

Chrome 的中文版桌面浏览器会默认设定页面的最小字号是12px的限制。
如果要是需要设置font-size小于12px？
```
 /*旧方案：*/
/*桌面浏览器小于Chrome27中可以。但是一般不用这个方案，因为它会阻止用户对页面进行放缩*/
 .classsname{ -webkit-text-size-adjust:none; font-size:9px; } 
 
 /*方案2: */
 .chrome_adjust {
    font-size: 9px;
    -webkit-transform: scale(0.75);
    -o-transform: scale(1);    //针对能识别-webkit的opera browser设置
}
```

详细查看 <a href="http://caniuse.com/#search=-webkit-text-size-adjust">Can I use</a>

**另外：**

在使用rem单位的时候要特别注意。最好不要把font-size设置为62.5%，一般设置的字号应该大于 12px。
我一般会设置为625%，然后再用ren单位。
```
 html {
       font: 16px/1.5 "Helvetica Neue", Helvetica, Arial, 
       "Microsoft Yahei", "Hiragino Sans GB", "Heiti SC", 
       "WenQuanYi Micro Hei", sans-serif;
       font-size: 625%;
       /* 1rem=100px;
   }

```

#### fixed定位元素居中问题

```
position: fixed;
box-sizing: border-box;
width: 90%;
height:50px;
background: yellowgreen;
padding-left: 20px;
padding-right: 20px;
margin:0 auto;  
left:0;  
right:0;
*left: auto;  /* 兼容ie7*/
*right: auto;  /* 兼容ie7*/

```

详细请查看<a href="position-fixed.html">Demo</a>


#### <a href="css-hack.html">浏览器常用的hack</a>

Hack是针对不同的浏览器去写不同的CSS样式，从而让各浏览器能达到一致的渲染效果，那么针对不同的浏览器写不同的CSS CODE的过程，就叫CSS HACK。这里我整理了自己在项目中遇到的一些hack<a href="css-hack.html">浏览器常用的hack</a>。

1. <a href="css-hack.html#ie">IE常用的hack</a>
1. <a href="css-hack.html#firefox">Firefox常用的hack</a>
1. <a href="css-hack.html#webkit">webkit常用的hack</a>
1. <a href="css-hack.html#opera">欧朋常用的hack</a>
1. <a href="ie-ifhack.html">HTML条件hack</a>

<a href="http://browserhacks.com/">这里</a>你可以查询到针对各种浏览器常用的hack方法。

#### ie6下面元素浮动后显示margin边距加倍的问题

这是ie6一个著名的bug，当一个元素向一边浮动时，其它同一个方向如果有margin的话，ie6就会产生双倍的margin。例 如：

```html
<div style="float: left;margin-left: 10px;"></div>

```

在ie6下显示会有margin-left:20px的距离用ie6的hack解决

```
div{
  width: 200px;
  height: 30px;
  background: pink;
  float: left;
  margin-left: 10px;
  _margin-left: 5px;/*方式1*/
  _display: inline;  /*方式2*/
 }
```

#### 数值和中文混写导致错位

本质上是混合的字体到时baseline不统一形成的，所以只要将其设置成块元素设置高度或者行高即可解决
<a href="ie7ie6-line-height.html">demo演示</a>

#### IE7-li之间产生的空白间隙的BUG

IE7及更早浏览器下当li中出现2个或以上的浮动时，li之间产生的空白间隙的BUG

请查看 <a href="ie7low-liFloat-bug.html">demo</a> 演示 

#### 参考

1. [Can I use](http://caniuse.com/)
1. [cssrest](http://cssreset.com/)
1. [normalize.css](https://github.com/necolas/normalize.css/)
