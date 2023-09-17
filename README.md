# hexo blog

- [hexo](https://hexo.io/zh-cn/docs/)
- [hexo fluid](https://hexo.fluid-dev.com/docs/guide/)

## tag label
```
{% label primary @primary %}
{% label info @info %}
{% label success @success %}
{% label warning @warning %}
{% label danger @danger %}
```

## font color
```html
<b class=text-primary>primary</b>
<b class=text-info>info</b>
<b class=text-success>success</b>
<b class=text-warning>warning</b>
<b class=text-danger>danger</b>
```

## multiple img
```md
{% gi %}
![](/img/xx.jpg)
![](/img/xx.jpg)
{% endgi %}
```

## tag
```
{% note primary %}
primary
{% endnote %}

{% note info %}
info
{% endnote %}

{% note success %}
success
{% endnote %}

{% note warning %}
warning
{% endnote %}

{% note danger %}
danger
{% endnote %}

{% note secondary %}
secondary
{% endnote %}

{% note light %}
light
{% endnote %}
```

## 对话

```html
<article class="the-dialogue">
	<header>
    <h2>
      果园生产毛桃罐头
    </h2>
  </header>
  <div class="sender" title="your">
    <p>

    </p>
  </div>
  <div class="responder" title="me">
    <p>

    </p>
  </div>
</article>
```