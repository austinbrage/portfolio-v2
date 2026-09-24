## Por qué no usar simplemente un motor de plantillas existente

No faltan motores de plantillas del lado del servidor — [Pug](https://pugjs.org), EJS, [Handlebars](https://handlebarsjs.com), Nunjucks.

Lo que nos hacía volver una y otra vez a construir el nuestro fue un requisito más específico: quería que las interpolaciones, condicionales y argumentos de pipes aceptaran **expresiones de JavaScript reales** — no un subconjunto de lenguaje de plantillas restringido que casi, pero no del todo, hace lo mismo que un condicional normal.

Los motores estilo Handlebars mantienen la lógica deliberadamente fuera de las plantillas. Yo quería lo contrario: confiar en el autor de la plantilla con expresiones reales, y poner la seguridad en otro lado (ver más abajo).

```html
<li map="p of projects" if="p.title.length > 0">{{p.title}}</li>
```

Esa condición no es una comparación de un mini-DSL — se evalúa como JavaScript real contra el scope de renderizado. Cualquier cosa válida en una expresión de JS es válida ahí.

![Editor de código mostrando la sintaxis de plantillas](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80)

## El trade-off del escaping

Los valores interpolados **no** se escapan a HTML por defecto. Escapar cada interpolación cuesta tiempo real a escala, y la mayoría de los valores que fluyen por una plantilla renderizada en el servidor — strings traducidos, contenido ya sanitizado, números, labels calculados — no lo necesitan.

Un pipe integrado permite optar por escapar un valor específico:

```html
{{userComment |> esc}}
```

El trade-off es real. Empuja una decisión relevante para la seguridad hacia quien escribe la plantilla, en cada interpolación, en lugar de hacer que la opción segura sea la opción silenciosa por defecto. Lo dudé más de una vez.

Lo que terminó de decidirlo: en la práctica, casi todo lo que se renderiza a través de HTML6 es contenido controlado por el autor o ya viene escapado desde antes. Las interpolaciones que sí necesitan escaping suelen ser fáciles de detectar en el punto donde se usan.

Es el tipo de trade-off que reconsideraría si esto alguna vez tuviera que manejar input arbitrario de usuarios no confiables directamente en las plantillas, a mayor escala.

## Componentes: scope compartido, props aislados

Un componente tiene su propio namespace aislado de *props*. Todo lo demás en el scope de renderizado externo — el idioma activo, la función de traducción, un timestamp para cache-busting — fluye hacia abajo automáticamente, sin tener que redeclararse en cada nivel de anidamiento:

```html
<template is="layout" title="string" description="string">
  <html lang="{{lang || 'en'}}">
    ...
  </html>
</template>
```

El idioma activo aquí nunca se declaró como prop de este componente. Simplemente es *visible*, heredado de quien haya llamado al render de nivel superior con esos datos.

Solo **title** y **description** son props reales — son cosas que quien llama debería setear explícitamente en cada uso, no heredar implícitamente.

Los nombres de los props también tienen que ser identificadores válidos de JavaScript: camelCase, no separados por guiones. Por debajo se convierten en acceso directo a propiedades, y un guión en el nombre haría que ese acceso fuera sintaxis inválida.

Es una restricción pequeña, pero mucho más barata de imponer desde el principio que de explicar después — así que simplemente es la forma en que se escriben los componentes desde el inicio.

## Fallar ruidosamente, no en silencio

La regla en la que soy más estricto: cada variable que una plantilla referencia tiene que estar presente en el objeto de datos que se pasa al render, aunque sea solo un string vacío.

Una variable referenciada pero ausente lanza un error inmediatamente, en lugar de imprimir silenciosamente nada.

Agregué esto después de perseguir demasiadas secciones en blanco en el HTML renderizado que resultaban ser un campo olvidado en un controller a tres archivos de distancia. Con variables estrictas, ese error ahora sale a la luz en el momento de renderizar — no cuando alguien nota por casualidad la sección vacía en la página.

## Construido test-first, función por función

Mi jefe en Eldøy me impulsó a construir HTML6 test-first: una suite de tests unitarios chica y enfocada para cada función — el parser, el paso de compilación de masking/unmasking, el evaluador de expresiones, el resolvedor de scope de componentes — cada una cubriendo todo su rango de inputs antes de que existiera siquiera la implementación que hacía pasar esos tests.

Es en parte por qué la reescritura de masking/unmasking (la razón por la que HTML6 terminó siendo tan rápido) fue algo que pude intentar con confianza real. Reescribir un compilador que ya tiene una suite de tests genuina alrededor de cada pieza es un tipo de riesgo distinto a reescribir uno sostenido por chequeos manuales.

## Dónde corre realmente

HTML6 se lanzó por primera vez en producción en [Nobo](https://en.nobo.no/) — el primer sitio desplegado en correr con él, y el lugar de trabajo donde todo esto empezó.

También impulsa [Ultimate Learning](https://ultimatelearning.app/), una app de aprendizaje de idiomas que mantengo activamente. Cada plantilla se compila una vez, y luego se renderiza por cada request a partir de esa función compilada — sin volver a parsear, sin paso de hidratación en el cliente.

A esta altura es un motor de plantillas genuinamente estable y en producción — no un juguete que se construyó una vez y se abandonó.
