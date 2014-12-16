<!doctype html>
<html lang="ru-RU">
<head>
    <meta charset="UTF-8">
    <title>Список страниц</title>
</head>
<body>
    <h1>Список страниц</h1>
    <ul>
        <? foreach (glob('./*.html') as $file) { ?>
        <li><a href="<?=basename($file)?>"><?=basename($file)?></a></li>
        <? } ?>
    </ul>
</body>
</html>
